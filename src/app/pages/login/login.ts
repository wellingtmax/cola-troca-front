import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import { AlertService } from '../../core/services/alert';
import { PublicAuthShell } from '../../shared/public-auth-shell/public-auth-shell';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PublicAuthShell,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  loading = false;

  errorMessage = '';
  successMessage = '';

  login() {
    if (this.loading) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Preencha e-mail e senha para continuar.';

      this.alertService.warning(
        'Campos obrigatórios',
        this.errorMessage,
      );

      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.email.trim().toLowerCase(),
      password: this.password,
    }).subscribe({
      next: () => {
        this.loading = false;

        this.successMessage = 'Login realizado com sucesso!';

        this.alertService.success(
          'Login realizado com sucesso!',
          'Bem-vindo ao Cola&Troca.',
        );

        this.router.navigate(['/loja']);
      },

      error: (error) => {
        this.loading = false;

        const errorMessage =
          Array.isArray(error?.error?.message)
            ? error.error.message[0]
            : error?.error?.message ||
              'E-mail ou senha inválidos.';

        this.errorMessage = errorMessage;

        this.alertService.error(
          'Erro no login',
          errorMessage,
        );

        console.error('Erro no login:', error);
      },
    });
  }
}
