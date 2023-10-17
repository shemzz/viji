import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  loggedIn: boolean = false;
  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    this.loggedIn = this.userService.isLoggedIn()
  }
  create() {
    this.router.navigate(['/create']);
  }

}
