import { Routes } from '@angular/router';
import { ListaEmpleadosComponent } from './components/lista-empleados/lista-empleados.component';
import { FormEmpleadoComponent } from './components/form-empleado/form-empleado.component';

export const routes: Routes = [
    { path: '', redirectTo: 'empleado/list', pathMatch: 'full' },
    { path: 'empleado/list', component: ListaEmpleadosComponent },
    { path: 'empleado/create', component: FormEmpleadoComponent },
    { path: 'empleado/edit/:id', component: FormEmpleadoComponent },
    { path: '**', redirectTo: 'empleado/list' }
];
