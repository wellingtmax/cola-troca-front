import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { UserService } from '../../core/services/user';
import { AlertService } from '../../core/services/alert';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly userService = inject(UserService);
  private readonly alertService = inject(AlertService);
  private readonly authService = inject(AuthService)

  loading = true;
  activeTab: 'perfil' | 'endereco' | 'avatar' | 'seguranca' = 'perfil';

  profile: any = {};
  dashboard: any = {};

  avatars = [
    'assets/avatars/urubu.jfif',
    'assets/avatars/flamengo.png',
    'assets/avatars/trofeu.png',
    'assets/avatars/bola.jfif',
    'assets/avatars/guerreiro.jfif',
    'assets/avatars/coroa.jfif',
  ];

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;

    this.userService.profile().subscribe({
      next: (response) => {
        this.profile = response.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.alertService.error('Erro ao carregar perfil.');
      },
    });

    this.userService.dashboard().subscribe({
      next: (response) => {
        this.dashboard = response.data;
      },
    });
  }

  updateProfile() {
    this.userService.updateProfile({
      name: this.profile.name,
      nickname: this.profile.nickname,
      phone: this.profile.phone,
      bio: this.profile.bio,
    }).subscribe({
      next: () => {
        this.authService.updateCurrentUser({
          name: this.profile.name,
          nickname: this.profile.nickname,
          phone: this.profile.phone,
        });

        this.alertService.success('Perfil atualizado com sucesso!');
        this.loadProfile();
      },
      error: () => {
        this.alertService.error('Erro ao atualizar perfil.');
      },
    });
  }

  updateAddress() {
    this.userService.updateAddress({
      zipCode: this.profile.zipCode,
      street: this.profile.street,
      number: this.profile.number,
      complement: this.profile.complement,
      district: this.profile.district,
      city: this.profile.city,
      state: this.profile.state,
      country: this.profile.country,
    }).subscribe({
      next: () => {
        this.alertService.success('Endereço atualizado com sucesso!');
        this.loadProfile();
      },
      error: () => {
        this.alertService.error('Erro ao atualizar endereço.');
      },
    });
  }

  selectAvatar(avatarUrl: string) {
    this.userService.updateAvatar(avatarUrl).subscribe({
      next: () => {
        this.profile.avatarUrl = avatarUrl;

        this.authService.updateCurrentUser({
          avatarUrl,
        });

        this.alertService.success('Avatar atualizado!');
      },
      error: () => {
        this.alertService.error('Erro ao atualizar avatar.');
      },
    });
  }

  generateTradeCode() {

    this.userService.generateTradeCode().subscribe({

      next: (response) => {

        this.profile.tradeCode = response.data;

        this.alertService.success(
          'ID de troca gerado!',
        );
      },

      error: () => {
        this.alertService.error(
          'Erro ao gerar ID.',
        );
      },
    });
  }

  copyTradeCode() {

    navigator.clipboard.writeText(
      this.profile.tradeCode,
    );

    this.alertService.success(
      'ID copiado!',
    );
  }

  onAvatarError(event: Event) {
  const img = event.target as HTMLImageElement;

  img.src = 'assets/avatars/trofeu.png';
}
}
