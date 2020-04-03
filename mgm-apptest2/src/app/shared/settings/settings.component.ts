import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { DisplaySettings } from '../../models/display-settings.model';
import { PopoverController } from '@ionic/angular';
import { SpeechService } from '../../services/speech.service';

import { faFont } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'venite-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass'],
})
export class SettingsComponent implements OnInit {
  @Input() settings : DisplaySettings;
  @Input() voiceChoices : SpeechSynthesisVoice[];
  @Input() voiceChoiceName : string;
  @Input() backgroundEnabled : boolean = true;
  voicesWithNationalities : { voice: SpeechSynthesisVoice; nationality: string }[];

  faFont = faFont;

  constructor(
    private popoverController : PopoverController,
    private speechService : SpeechService
  ) { }

  ngOnInit() {
    this.voicesWithNationalities = this.voiceChoices
      .map(voice => {
        return { voice, nationality: this.speechService.getNationality(voice) };
      })
      .sort((a, b) => b.nationality < a.nationality ? 1 : -1);
  }

  ngOnChanges() {
    this.voicesWithNationalities = this.voiceChoices
      .map(voice => {
        return { voice, nationality: this.speechService.getNationality(voice) };
      })
      .sort((a, b) => b.nationality < a.nationality ? 1 : -1);
  }
}
