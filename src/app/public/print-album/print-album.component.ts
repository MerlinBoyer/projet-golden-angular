import { Component, OnInit, HostListener, PipeTransform } from '@angular/core';
import { PublicService } from 'src/app/services/public.service';
import { Album } from 'src/app/models/album';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { Photo } from 'src/app/models/photo';
import { environment } from 'src/environments/environment';


export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  ESC = 27
}


@Component({
  selector: 'app-print-album',
  templateUrl: './print-album.component.html',
  styleUrls: ['./print-album.component.css']
})
export class PrintAlbumComponent implements OnInit {

  album: Album;
  lazy_album: Album;  // once album is loaded, pictures are recursively pushed
                      // into lazy_album to be loaded one by one in PicCardComponent
                      // (avoid requesting server all pics at the same time)
  bigPicPath: String;
  bigPicIndex: number;
  loading: boolean;
  isDownloading: boolean;
  progressBar;
  constructor(private publicService: PublicService,
    private _flashMessagesService: FlashMessagesService,
    private router: Router) { }

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
    this.isDownloading = false;
    this.bigPicPath = null;
    this.lazy_album = new Album();
    this.album = this.publicService.getSavedAlbum();
    if( this.album && this.album.pictures && this.album.pictures.length !== 0) {
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
    
    // if needed, get album code
    var code: String;
    if (this.album && this.album.visibility === 0) {
      code = this.retrieveCode();
    } else {
      code = 'default-code';
    }

    //finally get album from api
    this.requestAlbum(id, code);
  }


  retrieveCode(): String {
    var code: String = "";
    if(this.album.code !== null && this.album.code !== undefined && this.album.code !== '') {
      code = this.album.code;
    }
    if( code === "") {
      code = sessionStorage.getItem('savedAlbumCode');
    }
    return code;
  }

  requestAlbum(id, code) {
    if(!id || !code) {
      this._flashMessagesService.show("Mauvais code, rééssayez", { cssClass: 'alert-danger', timeout: 3000 });
      this.router.navigate(['/public/selectAlbum']);
    }
    // retrieve album with code (can be null)
    this.publicService.getAlbumById(id, code).subscribe( res => {
      if(res === null){
        this._flashMessagesService.show("Mauvais code, rééssayez", { cssClass: 'alert-danger', timeout: 5000 });
        this.router.navigate(['/public/selectAlbum']);
      }
      this.album = res;
      // start constructing recursively pictures one by one
      this.initLazyAlbum();
    })
  }

  downloadAlbum() {
    this.isDownloading = true;
    var id = this.album.id;
    var code = this.album.code;
    if(!id) {
        this._flashMessagesService.show("Probleme survenu, rééssayez", { cssClass: 'alert-danger', timeout: 3000 });
        this.router.navigate(['/public/selectAlbum']);
      }

    this.publicService.downloadAlbumById(id, code).subscribe( data => {
        this.isDownloading = false;
        this._flashMessagesService.show("Si la fenetre de telechargement ne s'ouvre pas, vérifiez que votre navigateur ne l'a pas bloqué", { cssClass: 'alert-warning', timeout: 6000 });
        const blob = new Blob([data], {
            type: 'application/zip'
          });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
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
    this.bigPicPath = environment.urlAPI + "/public/photos/getCompressedImg/" + p.id + '/' + this.album.code;
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

}
