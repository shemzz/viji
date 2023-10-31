import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { LocalService } from 'src/app/services/local.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  email: string = '';
  password: string = '';
  loggedIn: boolean = false;

  constructor(private userService: UserService, private toastr: ToastrService, private router: Router, private localService: LocalService, private title: Title) {
    this.title.setTitle('Login to your account')
   }
  
  ngOnInit(): void {
    this.localService.isLoggedIn().subscribe(value => {
      this.loggedIn = value;
    })

    if (this.loggedIn === true) {
        this.router.navigate(['/transactions'])
      }
  }

  login() {
    this.loading = true;
    const user = {
      email: this.email,
      password: this.password
    }
    this.userService.login(user).subscribe({
      next: res => {
        this.localService.saveUser(res);
        this.loading = false;
      },
      error: err => {
        console.log(err.error?.message)
        this.toastr.error(err.error?.message, "Error")
        this.loading = false;
      },
      complete: () => this.router.navigate(['/transactions'])
    })
  }
}
