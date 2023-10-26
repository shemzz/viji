import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { LocalService } from 'src/app/services/local.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  loggedIn: boolean = false;

  constructor(private userService: UserService, private toastr: ToastrService, private router: Router, private localService: LocalService) { }
  
  ngOnInit(): void {
    this.localService.isLoggedIn().subscribe(value => {
      this.loggedIn = value;
    })
    console.log(this.loggedIn)
    if (this.loggedIn === true) {
        this.router.navigate(['/transactions'])
      }
  }

  login() {
    const user = {
      email: this.email,
      password: this.password
    }
    this.userService.login(user).subscribe({
      next: res => {
        this.localService.saveUser(res);
      },
      error: err => {
        this.toastr.error(err.error.message, "Error")
      },
      complete: () => this.router.navigate(['/transactions'])
    })
  }
}
