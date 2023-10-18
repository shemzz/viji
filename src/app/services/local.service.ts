import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';

const user_key = 'user';

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
    this.cookieService.set(user_key, JSON.stringify(userData), { expires: 1, domain: 'localhost', path: '/' })
  }

  public getLoggedInUser(): any {
    const loggedUser = this.cookieService.get(user_key);
    if (loggedUser) {
      return JSON.parse(loggedUser);
    }
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
