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
    children: [
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/projects/projects.component').then(
            (m) => m.ProjectsComponent
          )
      },
      {
        path: '',
        redirectTo: 'projects',
        pathMatch: 'full',
      },
      {
        path: '**',
        redirectTo: 'projects',
        pathMatch: 'full',
      }
    ]
  },

  // 4. Ruta Tasks (Tablero de Tareas)
  {
    path: 'tasks/user/:idUsuario/project/:idProject',
    title: 'TaskFlow - Tablero de Tareas',
    loadComponent: () =>
      import('./features/tasks/tasks.component').then(
        (m) => m.TasksComponent
      ),
  },

  // 5. Ruta Task Detail (Modal sobre el tablero)
  {
    path: 'taskById/user/:idUsuario/project/:idProject/task/:idTask',
    title: 'TaskFlow - Detalles de Tarea',
    loadComponent: () =>
      import('./features/task-detail/task-detail.component').then(
        (m) => m.TaskDetailComponent
      ),
  },

  // 5. Comodín global
  {
    path: '**',
    redirectTo: 'home',
  },
];
