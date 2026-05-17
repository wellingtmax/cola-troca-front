import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { AlertService } from '../../core/services/alert';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  email = '';
  password = '';
  loading =false;

  login() {
    this.loading = true;

    this.authService.login({
      email: this.email,
      password: this.password,
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.alertService.success('Login realizado!', response.message);
        this.router.navigate(['/loja']);
      },

      error: () => {
        this.loading = false;
        this.alertService.error('Erro no login', 'Verifique seu e-mail e senha.');
      },
    });
  }
}
