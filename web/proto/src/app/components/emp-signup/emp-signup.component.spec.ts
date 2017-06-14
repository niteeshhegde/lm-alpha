import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpSignupComponent } from './emp-signup.component';

describe('EmpSignupComponent', () => {
  let component: EmpSignupComponent;
  let fixture: ComponentFixture<EmpSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpSignupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
