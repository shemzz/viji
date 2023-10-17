import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-dispute-detail',
  standalone: true,
  imports: [CommonModule],
  providers: [TransactionService],
  templateUrl: './dispute-detail.component.html',
  styleUrls: ['./dispute-detail.component.scss']
})
export class DisputeDetailComponent implements OnInit {
  disputeId!: number;
  dispute: any;
  message: string = 'Fetching Dispute Details...'

  constructor(private route: ActivatedRoute, private transactionService: TransactionService) { }
  
  ngOnInit(): void {
    this.extractIdFromRoute();
    this.getDispute(this.disputeId);
  }

  extractIdFromRoute() {
    this.route.params.subscribe(params => {
      this.disputeId = params['id'];
    });
  }
  getDispute(id: number) {
    this.transactionService.getDisputeById(id).subscribe({
      next: res => {
        this.dispute = res
        console.log(this.dispute)
      },
      error: err => {
        console.error(err)
        this.message = err.error.error;
      }
    })
  }

}
