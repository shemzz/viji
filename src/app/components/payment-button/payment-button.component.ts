import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInterface } from 'src/app/interface/user.interface';
import { PaymentService } from 'src/app/services/payment.service';
import { Angular4PaystackModule } from 'angular4-paystack';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-button',
  standalone: true,
  imports: [CommonModule, HttpClientModule, Angular4PaystackModule],
  providers: [PaymentService],
  templateUrl: './payment-button.component.html',
  styleUrls: ['./payment-button.component.scss']
})
export class PaymentButtonComponent  implements OnInit{
  @Input() transaction: any;
  @Input() terms: any;
  @Input() amount: number = 0;
  amt: number = 0;
  loading: boolean = false;
  agreeToTermsOfUse: boolean = false;
  transactionId!: number;
  reference!: any;
  metadata: {} = {};
  user: any = {
    name: 'Shemang',
    email: 'david@gmail.com',
    phone: '090123456'
  }


constructor(private paymentService: PaymentService, private router: Router, private toastr: ToastrService){}
  
  ngOnInit(): void {
    this.amt = parseInt(this.amount + '00')
    this.saveTransaction();
  }
  
  saveTransaction() {
    // generate Reference
    const createReference = this.paymentService.createPaymentReference()
    
    const data = {
      reference: createReference,
      totalCollected: this.amt,
      amount: this.transaction?.transaction_details.amount,
      fee: this.transaction.transaction_details.escrow_fee,
      buyerId: 1,
      sellerId: 2,
      transactionId: this.transaction.id,
      success: false
    }
  
    //save the transaction payment to the DB
    this.paymentService.savePaymentToDB(data).subscribe({
      next: res => {
        console.log(res)
        this.reference = res.ref ? res.ref : createReference;
        console.log(this.reference)
      },
      error: err => {
        console.error(err);
      },
    })

  }

  initializePayment() {
    this.loading = true;
    // create metadata
    this.metadata = {
      product: this.transaction.product.advert.title,
      ref: this.reference,
      amount: this.amount,
    }
  }
  
  cancelPayment(reference: string) {
    this.toastr.info('You cancelled a payment', 'Cancelled!')
    console.log('cancelled', reference)
    this.loading = false;
    
    //delete the transaction with reference from DB because payment was cancelled
  }
  
  checkPaymentStatus(ref: string) {
    this.router.navigate([`/transaction/${this.transaction.id}/payment/validate`], { queryParams: { ref: ref } })
    
    }
  
}

