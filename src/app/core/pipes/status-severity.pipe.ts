import { Pipe, PipeTransform } from '@angular/core';
import { StatusCommon } from '@core/interfaces';

type Severity = 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined;
const MAP_SEVERITY: Record<StatusCommon, Severity> = {
  ACTIVE: 'success',
  INACTIVE: 'warn',
  DISCONTINUED: 'danger',
  PENDING: 'warn',
  CANCELLED: 'danger',
  DRAFT: 'warn',
  COMPLETED: 'success',
  PAID: 'success',
  UNPAID: 'danger',
  PARTIALLY_PAID: 'warn',
  RETURNED: 'danger',
  PARTIALLY_RETURNED: 'warn',
  CLOSED: 'success',
  OPEN: 'warn',
  VOIDED: 'danger',
  EXPIRED: 'danger',
  REJECTED: 'danger',
  APPROVED: 'success',
};

@Pipe({
  name: 'statusSeverity',
  standalone: true,
})
export class StatusSeverityPipe implements PipeTransform {
  transform(status: StatusCommon): Severity {
    return MAP_SEVERITY[status] ?? 'secondary';
  }
}
