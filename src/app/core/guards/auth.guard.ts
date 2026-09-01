import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);

  // Verifica que exista window antes de acceder a localStorage
  const token = localStorage.getItem('tf_token');

  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }

};
