import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayTextComponent } from './pray-text.component';

describe('PrayTextComponent', () => {
  let component: PrayTextComponent;
  let fixture: ComponentFixture<PrayTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
