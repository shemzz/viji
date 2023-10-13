import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionService } from 'src/app/services/transaction.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MessageInterface } from 'src/app/interface/message.interface';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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
  
  constructor(private transaction: TransactionService) { }
  
  ngOnInit(): void {
      this.getProductFromJiji()
  }

  getProductFromJiji() {
    this.productFetched = false;
    this.message = {};
    this.transaction.getProductFromJiji(this.productUrl).subscribe({
      next: data => {
        this.productFetched = true;
        this.message = data.message;
        this.product = data.product;
        
        console.log(data);  
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
    this.isProductFullyLoaded = true;
  }
  
}
