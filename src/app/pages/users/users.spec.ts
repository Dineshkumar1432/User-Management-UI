import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Users } from './users';
import { UserService } from '../../services/user';

describe('Users', () => {
  let component: Users;
  let fixture: ComponentFixture<Users>;
  const userServiceStub = {
    getUsers: () => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Users],
      providers: [{ provide: UserService, useValue: userServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Users);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
