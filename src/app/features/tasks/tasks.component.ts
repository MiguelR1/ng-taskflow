import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { TasksService } from '../../core/services/tasks.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  badge: string;
  badgeClass: string;
  date?: string;
  commentsCount?: number;
  progress?: number;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {

  private taskService = inject(TasksService);

  route = inject(ActivatedRoute);

  projectId: string = '';

  ngOnInit() {
    this.getId();
  }

  getId() {
    return this.route.params.subscribe((params) => {
      this.projectId = params['idProject'];

      this.getTaskById(this.projectId);
    });
  }

  getTaskById(id: string) {
    this.taskService.getTasksByProject(id).subscribe({
      next: (res) => {
        // this.tasks = res.tarea;
        console.log('taskss', res);

      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  private router = inject(Router);

  tasks: Task[] = [
    {
      id: '1',
      title: 'Diseñar flujo de onboarding',
      description: 'Crear wireframes de alta fidelidad para el nuevo proceso de registro de usuarios.',
      status: 'todo',
      badge: 'Urgente',
      badgeClass: 'bg-error-container text-on-error-container',
      date: 'Oct 24'
    },
    {
      id: '2',
      title: 'Implementar API de autenticación',
      description: 'Conectar frontend con el servicio JWT del backend.',
      status: 'in_progress',
      badge: 'Desarrollo',
      badgeClass: 'bg-surface-variant text-on-background',
      progress: 60,
      commentsCount: 3
    },
    {
      id: '3',
      title: 'Configurar entorno de QA',
      description: 'Desplegar versión beta en el servidor de pruebas.',
      status: 'done',
      badge: 'Completado',
      badgeClass: 'bg-on-tertiary-container text-tertiary'
    }
  ];

  get todoTasks() {
    return this.tasks.filter(t => t.status === 'todo');
  }

  get inProgressTasks() {
    return this.tasks.filter(t => t.status === 'in_progress');
  }

  get doneTasks() {
    return this.tasks.filter(t => t.status === 'done');
  }

  // modal de creación

  private fb = inject(FormBuilder);

  // Formulario de creación
  taskForm = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: ['' as string | null],
    estado: ['POR_HACER' as 'POR_HACER' | 'EN_PROCESO' | 'HECHO', [Validators.required]],
    prioridad: ['MEDIA' as 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE', [Validators.required]],
    fechaEntrega: ['' as string | null, [Validators.required]],
    responsableId: [null as number | null, [Validators.required]]
  });

  usuarios = [
    {
      id: 1,
      nombre: 'Equipo A'
    },
    {
      id: 2,
      nombre: 'Equipo B'
    },
    {
      id: 3,
      nombre: 'Equipo C'
    }
  ];

  modalCreacionTarea = false;

  addTask() {
    console.log('tarea', this.taskForm.value);


  }

  accModalTarea(acc: Boolean) {
    console.log('modall');

    if (acc) {
      this.modalCreacionTarea = true;
    }
    else {
      this.modalCreacionTarea = false;
    }
  }

  moveTask(task: Task, newStatus: 'todo' | 'in_progress' | 'done') {
    task.status = newStatus;
  }
}
