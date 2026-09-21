import { Component, inject, input, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../../core/services/tasks.service';
import { DatePipe } from '@angular/common';

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface TaskDetail {
  titulo: string;
  descripcion?: string | null;
  estado: string;
  proyectoId: string;
  creadorId: number;
  horasEstimadas: number;
  prioridad: string;
  fechaTerminada: Date;
  asignadorId: number;
  clase: string;
  color: string;
  asignado: string;
  creador: string;
}

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './task-detail.component.html',
  styles: ``
})


export class TaskDetailComponent implements OnInit {

  // Recibe el taskId desde la URL automáticamente (withComponentInputBinding)
  taskId = input.required<string>();

  // Señal con los datos de la tarea
  // task = signal<TaskDetail>({
  //   titulo: 'Prueba 1',
  //   descripcion: 'Implementar la autenticación y el hilo de comentarios detallado para la tarea en el frontend.',
  //   estado: 'EN PROGRESO',
  //   proyectoId: 'proj-123',
  //   creadorId: 1,
  //   horasEstimadas: 8,
  //   prioridad: 'ALTA',
  //   fechaTerminada: new Date(),
  //   asignadorId: 2,
  //   clase: 'programacion',
  //   color: '#3B82F6'
  // });

  task = signal<TaskDetail | null>(null);

  // Lista de Comentarios
  comments = signal<Comment[]>([
    {
      id: 'c1',
      author: 'María González',
      text: 'Recuerda revisar la validación de DTOs en el backend antes de subir a staging.',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'c2',
      author: 'Carlos Pérez',
      text: '¡Entendido! Ya tengo los Middlewares de Zod listos.',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ]);

  // Texto del nuevo comentario
  newCommentText = signal<string>('');

  onCommentInput(event: Event) {
    const input = event.target as HTMLTextAreaElement;
    this.newCommentText.set(input.value);
  }

  addComment() {
    const text = this.newCommentText().trim();
    if (!text) return;

    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: 'Usuario Actual', // Puede venir de tu AuthService
      text,
      createdAt: new Date().toISOString()
    };

    // Actualiza el hilo reactivamente usando Signals
    this.comments.update(list => [newComment, ...list]);
    this.newCommentText.set('');
  }

  getInitials(name: string): string {
    if (!name) return 'TF';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  goBack() {
    window.history.back();
  }

  private route = inject(ActivatedRoute);
  private tasksService = inject(TasksService);

  usuarioId: string = '';
  projectId: string = '';
  taskById: string = '';

  ngOnInit(): void {

    this.route.params.subscribe((params) => {
      this.usuarioId = params['idUsuario'];
      this.projectId = params['idProject'];
      this.taskById = params['idTask'];

      console.log(this.usuarioId, this.projectId, this.taskById);

      return this.getTaskDetailById(this.projectId, this.taskById);



    });


  }

  getTaskDetailById(idProyecto: string, idTarea: string) {
    return this.tasksService.getTaskDetailById(idProyecto, idTarea)
      .subscribe((response) => {
        console.log(response);
        this.task.set(response.tarea);
      });
  }

}
