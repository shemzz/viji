import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { PhoneNumberTransform } from 'src/app/pipes/phoneNumberTransform.pipe';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-seller-view-transaction',
  standalone: true,
  imports: [CommonModule, RouterModule, PhoneNumberTransform],
  providers: [TransactionService],
  templateUrl: './seller-view-transaction.component.html',
  styleUrls: ['./seller-view-transaction.component.scss']
})
export class SellerViewTransactionComponent {
  agreeToTermsOfUse: boolean = false;
  transactionId!: number;
  closeResult: any;
  transaction: any;
  buyer: any;

  constructor(private route: ActivatedRoute, private transactionService: TransactionService, private userService: UserService, private title: Title) {
    this.title.setTitle('Seller Transactions | vijiPay')
  }

ngOnInit(): void {
  this.extractIdFromRoute();
  this.viewTransaction();
}
  
extractIdFromRoute() {
  this.route.params.subscribe(params => {
    this.transactionId = params['id'];
  });
}
  
  getBuyer() {
    let id;
    if (this.transaction) {
    id = this.transaction.transaction_details.buyer_id
    }
    this.userService.getUser(id).subscribe({
      next: res => {
       this.buyer = res
      },
      error: err => {
        console.log(err.error.message)
      }
    }
    )
}
viewTransaction() {
  this.transactionService.getTransactionById(this.transactionId).subscribe({
    next: data => {
      this.transaction = data.transaction
      console.log(data)
    },
    error: err => {
      console.log(err)
    },
    complete: ()=> this.getBuyer()
  })
}
  
  amountToPay() {
    return this.transaction?.transaction_details.amount + this.transaction.transaction_details.escrow_fee
  }

}
