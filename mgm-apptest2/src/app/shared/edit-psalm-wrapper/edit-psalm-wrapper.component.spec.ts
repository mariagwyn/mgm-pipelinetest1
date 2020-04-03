import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPsalmWrapperComponent } from './edit-psalm-wrapper.component';

describe('EditPsalmWrapperComponent', () => {
  let component: EditPsalmWrapperComponent;
  let fixture: ComponentFixture<EditPsalmWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPsalmWrapperComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPsalmWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
