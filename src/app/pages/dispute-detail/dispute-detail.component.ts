import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { LocalService } from 'src/app/services/local.service';
import { Title } from '@angular/platform-browser';

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
  buyer: any;
  seller: any;
  message: string = 'Fetching Dispute Details...'
  user: any;

  constructor(private route: ActivatedRoute, private transactionService: TransactionService, private localService: LocalService, private title: Title) {
    this.title.setTitle(this.dispute?.title || 'Disputes Vijipay' )
   }
  
  ngOnInit(): void {
    this.extractIdFromRoute();
    this.getDispute(this.disputeId);
    this.user = this.localService.getLoggedInUser();
  }

  extractIdFromRoute() {
    this.route.params.subscribe(params => {
      this.disputeId = params['id'];
    });
  }
  getDispute(id: number) {
    this.transactionService.getDisputeById(id).subscribe({
      next: res => {
        this.dispute = res.dispute;
        console.log(this.dispute)
        this.buyer = res.buyer;
        this.seller = res.seller
      },
      error: err => {
        console.error(err)
        this.message = err.error.error;
      }
    })
  }

  endDispute() {
    this.transactionService.endDispute('', this.disputeId).subscribe({
      next: res => {
        console.log(res)
      },
      error: err => {
        console.error(err);
        this.message = err.error.error;
      }
    })
  }

}
