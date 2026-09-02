import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActualizarProyectoPayload, CrearProyectoPayload, getProjectsResponse, ProjectsService } from '../../core/services/projects.service';
import { HttpClient } from '@angular/common/http';
import { ColorOption, ICON_OPTIONS } from '../../core/constantes/project-customization';
import { TasksService } from '../../core/services/tasks.service';


export interface Usuario {
  nombre: string | null;
  id: number;
  email: string;
  cedula: string;
  password: string | null;
  rol: Roles;
}

export type Roles = "User" | "Admin";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  async ngOnInit() {
    await this.getInfoUser();
    await this.getTareas_horas();
    await this.getProyectos();
  }

  navigateToTasks(projectId: string): void {
    this.router.navigate(['tasks/' + projectId]);
  }

  private fb = inject(FormBuilder);
  private projectService = inject(ProjectsService);
  private tasksService = inject(TasksService);

  // Variable para controlar la visibilidad del Modal
  isModalOpen = false;

  // Formulario reactivo configurado con tus campos
  projectForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    categoria: ['', [Validators.required]],
    color: ['blue', [Validators.required]],
    icono: ['folder', [Validators.required]]
  });

  // Funciones para abrir y cerrar
  openModal(): void {
    this.isModalOpen = true;
    this.projectForm.reset();
    this.projectForm.patchValue({
      color: 'blue',
      icono: 'folder'
    })
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.projectForm.reset();
  }

  // Envío del formulario
  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }


    console.log('formmm project', this.projectForm);

    const rawForm = this.projectForm.getRawValue();

    const payload: CrearProyectoPayload = {
      nombre: rawForm.nombre,
      descripcion: rawForm.descripcion || null,
      duenoId: this.userInfo!.id,
      categoria: rawForm.categoria,
      color: this.projectForm.get('color')!.value,
      icono: this.projectForm.get('icono')!.value
    };

    console.log('formulario proyecto', payload);


    this.projectService.createProject(payload).subscribe({
      next: (res) => {
        this.closeModal();

        this.getProyectos();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  async getInfoUser() {
    const lsUser = localStorage.getItem('tf_user');
    const lsToken = localStorage.getItem('tf_token');

    if (lsUser && lsToken) {
      const user: Usuario = JSON.parse(lsUser);
      const token: string = JSON.stringify(lsToken);

      if (!user || !token) {
        this.router.navigate(['auth/login']);
      } else {
        this.userInfo = user;
        this.userToken = token;
      }
    } else {
      this.router.navigate(['auth/login']);
    }
  }

  userInfo: Usuario | undefined = undefined;
  userToken: string | undefined = undefined;

  async getProyectos() {

    if (this.projects.length > 0) {
      this.projects = [];
    }

    return this.projectService.getProjectsByUsuario().subscribe({
      next: (res: getProjectsResponse) => {
        const proyectoUrgente = res.proyecto.find(m => m.categoria == 'URGENTE');

        //Logica de proyecto principal grande
        if (proyectoUrgente) {
          this.proyectoPrincipalProyectado = proyectoUrgente
        } else {
          this.proyectoPrincipalProyectado = res.proyecto[0];
        }

        console.log('proyecto principal', this.proyectoPrincipalProyectado);


        const indexProyectoPrincipal = res.proyecto.findIndex(m => m.id == this.proyectoPrincipalProyectado?.id);

        //Eliminado de apartados comunes
        res.proyecto.splice(indexProyectoPrincipal, 1);

        this.projects = res.proyecto;
      },
      error: (err) => {
        console.log(err);
      }
    })

  }

  async getTareas_horas() {
    //Carga de horas
    this.tasksService.getHorasTrabajadas()
      .subscribe({
        next: (res) => {
          this.horasTrabajadas = res.horas;
        },
        error: (err) => {
          console.log(err);
        }
      });

    //Carga de tareas completadas
    return this.tasksService.getTareasCompletadas().subscribe({
      next: (res) => {
        this.tareasCompletadas = res.tareas;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  horasTrabajadas: number = 0;
  tareasCompletadas: number = 0;

  proyectoPrincipalProyectado: ActualizarProyectoPayload | null = null;

  projects: ActualizarProyectoPayload[] = [];



  isPickerOpen: boolean = false;

  colorOptions: ColorOption[] = [
    { id: 'blue', nombre: 'Azul', bgClass: 'bg-blue-100 dark:bg-blue-950', textClass: 'text-blue-600 dark:text-blue-400' },
    { id: 'emerald', nombre: 'Esmeralda', bgClass: 'bg-emerald-100 dark:bg-emerald-950', textClass: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'purple', nombre: 'Púrpura', bgClass: 'bg-purple-100 dark:bg-purple-950', textClass: 'text-purple-600 dark:text-purple-400' },
    { id: 'amber', nombre: 'Ámbar', bgClass: 'bg-amber-100 dark:bg-amber-950', textClass: 'text-amber-600 dark:text-amber-400' },
    { id: 'rose', nombre: 'Rosa', bgClass: 'bg-rose-100 dark:bg-rose-950', textClass: 'text-rose-600 dark:text-rose-400' }
  ];

  iconOptions = [
    { id: 'folder', label: 'Carpeta' },
    { id: 'rocket', label: 'Cohete' },
    { id: 'code', label: 'Código' },
    { id: 'bar_chart', label: 'Métricas' },
    { id: 'briefcase', label: 'Maletín' }
  ];

  getSelectedColor(): ColorOption {
    const selectedId = this.projectForm.get('color')?.value;
    return this.colorOptions.find(c => c.id === selectedId) || this.colorOptions[0];
  }

  getBgColorDashboard(color: string): ColorOption {
    const selectedId = color;
    return this.colorOptions.find(c => c.id === selectedId) || this.colorOptions[0];
  }

  get selectedColor() {
    console.log('seleccionada color');

    const colorId = this.projectForm.get('color')?.value;
    console.log('colorId', colorId);

    // Retorna el color coincidente o el primero como fallback por defecto
    return this.colorOptions.find(c => c.id === colorId) || this.colorOptions[0];
  }

  // Métodos auxiliares para la selección con cancelación de evento
  selectColor(colorId: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.projectForm.patchValue({ color: colorId });
  }

  selectIcon(iconId: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.projectForm.patchValue({ icono: iconId });
  }

  // Método de cierre corregido
  closePicker(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Forzar el cambio de estado de forma síncrona
    this.isPickerOpen = false;
  }

  togglePickerModal(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.isPickerOpen = !this.isPickerOpen;
  }

  //Para obtener el color seleccionado y ponerlo de fondo del icono en el modal
  get selectedColorBgClass(): string {
    const selectedColorId = this.projectForm.get('color')?.value;
    const matchedColor = this.colorOptions.find(c => c.id === selectedColorId);
    return matchedColor ? matchedColor.bgClass : 'bg-transparent';
  }
}
