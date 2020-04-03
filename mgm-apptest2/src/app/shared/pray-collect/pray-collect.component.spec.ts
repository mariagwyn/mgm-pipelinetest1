import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayCollectComponent } from './pray-collect.component';

describe('PrayCollectComponent', () => {
  let component: PrayCollectComponent;
  let fixture: ComponentFixture<PrayCollectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayCollectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayCollectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
