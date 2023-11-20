import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

type TipoMensaje = 'create' | 'update' | 'delete' | 'error';

@Injectable({
  providedIn: 'root'
})
export class SwalService {
  constructor() { }

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

  swalDelete():Promise<SweetAlertResult<any>> {
    return Swal.fire({
      title: '¿Estas seguro?',
      text: "Se eliminara el empleado",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#2091a2',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      return result
    })
  }
}
