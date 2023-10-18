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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbTypeaheadModule],
  providers: [UserService, EventBusService],
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
  
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService, private eventBusService: EventBusService, public localService: LocalService) { }

  ngOnInit(): void {
    this.localService.isLoggedIn().subscribe(value => {
      if (value === false) {
        this.router.navigate(['/auth/login'])
      }
    })
    this.user = this.localService.getLoggedInUser();
    this.getLoggedInUser(this.user.id);

    // this.eventBusSub = this.eventBusService.on('logout', () => { this.logout() });
  }
  
  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  getLoggedInUser(id: number) {
    return this.userService.getUser(id).subscribe({
      next: res => {
        this.currentUser = res.user;
      },
      error: err => {
        console.error(err.error.name)
        this.message = err.error.name;
      },
      complete: () => this.getBanks()
    })
  }

  getBanks() {
    this.userService.getBanks()
    .subscribe({
      next: res => {
        this.banks = res;
      },
      error: err => {
        console.error('Error retrieveing banks')
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
        this.toastr.success(res.message, 'Success');
      },
      error: err => {
        this.toastr.error(err.error.message, 'Error');
      }
})
   }
  

  logout() {
    this.localService.clean();
    this.localService.setLoggedInStatus(false);
    // this.localService.isLoggedIn().subscribe(value => {
    //   if (value === true) {
    //     window.location.reload()
    //   }
    // })
}
}
