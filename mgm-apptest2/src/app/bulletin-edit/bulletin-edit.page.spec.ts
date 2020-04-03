import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BulletinEditPage } from './bulletin-edit.page';

describe('BulletinEditPage', () => {
  let component: BulletinEditPage;
  let fixture: ComponentFixture<BulletinEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulletinEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BulletinEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
