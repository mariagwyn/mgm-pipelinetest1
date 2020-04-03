import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditLiturgyWrapperComponent } from './edit-liturgy-wrapper.component';

describe('EditLiturgyWrapperComponent', () => {
  let component: EditLiturgyWrapperComponent;
  let fixture: ComponentFixture<EditLiturgyWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLiturgyWrapperComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditLiturgyWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
