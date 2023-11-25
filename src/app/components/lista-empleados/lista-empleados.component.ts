import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Empleado } from '@/interfaces/empleado.interface';
import { EmpleadoService } from '@/services/empleado/empleado-service.service';
import { SwalService } from '@/services/swal/swal-service.service';
import { ColumnData } from '@/interfaces/column-data.interfaces';
import { DataTableComponent } from '@/components/datatable/data-table.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    DataTableComponent,
  ],
  templateUrl: './lista-empleados.component.html',
  styleUrl: './lista-empleados.component.scss',
})
export class ListaEmpleadosComponent implements OnInit {
  empleados = signal<Empleado[]>([]);
  columns: ColumnData[] = [
    {
      matColumnDef: 'id',
      header: 'ID',
      field: 'id',
    },
    {
      matColumnDef: 'name',
      header: 'Nombre',
      field: 'name',
    },
    {
      matColumnDef: 'jobTitle',
      header: 'Puesto',
      field: 'jobTitle',
    },
    {
      matColumnDef: 'department',
      header: 'Departamento',
      field: 'department',
    },
  ];

  constructor(
    private empleadoService: EmpleadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private swalService: SwalService
  ) {}

  ngOnInit() {
    this.empleadoService.getEmpleados().subscribe({
      next: (empleados) => {
        this.empleados.set(empleados);
        this.activatedRoute.queryParams.subscribe((params) => {
          this.swalService.validarMensaje(
            params['mensaje'],
            params['empleado']
          );
        });
      },
      error: (error) => {
        this.empleados.set([]);
        this.swalService.mostrarMensaje('error', '');
        console.error(error);
      },
    });
  }

  agregarEmpleado() {
    this.router.navigate(['empleado', 'create']);
  }

  onRowClick(row: Empleado) {
    this.router.navigate(['empleado/edit', row['id']]);
  }
}
