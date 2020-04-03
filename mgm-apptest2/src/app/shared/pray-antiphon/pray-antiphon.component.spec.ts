import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayAntiphonComponent } from './pray-antiphon.component';

describe('PrayAntiphonComponent', () => {
  let component: PrayAntiphonComponent;
  let fixture: ComponentFixture<PrayAntiphonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayAntiphonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayAntiphonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
