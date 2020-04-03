import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreatePrayerPage } from './create-prayer.page';

describe('CreatePrayerPage', () => {
  let component: CreatePrayerPage;
  let fixture: ComponentFixture<CreatePrayerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePrayerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePrayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
