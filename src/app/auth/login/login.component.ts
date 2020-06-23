import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  invalidLogin = false
  username: String = '';
  password: String = '';

  constructor(private router: Router,
    private loginservice: AuthenticationService) { }
 
  ngOnInit() {
  }
 
  doLogin() {
    this.loginservice.authenticate(this.username, this.password);
  }


}
