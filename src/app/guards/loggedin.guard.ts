import { CanActivateFn, Router } from '@angular/router';
import { LocalService } from '../services/local.service';
import { map } from 'rxjs';
import { inject } from '@angular/core';

export const loggedinGuard: CanActivateFn = (route, state) => {
  const localService: LocalService = inject(LocalService);
  const router: Router = inject(Router);

  return localService.isLoggedIn().pipe(
    map((status) => {
      if (status) {
        router.createUrlTree(['transactions']);
        return false;
      }
      
      return true;
    })
  );
};
