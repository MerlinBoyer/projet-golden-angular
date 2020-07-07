import { Component, OnInit } from '@angular/core';
import { PublicService } from 'src/app/services/public.service';
import { Album } from 'src/app/models/album';

@Component({
  selector: 'app-print-album',
  templateUrl: './print-album.component.html',
  styleUrls: ['./print-album.component.css']
})
export class PrintAlbumComponent implements OnInit {

  album: Album;
  constructor(private publicService: PublicService) { }

  ngOnInit(): void {
    this.album = this.publicService.getSavedAlbum();
    // if needed, get album id in session and get it from API
    if(this.album == null || this.album == undefined) {
      this.publicService.getAlbumById(parseInt(sessionStorage.getItem('savedAlbumId'))).subscribe( res => {
        this.album = res;
        console.log(this.album);
        
      })
    }
  }

}
