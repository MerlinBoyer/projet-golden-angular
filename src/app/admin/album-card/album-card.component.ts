import { Component, OnInit, Input, Inject } from '@angular/core';
import { Album } from 'src/app/models/album';
import { Router } from '@angular/router';
import { PublicService } from 'src/app/services/public.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

export interface DialogData {
  code: string;
}

@Component({
  selector: 'app-admin-album-card',
  templateUrl: './album-card.component.html',
  styleUrls: ['./album-card.component.css']
})
export class AlbumCardComponent implements OnInit {

  album: Album;
  @Input() alb: Album;

  constructor(private router: Router,
    private publicService: PublicService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.album = this.alb;
  }

  // open popup to get album code if needed
  // go to print-album-comp
  onClicked() {
    sessionStorage.setItem('savedAlbumCode', '');
    this.loadAlbum();
  }

  // go to print-album-comp
  loadAlbum() {
    this.publicService.saveAlbum( this.album );
    sessionStorage.setItem('savedAlbumId', this.album.id.toString() );
    this.router.navigate(["/admin/album"]);
  }

}

