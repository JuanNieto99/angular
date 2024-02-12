import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsWalletsComponent } from './details-wallets.component';

describe('DetailsWalletsComponent', () => {
  let component: DetailsWalletsComponent;
  let fixture: ComponentFixture<DetailsWalletsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsWalletsComponent]
    });
    fixture = TestBed.createComponent(DetailsWalletsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
