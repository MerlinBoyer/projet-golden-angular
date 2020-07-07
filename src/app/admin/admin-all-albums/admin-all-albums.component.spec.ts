import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAllAlbumsComponent } from './admin-all-albums.component';

describe('AdminAllAlbumsComponent', () => {
  let component: AdminAllAlbumsComponent;
  let fixture: ComponentFixture<AdminAllAlbumsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAllAlbumsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAllAlbumsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
