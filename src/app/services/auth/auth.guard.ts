import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

export const isAuthenticatedGuard = (): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isUserDefined = authService.userSubject.value;

    if (isUserDefined) {
      return true;
    }

    return authService.authState$.pipe(
      map((user) => {
        if (user) {
          return true;
        }
        return router.parseUrl('/auth/login');
      }),
    );
  };
};
