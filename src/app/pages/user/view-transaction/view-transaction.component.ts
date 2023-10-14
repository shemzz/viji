import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Angular4PaystackModule } from 'angular4-paystack';
import { UserInterface } from 'src/app/interface/user.interface';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-view-transaction',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, Angular4PaystackModule],
  providers: [TransactionService, PaymentService],
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss']
})
export class ViewTransactionComponent implements OnInit {
agreeToTermsOfUse: boolean = false;
  transactionId!: number;
  reference!: any;
  metadata: {} = {};
  transaction: any;
  user: UserInterface = {
    name: 'Shemang',
    email: 'david@gmail.com',
    phone: '090123456'
  }


constructor(private route: ActivatedRoute, private transactionService: TransactionService, private paymentService: PaymentService){}

ngOnInit(): void {
  this.extractIdFromRoute();
  this.viewTransaction()
}
  
extractIdFromRoute() {
  this.route.params.subscribe(params => {
    this.transactionId = params['id'];
  });
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
    complete: ()=> console.log(this.transaction)
  })
}
  
  amountToPay() {
    return this.transaction?.transaction_details.amount + this.transaction.transaction_details.escrow_fee
  }

  initializePayment() {
    // generate Reference
    const createReference = this.paymentService.createPaymentReference()
    //save the transaction  payment to the DB
    const data = {
      reference: createReference,
      totalCollected: this.amountToPay(),
      amount: this.transaction?.transaction_details.amount,
      fee: this.transaction.transaction_details.escrow_fee,
      buyerId: 1,
      sellerId: 2,
      transactionId: 5,
      success: false
    }

    this.paymentService.savePaymentToDB(data).subscribe({
      next: res => {
        this.reference = res.ref
        console.log(this.reference)
      },
      error: err => {
        console.error(err);
      }
    })
    // create metadata
    this.metadata = {
      product: this.transaction.product.advert.title,
      ref: this.reference
    }
  }
  
  cancelPayment(reference: string) {
    //delete the transaction with reference from DB because payment was cancelled
  }
  
  checkPaymentStatus(ref: string) {
    // this.router.navigate([`/transactions/payment/validate`], { queryParams: { ref: ref } })
    
    }
makePayment() {
throw new Error('Method not implemented.');
}
  
}
