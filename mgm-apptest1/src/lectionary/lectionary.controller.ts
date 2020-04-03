import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { LectionaryService } from './lectionary.service';
import { Reading } from './lectionary.entity';
import { CalendarService } from '../calendar/calendar.service';
import { LiturgicalDay } from '../calendar/calendar.model';

@Controller('lectionary')
export class LectionaryController {
  constructor(private readonly lectionaryService: LectionaryService, private readonly calendarService : CalendarService) {}

  @Get('office')
  async getOfficeReadings(@Query('y') year : string, @Query('m') month : string, @Query('d') dayOfMonth : string, @Query('evening') evening : string) {
    const date : Date = this.calendarService.dateFromYMD(year, month, dayOfMonth),
          day : LiturgicalDay = this.calendarService.liturgicalDay(date, evening == 'true'),
          readings = await this.lectionaryService.getReadings(day.slug, 'bcp1979_daily_office', day.years.bcp1979_daily_office, 'year', date),
          psalms = await this.lectionaryService.getReadings(day.slug, 'bcp1979_daily_psalms', day.years.bcp1979_daily_psalms, 'year', date);
    return readings.concat(psalms);
  }

  @Get('reading')
  async getReadings(
    @Query('day') slug : string,
    @Query('lectionary') lectionary : string,
    @Query('when') when : number,
    @Query('whentype') whentype : string,
    @Query('y') y : string,
    @Query('m') m : string,
    @Query('d') d : string
  ) : Promise<Reading[]> {
    let date : Date = undefined;
    if(y && m && d) {
      date = new Date();
      date.setFullYear(parseInt(y));
      date.setMonth(parseInt(m)-1);
      date.setDate(parseInt(d));
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
    }
    return await this.lectionaryService.getReadings(slug, lectionary, when, whentype, date);
  }

  @Get('readings')
  async getAllReadings() {
    let readings = await this.lectionaryService.findAll();
    return readings;
  }

  @Post('reading')
  async createReading(@Body() reading : Reading) {
    return this.lectionaryService.create(reading);
  }
}
