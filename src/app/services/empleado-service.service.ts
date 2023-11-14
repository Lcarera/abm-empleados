import { Injectable } from '@angular/core';
import { Empleado } from '../interfaces/empleado.interface';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class EmpleadoService {
  constructor(private http: HttpClient) {}
  private serverUrl = 'http://localhost:8080/api/employees'
  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.serverUrl).pipe(
      catchError(() => {
        const error = new Error('An error occurred while fetching the empleados.');
        console.error(error);
        return throwError(() => error);
      })
    );
  }
  
  deleteEmpleado(id: number):Observable<any> {
    return this.http.delete(this.serverUrl + '/' + id)
  }

  addEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.serverUrl, empleado);
  }

  getEmpleado(id: number): Observable<Empleado> {
    return this.http.get<Empleado>(this.serverUrl + '/' + id);
  }

  updateEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.put<Empleado>(this.serverUrl + '/' + empleado.id, empleado);
  }
}
