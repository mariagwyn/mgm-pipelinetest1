import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Media, MediaObject, MEDIA_STATUS } from '@ionic-native/media/ngx';

interface Sound {
  key: string;
  asset: string;
  file: MediaObject;
  playing: boolean;
  webplayer: HTMLAudioElement;
}

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private sounds: Sound[] = [];
  private forceWebAudio: boolean = true;

  constructor(
    private platform: Platform,
    private media : Media
  ) { }

  preload(key: string, asset: string): void {
    let file : MediaObject,
        webplayer : HTMLAudioElement;
    if(this.platform.is('capacitor') && this.platform.is('ios')) {
      file = this.media.create(asset);
    } else {
      webplayer = new Audio();
      webplayer.src = asset;
    }
    this.sounds.push({ key, asset, file, playing: false, webplayer });
  }

  isReady(key : string) : boolean {
    let sound = this.sounds.find((sound) => {
      return sound.key === key;
    });
    return sound && (!!sound.file || !!sound.webplayer);
  }

  play(key: string, loop : boolean = false): void {
    console.log(JSON.stringify(this.platform.platforms()));


    let sound = this.sounds.find((sound) => {
      return sound.key === key;
    });
    sound.playing = true;

    if(this.platform.is('capacitor') && this.platform.is('ios')) {
      sound.file.play(); // add looping support
      if(loop) {
        sound.file.onStatusUpdate.subscribe(status => {
          if(status == MEDIA_STATUS.STOPPED) {
            sound.file.play();
          }
        });
      }
    } else {
      console.log('HTML5 audio mode enabled');
      sound.webplayer.loop = loop;
      sound.webplayer.play();
    }
  }

  pause(key: string) : void {
    let sound = this.sounds.find((sound) => {
      return sound.key === key;
    });
    sound.playing = false;

    if(this.platform.is('capacitor') && this.platform.is('ios')) {
      sound.file.pause(); // add looping support
    } else {
      sound.webplayer.pause();
    }
  }

  stop(key: string) : void {
    let sound = this.sounds.find((sound) => {
      return sound.key === key;
    });
    sound.playing = false;

    if(this.platform.is('capacitor') && this.platform.is('ios')) {
      sound.file.stop(); // add looping support
    } else {
      if(sound.webplayer) {
        sound.webplayer.pause();
      }
    }
  }

  release(key: string) : void {
    let sound = this.sounds.find((sound) => {
      return sound.key === key;
    });
    sound.playing = false;

    let soundIndex = this.sounds.indexOf(sound);
    this.sounds.splice(soundIndex, 1);

    if(this.platform.is('capacitor') && this.platform.is('ios')) {
      sound.file.release(); // add looping support
    } else {
      sound.webplayer.pause();
      sound.webplayer.src = '';
      sound.webplayer = null;
    }
  }

  setVolume(key: string, volume : number) : void {
    let sound = this.sounds.find((sound) => {
      return sound.key === key;
    });

    if(this.platform.is('capacitor') && this.platform.is('ios')) {
      sound.file.setVolume(volume); // add looping support
    } else {
      sound.webplayer.volume = volume;
    }
  }

  isPlaying(key: string) : boolean {
    let sound = this.sounds.find((sound) => {
      return sound.key === key;
    });
    return sound.playing;
  }
}
