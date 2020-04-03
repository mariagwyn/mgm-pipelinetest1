import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreatePsalmPage } from './create-psalm.page';

describe('CreatePsalmPage', () => {
  let component: CreatePsalmPage;
  let fixture: ComponentFixture<CreatePsalmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePsalmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePsalmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
