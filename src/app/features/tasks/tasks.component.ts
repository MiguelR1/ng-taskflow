import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { createTareaPayload, Estado, getTasksResponse, TasksService } from '../../core/services/tasks.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActualizarProyectoPayload, getProyectoById, ProjectsService } from '../../core/services/projects.service';


interface ColorOption {
  label: string;
  bgClass: string;
  textClass: string;
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {

  readonly colorOptions: ColorOption[] = [
    { label: 'Púrpura', bgClass: 'bg-primary-container', textClass: 'text-on-primary-container' },
    { label: 'Verde', bgClass: 'bg-tertiary-container', textClass: 'text-on-tertiary-container' },
    { label: 'Azul', bgClass: 'bg-indigo-100 dark:bg-indigo-950', textClass: 'text-indigo-900 dark:text-indigo-200' },
    { label: 'Rojo', bgClass: 'bg-error-container', textClass: 'text-on-error-container' },
    { label: 'Amarillo', bgClass: 'bg-amber-400', textClass: 'text-amber-950' }
  ];

  selectColor(colorOption: ColorOption): void {
    const combinedClass = `${colorOption.bgClass} ${colorOption.textClass}`;

    console.log('clase boton', combinedClass);


    this.taskForm.patchValue({ color: combinedClass });
  }

  private taskService = inject(TasksService);
  private projectsService = inject(ProjectsService);

  route = inject(ActivatedRoute);

  projectId: string = '';
  usuarioId: number = 0;

  ngOnInit() {
    this.getId();
  }

  infoPrincipalCargada: boolean = false;

  getId() {
    this.route.params.subscribe((params) => {
      this.projectId = params['idProject'];
      this.usuarioId = params['idUsuario'];

      this.getProjectById(this.projectId);
    }
    );
  }

  formatearFecha(fecha: string | Date | null | undefined): string {
    // 1. Si no hay fecha o es nula, retornamos una cadena vacía
    if (!fecha) return '';

    const dateObj = new Date(fecha);

    // 2. Si la fecha no es válida (isNaN), retornamos vacío para evitar el crash
    if (isNaN(dateObj.getTime())) return '';

    // 3. Formateamos a dd/mm/yyyy
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      timeZone: 'UTC'
    });
  }



  getTaskById(id: string) {

    this.infoPrincipalCargada = false;

    this.taskService.getTasksByProject(id).subscribe({
      next: (res) => {
        this.tasks = res.tarea;

        this.tasks.map(m => {
          const fechaFormateada = this.formatearFecha(m.fechaTerminada);

          m.fechaTerminadaFormateada = fechaFormateada;
        });

        this.tasks.map(m => m.clase = 'Programacion');

        this.infoPrincipalCargada = true;
      },
      error: (err) => {
        console.log(err);
        this.infoPrincipalCargada = true;
      }
    })

  }

  getProjectById(id: string) {

    this.projectsService.getProjectById(id).subscribe({
      next: (res) => {
        this.proyectoSeleccionado = res;

        console.log('proyecto', this.proyectoSeleccionado);

        this.getTaskById(this.projectId);
      }
    })
  }

  proyectoSeleccionado!: getProyectoById;

  private router = inject(Router);

  tasks: getTasksResponse[] = [];

  tasksEjemplo: getTasksResponse[] = [
    {
      id: '1',
      titulo: 'Diseñar flujo de onboarding',
      descripcion: 'Crear wireframes de alta fidelidad para el nuevo proceso de registro de usuarios.',
      estado: 'Pendiente',
      clase: 'Urgente',
      color: 'bg-error-container text-on-error-container',
      fechaTerminada: new Date('20-02-2003'),

      proyectoId: '1',
      creadorId: 1,
      asignadorId: 1,
      horasEstimadas: 10,
      fechaCreada: new Date('20-02-2003')
    },
    {
      id: '2',
      titulo: 'Implementar API de autenticación',
      descripcion: 'Conectar frontend con el servicio JWT del backend.',
      estado: 'enProgreso',
      clase: 'Desarrollo',
      color: 'bg-surface-variant text-on-background',

      fechaTerminada: new Date('20-02-2003'),

      proyectoId: '1',
      creadorId: 1,
      asignadorId: 1,
      horasEstimadas: 10,
      fechaCreada: new Date('20-02-2003')
    },
    {
      id: '3',
      titulo: 'Configurar entorno de QA',
      descripcion: 'Desplegar versión beta en el servidor de pruebas.',
      estado: 'Terminado',
      clase: 'Completado',
      color: 'bg-on-tertiary-container text-tertiary',
      fechaTerminada: new Date('20-02-2003'),

      proyectoId: '1',
      creadorId: 1,
      asignadorId: 1,
      horasEstimadas: 10,
      fechaCreada: new Date('20-02-2003')
    }
  ];

  get todoTasks() {
    return this.tasks.filter(t => t.estado === 'Pendiente');
  }

  get inProgressTasks() {
    return this.tasks.filter(t => t.estado === 'enProgreso');
  }

  get doneTasks() {
    return this.tasks.filter(t => t.estado === 'Terminado');
  }

  // modal de creación

  private fb = inject(FormBuilder);

  // Formulario de creación
  taskForm = this.fb.nonNullable.group({
    titulo: ['tttt', [Validators.required, Validators.minLength(3)]],
    descripcion: ['ddd' as string | null],
    estado: ['Pendiente' as 'Pendiente' | 'enProgreso' | 'Terminado', [Validators.required]],
    prioridad: ['MEDIA' as 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE', [Validators.required]],
    fechaEntrega: ['2003-02-20' as string | null, [Validators.required]],
    responsableId: [2 as number | null, [Validators.required]],
    horasEstimadas: [10 as number | null, [Validators.required]],
    clase: ['Programacion' as string, Validators.required],
    color: ['bg-primary-container text-on-primary-container' as string, Validators.required]
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

  toastTareaCreada = false;

  addTask() {

    let formularioTarea: createTareaPayload = {
      titulo: this.taskForm.value.titulo!,//
      descripcion: this.taskForm.value.descripcion,//
      estado: this.taskForm.value.estado!,//
      prioridad: this.taskForm.value.prioridad!,//
      fechaTerminada: new Date(this.taskForm.value.fechaEntrega!),
      asignadorId: Number(this.taskForm.value.responsableId!),//
      proyectoId: this.projectId,//
      horasEstimadas: this.taskForm.value.horasEstimadas!,
      creadorId: this.usuarioId,
      clase: this.taskForm.value.clase!,
      color: this.taskForm.value.color!
    }

    console.log('payload', formularioTarea);

    this.taskService.createTarea(formularioTarea).subscribe({
      next: (res) => {
        console.log('res', res);

        //Recargar tareas
        this.getTaskById(this.projectId);

        this.taskForm.reset();

        //Configuracion de toast
        this.toastTareaCreada = true;

        this.toast.show = true;
        this.toast.mensaje = 'Tarea creada correctamente';
        this.toast.titulo = 'Tarea creada';
        this.toast.clase = 'bg-success text-white';

        //Cierre modal
        this.modalCreacionTarea = false;
      },
      error: (err) => {
        console.log(err);

        //Configuracion de toast
        this.toast.show = true;
        this.toast.mensaje = 'Error al crear tarea';
        this.toast.titulo = 'Error';
        this.toast.clase = 'bg-error text-white';
      }
    })

    //Ocultar toast
    setTimeout(() => {
      this.toastTareaCreada = false;
    }, 2000);
  }

  editTaskStatus(idTarea: string, estado: Estado) {

    const payload = {
      idUsuario: this.usuarioId,
      idProyecto: this.projectId,
      idTarea: idTarea,
      estado: estado
    }

    this.taskService.editStatusTarea(payload).subscribe({
      next: (res => { console.log(res) }),
      error: (error => { console.error(error) })
    })
  }

  toast: {
    show: boolean,
    mensaje: string,
    titulo: string,
    clase: string
  } = {
      show: false,
      mensaje: '',
      titulo: '',
      clase: ''
    };

  accModalTarea(acc: Boolean) {
    console.log('modall');

    if (acc) {
      this.modalCreacionTarea = true;
    }
    else {
      this.modalCreacionTarea = false;
    }
  }

  moveTask(task: getTasksResponse, newStatus: 'Pendiente' | 'enProgreso' | 'Terminado') {
    const statusAnt = task.estado;

    if (newStatus === statusAnt) return;

    //Borrado de su lista
    if (statusAnt === 'Pendiente') {
      this.todoTasks.splice(this.todoTasks.indexOf(task), 1);


    }
    else if (statusAnt === 'enProgreso') {
      this.inProgressTasks.splice(this.inProgressTasks.indexOf(task), 1);
    }
    else if (statusAnt === 'Terminado') {
      this.doneTasks.splice(this.doneTasks.indexOf(task), 1);
    }

    task.estado = newStatus;

    //Agregado a la nueva lista
    console.log('tarea', task);

    switch (newStatus) {
      case 'Pendiente':
        this.todoTasks.push(task);
        break;

      case 'enProgreso':
        this.inProgressTasks.push(task);
        break;

      case 'Terminado':
        this.doneTasks.push(task);
        break;

      default:
        break;
    }

    //Llamar metodo BD
    this.editTaskStatus(task.id, newStatus);

  }
}
