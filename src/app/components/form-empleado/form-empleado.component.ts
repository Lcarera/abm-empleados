import { Component, OnInit } from '@angular/core';

import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Empleado } from '@/interfaces/empleado.interface';
import { EmpleadoService } from '@/services/empleado/empleado-service.service';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { SwalService } from '@/services/swal/swal-service.service';

@Component({
  selector: 'app-form-empleado',
  templateUrl: './form-empleado.component.html',
  styleUrls: ['./form-empleado.component.scss'],
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule,
    RouterLink,
  ],
})
export class FormEmpleadoComponent implements OnInit {
  id: number = -1;
  empleadoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private empleadoService: EmpleadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private swalService: SwalService
  ) {
    this.empleadoForm = this.fb.group({
      name: ['', Validators.required],
      jobTitle: ['', Validators.required],
      department: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        if (params['id'] !== null && params['id'] !== undefined) {
          this.id = params['id'];
          this.empleadoService.getEmpleado(this.id).subscribe({
            next: (empleado) => {
              this.setFormValues(empleado);
            },
            error: (error) => {
              console.error(error);
            },
          });
        }
      },
      error: (error) => {
        this.navigateToEmpleados(this.getNuevoEmpleado(), 'error');
        console.error(error);
      },
    });
  }

  onSubmit(): void {
    if (this.empleadoForm.invalid) {
      return;
    }

    const nuevoEmpleado: Empleado = this.getNuevoEmpleado();
    if (this.id === -1) {
      this.empleadoService.addEmpleado(nuevoEmpleado).subscribe({
        next: (empleado) => {
          this.navigateToEmpleados(empleado, 'create');
        },
        error: (error) => {
          this.navigateToEmpleados(this.getNuevoEmpleado(), 'error');
          console.error(error);
        },
      });
    } else {
      this.empleadoService.updateEmpleado(nuevoEmpleado).subscribe({
        next: (empleado) => {
          this.navigateToEmpleados(empleado, 'update');
        },
        error: (error) => {
          this.navigateToEmpleados(this.getNuevoEmpleado(), 'error');
          console.error(error);
        },
      });
    }
  }

  setFormValues(empleado: Empleado) {
    this.empleadoForm.controls['name'].setValue(empleado.name);
    this.empleadoForm.controls['jobTitle'].setValue(empleado.jobTitle);
    this.empleadoForm.controls['department'].setValue(empleado.department);
  }

  getNuevoEmpleado(): Empleado {
    return {
      id: this.id,
      name: this.empleadoForm.value.name || '',
      jobTitle: this.empleadoForm.value.jobTitle || '',
      department: this.empleadoForm.value.department || '',
    };
  }

  navigateToEmpleados(empleado: Empleado, mensaje: string) {
    this.router.navigate(['/lista-empleados'], {
      queryParams: { empleado: empleado.name, mensaje: mensaje },
    });
  }

  deleteEmpleado() {
    this.swalService.swalDelete().then((result) => {
      if (result.isConfirmed) {
        this.empleadoService.deleteEmpleado(this.id).subscribe({
          next: () => {
            this.navigateToEmpleados(this.getNuevoEmpleado(), 'delete');
          },
          error: (error) => {
            this.navigateToEmpleados(this.getNuevoEmpleado(), 'error');
            console.error(error);
          },
        });
      }
    });
  }
}
