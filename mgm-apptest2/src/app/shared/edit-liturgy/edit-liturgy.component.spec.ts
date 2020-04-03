import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditLiturgyComponent } from './edit-liturgy.component';

describe('EditLiturgyComponent', () => {
  let component: EditLiturgyComponent;
  let fixture: ComponentFixture<EditLiturgyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLiturgyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditLiturgyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
