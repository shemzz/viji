import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UserInterface } from 'src/app/interface/user.interface';
import { ToastrService } from 'ngx-toastr';
import { LocalService } from 'src/app/services/local.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: UserInterface = {
    name: '',
    email: '',
    phone: '',
    password: '',
    isSeller: false
  }
  acceptTerms: boolean = false;
  loading: boolean = false;

  constructor(private userService: UserService, private toastr: ToastrService, private router: Router, private localService: LocalService, private title: Title) { 
    this.title.setTitle('Register on vijiPay')
  }
  
  formatPhone(phone: any) {
    try {
     return this.localService.formatPhoneNumber(phone)
    } catch (error: any) {
      return error.message; // Handle the error here
    }
  }

  
  register() {
    const formattedPhone = this.formatPhone(this.user.phone)
    this.loading = true
    this.user.phone = formattedPhone;
    console.table(this.user)
    this.userService.register(this.user).subscribe({
      next: res => {
        this.toastr.success(res.message, 'Success', { progressBar: true });
      },
      error: err => {
        console.log(err.error.message)
        this.toastr.error(err.error.message, 'Error')
        this.loading = false
      },
      complete: ()=> this.router.navigate(['/auth/verify-email/'], { queryParams: { user: this.user.isSeller ? 'seller' : 'buyer', email: this.user.email } })
    })
  }

  CheckUserType(event: Event) {
    this.user.isSeller = (event.target as HTMLInputElement).checked;
  }
  onAcceptTerms(event: Event) {
    this.acceptTerms = (event.target as HTMLInputElement).checked;
  }
}
