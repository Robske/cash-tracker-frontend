import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewChannelComponent } from './overview-channel.component';

describe('OverviewChannelComponent', () => {
  let component: OverviewChannelComponent;
  let fixture: ComponentFixture<OverviewChannelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OverviewChannelComponent]
    });
    fixture = TestBed.createComponent(OverviewChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
