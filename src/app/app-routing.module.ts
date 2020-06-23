import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './public/home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { AlbumComponent } from './public/album/album.component';
import { AdminGuard } from './auth/admin.guard';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminAlbumComponent } from './admin/admin-album/admin-album.component';


const routes: Routes = [
  // default redirection to home
  {path:'', redirectTo : 'public/home', pathMatch:'full'},

  
  {path : 'public/home',       component:HomeComponent},
  {path : 'public/login',       component:LoginComponent},
  {path : 'public/logout',       component:LogoutComponent},
  {path : 'public/album',       component:AlbumComponent},
  {path : 'public/logout',       component:LogoutComponent},


  {path : 'admin/dashboard',       component:AdminDashboardComponent, canActivate:[AdminGuard]},
  {path : 'admin/album',       component:AdminAlbumComponent, canActivate:[AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
