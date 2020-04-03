import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayRubricComponent } from './pray-rubric.component';

describe('PrayRubricComponent', () => {
  let component: PrayRubricComponent;
  let fixture: ComponentFixture<PrayRubricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayRubricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayRubricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
