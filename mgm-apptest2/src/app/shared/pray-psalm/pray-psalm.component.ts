import { Component, OnInit, Input } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { PsalmService } from '../../services/psalm.service';

@Component({
  selector: 'venite-pray-psalm',
  templateUrl: './pray-psalm.component.html',
  styleUrls: ['./pray-psalm.component.sass']
})
export class PrayPsalmComponent implements OnInit {
  @Input() slug: string;
  @Input() number : string;
  @Input() value : string[][];
  @Input() showNumbers : boolean = false;

  @Input() canticle : boolean = false;
  @Input() invitatory : boolean = false;
  @Input() english : string;
  @Input() latin : string;
  @Input() citation : string;

  @Input() antiphon : string;
  @Input() omit_gloria : boolean = false;
  @Input() bulletinEditor : boolean = false;
  changingCitation : boolean = false;
  isPsalm : boolean = true;

  @Input() language : string = 'en';
  @Input() version : string = 'bcp1979';

  filteredValue : string[][] = new Array();
  gloriaValue : string[] = new Array();
  includeAntiphon : boolean = false;

  constructor(private service : RecipeService, private psalmService : PsalmService) { }

  async ngOnInit() {
    // if it's a real psalm, but has a citation and numbers, means we might need to filter verses
    this.filter();

    let gloria = await this.service.getPrayer('gloria_patri', this.language, this.version);
    if(gloria) {
      this.gloriaValue = gloria.value;
    }

    this.isPsalm = !!this.slug.match(/psalm_/);
    this.includeAntiphon = this.antiphon && !(this.canticle && !this.omit_gloria);
  }

  filter() {
    if(this.citation && !this.citation.match(/psalm_/) && this.slug.match(/psalm_/) && this.value[0][0].length == 3) {
      const versesInCitation : string[] = this.psalmService.versesInCitation(this.citation);
      this.filteredValue = new Array();
      this.value.forEach(section => {
        const newSection = new Array();

        section.forEach(verse => {
          if(versesInCitation.includes(verse[0])) {
            newSection.push(verse);
          }
        });

        this.filteredValue.push(newSection);
      });
    } else {
      this.filteredValue = this.value.filter(section => Array.isArray(section) ? section.length > 0 : true);
    }
  }

  citationMenu() {
    this.changingCitation = true;
    if(this.citation.match(/psalm_/)) {
      this.citation = this.citation.replace('psalm_', 'Psalm ');
    }
  }

  changeCitation() {
    this.filter();
  }

}
