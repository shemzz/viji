import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const url = environment.apiUrl;
const httpOptions = environment.httpOptions

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private http: HttpClient) { }

  getProductFromJiji(mainUrl: string): Observable<any> {
    return this.http.post(`${url}getProductInfo`, {mainUrl}, httpOptions);
  }

  createEscrow(prod: {}, tx_details: {}): Observable<any> {
    return this.http.post(`${url}create`, { prod, tx_details }, httpOptions);
  }
  getTransactionById(id: number): Observable<any>{
    return this.http.get(`${url}transaction/${id}`, httpOptions);
  }
}
