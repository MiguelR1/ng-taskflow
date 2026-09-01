import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthResponse, AuthService, LoginPayload } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  showPassword = false;
  loading = false;
  errorMessage: string | null = null;

  // Por defecto se logea con email, pero puede alternar a cédula
  loginMode: 'email' | 'cedula' = 'email';

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    cedula: [''],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  switchMode(mode: 'email' | 'cedula'): void {
    this.loginMode = mode;
    this.errorMessage = null;

    if (mode === 'email') {
      this.loginForm.get('email')!.setValidators([Validators.required, Validators.email]);
      this.loginForm.get('cedula')!.clearValidators();
      this.loginForm.get('cedula')!.setValue('');
    } else {
      this.loginForm.get('cedula')!.setValidators([Validators.required, Validators.minLength(5)]);
      this.loginForm.get('email')!.clearValidators();
      this.loginForm.get('email')!.setValue('');
    }

    this.loginForm.get('email')!.updateValueAndValidity();
    this.loginForm.get('cedula')!.updateValueAndValidity();
  }

  isInvalid(control: string): boolean {
    const c = this.loginForm.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValues = this.loginForm.getRawValue();

    const payload: LoginPayload = {
      password: formValues.password,
    };

    if (this.loginMode === 'email') {
      payload.email = formValues.email;
    } else {
      payload.cedula = formValues.cedula;
    }

    this.authService.login(payload).subscribe({
      next: (res: AuthResponse) => {
        this.loading = false;

        console.log('localsto datos', localStorage);

        this.router.navigate(['home']);
      },
      error: (msg: string) => {
        this.errorMessage = msg;
        this.loading = false;
      }
    });
  }
}
