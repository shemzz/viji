import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { LocalService } from 'src/app/services/local.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  loggedIn: boolean = false;
  constructor(private localService: LocalService) { }

  ngOnInit(): void {
    this.localService.isLoggedIn().subscribe(value =>{ this.loggedIn = value})
  }
  

}
