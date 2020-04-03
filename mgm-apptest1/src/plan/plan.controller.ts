import { Controller, Get, Query, HttpCode, HttpStatus, Header, Res, Post, Body } from '@nestjs/common';
import { PlanService } from './plan.service';
import { PrayService } from '../pray/pray.service';
import { CalendarService } from '../calendar/calendar.service';
import { Readable } from 'stream';
import { Liturgy, Section, Condition, ClientPreferences, PreferenceOption } from '../liturgy/liturgy.entity';
import { LiturgicalDay } from '../calendar/calendar.model';
import { CompiledLiturgy, CompiledSection } from '../pray/pray.model';


@Controller('plan')
export class PlanController {
  constructor(
    private planService : PlanService,
    private calendarService : CalendarService,
    private prayService : PrayService
  ) {}


  @Post('docx')
  @HttpCode(HttpStatus.OK)
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  @Header('Content-Disposition', 'attachment; filename=liturgy.docx')
  async docxPost(
    @Body() compiledLiturgy : CompiledLiturgy,
    @Res() res
  ) {
    // build the data
    let filename = `${compiledLiturgy.name} - ${compiledLiturgy.date}`,
        buffer = await this.planService.compiledLiturgyToDocx(compiledLiturgy);

    // stream the data
    const stream : Readable = new Readable();
    stream.push(buffer);
    stream.push(null);
    res.set({
      'Content-Length': buffer.length
    });
    stream.pipe(res);
  }
}
