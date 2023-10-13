import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const url = 'http://localhost:4343/api/v1/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer ' + sessionStorage.getItem("token")
  })
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private http: HttpClient) { }

  getProductFromJiji(mainUrl: string): Observable<any> {
    return this.http.post(`${url}getProductInfo`, {mainUrl}, httpOptions);
  }
  createEscrow(prod: {}, tx_details: {}): Observable<any> {
    return this.http.post(`${url}create`, {prod, tx_details}, httpOptions)
  }
}
