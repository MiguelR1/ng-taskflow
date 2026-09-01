import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // 1. Redirección inicial de la raíz (/) hacia /auth/login
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  // 2. Grupo de rutas de Autenticación
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        title: 'TaskFlow - Login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(
            (m) => m.LoginComponent
          ),
      },
      {
        path: 'register',
        title: 'TaskFlow - Registro',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(
            (m) => m.RegisterComponent
          ),
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },

  // 3. Ruta Home (Dashboard de Proyectos)
  {
    path: 'home',
    title: 'TaskFlow - Dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },

  // 4. Ruta Tasks (Tablero de Tareas)
  {
    path: 'tasks/:idProject',
    title: 'TaskFlow - Tablero de Tareas',
    loadComponent: () =>
      import('./features/tasks/tasks.component').then(
        (m) => m.TasksComponent
      ),
  },

  // 5. Comodín global
  {
    path: '**',
    redirectTo: 'home',
  },
];
