import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { inject, Inject, Injectable } from '@angular/core';
import { catchError, Observable, pipe, tap, throwError } from 'rxjs';

export interface getTasksResponse {
  id: string;
  titulo: string;
  descripcion: string | null;
  estado: 'Pendiente' | 'enProgreso' | 'Terminado';
  proyectoId: string;
  creadorId: number;
  asignadorId: number | null;
  fechaTerminada: string | null;
}

export interface TaskErrorResponse {
  ok?: boolean;
  mensaje?: string;
  errores?: { campo: string; mensaje: string }[];
}

export interface getTasksByProjectIdResponse {
  mensaje: string;
  tarea: getTasksResponse[];
}

export interface getHorasRegistradas {
  mensaje: string;
  horas: number;
}

export interface getTareasCompletadas {
  mensaje: string;
  tareas: number;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private http = inject(HttpClient);

  private readonly API_URL = 'http://localhost:3000/api/tasks';

  getTasksByProject(idProject: string) {

    console.log('id en service', idProject);


    return this.http.get<getTasksByProjectIdResponse>(
      `${this.API_URL}/getTareas?idProyecto=${idProject}`,
      { headers: this.getTokenLS() })
      .pipe(
        catchError((err: HttpErrorResponse) => this.handleError(err))
      )
  }

  horasTrabajadas: number = 0;

  getHorasTrabajadas() {
    return this.http.get<getHorasRegistradas>(
      `${this.API_URL}/getHorasRegistradas`,
      { headers: this.getTokenLS() })
      .pipe(
        catchError((err: HttpErrorResponse) => this.handleError(err))
      )
  }

  tareasCompletadas: number = 0;

  getTareasCompletadas() {
    return this.http.get<getTareasCompletadas>(
      `${this.API_URL}/getTareas`,
      { headers: this.getTokenLS() })
      .pipe(
        catchError((err: HttpErrorResponse) => this.handleError(err))
      )
  }

  // createTarea(payload: createTareaPayload) {
  //   return this.http.post<createTareaResponse>(
  //     `${this.API_URL}/crearTarea`,
  //     payload,
  //     { headers: this.getTokenLS() })
  //     .pipe(
  //       catchError((err: HttpErrorResponse) => this.handleError(err))
  //     )
  // }

  private getTokenLS() {
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

  private handleError(error: HttpErrorResponse): Observable<never> {
    let message = 'Ha ocurrido un error inesperado.';

    if (error.error) {
      const body = error.error as TaskErrorResponse;

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

  constructor() { }
}
