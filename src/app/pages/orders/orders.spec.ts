import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { Orders } from './orders';
import { OrderService } from '../../services/order';

describe('Orders', () => {
  let component: Orders;
  let fixture: ComponentFixture<Orders>;
  const orderServiceStub = {
    getAllOrders: () => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Orders, RouterTestingModule],
      providers: [{ provide: OrderService, useValue: orderServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Orders);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
