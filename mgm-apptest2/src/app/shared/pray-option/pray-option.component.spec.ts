import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayOptionComponent } from './pray-option.component';

describe('PrayOptionComponent', () => {
  let component: PrayOptionComponent;
  let fixture: ComponentFixture<PrayOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
