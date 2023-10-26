import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UserInterface } from 'src/app/interface/user.interface';
import { ToastrService } from 'ngx-toastr';


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

  constructor(private userService: UserService, private toastr: ToastrService, private router: Router) { }
  
  register() {
    this.loading = true
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
