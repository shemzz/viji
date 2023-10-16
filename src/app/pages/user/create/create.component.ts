import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from 'src/app/services/transaction.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MessageInterface } from 'src/app/interface/message.interface';
import { NgxCurrencyDirective } from 'ngx-currency';
import { Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgxCurrencyDirective, RouterModule],
  providers:[TransactionService],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  sellerPhone: any;
  message: MessageInterface = {};
  productUrl: string = 'https://jiji.ng/ojodu/cars/mercedes-benz-gl-class-gl-450-2012-blue-pJKk2g0nGczlkbmoyJJ3UfTl.html?page=1&pos=2&cur_pos=2&ads_per_page=21&ads_count=97434&lid=DnJo9wLVcCQmd9E9&indexPosition=1';
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
  
  constructor(private transactionService: TransactionService, private router: Router, private cookieService: CookieService) { 
    this.userId = parseInt(this.cookieService.get('_userId_'));

  }
  
  ngOnInit(): void {
    this.getProductFromJiji()
  }

  getProductFromJiji() {
    this.productFetched = false;
    this.message = {};
    this.transactionService.getProductFromJiji(this.productUrl).subscribe({
      next: data => {
        this.productFetched = true;
        this.message = data.message;
        this.product = data.product;
      },
      error: error => {
        console.error('There was an error!', error);
      }
    });
  }
  
  updateSellerPhone() {
    this.sellerPhone = this.formatPhoneNumber(this.sellerPhone);
    this.product.seller.phone = this.sellerPhone;
    this.message = {};
  }
  
  formatPhoneNumber(phoneNumber: string): string {
    // Remove leading zero and ensure it's at least 11 characters long
    if (phoneNumber.length >= 11 && phoneNumber.startsWith('0')) {
      phoneNumber = phoneNumber.slice(1);
    }
    // Check if the phone number is in the format +234...
    if (phoneNumber.startsWith('+234') && phoneNumber.length === 14) {
      return phoneNumber;
    }
    // Default case: assume it's a local number, prepend +234
    return '+234' + phoneNumber;
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
        return this.negotiatedPrice * 0.05
      }
    } else {
      if (this.product.advert.price.value >= 100000) {
        return 5000;
      } else {
        return this.product.advert.price.value * 0.05
      }
    }

  }

  createEscrowTransaction() {
    const transaction = {
      buyer_id: this.userId,
      produc_amount: this.product.advert.price.value,
      amount: this.negotiatedPrice ? this.negotiatedPrice : this.product.advert.price.value,
      escrow_fee: this.calculateEscrowFee(),
      price_negotiated: this.negotiated,
      require_delivery: this.requireDelivery,
      who_pays_for_delivery: this.requireDelivery ? this.whoPaysForDelivery : '',
      delivery_region: this.deliveryRegion,
    }

    this.transactionService.createEscrow(this.product, transaction).subscribe({
      next: data => {
        console.log(data.message)
        this.txId = data.id;
      },
      error:err => {
          console.error(err)
      },
      complete: () => {
        setTimeout(() => {
          this.router.navigate([`/transaction/${this.txId}`]);
        }, 2000);
      }
    })
    }
  
}
