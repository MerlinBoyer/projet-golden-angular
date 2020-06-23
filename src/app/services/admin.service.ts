import { Injectable } from '@angular/core';
import { Album } from '../models/album';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  url: String = environment.urlAPI + '/admin'
  constructor(private http: HttpClient) { }

  registerAlbum(album: Album): Observable<any> {
    console.log("ready to register : " + album);

    let headers={
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      })
    }
    return this.http.post( this.url + '/registerAlbum', album, headers);
    
  }
}
