import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal, { SweetAlertIcon } from 'sweetalert2';

import { Empleado } from '@/interfaces/empleado.interface';
import { EmpleadoService } from '@/services/empleado-service.service';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';

type TipoMensaje = 'create' | 'update' | 'delete' | 'error';

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
  providers: [EmpleadoService],
})
export class ListaEmpleadosComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'jobTitle', 'department'];
  dataSource!: MatTableDataSource<Empleado>;
  empleados!: Empleado[];
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private empleadoService: EmpleadoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.empleadoService.getEmpleados().subscribe({
      next: (empleados) => {
        this.empleados = empleados;
        this.dataSource = new MatTableDataSource(this.empleados);
        this.dataSource.sort = this.sort;
        this.activatedRoute.queryParams.subscribe((params) => {
          this.validarMensaje(params['mensaje'], params['empleado']);
        });
      },
      error: (error) => {
        this.empleados = [];
        this.dataSource = new MatTableDataSource(this.empleados);
        this.dataSource.sort = this.sort;
        this.mostrarMensaje('error', '');
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

  mostrarMensaje(mensaje: TipoMensaje, empleado: String) {
    const messageConfig: { [key in TipoMensaje]: { texto: string, icono: SweetAlertIcon, titulo: string } } = {
      'create': { texto: `Empleado ${empleado} creado correctamente`, icono: 'success', titulo: 'Exito!' },
      'update': { texto: `Empleado ${empleado} actualizado correctamente`, icono: 'success', titulo: 'Exito!' },
      'delete': { texto: `Empleado ${empleado} eliminado correctamente`, icono: 'success', titulo: 'Exito!' },
      'error': { texto: 'Error al realizar la operación', icono: 'error', titulo: 'Error!' },
    };

    const { texto, icono, titulo } = messageConfig[mensaje];

    Swal.fire({
      title: titulo,
      text: texto,
      icon: icono,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  validarMensaje(mensaje: TipoMensaje, empleado:String) {
    const validMessages: TipoMensaje[] = ['create', 'update', 'delete', 'error'];
    if (validMessages.includes(mensaje)) {
      const tipoMensaje: TipoMensaje = mensaje;
      this.mostrarMensaje(tipoMensaje, empleado);
      history.replaceState(null, '', window.location.pathname);
    }
  }

  onRowClick(row:Empleado) {
    this.router.navigate(['empleado/edit', row['id']]);
  }
}
