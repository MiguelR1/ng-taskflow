import { Component, inject, input, signal } from '@angular/core';

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface TaskDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  assignee: {
    name: string;
    email: string;
  };
}

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [],
  templateUrl: './task-detail.component.html',
  styles: ``
})


export class TaskDetailComponent {

  // Recibe el taskId desde la URL automáticamente (withComponentInputBinding)
  taskId = input.required<string>();

  // Señal con los datos de la tarea
  task = signal<TaskDetail>({
    id: '1',
    title: 'Prueba 1',
    description: 'Implementar la autenticación y el hilo de comentarios detallado para la tarea en el frontend.',
    category: 'Programacion',
    status: 'EN PROGRESO',
    createdAt: new Date().toISOString(),
    assignee: {
      name: 'Carlos Pérez',
      email: 'carlos@taskflow.dev'
    }
  });

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

}
