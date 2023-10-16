import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-seller-view-transaction',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [TransactionService],
  templateUrl: './seller-view-transaction.component.html',
  styleUrls: ['./seller-view-transaction.component.scss']
})
export class SellerViewTransactionComponent {
  agreeToTermsOfUse: boolean = false;
  transactionId!: number;
  closeResult: any;
  transaction: any;

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
    }
  })
}
  
  amountToPay() {
    return this.transaction?.transaction_details.amount + this.transaction.transaction_details.escrow_fee
  }

}
