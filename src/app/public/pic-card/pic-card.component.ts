import { Component, OnInit, Input, SecurityContext } from '@angular/core';
import { Photo } from 'src/app/models/photo';
import { PublicService } from 'src/app/services/public.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

var base64data;
let mySrc;

@Component({
  selector: 'app-pic-card',
  templateUrl: './pic-card.component.html',
  styleUrls: ['./pic-card.component.css']
})
export class PicCardComponent implements OnInit {

  pic: Photo;
  imgUrl: SafeUrl;
  @Input() inputPic: Photo;

  constructor(private service: PublicService, private sanitizer : DomSanitizer) { }

  ngOnInit(): void {
    this.pic = new Photo("loading...", 0);
    this.imgUrl = environment.urlAPI + "/public/photos/getImg/" + this.inputPic.id;
    this.loadPic();
  }

  onClick(){
    console.log(this.pic);
  }

  loadPic() {
    this.service.getPhotoById( this.inputPic.id ).subscribe( res => {
      this.pic = res;
    })
  }

}
