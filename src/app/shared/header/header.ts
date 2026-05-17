import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../core/services/auth';

import { User } from '../../interfaces/user.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  private readonly authService = inject(AuthService);

  user: User | null = null;

  ngOnInit(): void {

    this.loadProfile();
  }

  loadProfile() {

    this.authService.profile().subscribe({

      next: (response) => {

        this.user = response.data;
      },

      error: () => {

        this.user = this.authService.getUser();
      },
    });
  }

  getInitialLetter(): string {

    if (!this.user?.name) {
      return 'U';
    }

    return this.user.name.charAt(0).toUpperCase();
  }
}
