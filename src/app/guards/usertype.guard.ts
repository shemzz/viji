import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { LocalService } from '../services/local.service';

export const userTypeGuard: CanActivateFn = (route, state) => {
  const localService: LocalService = inject(LocalService);
  const router: Router = inject(Router);
  const transactionId = route.params['id'];

  const user = localService.getLoggedInUser()
  if (user && user.isSeller === false) {
    return true;
    } 
    return router.createUrlTree([`seller-transaction/${transactionId}`]);

};
