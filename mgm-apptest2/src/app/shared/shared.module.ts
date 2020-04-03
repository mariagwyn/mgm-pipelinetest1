import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { ErrorComponent } from './error/error.component';
import { EditPrayerComponent } from './edit-prayer/edit-prayer.component';
import { EditPsalmComponent } from './edit-psalm/edit-psalm.component';
import { EditCollectComponent } from './edit-collect/edit-collect.component';
import { EditLiturgyComponent } from './edit-liturgy/edit-liturgy.component';
import { EditLiturgyWrapperComponent } from './edit-liturgy-wrapper/edit-liturgy-wrapper.component';
import { EditPrayerWrapperComponent } from './edit-prayer-wrapper/edit-prayer-wrapper.component';
import { EditPsalmWrapperComponent } from './edit-psalm-wrapper/edit-psalm-wrapper.component';
import { EditCollectWrapperComponent } from './edit-collect-wrapper/edit-collect-wrapper.component';
import { PrayPsalmComponent } from './pray-psalm/pray-psalm.component';
import { PrayGloriaComponent } from './pray-gloria/pray-gloria.component';

import { LordPipe } from '../pipes/lord.pipe';
import { TypographyPipe } from '../pipes/typography.pipe';
import { ReplaceableTextPipe } from '../pipes/replaceabletext.pipe';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { NewlinesPipe } from '../pipes/newlines.pipe';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SelectableDirective } from '../directives/selectable.directive';

import { PrayComponent } from './pray/pray.component';
import { PrayAntiphonComponent } from './pray-antiphon/pray-antiphon.component';
import { PrayCollectComponent } from './pray-collect/pray-collect.component';
import { PrayObjectComponent } from './pray-object/pray-object.component';
import { PrayOptionComponent } from './pray-option/pray-option.component';
import { PrayPrayersComponent } from './pray-prayers/pray-prayers.component';
import { PrayResponsivePrayerComponent } from './pray-responsive-prayer/pray-responsive-prayer.component';
import { PraySectionComponent } from './pray-section/pray-section.component';
import { PrayReadingComponent } from './pray-reading/pray-reading.component';
import { PrayRubricComponent } from './pray-rubric/pray-rubric.component';
import { PrayScriptureComponent } from './pray-scripture/pray-scripture.component';
import { PrayTextComponent } from './pray-text/pray-text.component';

import { CopyBulletinLinkComponent } from './copy-bulletin-link/copy-bulletin-link.component';
import { SettingsComponent } from './settings/settings.component';
import { MarkFavoriteComponent } from './mark-favorite/mark-favorite.component';
import { FavoriteTextComponent } from './favorite-text/favorite-text.component';

@NgModule({
  declarations: [
    EditPrayerComponent,
    EditPsalmComponent,
    EditCollectComponent,
    EditLiturgyComponent,
    EditLiturgyWrapperComponent,
    EditPrayerWrapperComponent,
    EditPsalmWrapperComponent,
    EditCollectWrapperComponent,
    ErrorComponent,
    PrayPsalmComponent,
    PrayGloriaComponent,
    LordPipe,
    ReplaceableTextPipe,
    TypographyPipe,
    TruncatePipe,
    NewlinesPipe,
    SelectableDirective,
    PrayComponent,
    PrayAntiphonComponent,
    PrayCollectComponent,
    PrayObjectComponent,
    PrayOptionComponent,
    PrayPrayersComponent,
    PrayResponsivePrayerComponent,
    PraySectionComponent,
    PrayReadingComponent,
    PrayRubricComponent,
    PrayScriptureComponent,
    PrayTextComponent,
    SettingsComponent,
    MarkFavoriteComponent,
    FavoriteTextComponent,
    CopyBulletinLinkComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    RouterModule
  ],
  exports: [
    EditPrayerComponent,
    EditPsalmComponent,
    EditCollectComponent,
    EditLiturgyComponent,
    EditLiturgyWrapperComponent,
    EditPrayerWrapperComponent,
    EditPsalmWrapperComponent,
    EditCollectWrapperComponent,
    ErrorComponent,
    PrayPsalmComponent,
    PrayGloriaComponent,
    LordPipe,
    ReplaceableTextPipe,
    TypographyPipe,
    TruncatePipe,
    NewlinesPipe,
    SelectableDirective,
    PrayComponent,
    PrayAntiphonComponent,
    PrayCollectComponent,
    PrayObjectComponent,
    PrayOptionComponent,
    PrayPrayersComponent,
    PrayResponsivePrayerComponent,
    PraySectionComponent,
    PrayReadingComponent,
    PrayRubricComponent,
    PrayScriptureComponent,
    PrayTextComponent,
    SettingsComponent,
    MarkFavoriteComponent,
    FavoriteTextComponent,
    CopyBulletinLinkComponent
  ]
})
export class SharedModule { }
