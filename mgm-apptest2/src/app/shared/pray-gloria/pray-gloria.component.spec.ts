import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayGloriaComponent } from './pray-gloria.component';

describe('PrayGloriaComponent', () => {
  let component: PrayGloriaComponent;
  let fixture: ComponentFixture<PrayGloriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayGloriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayGloriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
