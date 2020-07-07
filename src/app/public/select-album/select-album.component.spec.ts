import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectAlbumComponent } from './select-album.component';

describe('SelectAlbumComponent', () => {
  let component: SelectAlbumComponent;
  let fixture: ComponentFixture<SelectAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
