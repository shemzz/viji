import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { customAlphabet } from 'nanoid';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PaymentDetailsInterface } from '../interface/paymentDetails.interface';

const url = environment.apiUrl;
const httpOptions = environment.httpOptions

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  createPaymentReference() {
    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
    return nanoid();
  }
  savePaymentToDB(data: PaymentDetailsInterface): Observable<any> {
    return this.http.post(`${url}savepayment`, {data}, httpOptions)
  }
  validatePaymentStatus(ref: string): Observable<any>{
    return this.http.post(`${url}paymentstatus`, {ref: ref}, httpOptions)
  }
}
