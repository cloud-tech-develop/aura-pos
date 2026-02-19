import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Cliente {
  id: number;
  nombre: string;
  status: string;
  telefono: string;
  pais: string;
  correo: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  readonly pageTitle = 'Todos los clientes';
  readonly breadcrumb = 'Dashboards - Lista de Clientes';
  readonly agenteSeleccionado = '';
  readonly totalTabla = 'Total tabla';
  readonly statusFiltro = 'Filtrar Status';
  readonly mostrando = 'Showing 1-5 of 0';
  
  readonly clientes: Cliente[] = []; // Tabla vacía inicialmente
  
  readonly columnas = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'NOMBRE' },
    { key: 'status', label: 'STATUS' },
    { key: 'telefono', label: 'TELEFONO' },
    { key: 'pais', label: 'PAIS' },
    { key: 'correo', label: 'CORREO' }
  ];
}
