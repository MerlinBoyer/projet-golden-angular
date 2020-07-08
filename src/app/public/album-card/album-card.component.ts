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
  selector: 'app-album-card',
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
    if( this.album.visibility === 0) {
      this.requireCode();
    } else {
      sessionStorage.setItem('savedAlbumCode', '');
      this.loadAlbum();
    }
  }

  // open code prompt popup
  requireCode() {
    this.openDialog();
  }

  // go to print-album-comp
  loadAlbum() {
    this.publicService.saveAlbum( this.album );
    sessionStorage.setItem('savedAlbumId', this.album.id.toString() );
    this.router.navigate(["/public/printAlbum"]);
  }


  // code prompt popup
  openDialog(): void {
    const dialogRef = this.dialog.open(PopupAlbumCode, {
      width: '250px',
      data: {code: 'iii'}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result !== undefined && result !== '') {
        this.album.code = result;
        this.loadAlbum();
      }
    });
  }

}



@Component({
  selector: 'popup-album-code',
  templateUrl: 'popup-album-code.html',
})
export class PopupAlbumCode implements OnInit {

  code = '';

  constructor(
    public dialogRef: MatDialogRef<PopupAlbumCode>) {}

  
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.code = '';
  }

  onOkClick() {
    sessionStorage.setItem('savedAlbumCode', this.code);
    this.dialogRef.close(this.code);
  }

}


