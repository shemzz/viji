import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TransactionService } from 'src/app/services/transaction.service';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgbNavModule, NgIf, RouterModule],
  providers: [TransactionService],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit{
  transactionsLoaded: boolean = false;
  transactions: any;
  message: string = '';
  active: number = 1;
  userId!: number;
  isSeller?: boolean;

  constructor(private transactionService: TransactionService, private cookieService: CookieService) {
    this.userId = parseInt(this.cookieService.get('_userId_'));
  }

  ngOnInit(): void {
    this.transactionService.getUserTransactions(this.userId).subscribe({
      next: res => {
        console.log(res)
        this.transactions = res.transactions;
        this.isSeller = res.isSeller;
        this.transactionsLoaded = true;
      },
      error: err => {
        console.log(err);
      }
     }) 
  }

  setStatusMessage(status: string) {
    if (status === 'created') {
      this.message = 'Transaction created. Waiting for Buyer to Pay'
    } else if (status === 'started') {
      this.message = 'Payment in Secure Escrow. Waiting for Buyer to Recieve Product'
    } else if (status === 'completed') {
      this.message = 'Transaction is now completed and Payment Sent to Seller'
    } else if (status === 'dispute') {
      this.message = 'This transaction is in Dispute.'
    }else if (status === 'refund') {
      this.message = 'This transaction has been Refunded'
    } else {
      this.message = 'Ongoing Transaction'
    }

    return this.message;
  }
}
