import { Controller, Get, Query } from '@nestjs/common';
import { BibleService } from '../bible/bible.service';
import { BibleReading } from '../bible/bible.entity';
import { LectionaryService } from '../lectionary/lectionary.service';
import { Reading } from '../lectionary/lectionary.entity';
import { Like } from 'typeorm';

@Controller('analysis')
export class AnalysisController {
  constructor(
    private lectionary : LectionaryService,
    private bible : BibleService
  ) { }

  @Get('wordcloud')
  async getWords(@Query('season') season : string) : Promise<string> {
    let readings : Reading[] = await this.lectionary.find({
      whentype: 'year',
      day: Like(`%-${season}`)
    });

    let soFar : string = (await Promise.all(readings.map(async reading => {
      let bibleReading = (await this.bible.query({
        citation: reading.citation
      }))[0];
      return (bibleReading && bibleReading.value) ? bibleReading.value.join(' ') : '';
    }))).join(' ');

    return soFar;
  }
}
