import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { HttpClientModule } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-validate-payment',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  providers: [PaymentService, TransactionService],
  templateUrl: './validate-payment.component.html',
  styleUrls: ['./validate-payment.component.scss']
})
export class ValidatePaymentComponent {
  payment: any;
  loading: boolean = true;
  status: string = 'Verifying Transaction'
  message: string = 'Please wait while we confirm the status of your payment with the service provider.'
  item: any;


  constructor(private route: ActivatedRoute, private paymentService: PaymentService, private transactionService: TransactionService, private router: Router, private title: Title) {
    this.title.setTitle('Validate payment | vijiPay')
  }

  ngOnInit(): void {

    // Get the tx_ref parameter from the query params
    this.route.queryParams.subscribe(params => {
      const txRef = params['ref'];
      if (txRef) {
        // Send the tx_ref to the backend for validation
        this.sendTxRefToBackend(txRef);
      }
    });
  }
  
  sendTxRefToBackend(txRef: string): void {
    // Send a POST request to the backend for validation
    this.paymentService.validatePaymentStatus(txRef).subscribe({
      next: res => {
        this.payment = res.data;
        if (this.payment.status === 'success') {
          this.message = res.message;
          // update the transaction
          this.updateTransactionStatus(res.id)
        } else {
          this.message = 'Your Payment is still pending. Refresh this page after two minutes'
        }
      },
      error: err => {
        this.message = err.error.message;
        console.log(err)
      }
    });
  }
  
  updateTransactionStatus(id: number) {
    const data = {
      status: 'started'
    }
    this.transactionService.updateTransaction(data, id).subscribe({
      next: res => {
        this.item = res.transaction;
        this.loading = false;
        this.status = 'Updating Transaction'
        this.message = 'Payment recieved. Updating the Escrow Transaction'
      },
      error: err => {
        console.error(err)
      },
      complete: ()=> this.goToTransaction(id)
    })
  }

  goToTransaction(id: number) {
    setTimeout(() => {
      this.router.navigate([`/transaction/${id}`])
    }, 2000);
  }
}
