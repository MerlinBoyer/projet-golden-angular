import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Album } from 'src/app/models/album';
import { FormGroup, FormControl } from '@angular/forms';
import { Photo } from 'src/app/models/photo';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-album-creation',
  templateUrl: './album-creation.component.html',
  styleUrls: ['./album-creation.component.css']
})
export class AlbumCreationComponent implements OnInit {

  album: Album;
  selectedFiles: File[] = [];
  loading: boolean = false;

  visibilityStates = [
    {name: 'Privé', value: 0},
    {name: 'Public', value: 1},
  ];
  visibilityForm = new FormGroup({
    state: new FormControl(this.visibilityStates[0].value),
  });

  globalFormControl = new FormControl();
  
  constructor(private adminService: AdminService,
    private router: Router,
    public popup: MatDialog) { }

  ngOnInit(): void {    
    this.album = new Album();
    this.album.nb_visits = 0;
    this.album.visibility = 0;
    this.album.pictures = [];
    this.album.creation_date = new Date();
  }

  onFilesChange(event) {
    //Select File
    this.selectedFiles = event.target.files;
    console.log("files changed");
  }


  generatePhotos(){
    this.album.pictures = [];
    for(var file of this.selectedFiles ){
      this.album.pictures.push(new Photo(file.name, file.size));
    }
  }

  registerAlbum() {
    this.album.visibility = this.visibilityForm.get("state").value;
    this.generatePhotos();
    console.log(this.album);

    this.adminService.registerAlbum(this.album).subscribe( res => {
      console.log("Album registered ? -> " + JSON.stringify(res));
      this.album.id = res.id;
      this.sendPhotos();
    })
  }

  sendPhotos() {
    
    var tasks = [];
    if(this.selectedFiles.length === 0 ) return;

    this.loadMode();
    for(var file of this.selectedFiles) {
      var p = new Photo(file.name, file.size);
      p.album = new Album();
      p.image = file;
      p.album.id = this.album.id;

      tasks.push( this.adminService.sendPic(this.album, p));
      
      
      forkJoin(...tasks).subscribe( results => { 
        console.log("photos registered ? -> " + results);
        this.notLoadMode();
      });
    }
    
  }




  // vanish form
  loadMode() {
    this.loading = true;
    (document.querySelector('.formulaire') as HTMLElement).style.opacity = '0.33';
    (document.querySelector('.formulaire') as HTMLElement).style.pointerEvents = 'none';
  }

  // unvanish form
  notLoadMode() {
    this.loading = false;
      (document.querySelector('.formulaire') as HTMLElement).style.opacity = '1';
      (document.querySelector('.formulaire') as HTMLElement).style.pointerEvents = 'auto';
  }


  // popup dont il manque apparement le CSS pour s'afficher correctement mais elle m'a gonflé
  UserCheckBeforeSending() {

    if((this.album.visibility === 0 && this.album.code === null) 
      || this.album.name === ""
      || this.selectedFiles.length === 0) {
        return;
      }

    const dialogRef = this.popup.open(AlbumPopup, {
      height: '400px',
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.registerAlbum();
      }
    });
  }



}



@Component({
  selector: 'album-popup',
  templateUrl: 'album-popup.html',
})
export class AlbumPopup {}
