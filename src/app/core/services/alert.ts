import { Injectable, signal } from '@angular/core';

import { AppAlert, AlertType } from '../../interfaces/alert.interface';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  
  alerts = signal<AppAlert[]>([]);

  show(type: AlertType, title: string, message?: string) {
    const alert: AppAlert = {
      id: Date.now(),
      type,
      title,
      message
    };

    this.alerts.update((items) => [...items, alert]);

    setTimeout(() => {
      this.remove(alert.id);
    }, 4000);
  }

  success(title: string, message?: string) {
    this.show('success', title, message);
  }

  error(title: string, message?: string) {
    this.show('error', title, message);
  } 


  warning(title: string, message?: string) {
    this.show('warning', title, message)
  }

  info(title: string, message?: string) {
    this.show('info', title, message)
  }

  remove(id: number) {
    this.alerts.update((items) => items.filter((alert) => alert.id !== id))
  }
}
