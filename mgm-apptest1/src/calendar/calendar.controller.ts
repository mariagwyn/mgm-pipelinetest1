import { Controller, Get, Query } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { LiturgicalWeek } from '../season/season.model';
import { LiturgicalDay } from './calendar.model';

// Controller
@Controller('calendar')
export class CalendarController {

  constructor(private readonly calendarService: CalendarService) {}

  @Get('week')
  getLiturgicalWeek(@Query('y') year : string, @Query('m') month : string, @Query('d') day : string) : LiturgicalWeek {
    let date : Date = this.calendarService.dateFromYMD(year, month, day);
    return this.calendarService.liturgicalWeek(date);
  }

  @Get('day')
  getLiturgicalDay(@Query('y') year : string, @Query('m') month : string, @Query('d') day : string, @Query('evening') evening : string, @Query('vigil') vigil : string) : LiturgicalDay {
    let date : Date = this.calendarService.dateFromYMD(year, month, day);
    return this.calendarService.liturgicalDay(date, evening == 'true', vigil == 'true');
  }
}
