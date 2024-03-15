import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesProductsComponent } from './recipes-products.component';

describe('RecipesProductsComponent', () => {
  let component: RecipesProductsComponent;
  let fixture: ComponentFixture<RecipesProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecipesProductsComponent]
    });
    fixture = TestBed.createComponent(RecipesProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
