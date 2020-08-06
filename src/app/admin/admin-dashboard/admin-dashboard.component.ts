import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  loading: boolean = false;

  constructor(private adminService: AdminService,
    private _flashMessagesService: FlashMessagesService,
    private router: Router) { }

  ngOnInit(): void {
  }


  loadMode() {
    this.loading = true;
  }
  notLoadMode() {
    this.loading = false;
  }


  synchronizeFromDisk() {
    this.loadMode();
    this.adminService.synchronizeFromDisk().subscribe( res => {
      this.notLoadMode();
    })
  }

}
