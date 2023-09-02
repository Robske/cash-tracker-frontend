import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordSharedComponent } from './record-shared.component';

describe('RecordSharedComponent', () => {
  let component: RecordSharedComponent;
  let fixture: ComponentFixture<RecordSharedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordSharedComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RecordSharedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
