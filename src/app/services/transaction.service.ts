import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

const url = environment.apiUrl;
const httpOptions = environment.httpOptions

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  extractIdFromRoute() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      return id;
    });
  }

  getProductFromJiji(mainUrl: string): Observable<any> {
    return this.http.post(`${url}getProductInfo`, {mainUrl}, httpOptions);
  }

  createEscrow(prod: {}, tx_details: {}): Observable<any> {
    return this.http.post(`${url}create`, { prod, tx_details }, httpOptions);
  }

  getTransactionById(id: number): Observable<any>{
    return this.http.get(`${url}transaction/${id}`, httpOptions);
  }

  updateTransaction(status: {}, id: number): Observable<any> {
    return this.http.put(`${url}update/${id}`, status, httpOptions);
  }

  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${url}delete/${id}`, httpOptions);
  }

  getUserTransactions(userId: number): Observable<any>{
    return this.http.get(`${url}transactions/${userId}`, httpOptions);
  }

  reportTransaction(issue: any, id: number): Observable<any>{
    console.log(issue)
    return this.http.post(`${url}dispute/create/${id}`, issue, httpOptions);
  }

  endDispute(reason: any, id: number): Observable<any>{
    console.log(reason)
    return this.http.post(`${url}dispute/end/${id}`, reason, httpOptions);
  }

  getDisputesForUser(id: number): Observable<any>{
    return this.http.get(`${url}disputes/${id}`, httpOptions)
  }

  getDisputeById(id: number): Observable<any>{
    return this.http.get(`${url}dispute/${id}`, httpOptions)
  }
}
