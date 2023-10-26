import { CanActivateFn, Router } from '@angular/router';
import { LocalService } from '../services/local.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const localService: LocalService = inject(LocalService);
  const router: Router = inject(Router);

  return localService.isLoggedIn().pipe(
    map((status) => {
      if (status) {
        console.log(status)
        return true;
      }
      
      return router.createUrlTree(['auth/login']);
    })
  );
};
