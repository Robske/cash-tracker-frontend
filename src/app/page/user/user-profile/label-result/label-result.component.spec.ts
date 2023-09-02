import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelResultComponent } from './label-result.component';

describe('LabelResultComponent', () => {
  let component: LabelResultComponent;
  let fixture: ComponentFixture<LabelResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabelResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LabelResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
