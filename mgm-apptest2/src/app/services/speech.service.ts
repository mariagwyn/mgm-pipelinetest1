import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { CompiledLiturgy, LiturgyObject } from '../models/liturgy.model';
import { BehaviorSubject, Subject } from 'rxjs';

import { BibleService, BCV } from './bible.service';
import { AudioService } from '../services/audio.service';
import { RecipeService } from '../services/recipe.service';
import { MediaControlsService } from '../services/mediacontrols.service';

import { TextToSpeech } from '@ionic-native/text-to-speech/ngx'; // Android only

var utterances = new Array();

const ANDROID_MOCK_VOICES = [
  { name: 'UK', lang: 'en-GB', default: false, localService: true, voiceURI: '' },
  { name: 'US', lang: 'en-US', default: false, localService: true, voiceURI: '' }
];

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  isPlaying : boolean = false;
  synth : SpeechSynthesis;
  voices : SpeechSynthesisVoice[] = new Array();
  languageChoices : string[] = new Array();
  voice : string;
  languageLabels = {
    'en-US': 'American',
    'en-GB': 'British',
    'en-scotland': 'Scottish',
    'en-AU': 'Australian',
    'en-IE': 'Irish',
    'en-IN': 'Indian',
    'en-ZA': 'South African',
    'en': 'Generic English'
  };
  defaultLang : string;

  objects : LiturgyObject[] = new Array();

  finished$ : Subject<boolean> = new Subject();
  text$ : Subject<string> = new Subject();
  object$ : Subject<LiturgyObject> = new Subject();
  voices$ : BehaviorSubject<SpeechSynthesisVoice[]>;

  compiledTexts : Text[] = new Array();
  ongoingTexts : Text[] = new Array();
  ongoingObjIndex : number = 0;
  ongoingTextIndex : number = 0;
  modifiedQueue : boolean = false;

  background : 'silence'|'seashore'|'garden'|'night'|'silence-short';
  backgroundEnabled : boolean = true;
  mediaControlsEnabled : boolean = false;

  rate : number = 0.75;

  gloria;

  constructor(
    private bibleService : BibleService,
    private audioService : AudioService,
    private platform : Platform,
    private recipeService : RecipeService,
    private controls : MediaControlsService,
    private cordovaTTS : TextToSpeech
  ) {
    if(this.platform.is('capacitor') && this.platform.is('android')) {
      this.voices$ = new BehaviorSubject(ANDROID_MOCK_VOICES);
    } else {
      this.voices$ = new BehaviorSubject(speechSynthesis.getVoices());
    }
  }

  async init(lang : string = 'en') : Promise<boolean> {
    this.backgroundEnabled = this.canPlayBackground();
    this.mediaControlsEnabled = this.controls.isAvailable();
    this.defaultLang = lang;

    if(this.platform.is('capacitor') && this.platform.is('android')) {
      // Android WebView does not support speechSynthesis. So annoying.
      this.voices$.next(ANDROID_MOCK_VOICES);
      return true;
    } else {
      try {
        this.synth = window.speechSynthesis;
        this.synth.onvoiceschanged = () => this.voices$.next(this.synth.getVoices());

        setTimeout(() => {
          this.voices$.next(this.synth.getVoices());
          this.languageChoices = this.voices.map(voice => voice.lang).filter((v, i, a) => a.indexOf(v) == i).sort(); // unique filter
        }, 1);

        this.voices$.subscribe(voices => {
          this.voices = voices;
          console.log(voices);
        });

        return true;
      } catch(e) {
        console.log(e);
        return undefined;
      }
    }
  }

  setRate(rate : number) {
    console.log('setting rate to ', rate);
    this.rate = rate || 0.75;
  }

  setBackground(background : 'silence'|'seashore'|'garden'|'night'|'silence-short') {
    if(background !== this.background) {
      if(this.background) {
        this.audioService.pause(this.background);
      }
      this.background = background || 'silence';
      if(this.backgroundEnabled) {
        this.audioService.preload(this.background, `assets/audio/${this.background}.mp3`);
      } else {
        this.background = 'silence-short';
        this.audioService.preload(this.background, `assets/audio/${this.background}.mp3`);
      }
      if(this.isPlaying) {
        this.audioService.play(this.background);
      }
    }
  }

  setBackgroundVolume(volume : number) {
    if(this.background) {
      this.audioService.setVolume(this.background, volume);
    }
  }

  getNationality(voice : SpeechSynthesisVoice) : string {
    return this.languageLabels[voice.lang] || voice.lang;
  }

  pause() {
    this.isPlaying = false;
    if(this.backgroundEnabled) { this.audioService.pause(this.background); }
    if(this.platform.is('capacitor') && this.platform.is('android')) {
      this.cordovaTTS.speak("");
    } else {
      this.synth.pause();
    }
  }

  resume() {
    this.isPlaying = true;
    if(this.backgroundEnabled) { this.audioService.play(this.background, true); }
    if(this.platform.is('capacitor') && this.platform.is('android')) {
      let newQueue = this.compiledTexts.filter(text => (text.objIndex >= this.ongoingObjIndex) && (text.textIndex >= this.ongoingTextIndex));
      console.log(JSON.stringify(newQueue.map(text => text.objIndex)));
      this.object$.next(this.objects[this.ongoingObjIndex]);
      this.speakTextsRecursively(newQueue);
    } else {
      this.synth.resume();
    }
  }

  cancel() {
    this.isPlaying = false;
    if(this.backgroundEnabled) { this.audioService.release(this.background); }
    if(this.platform.is('capacitor') && this.platform.is('android')) {
      this.cordovaTTS.speak("");
    } else {
      this.synth.cancel();
    }
  }

  setVoice(name : string) {
    console.log(`setting voice to ${name}`);
    this.voice = name;
  }

  currentText() : Subject<string> {
    return this.text$;
  }

  currentObject() : Subject<LiturgyObject> {
    return this.object$;
  }

  getVoices() : Subject<SpeechSynthesisVoice[]> {
    return this.voices$;
  }

  getLanguageChoices() : string[] {
    return this.languageChoices;
  }

  canPlayBackground() : boolean {
    return this.platform.is('desktop') || (this.platform.is('capacitor'));
  }

  rewind(force : boolean = false) {
    console.log('(SpeechService) (rewind) force = ', force);
    if(this.platform.is('capacitor') && this.platform.is('android')) {
      this.cordovaTTS.stop();
    } else {
      this.synth.cancel();
    }
    console.log(this.ongoingObjIndex, this.ongoingTextIndex);
    if(this.ongoingObjIndex !== 0 && (force || this.ongoingTextIndex < 2)) {
      this.ongoingObjIndex--;
      console.log(this.ongoingObjIndex);
    }
    this.ongoingTextIndex = 0;
    let newQueue = this.compiledTexts.filter(text => text && (text.objIndex >= this.ongoingObjIndex) && (text.textIndex >= this.ongoingTextIndex));
    this.object$.next(this.objects[this.ongoingObjIndex]);
    this.speakTextsRecursively(newQueue);
  }

  fastForward() {
    if(this.platform.is('capacitor') && this.platform.is('android')) {
      this.cordovaTTS.stop();
    } else {
      this.synth.cancel();
    }
    this.ongoingObjIndex++;
    this.ongoingTextIndex = 0;
    let newQueue = this.ongoingTexts.filter(text => text && text.objIndex >= this.ongoingObjIndex);
    this.object$.next(this.objects[this.ongoingObjIndex]);
    this.speakTextsRecursively(newQueue);
  }

  async speakTextsRecursively(texts : Text[]) : Promise<void> {
    console.log(texts[0]);
    this.ongoingTexts = texts;
    if(texts.length && texts.length > 0) {
      if(texts[0]) {
        let delayAfter = texts[0].delayAfter,
            text = texts[0].text,
            objIndex = texts[0].objIndex;

        if(text && text.replace) {
          text = text.replace(/YHWH/g, 'addo-nigh');
        }

        // break up longer texts so Chrome doesn't fail
        if(text.length > 180) {
          console.log('long text encountered: ', text);
          let chunks : string[] = text.split(','),
                chunkedTexts : Text[] = chunks.map(chunk => {
                  return {
                    text: chunk,
                    lang: texts[0].lang,
                    objIndex,
                    textIndex: texts[0].textIndex,
                    delayAfter
                  };
                });
          console.log('broken into: ', chunks);
          this.speakTextsRecursively(chunkedTexts.concat(texts.slice(1)));
        } else {
          // emit the object if objectIndex has changed
          if(objIndex != this.ongoingObjIndex) {
            this.object$.next(this.objects[objIndex]);
          }

          this.text$.next(texts[0].text);

          this.ongoingObjIndex = objIndex;
          this.ongoingTextIndex = texts[0].textIndex;
          if(Array.isArray(text)) {
            text = text.join('\n');
          }
          text = text.replace(/\*/g, ''); // don't pronounce "asterisk" in the psalms...

          if(this.platform.is('capacitor') && this.platform.is('android')) {
            let locale : string = 'en-US',
                rate : number = this.rate;

            if(!texts[0].lang || texts[0].lang == (this.defaultLang || 'en').split('-')[0]) {
              console.log('position A')
              locale = ANDROID_MOCK_VOICES.find(voice => voice.name == this.voice).lang;
              console.log(locale);
              rate = this.rate;
              console.log(rate);
            } else {
              console.log('using default for lang ', texts[0].lang);
              locale = ANDROID_MOCK_VOICES.find(voice => voice.name == this.voice).lang;
              rate = this.rate*(2/3);
            }

            this.cordovaTTS.speak({ text, locale, rate})
              .then(() => {
                setTimeout(() => {
                  if((texts[0].objIndex == this.ongoingObjIndex) && (texts[0].textIndex == this.ongoingTextIndex)) {
                    this.speakTextsRecursively(texts.slice(1));
                  }
                }, delayAfter);
              });
          } else {
            let utterance = new SpeechSynthesisUtterance(text);

            if(!texts[0].lang || texts[0].lang == (this.defaultLang || 'en').split('-')[0]) {
              console.log('using ', this.voice);
              utterance.voice = this.voices.find(voice => voice.name == this.voice);
              utterance.rate = this.rate;
            } else {
              console.log('using default for lang ', texts[0].lang);
              utterance.voice = this.voices.find(voice => voice.lang.includes(texts[0].lang));
              utterance.rate = this.rate*(2/3);
            }

            new Promise((resolve, reject) => {
              utterance.addEventListener('end', resolve, true);
              utterance.addEventListener('error', reject, true);
              utterances.push(utterance);
              setTimeout(() => {
                this.text$.next(text);
                this.synth.speak(utterance);
              }, 1);
            }).then(() => {
              setTimeout(() => {
                if((texts[0].objIndex == this.ongoingObjIndex) && (texts[0].textIndex == this.ongoingTextIndex)) {
                  this.speakTextsRecursively(texts.slice(1));
                }
              }, delayAfter);
            });
          }

          this.finished$.next(false);
        }
      } else {
        this.speakTextsRecursively(texts.slice(1));
        this.finished$.next(false);
      }
    } else {
      this.finished$.next(true);
      this.audioService.release(this.background);
    }
  }

  speakLiturgy(liturgy : CompiledLiturgy) : Subject<boolean> {
    //console.log(this.speech);
    let texts : Text[] = new Array(),
        absObjIndex : number = 0;

    this.isPlaying = true;

    if(!(this.platform.is('capacitor') && this.platform.is('android'))) {
      this.audioService.setVolume(this.background, 0.75);
      this.audioService.play(this.background, true);
    }

    liturgy.liturgy.forEach((section, sectionIndex) => {
      section.value.forEach((option, optionIndex) => {
        if(!(sectionIndex == 0 && optionIndex == 0)) {
          texts.push(new Text(' ', absObjIndex, this.defaultLang, 500));
        }
        let selectedOption : number = option.selected || 0;
        texts = texts.concat(this.speakOption(option.value[selectedOption], absObjIndex));
        absObjIndex++;
      });
      texts.push(new Text(' ', absObjIndex, this.defaultLang, 1000));
    });

    // attach textIndices
    let howmany = {};
    texts = texts.map((item, index) => {
      if(item) {
        const ii = item.objIndex.toString();
        if(!(howmany[ii])) {
          howmany[ii] = 0;
        }
        item.textIndex = howmany[ii];
        howmany[ii] = howmany[ii] + 1;
        return item;
      }
    });

    this.compiledTexts = JSON.parse(JSON.stringify(texts));
    this.object$.next(this.objects[0]);
    this.speakTextsRecursively(texts);
    return this.finished$;
  }

  speakOption(obj : LiturgyObject, absObjIndex : number) : Text[] {
    let texts : Text[] = new Array();

    if(obj) {
      this.objects.push(obj);
      let lang = obj.language;
      switch(obj.type) {
        case 'reading':
          let updatedLabel : string = this.bibleService.getCitationText(obj.label);
          texts.push(new Text(updatedLabel, absObjIndex, this.defaultLang));
          if(obj.verses && obj.verses.length > 0) {
            obj.verses.forEach(section => {
              section.forEach(verse => {
                texts = texts.concat(verse.text.split('\n').map(text => new Text(text, absObjIndex, lang)))
              });
            });
            break;
          }
        case 'text':
        case 'antiphon':
        case 'rubric':
          obj.value.forEach(p => {
            texts = texts.concat(p.split('\n').map(text => new Text(text, absObjIndex, lang)))
          });
          if(obj.response) {
            texts = texts.concat(new Text(obj.response, absObjIndex, lang));
          }
          break;
        case 'gloria':
          this.gloria = obj;
          console.log('gloria is = ', this.gloria);
          texts = texts.concat(obj.value.map(p => new Text(p.replace(/\&nbsp\;/g, ' '), absObjIndex, lang)));
          break;
        case 'scripture':
        case 'collect':
          texts = texts.concat(new Text(obj.value, absObjIndex, lang))
            .concat(new Text(obj.response ? ` ${obj.response}` : ' Amen.', absObjIndex, lang));
          break;
        case 'prayers':
          if(obj.slug == 'meditate') {
            texts.push(new Text('A meditation, silent or spoken, may follow. You can find a meditation timer in the app.', absObjIndex, lang, 3000));
          } else if(obj.slug == 'free-intercessions') {
            texts.push(new Text('Free intercessions may be offered.', absObjIndex, lang, 5000));
          } else if(obj.value) {
            obj.value.forEach(category => category.value.forEach(section => section.value.forEach(prayer => {
              if(prayer.show) {
                texts = texts.concat(new Text(prayer.text, absObjIndex, lang)).concat(new Text(obj.response ? ` ${obj.response}` : ' Amen.', absObjIndex, lang));
              }
            })))
          }
          break;
        case 'preces':
        case 'litany':
        case 'responsive':
          if(obj.value[0].hasOwnProperty('label')) {
            obj.value.forEach((line, index) => {
              texts.push(new Text(line.text, absObjIndex, lang))
            });
          }
          if(!!obj.response || Array.isArray(obj.value[0])) {
            obj.value.forEach((line, index) => {
              texts.push(new Text(line[0], absObjIndex, lang));
              texts.push(new Text(obj.response ? obj.response : line[1], absObjIndex, lang))
            });
          }
          break;
        case 'psalm':
        case 'canticle':
          texts.push(new Text((!obj.canticle && !obj.number) ? obj.localname || obj.label : obj.label, absObjIndex, lang));
          obj.value.forEach(set => {
            if(set.hasOwnProperty('label')) {
              texts.push(new Text(set.label, absObjIndex, lang));
            }

            (set.verses || set).forEach(verse => {
              if(verse.length == 3) {
                texts.push(new Text(`${verse[1]}`.replace(/\&nbsp\;/g, ' '), absObjIndex, lang, 900));
                texts.push(new Text(verse[2].replace(/\&nbsp\;/g, ' '), absObjIndex, lang));
              } else if(verse.length == 2) {
                texts.push(new Text(`${verse[0]}`.replace(/\&nbsp\;/g, ' '), absObjIndex, lang, 900));
                texts.push(new Text(verse[1].replace(/\&nbsp\;/g, ' '), absObjIndex, lang));
              } else {
                texts.push(new Text(verse[0].replace(/\&nbsp\;/g, ' '), absObjIndex, lang));
              }
            });
          });

          if(obj.canticle && !obj.omit_gloria && this.gloria) {
            texts = texts.concat(this.gloria.value.map(p => new Text(p.replace(/\&nbsp\;/g, ' '), absObjIndex, lang)));
          }

          break;
        default:
          texts.push(new Text(JSON.stringify(obj), absObjIndex, lang));
          break;
      }

      return texts;
    }
  }
}

export class Text {
  text: string;
  lang?: string;
  objIndex : number;
  textIndex? : number;
  delayAfter: number;

  constructor(text : string, objIndex : number, lang : string, delayAfter : number = 300, textIndex : number = undefined) {
    this.text = text;
    this.objIndex = objIndex;
    this.lang = lang;
    this.delayAfter = delayAfter;
    if(textIndex) {
      this.textIndex = textIndex;
    }
  }
}
