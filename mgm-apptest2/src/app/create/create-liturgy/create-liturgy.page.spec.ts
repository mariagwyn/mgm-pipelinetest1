import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateLiturgyPage } from './create-liturgy.page';

describe('CreateLiturgyPage', () => {
  let component: CreateLiturgyPage;
  let fixture: ComponentFixture<CreateLiturgyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateLiturgyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateLiturgyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
