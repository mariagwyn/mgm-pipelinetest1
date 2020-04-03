import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayReadingComponent } from './pray-reading.component';

describe('PrayReadingComponent', () => {
  let component: PrayReadingComponent;
  let fixture: ComponentFixture<PrayReadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayReadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
