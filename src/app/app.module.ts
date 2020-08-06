import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';

import { HomeComponent }   from './public/home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent }  from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { RegisterAdminComponent } from './auth/register-admin/register-admin.component';
import { AdminGuard }      from './auth/admin.guard';
import { BasicAuthHtppInterceptorService } from './services/interceptors/basic-auth-http-interceptor.service';
import { AdminAlbumComponent, YouhouPopup as yPopup }             from './admin/admin-album/admin-album.component';
import { AdminDashboardComponent }         from './admin/admin-dashboard/admin-dashboard.component';
import { Admin }  from './models/admin';
import { AlbumCreationComponent, AlbumPopup, YouhouPopup } from './admin/album-creation/album-creation.component';
import { FontAwesomeModule }    from '@fortawesome/angular-fontawesome';
import { FlashMessagesModule }  from 'angular2-flash-messages';
import { PrintAlbumComponent }  from './public/print-album/print-album.component';
import { PicCardComponent }     from './public/pic-card/pic-card.component';
import { SelectAlbumComponent } from './public/select-album/select-album.component';
import { AdminAllAlbumsComponent }  from './admin/admin-all-albums/admin-all-albums.component';
import { AdminPicCardComponent }    from './admin/admin-pic-card/admin-pic-card.component';
import { AlbumCardComponent, PopupAlbumCode }       from './public/album-card/album-card.component';
import { AlbumCardComponent as AdminAlbumCardComponent }       from './admin/album-card/album-card.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AlbumsPipe } from './pipes/albums.pipe';


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
    AdminAlbumComponent,
    AdminDashboardComponent,
    AlbumCreationComponent,
    AlbumPopup,
    YouhouPopup,
    yPopup,
    PrintAlbumComponent,
    PicCardComponent,
    SelectAlbumComponent,
    AdminAllAlbumsComponent,
    AdminPicCardComponent,
    AlbumCardComponent,
    AdminAlbumCardComponent,
    PopupAlbumCode,
    AlbumsPipe,
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
    MatCheckboxModule,
    FlashMessagesModule.forRoot()
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
