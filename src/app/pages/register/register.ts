import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { PublicAuthShell } from '../../shared/public-auth-shell/public-auth-shell';
import { AuthService } from '../../core/services/auth';
import { AlertService } from '../../core/services/alert';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    PublicAuthShell,
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  name = '';
  email = '';
  password = '';

  loading = false;

  errorMessage = '';
  successMessage = '';

  register() {
    if (this.loading) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    if (!this.name.trim() || !this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Preencha nome, e-mail e senha para continuar.';

      this.alertService.warning(
        'Campos obrigatórios',
        this.errorMessage,
      );

      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'A senha precisa ter no mínimo 6 caracteres.';

      this.alertService.warning(
        'Senha inválida',
        this.errorMessage,
      );

      return;
    }

    this.loading = true;

    this.authService.register({
      name: this.name.trim(),
      email: this.email.trim().toLowerCase(),
      password: this.password,
    }).subscribe({
      next: () => {
        this.loading = false;

        this.successMessage =
          'Cadastro realizado com sucesso! Agora você já pode entrar.';

        this.alertService.success(
          'Cadastro realizado com sucesso!',
          'Agora você já pode entrar na sua conta.',
        );

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 800);
      },

      error: (error) => {
        this.loading = false;

        const errorMessage =
          Array.isArray(error?.error?.message)
            ? error.error.message[0]
            : error?.error?.message ||
              'Verifique os dados informados.';

        this.errorMessage = errorMessage;

        this.alertService.error(
          'Erro no cadastro',
          errorMessage,
        );

        console.error('Erro no cadastro:', error);
      },
    });
  }
}
