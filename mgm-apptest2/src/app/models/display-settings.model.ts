export class DisplaySettings {
  dropcaps: 'decorated'|'plain'|'none';
  response: 'bold'|'italics';
  repeatAntiphon: 'bracket'|'repeat'|'none';
  fontscale: 's'|'m'|'l'|'xl'|'xxl';
  font: 'garamond'|'gill-sans'
  voiceChoice: string;
  voiceRate: number = 0.75;
  voiceBackground: 'silence'|'seashore'|'garden'|'night'|'silence-short';
  voiceBackgroundVolume: number = 0.5;
  psalmVerses: boolean = false;
  bibleVerses : boolean = false;
  meditationBell: 'silence'|'singing-bowl';
  displayMode: 'auto'|'dark'|'light';

  constructor(
    dropcaps : 'decorated'|'plain'|'none' = 'decorated',
    response : 'bold'|'italics' = 'bold',
    repeatAntiphon : 'bracket'|'repeat'|'none' = 'bracket',
    fontscale : 's'|'m'|'l'|'xl'|'xxl' = 'm',
    font : 'garamond'|'gill-sans' = 'garamond',
    voiceRate: number = 0.85,
    voiceBackground: 'silence'|'seashore'|'garden'|'night'|'silence-short' = 'silence',
    voiceBackgroundVolume: number = 0.5,
    psalmVerses: boolean = false,
    bibleVerses: boolean = false,
    meditationBell: 'silence'|'singing-bowl' = 'singing-bowl',
    displayMode: 'auto'|'dark'|'light' = 'auto'
  ) {
    this.dropcaps = dropcaps;
    this.response = response;
    this.repeatAntiphon = repeatAntiphon;
    this.fontscale = fontscale;
    this.font = font;
    this.voiceRate = voiceRate;
    this.voiceBackground = voiceBackground;
    this.voiceBackgroundVolume = voiceBackgroundVolume;
    this.psalmVerses = psalmVerses;
    this.bibleVerses = bibleVerses;
    this.meditationBell = meditationBell;
    this.displayMode = displayMode;
  }
}
