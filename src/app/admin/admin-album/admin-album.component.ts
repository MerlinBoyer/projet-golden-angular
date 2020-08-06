import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { PublicService } from 'src/app/services/public.service';
import { Album } from 'src/app/models/album';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { Photo } from 'src/app/models/photo';
import { environment } from 'src/environments/environment';
import { AdminService } from 'src/app/services/admin.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


// input data to be injected in youhoupopup
export interface DialogData {
  msg: string;
}
export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  ESC = 27
}


@Component({
  selector: 'app-admin-album',
  templateUrl: './admin-album.component.html',
  styleUrls: ['./admin-album.component.css']
})
export class AdminAlbumComponent implements OnInit {

  album: Album;
  lazy_album: Album;  // once album is loaded, pictures are recursively pushed
                      // into lazy_album to be loaded one by one in PicCardComponent
                      // (avoid requesting server all pics at the same time)
  bigPicPath: String;
  bigPicIndex: number;
  loading: boolean;
  selectedFiles: File[] = [];
  currentPicToSend: number = 0;
  picturesToDelete: number[] = [];
  currentPicTodelete: number = 0;
  checked: boolean = false;

  // link boolean & text to choose album privacy policy in dialog box
  visibilityStates = [
    {name: 'Privé', value: 0},
    {name: 'Public', value: 1},
  ];
  visibilityForm = new FormGroup({
    state: new FormControl(this.visibilityStates[0].value),
  });

  globalFormControl = new FormControl();
  
  constructor(private adminService: AdminService,
    private _flashMessagesService: FlashMessagesService,
    private router: Router,
    public popup: MatDialog) { }

