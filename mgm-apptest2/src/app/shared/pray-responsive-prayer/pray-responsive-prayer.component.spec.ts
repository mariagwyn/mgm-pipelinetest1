import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrayResponsivePrayerComponent } from './pray-responsive-prayer.component';

describe('PrayResponsivePrayerComponent', () => {
  let component: PrayResponsivePrayerComponent;
  let fixture: ComponentFixture<PrayResponsivePrayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayResponsivePrayerComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrayResponsivePrayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
