import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserInterface } from 'src/app/interface/user.interface';
import { PaymentButtonComponent } from 'src/app/components/payment-button/payment-button.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-transaction',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, PaymentButtonComponent, RouterModule],
  providers: [TransactionService],
  templateUrl: './view-transaction.component.html',
  styleUrls: ['./view-transaction.component.scss']
})
export class ViewTransactionComponent implements OnInit {
agreeToTermsOfUse: boolean = false;
  transactionId!: number;
  closeResult: any;
  transaction: any;
  user: UserInterface = {
    name: 'Shemang',
    email: 'david@gmail.com',
    phone: '090123456'
  }


constructor(private route: ActivatedRoute, private transactionService: TransactionService, private modalService: NgbModal){}

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
  
  completeTransaction() {
    const status = { status: 'completed' }
    this.transactionService.updateTransaction(status, this.transaction.id).subscribe({
      next: res => {
        this.transaction = res.transaction;
        console.log(this.transaction)
      },
      error: err => {
        console.log(err)
      },
      complete: () => this.modalService.dismissAll()
    })
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'Complete Transaction', centered: true, animation: true, backdrop: 'static' });
  }
  

  
}
