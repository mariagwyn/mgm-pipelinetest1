import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayPrayersComponent } from './pray-prayers.component';

describe('PrayPrayersComponent', () => {
  let component: PrayPrayersComponent;
  let fixture: ComponentFixture<PrayPrayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayPrayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayPrayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
