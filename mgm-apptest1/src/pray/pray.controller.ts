import { Controller, Get, Query } from '@nestjs/common';
import { CalendarService } from '../calendar/calendar.service';
import { LectionaryService } from '../lectionary/lectionary.service';
import { PrayService } from './pray.service';
import { LiturgicalDay } from '../calendar/calendar.model';
import { Reading } from '../lectionary/lectionary.entity';
import { CompiledLiturgy, CompiledSection } from './pray.model';
import { Liturgy, ClientPreferences } from '../liturgy/liturgy.entity';
import { Prayer } from '../prayer/prayer.entity';

@Controller('pray')
export class PrayController {
  constructor(
    private readonly calendarService : CalendarService,
    private readonly lectionaryService : LectionaryService,
    private readonly prayService : PrayService
  ) { }

  @Get()
  async compileLiturgy(
    @Query('y') year : string,
    @Query('m') month : string,
    @Query('d') day : string,
    @Query('liturgy') liturgyName : string,
    @Query('preferences') prefsRaw : string,
    @Query('language') language : string = 'en',
    @Query('version') version : string = 'Rite II',
    @Query('rotate') rotate : string = 'true',
    @Query('vigil') vigil : string = 'false'
  ) : Promise<CompiledLiturgy> {

    let prefs : ClientPreferences = JSON.parse(prefsRaw || '{}'),
        date : Date = this.calendarService.dateFromYMD(year, month, day),
        liturgy : Liturgy = await this.prayService.getLiturgy(liturgyName, language, version),
        liturgicalDay : LiturgicalDay = this.calendarService.liturgicalDay(date, liturgy.evening, vigil == 'true'),
        compiled : CompiledSection[] = await this.prayService.compileLiturgy(
          date,
          liturgicalDay,
          liturgy,
          prefs,
          !(rotate == 'false')
        );

    return {
      date,
      name: liturgy.name,
      day: liturgicalDay,
      language: liturgy.language,
      version: liturgy.version,
      liturgyversions: liturgy.liturgyversions,
      liturgy: compiled
    }
  }

  @Get('prayer')
  async getPrayer(
    @Query('slug') slug : string,
    @Query('language') language : string,
    @Query('version') version : string
  ) : Promise<Prayer> {
    return this.prayService.getPrayer(slug, language, version);
  }

  @Get('readings')
  async getReadings(
    @Query('y') year : string,
    @Query('m') month : string,
    @Query('d') day : string,
    @Query('liturgy') liturgyName : string,
    @Query('language') language : string,
    @Query('version') version : string
  ) : Promise<Reading[]> {
    const date : Date = this.calendarService.dateFromYMD(year, month, day),
          liturgy : Liturgy = await this.prayService.getLiturgy(liturgyName, language, version),
          liturgicalDay : LiturgicalDay = this.calendarService.liturgicalDay(date, liturgy.evening);
    return this.lectionaryService.find({ day: liturgicalDay.slug });
  }
}
