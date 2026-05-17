import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { AlertService } from '../../core/services/alert';

@Component({
  selector: 'app-alert-container',
  imports: [CommonModule, MatIconModule],
  templateUrl: './alert-container.html',
  styleUrl: './alert-container.css',
})
export class AlertContainer {
  alertService = inject(AlertService);

  getIcon(type: string) {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning'
      default:
        return 'info';
    }
  }
}
