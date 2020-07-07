import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintAlbumComponent } from './print-album.component';

describe('PrintAlbumComponent', () => {
  let component: PrintAlbumComponent;
  let fixture: ComponentFixture<PrintAlbumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintAlbumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintAlbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
