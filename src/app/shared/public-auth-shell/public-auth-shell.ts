import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public-auth-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
  ],
  templateUrl: './public-auth-shell.html',
  styleUrl: './public-auth-shell.css',
})
export class PublicAuthShell {
  @Input() pageTitle = '';
  @Input() pageSubtitle = '';
  @Input() activePage: 'login' | 'register' = 'login';
}
