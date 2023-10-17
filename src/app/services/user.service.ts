import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { customAlphabet } from 'nanoid';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserInterface } from '../interface/user.interface';
import { CookieService } from 'ngx-cookie-service';


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

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  register(data: UserInterface): Observable<any> {
    console.log(data)
    return this.http.post(`${url}signup`, data, httpOptions)
  }
  login(data: UserInterface): Observable<any>{
    console.log(data)
    return this.http.post(`${url}signin`, data, httpOptions)
  }
  forgotPassword(ref: string): Observable<any>{
    return this.http.post(`${url}paymentstatus`, {ref: ref}, httpOptions)
  }
  resetPassword(ref: string): Observable<any>{
    return this.http.post(`${url}paymentstatus`, {ref: ref}, httpOptions)
  }

  isLoggedIn(): boolean {
    const user = this.cookieService.get('_userId_');
    const key = this.cookieService.get('_token_');
    if (user && key) {
      return true
    }

    return false;
  }

  loggedInUser(): {} {
    const id = this.cookieService.get('_userId_');
    const key = this.cookieService.get('_token_');
    const user = {
      id: id,
      key: key
    }
    if (user) {
      return user
    }

    return {};
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

  signout() {
    this.cookieService.deleteAll();
    return true;
  }
}
