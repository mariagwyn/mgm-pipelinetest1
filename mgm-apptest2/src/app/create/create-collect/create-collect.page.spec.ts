import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateCollectPage } from './create-collect.page';

describe('CreateCollectPage', () => {
  let component: CreateCollectPage;
  let fixture: ComponentFixture<CreateCollectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCollectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCollectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
