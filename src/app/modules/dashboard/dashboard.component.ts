import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { Fluid } from 'primeng/fluid';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SpeedDialModule } from 'primeng/speeddial';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
// For dynamic progressbar demo

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
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [
    TableModule,
    ToastModule,
    SelectModule,
    CheckboxModule,
    ProgressBarModule,
    DatePickerModule,
    FormsModule,
    SpeedDialModule,
    CardModule,
    RadioButtonModule,
    ToggleSwitchModule,
    ButtonModule,
  ],
})
export class DashboardComponent {
  readonly pageTitle = 'Todos los clientes';
  readonly breadcrumb = 'Dashboards - Lista de Clientes';
  readonly agenteSeleccionado = '';
  readonly totalTabla = 'Total tabla';
  readonly statusFiltro = 'Filtrar Status';
  readonly mostrando = 'Showing 1-5 of 0';
  date1: Date | undefined;
  date2: Date | undefined;
  date3: Date | undefined;
  checked: boolean = false;

  readonly clientes: Cliente[] = []; // Tabla vacía inicialmente

  readonly columnas = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'NOMBRE' },
    { key: 'status', label: 'STATUS' },
    { key: 'telefono', label: 'TELEFONO' },
    { key: 'pais', label: 'PAIS' },
    { key: 'correo', label: 'CORREO' },
  ];

  products: any[] = [
    { code: '1', name: 'Product 1', category: 'Category 1', quantity: 10 },
    { code: '2', name: 'Product 2', category: 'Category 2', quantity: 20 },
    { code: '3', name: 'Product 3', category: 'Category 3', quantity: 30 },
    { code: '4', name: 'Product 4', category: 'Category 4', quantity: 40 },
    { code: '5', name: 'Product 5', category: 'Category 5', quantity: 50 },
    { code: '6', name: 'Product 6', category: 'Category 6', quantity: 60 },
    { code: '7', name: 'Product 7', category: 'Category 7', quantity: 70 },
    { code: '8', name: 'Product 8', category: 'Category 8', quantity: 80 },
    { code: '9', name: 'Product 9', category: 'Category 9', quantity: 90 },
    { code: '10', name: 'Product 10', category: 'Category 10', quantity: 100 },
  ];

  cities = [
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' },
  ];
  selectedCity: any;
  ingredient: any;
  messageService = {
    add: (message: any) => {
      console.log(message);
    },
  };

  items = [
    {
      icon: 'pi pi-pencil',
      command: () => {
        this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
      },
    },
    {
      icon: 'pi pi-refresh',
      command: () => {
        this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
      },
    },
    {
      icon: 'pi pi-trash',
      command: () => {
        this.messageService.add({ severity: 'error', summary: 'Delete', detail: 'Data Deleted' });
      },
    },
    {
      icon: 'pi pi-upload',
      routerLink: ['/fileupload'],
    },
    {
      icon: 'pi pi-external-link',
      target: '_blank',
      url: 'https://angular.dev',
    },
  ];
}
