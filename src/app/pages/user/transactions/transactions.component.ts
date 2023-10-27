import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TransactionService } from 'src/app/services/transaction.service';
import { HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { RouterModule } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { LocalService } from 'src/app/services/local.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgbNavModule, NgIf, RouterModule],
  providers: [TransactionService, UserService],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit{
  transactionsLoaded: boolean = false;
  transactions: any;
  message: string = 'Loading Transactions';
  active: number = 1;
  user!: any;
  isSeller?: boolean;

  constructor(private transactionService: TransactionService, private localService: LocalService, private title: Title) {
    this.title.setTitle('Transactions | vijiPay')
  }

  ngOnInit(): void {
    this.user = this.localService.getLoggedInUser();

        this.transactionService.getUserTransactions(this.user.id).subscribe({
          next: res => {
            this.transactions = res.transactions;
            this.isSeller = res.isSeller;
            this.transactionsLoaded = true;
          },
          error: err => {
            console.log(err);
          }
         }) 
  }
  get activeTransactions() {
    return this.transactions?.filter((transaction: any) => transaction.status === 'created' || transaction.status === 'pending' || transaction.status === 'started');
  }
  
  get completedTransactions() {
    return this.transactions?.filter((transaction: any) => transaction.status === 'completed');
  }
  
  get disputedTransactions() {
    return this.transactions?.filter((transaction: any) => transaction.status === 'dispute' || transaction.status === 'refund');
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
