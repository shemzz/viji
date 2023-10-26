import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { EventBusService } from './services/event-bus.service';
import { LocalService } from './services/local.service';
import { UserService } from './services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'viji';
  isLoggedIn: any;
  user!: any;
  eventBusSub?: Subscription;

  constructor(private userService: UserService, private router: Router, private toastr: ToastrService, private eventBusService: EventBusService, public localService: LocalService) { }

  ngOnInit(): void {
    this.isLoggedIn = this.localService.isLoggedIn();
    
    if (this.isLoggedIn) {
      this.user = this.localService.getLoggedInUser();
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });
  }

  sendCode() {
    this.userService.sendVerificationCode(this.user.email).subscribe({
      next: res => {
        this.toastr.info(res.message, 'Sent!')
      },
      error: err => {
        this.toastr.error(err.error.message, 'Error')
      }
    })
  }
  
  logout(): void {
    this.userService.logout().subscribe({
      next: res => {
        console.log(res);
        this.localService.clean();
        this.localService.setLoggedInStatus(false);
        window.location.reload();
      },
      error: err => {
        console.log(err);
      }, complete: () => {
          this.localService.isLoggedIn().subscribe(value => {
      if (value === true) {
        window.location.reload()
      }
    })
      }
    });
  }

}
