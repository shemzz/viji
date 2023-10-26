import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { LocalService } from '../services/local.service';

export const userTypeGuard: CanActivateFn = (route, state) => {
  const localService: LocalService = inject(LocalService);
  const router: Router = inject(Router);

  const user = localService.getLoggedInUser()
    if (user && user.isSeller === false) {
      console.log('not a seller')
      return true;
    } 
    console.log('is a seller')
    return router.createUrlTree(['seller-transaction/:id']);

};
