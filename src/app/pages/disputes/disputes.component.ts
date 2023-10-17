import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from 'src/app/services/transaction.service';
import { UserService } from 'src/app/services/user.service';
import { RouterModule } from '@angular/router';

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
  constructor(private transactionService: TransactionService, private userService: UserService) { }
  
  ngOnInit(): void {
    this.user = this.userService.loggedInUser()
    this.getDisputes(this.user.id);
  }

  getDisputes(userId: number) {
    this.transactionService.getDisputesForUser(userId).subscribe({
      next: res => {
        console.log(res)
        this.disputes = res
      },
      error: err => {
        console.error(err)
      }
    })
  }
}
