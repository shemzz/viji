import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TransactionService } from 'src/app/services/transaction.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgbNavModule, NgIf],
  providers: [TransactionService],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit{
  transactionsLoaded: boolean = false;
  transactions: any;
  message: string = '';
  active: number = 1;
  constructor(private transactionService: TransactionService){}

  ngOnInit(): void {
    this.transactionService.getUserTransactions(1).subscribe({
      next: res => {
        this.transactions = res.transactions;
        this.transactionsLoaded = true;
        console.log(res)
      },
      error: err => {
        console.log(err);
        this.message = err.error.message
      }
     }) 
  }
}
