import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  code: string = '';
  email: string = '';
  passwordMatch: boolean = false;

  constructor(private route: ActivatedRoute, private userService: UserService, private toastr: ToastrService) { }
  
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
      this.email = params['email'];
    });
  }
  checkPassword() {
    if (this.password === this.confirmPassword && this.confirmPassword) {
      this.passwordMatch = true;
      return true
    } else {
      this.passwordMatch = false;
    }
    return false
  }

  resetpassword() {
    const data = {
      password: this.password,
      resetToken: this.code,
      email: this.email
    }
    this.loading = true
    this.userService.resetPassword(data).subscribe({
      next: res => {
        this.toastr.info(res.message, 'Sent!')
      },
      error: err => {
        this.toastr.error(err.error.message, 'Error')
      },
      complete: () => {
        this.loading = false;
      }
    })
  }
}
