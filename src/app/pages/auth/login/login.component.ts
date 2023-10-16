import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private userService: UserService, private toastr: ToastrService, private router: Router) { }
  
  login() {
    const user = {
      email: this.email,
      password: this.password
    }
    this.userService.login(user).subscribe({
      next: res => {
        console.log(res)
        // save the logged in user credentials
        this.router.navigate(['/transactions'])
      },
      error: err => {
        this.toastr.error(err.error.message, "Error")
      }
    })
  }
}
