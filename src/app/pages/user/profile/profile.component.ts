import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription, debounceTime, map } from 'rxjs';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EventBusService } from 'src/app/services/event-bus.service';
import { LocalService } from 'src/app/services/local.service';
import { Title } from '@angular/platform-browser';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbTypeaheadModule],
  providers: [UserService, EventBusService, CookieService],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  message: string = 'Fetching User Profile...'
  public model: any;
  banks: any;
  selectedBank: any;
  isValidated: boolean =false;
  accountDetails: any;
  loggedIn: boolean = false;
  user: any;
  currentUser: any;
  editMode = false;
  account_number: any;
  account_name: string = '';

  eventBusSub?: Subscription;
  
  constructor(private userService: UserService, private toastr: ToastrService, private eventBusService: EventBusService, public localService: LocalService, private title: Title) {
    this.title.setTitle('Profile | vijiPay')
   }

  ngOnInit(): void {
    this.user = this.localService.getLoggedInUser();
    this.getLoggedInUser(this.user.id);
    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    })
  }
  
  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.currentUser.isSeller) {
      this.getBanks();   
    }
  }

  getLoggedInUser(id: number) {
    return this.userService.getUser(id).subscribe({
      next: res => {
        if (res.user === null) {
          this.logout()
        }
        this.currentUser = res;
      },
      error: err => {
        this.logout()
      }
    })
  }

  switchToSeller(type:boolean) {
    const user = this.localService.getLoggedInUser();
    this.userService.updateUser({ isSeller: type }, user.id).subscribe({
      next: res => {
        this.toastr.success(res.message, 'Done!');
        this.localService.updateUserType(type);
      },
      error: err => {
        this.toastr.error(err.error.message, 'Error!');
      },
      complete: () => window.location.reload()
    }
    )

  }

  getBanks() {
    this.userService.getBanks()
    .subscribe({
      next: res => {
        this.banks = res;
      },
      error: err => {
        console.error('Error retrieving banks')
      }
  })
  }

  search = (text$: Observable<string>) =>
text$.pipe(
debounceTime(200),
map(term => term ? this.banks.filter((bank: { name: string; }) => bank.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10) : this.banks.slice())
);

formatter = (bank: any) => bank.name;

  onBankSelected(bank: any) {
    this.selectedBank = bank.item;
    this.currentUser.bank_name = this.selectedBank.name
    console.log(bank.item)
  }
  
  validateAccount() {
    const details = {
      accountNumber: this.currentUser.account_number,
      bankCode: this.selectedBank.code
    }
    this.userService.validateAccountDetails(details).subscribe({
      next: res => {
        if (res) {
          this.isValidated = true;
        this.currentUser.account_name = res.data.account_name
        }
      },
      error: err => {
        console.error(err)
      }
    })
  }

  updateProfile() {
    this.userService.updateUser(this.currentUser, this.user.id).subscribe({
      next: res => {
        this.currentUser = res.user
        this.toastr.success(res.message, 'Success');
      },
      error: err => {
        this.toastr.error(err.error.message, 'Error');
      },
      complete: ()=> this.toggleEditMode()
})
   }
  
  logout(): void {
    this.localService.clean();
    this.localService.setLoggedInStatus(false);
    window.location.reload()
  }
}
