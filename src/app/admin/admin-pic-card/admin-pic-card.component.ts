import { Component, OnInit, Input, SecurityContext, HostListener, Output } from '@angular/core';
import { Photo } from 'src/app/models/photo';
import { PublicService } from 'src/app/services/public.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { EventEmitter } from '@angular/core';



var base64data;
let mySrc;

/*
* Ce compo prend en param une id d'une pic et genere une src de <img>
* dans le navigateur qui va telecharger l'image depuis le serveur.
* lorsque l'image est chargée le comp parent (print-album) est notifié
*/
@Component({
  selector: 'app-admin-pic-card',
  templateUrl: './admin-pic-card.component.html',
  styleUrls: ['./admin-pic-card.component.css']
})
export class AdminPicCardComponent implements OnInit {

  pic: Photo;
  imgUrl: SafeUrl;
  loading: boolean;
  @Input() inputPic: Photo;
  @Input() albumCode: string;
  @Output() notifyParent = new EventEmitter();

  constructor(private service: PublicService, private sanitizer : DomSanitizer) { }

  ngOnInit(): void {
    this.loading = true;
    this.pic = new Photo("loading...", 0);
    if(!this.albumCode) {
      this.albumCode = 'default-code';
    }
    this.imgUrl = environment.urlAPI + "/public/photos/getImg/" + this.inputPic.id + '/' + this.albumCode;
    this.loadPic();
  }

  onClick(){
    
  }

  loadPic() {
    if( this.inputPic.id === 0) {
      return;
    }
    this.service.getPhotoById( this.inputPic.id, this.albumCode ).subscribe( res => {
      this.pic = res;
    })
  }

  whenLoaded() {
    this.loading = false;
    this.notifyParent.emit('done');
  }

}
