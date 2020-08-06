import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Admin } from 'src/app/models/admin';

export class User{
  constructor(
    public status:string,
     ) {}
  
}
 
export class JwtResponse{
  constructor(
    public jwttoken:string,
     ) {}
  
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient:HttpClient,
    private router: Router
) { }

authenticate(username, password) {
  if(!username || !password){
    this.router.navigate(['public/login']);
  }

  this.httpClient.post<any>( environment.urlAPI + '/authenticate',
    {username:username, password:password}).subscribe(
     userData => {

      // setup sesssion
        sessionStorage.setItem('username',username);
        let tokenStr = userData.token;
        sessionStorage.setItem('token', tokenStr);
        let role = userData.role;
        sessionStorage.setItem('role', role);
      // redirect on home page
        this.redirectOnSuccess( username );

     }, err => {
       this.redirectBadCredentials();
     }
  );
}

redirectBadCredentials(){
  this.router.navigate(['public/login']);
}

redirectOnSuccess(username: String){
  this.router.navigate(['admin/dashboard']);
}

isUserLoggedIn(): boolean {
  let user = sessionStorage.getItem('username');
  return !(user === null)
}

isUserAdmin(): boolean{
  return sessionStorage.getItem('role') === "ROLE_ADMIN";
}

logOut() {
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('token');
  sessionStorage.setItem('role', "ROLE_PUBLIC");
}

registerAdmin(admin: Admin){
  return this.httpClient.post<any>(environment.urlAPI + '/registerAdmin', admin);
}

getUserName(): String {
  return sessionStorage.getItem('username') === null ? "Unknown" : sessionStorage.getItem('username');
}

}
