import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayObjectComponent } from './pray-object.component';

describe('PrayObjectComponent', () => {
  let component: PrayObjectComponent;
  let fixture: ComponentFixture<PrayObjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayObjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayObjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
