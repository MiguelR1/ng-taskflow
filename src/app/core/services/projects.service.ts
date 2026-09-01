import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

export interface ActualizarProyectoPayload {
  id: string;
  nombre: string;
  descripcion: string | null;
  duenoId: number;
  fechaCreado: string;
  totalTareas: number;
  categoria: string;
  color: string;
  icono: string;
}

export interface CrearProyectoPayload {
  nombre: string;
  descripcion: string | null;
  duenoId: number;
  categoria: string;
  color: string;
  icono: string;
}

export interface newProjectResponse {
  mensaje: string;
  proyecto: ActualizarProyectoPayload;
}

export interface ProjectErrorResponse {
  ok?: boolean;
  mensaje?: string;
  errores?: { campo: string; mensaje: string }[];
}

//Respuesta getProyectos
// { proyecto: [...], mensaje: 'Proyectos obtenidos correctamente.' }
export interface getProjectsResponse {
  mensaje: string;
  proyecto: ActualizarProyectoPayload[];
}


@Injectable({ providedIn: 'root' })

export class ProjectsService {

  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:3000/api/projects';

  getProjectsByUsuario(): Observable<getProjectsResponse> {
    return this.http.get<getProjectsResponse>(
      `${this.API_URL}/getProyectosByUsuario`,
      { headers: this.getTokenLS() }).pipe(
        catchError((err: HttpErrorResponse) => this.handleError(err))
      );
  }

  createProject(payload: CrearProyectoPayload): Observable<newProjectResponse> {
    return this.http.post<newProjectResponse>(`${this.API_URL}/createProject`, payload, { headers: this.getTokenLS() }).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  getProjectById(id: String) {
    return this.http.get<ActualizarProyectoPayload>(`${this.API_URL}/getProyectoById/${id}`, { headers: this.getTokenLS() }).pipe(
      catchError((err: HttpErrorResponse) => this.handleError(err))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Ha ocurrido un error inesperado.';

    if (error.error) {
      const body = error.error as ProjectErrorResponse;

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

  getTokenLS() {
    const token = localStorage.getItem('tf_token');

    if (!token) {
      throw new Error('No hay token');
    } else {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return headers;
    }
  }

  constructor() { }
}
