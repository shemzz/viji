import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { customAlphabet } from 'nanoid';
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

  saveUserCredentials(user: LoggedInUser) {
    
  }
}
