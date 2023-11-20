import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Empleado } from '@/interfaces/empleado.interface';
import { EmpleadoService } from '@/services/empleado/empleado-service.service';
import { SwalService } from '@/services/swal/swal-service.service';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-lista-empleados',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatGridListModule,
  ],
  templateUrl: './lista-empleados.component.html',
  styleUrl: './lista-empleados.component.scss',
})
export class ListaEmpleadosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'jobTitle', 'department'];
  dataSource!: MatTableDataSource<Empleado>;
  empleados!: Empleado[] | null;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private empleadoService: EmpleadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private swalService: SwalService
  ) {}

  ngOnInit() {
    this.empleadoService.getEmpleados().subscribe({
      next: (empleados) => {
        this.empleados = empleados;
        this.dataSource = new MatTableDataSource(this.empleados);
        this.dataSource.sort = this.sort;
        this.activatedRoute.queryParams.subscribe((params) => {
          this.swalService.validarMensaje(
            params['mensaje'],
            params['empleado']
          );
        });
      },
      error: (error) => {
        this.empleados = [];
        this.dataSource = new MatTableDataSource(this.empleados);
        this.dataSource.sort = this.sort;
        this.swalService.mostrarMensaje('error', '');
        console.error(error);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  agregarEmpleado() {
    this.router.navigate(['empleado', 'create']);
  }

  onRowClick(row: Empleado) {
    this.router.navigate(['empleado/edit', row['id']]);
  }
}
