import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Album } from '../models/album';

@Injectable({
  providedIn: 'root'
})
export class PublicService {

  url: String = environment.urlAPI + '/public';
  savedAlbum: Album;
  albumCode: string;

  constructor(private http: HttpClient) { }


  getAllAlbums(): Observable<any> {
    return this.http.get(this.url + '/album/getAll');
  }

  saveAlbum(album: Album) {
    this.savedAlbum = album;
  }

  getSavedAlbum() {
    return this.savedAlbum;
  }

  getAlbumById(id: number, code: String): Observable<any>  {
    if(code === '') {
      code='public';
    }
    return this.http.get(this.url + '/album/' + id + '/' + code);
  }

  getPhotoById(id:number, code: String): Observable<any> {
    if(code === '') {
      code='public';
    }
    return this.http.get(this.url + '/photos/' + id + '/' + code);
  }

  getImgById(id: number, code: String): Observable<any> {
    if(code === '') {
      code='public';
    }
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(this.url + '/photos/getImg/' + id + '/' + code, {headers, responseType: 'blob' });
  }
}
