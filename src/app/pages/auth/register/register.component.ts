import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { HttpClientModule } from '@angular/common/http';
import { UserInterface } from 'src/app/interface/user.interface';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ToastrService, provideToastr } from 'ngx-toastr';


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

  constructor(private userService: UserService, private toastr: ToastrService) { }
  
  register() {
    this.userService.register(this.user).subscribe({
      next: res => {
        console.log(res)
        this.toastr.success(res.message, 'Success', {progressBar: true})
      },
      error: err => {
        console.log(err.error.message)
        this.toastr.error(err.error.message, 'Error')
      },
      complete: ()=> console.log('proceed to verify email component')
    })
  }

  CheckUserType() {
    
    if (this.user.isSeller) {
      this.user.isSeller = true;
      console.log('User is a seller');
      // Additional actions when user is a seller
    } else {
      console.log('User is not a seller');
      this.user.isSeller = false;
      // Additional actions when user is not a seller
    }
  }
}
