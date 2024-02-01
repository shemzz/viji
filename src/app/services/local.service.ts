import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { jwtDecode } from 'jwt-decode';

const user_key = 'koded';
const url = environment.url
@Injectable({
  providedIn: 'root'
})
export class LocalService {
  private _userIsLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private cookieService: CookieService) { }
  clean() {
    this.cookieService.delete(user_key);
    document.cookie = `${user_key} = ; expires=Thu, 1 jan 1990 12:00:00 UTC; path=/`;
    localStorage.clear()
  }

  public saveUser(userData: any): void {
    const token = userData.accessToken;
    this.cookieService.delete(user_key);
    localStorage.removeItem(user_key);
    this.cookieService.set(user_key, JSON.stringify({ token: token }), { domain: url, path: '/' });
    delete userData.accessToken;
    localStorage.setItem(user_key, JSON.stringify(userData))
  }
  public saveAccessToken(token: string): void {
    this.cookieService.delete(user_key);
    this.cookieService.set(user_key, JSON.stringify({ token: token }), { domain: url, path: '/' });
  }

  public updateUserType(type: boolean) {
    const loggedUser = localStorage.getItem(user_key);
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
    user.isSeller = type;
   }
  }

  public getLoggedInUser(): any {
    const loggedUser = localStorage.getItem(user_key);
    if (loggedUser) {
      return JSON.parse(loggedUser);
    } else {
      // this.clean();
      // window.location.reload()
    }
  }
  public getaccessToken(): any {
    const loggedUser = this.cookieService.get(user_key);
    if (loggedUser) {
      return JSON.parse(loggedUser);
    }
  }

  formatPhoneNumber(phoneNumber: string): string {
    if (!phoneNumber) {
      return ''
    }
    // Remove leading zero and ensure it's at least 11 characters long
    if (phoneNumber.length === 11 && phoneNumber.startsWith('0')) {
      phoneNumber = phoneNumber.slice(1);
      return '+234' + phoneNumber;
    }
    // Check if the phone number is in the format +234...
    if (phoneNumber.startsWith('+234') && phoneNumber.length === 14) {
      return phoneNumber;
    }

    // Check if the phone number is in the format +234...
    if (phoneNumber.startsWith('234') && phoneNumber.length === 13) {
      return '+'+phoneNumber;
    }

    throw new Error('Invalid phone number');
  }

  public setLoggedInStatus(value: boolean): void {
    console.log('login status is now', value)
    this._userIsLoggedIn$.next(value)
  }

  public isLoggedIn(): Observable<boolean> {
    const key = this.cookieService.get(user_key);
    if (key) {
      this._userIsLoggedIn$.next(true);
      return this._userIsLoggedIn$.asObservable();
    }
    return this._userIsLoggedIn$.asObservable();
  }
}
