import { Component, OnInit, Inject } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { Router } from '@angular/router';
import { Album } from 'src/app/models/album';
import { FormGroup, FormControl } from '@angular/forms';
import { Photo } from 'src/app/models/photo';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlashMessagesService } from 'angular2-flash-messages';


// input data to inject in youhoupopup
export interface DialogData {
  msg: string;
}

@Component({
  selector: 'app-album-creation',
  templateUrl: './album-creation.component.html',
  styleUrls: ['./album-creation.component.css']
})
export class AlbumCreationComponent implements OnInit {

  album: Album;
  selectedFiles: File[] = [];
  loading: boolean = false;
  currentPicToSend: number = 0;

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
    private router: Router,
    public popup: MatDialog,
    private _flashMessagesService: FlashMessagesService) { }

  ngOnInit(): void {
    // create empty album
    this.album = new Album();
    this.album.nb_visits = 0;
    this.album.visibility = 0;
    this.album.pictures = [];
    this.album.creation_date = new Date();
  }

  //update selected files by user with "select fichers"
  onFilesChange(event) {
    this.selectedFiles = event.target.files;
  }

  // save photo metadata in album
  generatePhotos(){
    this.album.pictures = [];
    for(var file of this.selectedFiles ){
      this.album.pictures.push(new Photo(file.name, file.size));
    }
  }

  // crée un album et lui associe les meta-data des photos pour l'enregistrer en base
  // (prepare le terrain pour envoyer les fichiers photos apres)
  registerAlbum() {
    this.album.visibility = this.visibilityForm.get("state").value;
    this.generatePhotos();

    this.adminService.registerAlbum(this.album).subscribe( res => {
      if(res === null) {
        this._flashMessagesService.show("Erreur : le nom de cet album est déjà pris, choisissez en un autre", { cssClass: 'alert-danger', timeout: 5000 });
        this.notLoadMode();
        return;
      }
      console.log("Album registered ? -> " + JSON.stringify(res));
      this.album.id = res.id;
      this.currentPicToSend = 0;
      this.sendRecursivePic();
    }, err => {
      this._flashMessagesService.show("Erreur lors de l'enregistrement de l'album, essayer de nouveau", { cssClass: 'alert-danger', timeout: 5000 })
    })
  }


  // send one picture, when done increment current pic index and call himself
  // (with async ForkJoin server can't hold charge when too many pictures)
  sendRecursivePic() {
    // when done
    if(this.currentPicToSend === this.selectedFiles.length ) {
      this.notLoadMode();
      this.selectedFiles = [];
      this.ngOnInit();
      this.youhou();
      return;
    }
    var file = this.selectedFiles[this.currentPicToSend];
    var p = new Photo(file.name, file.size);
    p.album = new Album();
    p.image = file;
    p.album.id = this.album.id;
    this.adminService.sendPic(this.album, p).subscribe(res => {
      // console.log("saved image : ", this.currentPicToSend+1, "/", this.selectedFiles.length);
      this.currentPicToSend++;
      this.sendRecursivePic();
    }, err => {
      this.notLoadMode();
      this.notYouhou();
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


  // popup de confirmation d'envoi dont il manque apparement le CSS pour s'afficher correctement mais elle m'a gonflé
  UserCheckBeforeSending() {
    if( (this.album.visibility === 0 && this.album.code === null) 
      || this.album.name === ""
      || this.selectedFiles.length === 0) {
        return;
    }

    this.loadMode();
    const dialogRef = this.popup.open(AlbumPopup);

    // si l'utilisateur confirme l'upload, lance la sequence
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.registerAlbum();
      } else {
        this.notLoadMode();
      }
    });
  }

  youhou() {
    const dialogRef = this.popup.open(YouhouPopup, {
      data: {msg: "l'album a ete cree avec succes !"}
    });
  }

  notYouhou() {
    const dialogRef = this.popup.open(YouhouPopup, {
      data: {msg: "Erreur de création de l'album"}
    });
  }


}



// pop-ups

@Component({
  selector: 'album-popup',
  templateUrl: 'album-popup.html',
})
export class AlbumPopup {
  constructor(
    public dialogRef: MatDialogRef<AlbumPopup>) {}
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
