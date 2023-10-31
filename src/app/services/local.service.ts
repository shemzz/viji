import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const user_key = 'user';
const url = environment.url
@Injectable({
  providedIn: 'root'
})
export class LocalService {
  private _userIsLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private cookieService: CookieService) { }
  clean() {
    this.cookieService.delete(user_key)  
  }

  public saveUser(userData: any): void {
    this.cookieService.delete(userData);
    this.cookieService.set(user_key, JSON.stringify(userData), { expires: 1, domain: url, path: '/' })
  }

  public getLoggedInUser(): any {
    const loggedUser = this.cookieService.get(user_key);
    if (loggedUser) {
      return JSON.parse(loggedUser);
    }
  }

  formatPhoneNumber(phoneNumber: string): string {
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
