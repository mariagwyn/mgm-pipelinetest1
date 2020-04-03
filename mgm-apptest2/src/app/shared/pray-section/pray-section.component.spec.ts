import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PraySectionComponent } from './pray-section.component';

describe('PraySectionComponent', () => {
  let component: PraySectionComponent;
  let fixture: ComponentFixture<PraySectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PraySectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PraySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
