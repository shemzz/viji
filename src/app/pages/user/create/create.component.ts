import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from 'src/app/services/transaction.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MessageInterface } from 'src/app/interface/message.interface';
import { NgxCurrencyDirective } from 'ngx-currency';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LocalService } from 'src/app/services/local.service';
import { ToastrService } from 'ngx-toastr';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgxCurrencyDirective, RouterModule],
  providers:[TransactionService],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit{
  user: any;
  correctFormat: boolean = false;
  phoneMessage: string = '';
  sellerPhone: any;
  message: MessageInterface = {};
  productUrl: string = '';
  productFetched: boolean = false;
  product: any;
  isProductFullyLoaded: boolean = false;
  negotiated: boolean = false;
  negotiatedPrice!: number;
  requireDelivery: boolean = false;
  whoPaysForDelivery: string = '';
  deliveryRegion: string = '';
  txId!: number;
  userId!: number;
  isLoading: boolean = false;
  
  constructor(private transactionService: TransactionService, private router: Router, private locaService: LocalService, private toastr: ToastrService, private title: Title) { 
    this.title.setTitle('Create Escrow Transaction')
  }
  ngOnInit(): void {
    this.user = this.locaService.getLoggedInUser();
  }

  getProductFromJiji() {
    this.isLoading = true
    this.productFetched = false;
    this.message = {};
    this.transactionService.getProductFromJiji(this.productUrl).subscribe({
      next: data => {
        this.productFetched = true;
        this.isLoading = false;
        this.message = data.message;
        this.product = data.product;
        if (!this.product.seller.phone) {
         this.product.seller.phone =  this.locaService.formatPhoneNumber(this.product.seller.phone)
        }
        console.log(this.product.seller.phone)
      },
      error: error => {
        this.isLoading = false;
        this.toastr.error(error.error.message, 'Error!')
      }
    });
  }
  
  updateSellerPhone() {
    this.sellerPhone = this.locaService.formatPhoneNumber(this.sellerPhone);
    this.product.seller.phone = this.sellerPhone;
    this.message = {};
  }
  
  checkPhoneFormat() {
    this.correctFormat = false; // Set it to false initially
    this.phoneMessage = 'Invalid phone number';
    if (this.sellerPhone.length === 11 && this.sellerPhone.startsWith('0')) {
      this.correctFormat = true;
      this.phoneMessage = '';
    }
  
    if (this.sellerPhone.startsWith('+234') && this.sellerPhone.length === 14) {
      this.correctFormat = true;
      this.phoneMessage = '';
    }
    if (this.sellerPhone.length < 11) {
      this.phoneMessage = 'Phone number is not complete'
    }
  }
  
  
  showProductTobeEscrowed() {
    this.isProductFullyLoaded = !this.isProductFullyLoaded;
  }

  calculateEscrowFee() {
    // calculate and display escrow fee here
    if (this.negotiated && this.negotiatedPrice) {
      if (this.negotiatedPrice >= 100000) {
        return 5000;
      } else if (this.negotiatedPrice < 10000) {
        return 500;
      } else {
        return Math.round(this.negotiatedPrice * 0.05)
      }
    } else {
      if (this.product.advert.price.value >= 100000) {
        return 5000;
      } else {
        return Math.round(this.product.advert.price.value * 0.05)
      }
    }

  }

  createEscrowTransaction() {
    
    if (!this.user) {
      this.router.navigate(['auth/login']);
    } else {
      const transaction = {
        buyer_id: this.user.id,
        produc_amount: this.product.advert.price.value,
        amount: this.negotiatedPrice ? this.negotiatedPrice : this.product.advert.price.value,
        escrow_fee: this.calculateEscrowFee(),
        price_negotiated: this.negotiated,
        require_delivery: this.requireDelivery,
        who_pays_for_delivery: this.requireDelivery ? this.whoPaysForDelivery : '',
        delivery_region: this.deliveryRegion,
      }
      this.isLoading = true
      this.transactionService.createEscrow(this.product, transaction).subscribe({
        next: data => {
          this.txId = data.id;
          this.toastr.success(data.message, 'Success')
        },
        error: err => {
          console.error(err)
          this.toastr.error(err.error.message, 'Error')
        },
        complete: () => {
          setTimeout(() => {
            this.router.navigate([`/transaction/${this.txId}`]);
          }, 1000);
        }
      })
    }

    // if (this.user != undefined) {
    // } else {
    //   this.router.navigate(['auth/login']);
    //  }
    
    
    }
  
}
