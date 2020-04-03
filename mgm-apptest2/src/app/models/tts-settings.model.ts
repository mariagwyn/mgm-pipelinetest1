export class TTSSettings {
  volume: number;
  lang: string;
  rate: number;
  pitch: number;
  voice?: string;

  constructor(
    lang: string = 'en-GB',
    volume: number = 1,
    rate: number = 0.85,
    pitch: number = 1,
    voice: string = undefined
  ) {
    this.volume = volume;
    this.lang = lang;
    this.rate = rate;
    this.pitch = pitch;
    if(voice) {
      this.voice = voice;
    }
  }
}
