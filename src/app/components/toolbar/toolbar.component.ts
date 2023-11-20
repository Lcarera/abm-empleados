import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

type ItemMenu = {
  name: string;
  href: string;
};
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterLink, 
    RouterLinkActive
  ],
})
export class ToolbarComponent {

  constructor() {}
  menuItems: ItemMenu[] = [
    { name: 'Lista Empleados', href: '/empleado/list'},
    { name: 'Agregar Empleado', href: '/empleado/create'},
  ];
  
  isCurrentUrl(href: string): boolean {
    return window.location.href.includes(href);
  }
}
