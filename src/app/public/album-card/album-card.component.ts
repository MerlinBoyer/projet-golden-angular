import { Component, OnInit, Input } from '@angular/core';
import { Album } from 'src/app/models/album';
import { Router } from '@angular/router';
import { PublicService } from 'src/app/services/public.service';

@Component({
  selector: 'app-album-card',
  templateUrl: './album-card.component.html',
  styleUrls: ['./album-card.component.css']
})
export class AlbumCardComponent implements OnInit {

  album: Album;
  @Input() alb: Album;

  constructor(private router: Router,
    private publicService: PublicService) { }

  ngOnInit(): void {
    this.album = this.alb;
  }

  printAlbum() {
    this.publicService.saveAlbum( this.album );
    sessionStorage.setItem('savedAlbumId', this.album.id.toString() );
    this.router.navigate(["/public/printAlbum"]);
  }

}
