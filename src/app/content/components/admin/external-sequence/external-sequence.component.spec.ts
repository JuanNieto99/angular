import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalSequenceComponent } from './external-sequence.component';

describe('ExternalSequenceComponent', () => {
  let component: ExternalSequenceComponent;
  let fixture: ComponentFixture<ExternalSequenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalSequenceComponent]
    });
    fixture = TestBed.createComponent(ExternalSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
