import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeRoomsComponent } from './type-rooms.component';

describe('TypeRoomsComponent', () => {
  let component: TypeRoomsComponent;
  let fixture: ComponentFixture<TypeRoomsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TypeRoomsComponent]
    });
    fixture = TestBed.createComponent(TypeRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
