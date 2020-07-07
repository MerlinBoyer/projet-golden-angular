import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/models/album';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-select-album',
  templateUrl: './select-album.component.html',
  styleUrls: ['./select-album.component.css']
})
export class SelectAlbumComponent implements OnInit {

  searchName: string;
  albumList: Album[];

  constructor(private service: PublicService) { }

  ngOnInit(): void {
    this.service.getAllAlbums().subscribe( result => {
      //console.log(JSON.stringify( result ));
      this.albumList = [];
      for(let i =0; i<result.length; i++) {
        this.albumList.push(result[i]);
      }
    })
  }

  searchAlbumByName() {
    // TODO
  }
}
