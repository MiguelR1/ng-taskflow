import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// Interfaces que reflejan las respuestas del backend
export interface Usuario {
  id: number;
  email: string;
  nombre: string | null;
  cedula: string;
  rol: 'User' | 'Admin';
}

export interface AuthResponse {
  mensaje: string;
  usuario: Usuario;
  token: string;
}

export interface AuthErrorResponse {
  ok?: boolean;
  mensaje?: string;
  errores?: { campo: string; mensaje: string }[];
}

// Interfaces para los payloads de envío al backend
export interface LoginPayload {
  email?: string;
  cedula?: string;
  password: string;
}

export interface RegisterPayload {
  nombre: string;
  cedula: string;
  email: string;
  password: string;
  rol: 'User' | 'Admin';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly API_URL = 'http://localhost:3000/api/auth';

  // Señales reactivas para el estado de autenticación
  private _usuario = signal<Usuario | null>(this.getStoredUser());
  private _token = signal<string | null>(this.getStoredToken());

  // Señales computadas públicas
  readonly usuario = this._usuario.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  // --- Login ---
  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/Login`, payload).pipe(
      tap((res) => {
        this.storeSession(res.token, res.usuario);
      }),
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  // --- Register ---
  register(payload: RegisterPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/Register`, payload).pipe(
      tap((res) => {
        this.storeSession(res.token, res.usuario);
      }),
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  // --- Logout ---
  logout(): void {
    localStorage.removeItem('tf_token');
    localStorage.removeItem('tf_user');
    this._token.set(null);
    this._usuario.set(null);
    this.router.navigate(['/auth/login']);
  }

  // --- Helpers de almacenamiento ---
  getToken(): string | null {
    return this._token();
  }

  private storeSession(token: string, usuario: Usuario): void {
    localStorage.setItem('tf_token', token);
    localStorage.setItem('tf_user', JSON.stringify(usuario));
    this._token.set(token);
    this._usuario.set(usuario);
  }

  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('tf_token');
  }

  private getStoredUser(): Usuario | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('tf_user');
    return raw ? JSON.parse(raw) : null;
  }

  // --- Manejo de errores ---
  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Ha ocurrido un error inesperado.';

    if (error.error) {
      const body = error.error as AuthErrorResponse;

      // Errores de validación Zod (400)
      if (body.errores && body.errores.length > 0) {
        message = body.errores.map((e) => `${e.campo}: ${e.mensaje}`).join('\n');
      }
      // Errores del backend con "mensaje" (409, 401)
      else if (body.mensaje) {
        message = body.mensaje;
      }
      // Errores del backend con "message"
      else if (body.mensaje) {
        message = body.mensaje;
      }
    }

    return throwError(() => message);
  }
}
