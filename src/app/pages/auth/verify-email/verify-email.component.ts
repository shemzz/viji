import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit{

  email: string = ''
  user: string = ''
  message: string = ''
  loading: boolean = false;

constructor(private route: ActivatedRoute, private userService: UserService){}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.user = params['user'];
    });
  }

  sendVerificationCode() {
    this.loading = true;
    this.message = '';
    this.userService.sendVerificationCode(this.email).subscribe({
      next: res => {
        console.log(res)
        this.message = res.message
      },
      error: err => {
        console.log(err)
        this.message = err.error.message
      },
      complete: ()=> this.loading = false
    })
  }
}
