import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Album } from 'src/app/models/album';

@Component({
  selector: 'app-album-creation',
  templateUrl: './album-creation.component.html',
  styleUrls: ['./album-creation.component.css']
})
export class AlbumCreationComponent implements OnInit {

  album: Album;

  constructor(private adminService: AdminService,
    private router: Router) { }

  ngOnInit(): void {
    this.album = new Album();
  }

  registerAlbum() {
    this.adminService.registerAlbum(this.album).subscribe( res => {
      console.log("RESPONSE : " + res);
    })
  }



}
