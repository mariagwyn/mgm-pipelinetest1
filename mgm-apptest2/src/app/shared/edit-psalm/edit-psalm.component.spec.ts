import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPsalmComponent } from './edit-psalm.component';

describe('EditPsalmComponent', () => {
  let component: EditPsalmComponent;
  let fixture: ComponentFixture<EditPsalmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPsalmComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPsalmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
