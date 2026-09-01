import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el backend devuelve 401, el token expiró o es inválido
      if (error.status === 401) {
        localStorage.removeItem('tf_user'); // Limpias la sesión
        localStorage.removeItem('tf_token'); // Limpias la sesión
        router.navigate(['/login']);      // Rediriges al login
      }
      return throwError(() => error);
    })
  );
};
