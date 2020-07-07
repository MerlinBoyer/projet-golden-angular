import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';

import { HomeComponent } from './public/home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { RegisterAdminComponent } from './auth/register-admin/register-admin.component';
import { AlbumComponent } from './public/album/album.component';
import { AdminGuard } from './auth/admin.guard';
import { BasicAuthHtppInterceptorService } from './services/interceptors/basic-auth-http-interceptor.service';
import { AdminAlbumComponent } from './admin/admin-album/admin-album.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { Admin } from './models/admin';
import { AlbumCreationComponent, AlbumPopup, YouhouPopup } from './admin/album-creation/album-creation.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlashMessagesModule } from 'angular2-flash-messages';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    HeaderComponent,
    NavbarComponent,
    LoginComponent,
    LogoutComponent,
    RegisterAdminComponent,
    AlbumComponent,
    AdminAlbumComponent,
    AdminDashboardComponent,
    AlbumCreationComponent,
    AlbumPopup,
    YouhouPopup
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    FlashMessagesModule.forRoot(),
  ],
  providers: [
    Admin,
    AdminGuard,
    {
      provide:HTTP_INTERCEPTORS, useClass:BasicAuthHtppInterceptorService, multi:true
    },
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AlbumPopup,
    YouhouPopup
  ]
})
export class AppModule { }
