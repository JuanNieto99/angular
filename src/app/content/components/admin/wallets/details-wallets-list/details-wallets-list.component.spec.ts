import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsWalletsListComponent } from './details-wallets-list.component';

describe('DetailsWalletsListComponent', () => {
  let component: DetailsWalletsListComponent;
  let fixture: ComponentFixture<DetailsWalletsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsWalletsListComponent]
    });
    fixture = TestBed.createComponent(DetailsWalletsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
