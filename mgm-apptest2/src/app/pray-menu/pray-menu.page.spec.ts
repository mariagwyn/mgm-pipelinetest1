import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrayMenuPage } from './pray-menu.page';

describe('PrayMenuPage', () => {
  let component: PrayMenuPage;
  let fixture: ComponentFixture<PrayMenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayMenuPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrayMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
