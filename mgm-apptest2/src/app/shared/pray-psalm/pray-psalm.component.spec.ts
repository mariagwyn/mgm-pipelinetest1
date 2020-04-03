import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayPsalmComponent } from './pray-psalm.component';

describe('PrayPsalmComponent', () => {
  let component: PrayPsalmComponent;
  let fixture: ComponentFixture<PrayPsalmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayPsalmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayPsalmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
