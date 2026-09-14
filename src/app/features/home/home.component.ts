import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
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
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
