import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-email-verified',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './email-verified.component.html',
  styleUrls: ['./email-verified.component.scss']
})
export class EmailVerifiedComponent {
  code: string = ''
  message: string = ''
  action: string = ''
  loading: boolean = false;

constructor(private route: ActivatedRoute, private userService: UserService, private router: Router){}
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.code = params['code'];
    });

    this.confirmEmailAddress();
  }

  confirmEmailAddress() {
    this.loading = true;
    this.userService.confirmEmailAddress(this.code).subscribe({
      next: res => {
        console.log(res)
        this.message = res.message
        this.loading = false
      },
      error: err => {
        console.log(err)
        this.loading = false;
        this.message = err.error.message
      },
      complete: () => {
        setTimeout(() => {
          this.router.navigate(['auth/login']);
        }, 1000);
      }
    })
  }
}
