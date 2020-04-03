import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CopyBulletinLinkComponent } from './copy-bulletin-link.component';

describe('CopyBulletinLinkComponent', () => {
  let component: CopyBulletinLinkComponent;
  let fixture: ComponentFixture<CopyBulletinLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyBulletinLinkComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CopyBulletinLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
