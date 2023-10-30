import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserInterface } from '../interface/user.interface';


const url = environment.apiUrl;
const httpOptions = environment.httpOptions

interface LoggedInUser {
  accessToken: string,
  email: string,
  id: number
}
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  register(data: UserInterface): Observable<any> {
    return this.http.post(`${url}signup`, data, httpOptions)
  }
  login(data: any): Observable<any>{
    return this.http.post(`${url}signin`, data, httpOptions)
  }
  forgotPassword(email: string): Observable<any>{
    return this.http.post(`${url}forgot-password`, {email:email}, httpOptions)
  }
  sendVerificationCode(email: string): Observable<any>{
    return this.http.post(`${url}sendverificationcode`, {email: email}, httpOptions)
  }
  confirmEmailAddress(code: string): Observable<any>{
    return this.http.post(`${url}confirmemail`, {token: code}, httpOptions)
  }
  resetPassword(data: any): Observable<any>{
    return this.http.post(`${url}reset-password`, data, httpOptions)
  }

  getUser(id: number): Observable<any>{
    return this.http.get(`${url}user/${id}`, httpOptions)
  }

  getBanks(): Observable<any>{
    return this.http.get(`${url}getbanks`, httpOptions)
  }
  validateAccountDetails(details: {}): Observable<any> {
    return this.http.post(`${url}validateaccount`, details, httpOptions)
  }

  updatePayoutMethod(data: any): Observable<any> {
    return this.http.post(`${url}updatepayout`, data, httpOptions)
  }

  updateUser(data: any, id: number): Observable<any> {
    return this.http.put(`${url}update/user/${id}`, data, httpOptions);
  }

  logout() {
    return this.http.post(`${url}logout`, {}, httpOptions)
  }

  refreshToken() {
    return this.http.post(`${url}refreshtoken`, { }, httpOptions);
  }

}
