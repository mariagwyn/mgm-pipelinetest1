import { Module, MiddlewareConsumer, NestModule, HttpModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarController } from './calendar/calendar.controller';
import { CalendarService } from './calendar/calendar.service';
import { SeasonService } from './season/season.service';
import { HolydayService } from './holyday/holyday.service';
import { LectionaryController } from './lectionary/lectionary.controller';
import { LectionaryService } from './lectionary/lectionary.service';
import { CollectService } from './collect/collect.service';
import { CollectController } from './collect/collect.controller';
import { LiturgyController } from './liturgy/liturgy.controller';
import { LiturgyService } from './liturgy/liturgy.service';

import { AuthMiddleware } from './middleware/auth.middleware';

import { Reading } from './lectionary/lectionary.entity';
import { Psalm } from './psalm/psalm.entity';
import { Liturgy } from './liturgy/liturgy.entity';
import { Prayer } from './prayer/prayer.entity';
import { PsalmService } from './psalm/psalm.service';
import { PsalmController } from './psalm/psalm.controller';
import { PrayController } from './pray/pray.controller';
import { PrayService } from './pray/pray.service';
import { BibleService } from './bible/bible.service';
import { BibleController } from './bible/bible.controller';
import { BibleReading } from './bible/bible.entity';
import { Collect } from './collect/collect.entity';
import { HolydayController } from './holyday/holyday.controller';
import { UsersService } from './users/users.service';
import { UsersController } from './users/users.controller';
import { PlanService } from './plan/plan.service';
import { PlanController } from './plan/plan.controller';
import { PrayerService } from './prayer/prayer.service';
import { PrayerController } from './prayer/prayer.controller';
import { Favorite } from './favorite/favorite.entity';
import { FavoriteService } from './favorite/favorite.service';
import { FavoriteController } from './favorite/favorite.controller';
import { AnalysisController } from './analysis/analysis.controller';
import { BulletinController } from './bulletin/bulletin.controller';
import { BulletinService } from './bulletin/bulletin.service';
import { Bulletin } from './bulletin/bulletin.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [Reading, Psalm, Liturgy, Prayer, BibleReading, Collect, Favorite, Bulletin],
        synchronize: false,
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([
      Reading,
      Psalm,
      Liturgy,
      Prayer,
      BibleReading,
      Collect,
      Favorite,
      Bulletin
    ]),
    HttpModule
  ],
  controllers: [AppController, CalendarController, LectionaryController, CollectController, LiturgyController, PsalmController, PrayController, BibleController, HolydayController, UsersController, PlanController, PrayerController, FavoriteController, AnalysisController, BulletinController],
  providers: [AppService, CalendarService, SeasonService, HolydayService, LectionaryService, CollectService, LiturgyService, PsalmService, PrayService, BibleService, UsersService, PlanService, PrayerService, FavoriteService, BulletinService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('favorite');
  }
}