    @HostListener('window:keyup', ['$event'])
    keyEvent(event: KeyboardEvent) {
      if(!this.bigPicPath){
        return;
      }
      if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
        this.goNext();
      }
      if (event.keyCode === KEY_CODE.LEFT_ARROW) {
        this.goPrevious();
      }
      if (event.keyCode === KEY_CODE.ESC) {
        this.closeBigPic();
      }
    }
    
  ngOnInit(): void {
    this.loading = false;
    this.bigPicPath = null;
    this.lazy_album = new Album();
    this.album = this.adminService.getSavedAlbum();
    if( this.album && this.album.pictures && this.album.pictures.length !== 0) {
      this.visibilityForm.setValue( {'state': this.album.visibility});
      this.initLazyAlbum();
      return;
    }

    // if needed, get album id
    var id: number;
    if(this.album == null || this.album == undefined) {
      id = parseInt(sessionStorage.getItem('savedAlbumId'));
    } else {
      id = this.album.id;
    }

    //finally get album from api
    this.requestAlbum(id);
  }


  //update selected files by user with "select fichers"
  onFilesChange(event) {
    this.selectedFiles = event.target.files;
  }

  requestAlbum(id) {
    if(!id) {
      this._flashMessagesService.show("Mauvaise id, rééssayez", { cssClass: 'alert-danger', timeout: 3000 });
      this.router.navigate(['/admin/allAlbums']);
    }
    // retrieve album with code (can be null)
    this.adminService.getAlbumById(id).subscribe( res => {
      if(res === null){
        this._flashMessagesService.show("Mauvais code, rééssayez", { cssClass: 'alert-danger', timeout: 5000 });
        this.router.navigate(['/admin/allAlbums']);
      }
      this.album = res;
      // start constructing recursively pictures one by one
      this.initLazyAlbum();
      this.visibilityForm.setValue( {'state': this.album.visibility});
    })
  }

  // create a lazy album in chich pics will be pushed one by one
  initLazyAlbum() {
    this.lazy_album = Object.assign({}, this.album);
    this.lazy_album.pictures = [];
    if( this.album && this.album.pictures[0] ) {
      this.lazy_album.pictures.push( this.album.pictures[0] );
    }
  }

  // recursively add pictures to lazy album to display it one by one
  // notification is received when a child PicCard has finished loaded its pic
  notificationReceived(event: string) {
    if( this.lazy_album.pictures.length === this.album.pictures.length) {
      return;
    }
    this.lazy_album.pictures.push( this.album.pictures[this.lazy_album.pictures.length] );
  }


  showBigPic(index: number) {
    // get pic in album
    var p = this.album.pictures[index];
    this.bigPicIndex = index;
    // generate img url
    if( !this.album.code ) {
      this.album.code = 'default-code';
    }
    this.bigPicPath = environment.urlAPI + "/public/photos/getImg/" + p.id + '/' + this.album.code;
    this.loading = true;
  }
  closeBigPic() {
    this.bigPicPath = null;
    this.bigPicIndex = null;
  }

  goNext() {
    this.bigPicIndex = this.bigPicIndex === this.album.pictures.length -1 ? this.bigPicIndex : this.bigPicIndex+1;
    this.showBigPic(this.bigPicIndex);
  }
  goPrevious() {
    this.bigPicIndex = this.bigPicIndex === 0 ? this.bigPicIndex : this.bigPicIndex-1;
    this.showBigPic(this.bigPicIndex);
  }

  whenLoaded() {
    this.loading = false;
  }


  
  updateAlbum() {
    this.album.visibility = this.visibilityForm.get("state").value;
    this.adminService.updateAlbumInfos( this.album ).subscribe( res => {
    })
  }

  // add photo metadata in album
  addPictures(){
    // for(var file of this.selectedFiles ){
    //   var p = new Photo(file.name, file.size);
    //   this.album.pictures.push( p );
    // }
    this.updateAlbumPictures();
  }

  updateAlbumPictures() {
    this.album.visibility = this.visibilityForm.get("state").value;
    this.adminService.updateAlbumInfos( this.album ).subscribe( res => {
      this.currentPicToSend = 0;
      this.sendRecursivePic();
    })
  }

  // send one picture, when done increment current pic index and call himself
  // (with async ForkJoin server can't hold charge when too many pictures)
  sendRecursivePic() {
    // when done
    if(this.currentPicToSend === this.selectedFiles.length ) {
      this.notLoadMode();
      this.selectedFiles = [];
      this._flashMessagesService.show("Pictures added", { cssClass: 'alert-success', timeout: 3000 });
      window.location.reload();
      return;
    }
    var file = this.selectedFiles[this.currentPicToSend];
    var p = new Photo(file.name, file.size);
    p.album = new Album();
    p.image = file;
    p.album.id = this.album.id;
    this.adminService.addPic(this.album, p).subscribe(res => {
      this.currentPicToSend++;
      this.sendRecursivePic();
    }, err => {
      this.notLoadMode();
    })
  }

  // gray the form
  loadMode() {
    this.loading = true;
    (document.querySelector('.formulaire') as HTMLElement).style.opacity = '0.33';
    (document.querySelector('.formulaire') as HTMLElement).style.pointerEvents = 'none';
  }

  // ungray the form
  notLoadMode() {
    this.loading = false;
      (document.querySelector('.formulaire') as HTMLElement).style.opacity = '1';
      (document.querySelector('.formulaire') as HTMLElement).style.pointerEvents = 'auto';
  }

  delete() {
    const dialogRef = this.popup.open(YouhouPopup);

    // si l'utilisateur confirme l'upload, lance la sequence
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.adminService.deleteAlbum( this.album ).subscribe( res => {
          this._flashMessagesService.show("Album supprimé !", { cssClass: 'alert-success', timeout: 5000 });
          this.router.navigate(['/admin/allAlbums']);
        })
      }
    });
  }

  updateCheck(pic: Photo) {
    const index: number = this.picturesToDelete.indexOf(pic.id);
    if (index !== -1) {
      this.picturesToDelete.splice(index, 1);
    } else {
      this.picturesToDelete.push(pic.id)
    }
  }

  deletePictures() {
    if (this.picturesToDelete.length === 0 ) {
      return;
    }
    this.currentPicTodelete = 0;
    this.loadMode();
    this.deleteRecursivePictures();
  }

  deleteRecursivePictures() {
    if(this.currentPicTodelete >= this.picturesToDelete.length) {
      this.picturesToDelete = [];
      this.notLoadMode();
      this._flashMessagesService.show("Pictures deleted", { cssClass: 'alert-danger', timeout: 3000 });
      window.location.reload();
      return;
    } 
    var p = new Photo('', 0);
    p.id = this.picturesToDelete[ this.currentPicTodelete ];
    this.adminService.deletePicture(p).subscribe( res => {
      this.currentPicTodelete++;
      this.deleteRecursivePictures();
    })
  }

}





@Component({
  selector: 'youhou-popup',
  templateUrl: 'youhou-popup.html',
})
export class YouhouPopup {
  constructor(
    public dialogRef: MatDialogRef<YouhouPopup>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    onNoClick(): void {
      this.dialogRef.close();
    }
}

