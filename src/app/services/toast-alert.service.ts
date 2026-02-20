import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

const config = {
  timeOut: 5000,
  positionClass: 'toast-top-right',
};

@Injectable({
  providedIn: 'root',
})
export class ToastAlertService {
  #toastServ = inject(ToastrService);

  success(message: string, title: string = 'Ok', time: number = 5000): void {
    this.#toastServ.success(message, title, {
      timeOut: time,
      positionClass: config.positionClass,
    });
  }

  error(message: string, title: string = 'Error!', time: number = 7000): void {
    this.#toastServ.error(message, title, {
      timeOut: time,
      positionClass: config.positionClass,
    });
  }

  info(message: string, title: string = 'Alerta!', time: number = 5000) {
    this.#toastServ.info(message, title, {
      timeOut: time,
      positionClass: config.positionClass,
    });
  }

  warning(message: string, title: string = 'Atención!', time: number = 5000) {
    this.#toastServ.warning(message, title, {
      timeOut: time,
      positionClass: config.positionClass,
    });
  }
}
