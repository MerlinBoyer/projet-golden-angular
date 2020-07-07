import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPicCardComponent } from './admin-pic-card.component';

describe('AdminPicCardComponent', () => {
  let component: AdminPicCardComponent;
  let fixture: ComponentFixture<AdminPicCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPicCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPicCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
