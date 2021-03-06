import { Injectable } from '@angular/core';
import { Album } from '../models/album';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Photo } from '../models/photo';
import { report } from 'process';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  url: String = environment.urlAPI + '/admin';
  savedAlbum: Album;
  constructor(private http: HttpClient) { }

  registerAlbum(album: Album): Observable<any> {
    let headers={
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    }
    return this.http.post( this.url + '/registerAlbum', album, headers);
    
  }

  sendPic(album: Album, pic: Photo): Observable<any> {
    
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', pic.image, pic.name.toString());
    uploadImageData.append('album_id', album.id.toString());
    uploadImageData.append('album_name', album.name.toString());

    // return this.http.post( this.url + '/savePhoto', pic);
    let headers={
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    }
    const req = new HttpRequest('POST', this.url.toString(), uploadImageData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.post( this.url + '/savePhoto', uploadImageData, {reportProgress: true} );
  }

  addPic(album: Album, pic: Photo): Observable<any> {
    
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', pic.image, pic.name.toString());
    uploadImageData.append('album_id', album.id.toString());
    uploadImageData.append('album_name', album.name.toString());

    // return this.http.post( this.url + '/savePhoto', pic);
    // let headers={
    //   headers: new HttpHeaders({
    //       'Content-Type': 'application/json'
    //   })
    // }
    // const req = new HttpRequest('POST', this.url.toString(), uploadImageData, {
    //   reportProgress: true,
    //   responseType: 'json'
    // });

    return this.http.post( this.url + '/addPhoto', uploadImageData, {reportProgress: true} );
  }


  compressAlbum(id: number, compressionFactor: number, maxImgSize: number,
    maxResizedW: number, maxResizedH: number): Observable<any> {
    const compressParams = new FormData();
    compressParams.append('albumId', id.toString());
    compressParams.append('compressionFactor', compressionFactor.toString());
    compressParams.append('maxImgSize', maxImgSize.toString());
    compressParams.append('maxResizedW', maxResizedW.toString());
    compressParams.append('maxResizedH', maxResizedH.toString());
    return this.http.post(this.url + '/compressAlbum',compressParams, {reportProgress: true} );
  }


  saveAlbum(album: Album) {
    this.savedAlbum = album;
  }

  getSavedAlbum() {
    return this.savedAlbum;
  }

  getAlbumById(id: number): Observable<any>  {
    return this.http.get(this.url + '/album/' + id );
  }

  updateAlbumInfos(album: Album): Observable<any> {
    return this.http.put( this.url + '/album/update', album);
  }
  
  deleteAlbum( album: Album ): Observable<any> {
    return this.http.delete( this.url + '/album/delete/' + album.id);
  }

  deletePicture(pic: Photo): Observable<any> {
    return this.http.delete( this.url + '/photo/delete/' + pic.id);
  }

  synchronizeFromDisk(): Observable<any> {
    return this.http.get( this.url + '/synchronize');
  }
}
