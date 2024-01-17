import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalSequenceComponent } from './internal-sequence.component';

describe('InternalSequenceComponent', () => {
  let component: InternalSequenceComponent;
  let fixture: ComponentFixture<InternalSequenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalSequenceComponent]
    });
    fixture = TestBed.createComponent(InternalSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
