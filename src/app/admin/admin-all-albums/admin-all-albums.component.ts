import { Component, OnInit } from '@angular/core';
import { Album } from 'src/app/models/album';
import { PublicService } from 'src/app/services/public.service';
import { AdminService } from 'src/app/services/admin.service';


@Component({
  selector: 'app-admin-all-albums',
  templateUrl: './admin-all-albums.component.html',
  styleUrls: ['./admin-all-albums.component.css']
})
export class AdminAllAlbumsComponent implements OnInit {

  searchName: string;
  albumList: Album[];

  constructor(private service: PublicService) { }

  ngOnInit(): void {
    this.service.getAllAlbums().subscribe( result => {
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
