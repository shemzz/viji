import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserInterface } from 'src/app/interface/user.interface';
import { PaymentButtonComponent } from 'src/app/components/payment-button/payment-button.component';

@Component({
  selector: 'app-view-transaction',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, PaymentButtonComponent],
  providers: [TransactionService],
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss']
})
export class ViewTransactionComponent implements OnInit {
agreeToTermsOfUse: boolean = false;
  transactionId!: number;

  transaction: any;
  user: UserInterface = {
    name: 'Shemang',
    email: 'david@gmail.com',
    phone: '090123456'
  }


constructor(private route: ActivatedRoute, private transactionService: TransactionService){}

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
  
}
