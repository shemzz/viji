import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = '';
  loading: boolean = false;

  constructor(private userService: UserService, private toastr: ToastrService){}
  resetpassword() {
    this.loading = true
    this.userService.forgotPassword(this.email).subscribe({
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
