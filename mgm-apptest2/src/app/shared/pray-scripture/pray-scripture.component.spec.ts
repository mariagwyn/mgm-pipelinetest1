import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayScriptureComponent } from './pray-scripture.component';

describe('PrayScriptureComponent', () => {
  let component: PrayScriptureComponent;
  let fixture: ComponentFixture<PrayScriptureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrayScriptureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrayScriptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
