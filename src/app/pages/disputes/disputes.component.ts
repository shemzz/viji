import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { RouterModule } from '@angular/router';
import { LocalService } from 'src/app/services/local.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-disputes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './disputes.component.html',
  styleUrls: ['./disputes.component.scss']
})
export class DisputesComponent implements OnInit {
  user: any;
  disputes: any = [];
  constructor(private transactionService: TransactionService, private localService: LocalService, private title: Title) {
    this.title.setTitle('My Disputes | vijiPay')
   }
  
  ngOnInit(): void {
    this.user = this.localService.getLoggedInUser()
    this.getDisputes(this.user.id);
  }

  getDisputes(userId: number) {
    this.transactionService.getDisputesForUser(userId).subscribe({
      next: res => {
        this.disputes = res
      },
      error: err => {
        console.error(err)
      }
    })
  }
}
