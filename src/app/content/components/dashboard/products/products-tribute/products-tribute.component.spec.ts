import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsTributeComponent } from './products-tribute.component';

describe('ProductsTributeComponent', () => {
  let component: ProductsTributeComponent;
  let fixture: ComponentFixture<ProductsTributeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsTributeComponent]
    });
    fixture = TestBed.createComponent(ProductsTributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
