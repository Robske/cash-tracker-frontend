import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordManageComponent } from './record-manage.component';

describe('RecordManageComponent', () => {
  let component: RecordManageComponent;
  let fixture: ComponentFixture<RecordManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordManageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
