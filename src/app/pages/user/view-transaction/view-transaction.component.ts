import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserInterface } from 'src/app/interface/user.interface';
import { PaymentButtonComponent } from 'src/app/components/payment-button/payment-button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReasonsForDispute } from 'src/app/helpers/disputeReasons.data';
import { ReasonInterface } from 'src/app/interface/reason.interface';
import { ToastrService } from 'ngx-toastr';
import { PhoneNumberTransform } from 'src/app/pipes/phoneNumberTransform.pipe';
import { Title } from '@angular/platform-browser';
import { LocalService } from 'src/app/services/local.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-view-transaction',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, PaymentButtonComponent, RouterModule, PhoneNumberTransform],
  providers: [TransactionService],
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss']
})
export class ViewTransactionComponent implements OnInit {
  loading: boolean = false;
agreeToTermsOfUse: boolean = false;
  transactionId!: number;
  closeResult: any;
  transaction: any;
  reasonsForDispute: any = ReasonsForDispute;
  otherChecked = false;
  otherReason = '';
  selectedDisputes: any = [];
  user: any = {
    name: 'Shemang',
    email: 'david@gmail.com',
    phone: '090123456'
  }


  constructor(private route: ActivatedRoute, private transactionService: TransactionService, private modalService: NgbModal, private toastr: ToastrService, private router: Router, private title: Title, private localService: LocalService, private userService: UserService) {
    this.title.setTitle('Transaction | vijiPay')
}

ngOnInit(): void {
  this.extractIdFromRoute();
  this.viewTransaction()
}
  
extractIdFromRoute() {
  this.route.params.subscribe(params => {
    this.transactionId = params['id'];
  });
}
  
  loggedInUserIsBuyer() {
    const user = this.localService.getLoggedInUser();
    if (user.id === this.transaction.transaction_details.buyer_id) {
      return true
    }
    return false;
}
viewTransaction() {
  this.transactionService.getTransactionById(this.transactionId).subscribe({
    next: data => {
      this.transaction = data.transaction
    },
    error: err => {
      this.toastr.error(err.error.message, 'Error!')
      console.log(err)
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
  
  amountToPay() {
    return this.transaction?.transaction_details.amount + this.transaction.transaction_details.escrow_fee
  }
  
  completeTransaction() {
    const status = { status: 'completed' }
    this.transactionService.updateTransaction(status, this.transaction.id).subscribe({
      next: res => {
        this.transaction = res.transaction;
        console.log(this.transaction);
        this.toastr.success('Transaction completed successfully', 'Success!')
      },
      error: err => {
        console.log(err)
        this.toastr.error(err.error.message, 'Error!')
      },
      complete: () => {
        this.modalService.dismissAll();
        this.router.navigate(['transactions'])
      }
    })
  }

  open(content: any) {
    const type = content._declarationTContainer.localNames[0];
    if (type === 'dispute') {
      this.modalService.open(content, { ariaLabelledBy: 'Report Transaction', fullscreen: true, animation: true, backdrop: 'static', scrollable: true });
    } else { 
      this.modalService.open(content, { ariaLabelledBy: 'Complete Transaction', centered: true, animation: true, backdrop: 'static' });
    }
  }
  
  onCheckboxChange(reason: ReasonInterface): void {
    if (reason.isChecked) {
      this.selectedDisputes.push(reason);
    } else {
      this.selectedDisputes = this.selectedDisputes.filter((r: any) => r.id !== reason.id);
    }
    if (reason.name === 'Other (Please Specify)' && reason.isChecked) {
      this.otherChecked = true
    } else {
      this.otherChecked = false;
      this.otherReason = ''
    }
  }
  addOtherIssueToList(id: number): void {
    this.selectedDisputes = this.selectedDisputes.filter((reason: any) => reason.id !== id);
    this.selectedDisputes.unshift({ id: 0, name: `Other Reason: ${this.otherReason}` });
  }
  
  
  handleSuccess() {
    this.selectedDisputes = [];
    this.router.navigate(['/disputes']);
  }
  
  reportTransaction() {
    this.loading = true;
    this.otherReason !== '' ? this.addOtherIssueToList(13) : '';
    this.transactionService.reportTransaction(this.selectedDisputes, this.transactionId).subscribe({
      next: res => {
        if (res.message == 'Dispute Created') {
          this.toastr.info(res.message, "Done!")
          this.handleSuccess();
          
        }
      },
      error: err => {
        this.toastr.error(err.error.message, "Error")
        console.error(err)
      },
      complete: () => {
        this.loading = false;
        this.modalService.dismissAll()
      }
    })
  }
  
  
  
}
