import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindStudents } from './find-students';

describe('FindStudents', () => {
  let component: FindStudents;
  let fixture: ComponentFixture<FindStudents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FindStudents],
    }).compileComponents();

    fixture = TestBed.createComponent(FindStudents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
