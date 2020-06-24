import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
 
@Injectable({
  providedIn: 'root'
}) 
export class BasicAuthHtppInterceptorService implements HttpInterceptor {
 
  constructor() { }
 
  intercept(req: HttpRequest<any>, next: HttpHandler) {
 
    if (sessionStorage.getItem('username') && sessionStorage.getItem('token')) {      
      req = req.clone({
        setHeaders: {
          Authorization: "Bearer " + sessionStorage.getItem('token')
        }
      })
    }
 
    return next.handle(req);
 
  }
}
