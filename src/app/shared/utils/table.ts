import { PageParams } from '@core/interfaces';
import { TableLazyLoadEvent } from 'primeng/table';

/**
 * Formatear los parámetros de la tabla para la API
 * @param event Evento de la tabla
 * @returns Parámetros formateados
 */
export const formatPageParams = <T>(event?: TableLazyLoadEvent): PageParams<T> => {
  const page = event ? (event.first || 0) / (event.rows || 10) + 1 : 1;
  const limit = event?.rows || 10;
  return {
    page,
    limit,
    search: '',
    sort: 'id',
    order: 'desc',
    params: null as T,
  };
};
