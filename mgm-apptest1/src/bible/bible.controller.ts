import { Controller, Get, Query } from '@nestjs/common';
import { BibleService } from './bible.service';
import { BibleReading } from './bible.entity';
import { Psalm } from '../psalm/psalm.entity';

@Controller('bible')
export class BibleController {
  constructor(private bibleService : BibleService) {}

  @Get()
  async getVerses(@Query('citation') citation : string, @Query('version') version : string = 'NRSV') {
    let reading : BibleReading = await this.bibleService.get(citation, version);
    console.log(reading);
    if(!reading || (!reading.value && !reading.verses)) {
      reading = await this.bibleService.get(citation, 'NRSV');
    }
    return reading;
  }

  @Get('psalm')
  async getPsalm(@Query('citation') citation : string, @Query('version') version : string = 'BCP') {
    let psalm : Psalm = await this.bibleService.getOremusPsalm(citation, version);
    return psalm;
  }
}
