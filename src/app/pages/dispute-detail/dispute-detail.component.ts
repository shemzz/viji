import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { LocalService } from 'src/app/services/local.service';
import { Title } from '@angular/platform-browser';
import { PhoneNumberTransform } from 'src/app/pipes/phoneNumberTransform.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dispute-detail',
  standalone: true,
  imports: [CommonModule, PhoneNumberTransform],
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
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private transactionService: TransactionService, private localService: LocalService, private title: Title, private toastr: ToastrService, private router: Router) {
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
        this.buyer = res.buyer;
        this.seller = res.seller
      },
      error: err => {
        this.toastr.error(err.error.message, 'Error!')
        this.message = err.error.message;
      }
    })
  }

  endDispute() {
    this.loading = true
    this.transactionService.endDispute('', this.disputeId).subscribe({
      next: res => {
        this.toastr.success(res.message, 'Closed!');
        this.loading = false
      },
      error: err => {
        this.toastr.error(err.error.message, "Error!")
        this.loading = false;
        this.message = err.error.error;
      },
      complete: ()=> this.router.navigate(['/transactions'])
    })
  }

}
