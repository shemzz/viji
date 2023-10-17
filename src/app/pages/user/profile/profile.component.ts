import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from 'src/app/services/user.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, debounceTime, map } from 'rxjs';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgbTypeaheadModule],
  providers: [UserService],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
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
  
  constructor(private userService: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.user = this.userService.loggedInUser();
    console.log(this.user)
    this.getLoggedInUser();
    this.getBanks()
  }
  
  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  getLoggedInUser() {
    return this.userService.getUser(this.user.id).subscribe({
      next: res => {
        console.log(res)
        this.currentUser = res.user;
      },
      error: err => {
        console.error(err.error.name)
      }
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
    const logout = this.userService.signout();
    if (logout) {
      console.log('logged out')
      this.userService.isLoggedIn();
      window.location.reload()
      this.router.navigate(['/']);
    }
}
}
