import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {

  currentTheme: 'dark' | 'light' = 'dark';

  constructor() {

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
      this.enableLightTheme();
    } else {
      this.enableDarkTheme();
    }
  }

  toggleTheme() {

    if (this.currentTheme === 'dark') {
      this.enableLightTheme();
    } else {
      this.enableDarkTheme();
    }
  }

  enableDarkTheme() {

    document.body.classList.remove('light-theme');

    document.body.classList.add('dark-theme');

    localStorage.setItem('theme', 'dark');

    this.currentTheme = 'dark';
  }

  enableLightTheme() {

    document.body.classList.remove('dark-theme');

    document.body.classList.add('light-theme');

    localStorage.setItem('theme', 'light');

    this.currentTheme = 'light';
  }
}
