import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

const config = {
  timeOut: 5000,
  positionClass: 'toast-top-right',
};

@Injectable({
  providedIn: 'root',
})
export class ToastAlertService {
  #toastServ = inject(ToastrService);
  #i18n = inject(TranslateService);

  success(message: string, titleKey: string = 'TOAST.SUCCESS', time: number = 5000): void {
    const title = this.#i18n.instant(titleKey);
    this.#toastServ.success(message, title, {
      timeOut: time,
      positionClass: config.positionClass,
    });
  }

  error(message: string, titleKey: string = 'TOAST.ERROR', time: number = 7000): void {
    const title = this.#i18n.instant(titleKey);
    this.#toastServ.error(message, title, {
      timeOut: time,
      positionClass: config.positionClass,
    });
  }

  info(message: string, titleKey: string = 'TOAST.INFO', time: number = 5000): void {
    const title = this.#i18n.instant(titleKey);
    this.#toastServ.info(message, title, {
      timeOut: time,
      positionClass: config.positionClass,
    });
  }

  warning(message: string, titleKey: string = 'TOAST.WARNING', time: number = 5000): void {
    const title = this.#i18n.instant(titleKey);
    this.#toastServ.warning(message, title, {
      timeOut: time,
      positionClass: config.positionClass,
    });
  }
}
