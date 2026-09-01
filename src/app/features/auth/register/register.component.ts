import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterPayload } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  showPassword = false;
  loading = false;
  errorMessage: string | null = null;

  registerForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    cedula: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rol: ['User' as 'User' | 'Admin', [Validators.required]],
  });

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  isInvalid(control: string): boolean {
    const c = this.registerForm.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const formValues = this.registerForm.getRawValue();

    const payload: RegisterPayload = {
      nombre: formValues.nombre,
      cedula: formValues.cedula,
      email: formValues.email,
      password: formValues.password,
      rol: formValues.rol,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (msg: string) => {
        this.errorMessage = msg;
        this.loading = false;
      }
    });
  }
}
