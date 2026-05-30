import {
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';


import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface HomeSlide {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  tag: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit, OnDestroy {
  slides: HomeSlide[] = [
    {
      title: 'Monte seus álbuns digitais',
      subtitle: 'Colecione, complete e evolua',
      description:
        'Compre álbuns, abra packs, cole figurinhas e acompanhe seu progresso em tempo real.',
      imageUrl: 'assets/albums/brasileirao-legends-2026.png',
      tag: 'Álbuns digitais',
    },
    {
      title: 'Abra packs de figurinhas',
      subtitle: 'Comuns, raras, épicas e lendárias',
      description:
        'Cada pack pode trazer novas figurinhas, repetidas para troca e itens especiais para sua coleção.',
      imageUrl: 'assets/packs/pack-premium.png',
      tag: 'Packs premium',
    },
    {
      title: 'Troque com outros colecionadores',
      subtitle: 'Complete sua coleção mais rápido',
      description:
        'Use seu código de troca, envie propostas, contrapropostas e negocie figurinhas repetidas.',
      imageUrl: 'assets/packs/pack-elite.png',
      tag: 'Trocas inteligentes',
    },
    {
      title: 'Suba de nível como colecionador',
      subtitle: 'Ganhe XP em cada ação',
      description:
        'Comprar packs, colar figurinhas, completar álbuns e concluir trocas aumentam seu nível.',
      imageUrl: 'assets/packs/pack-pequeno.png',
      tag: 'Sistema de XP',
    },
  ];

  currentSlideIndex = 0;

  progressPercent = 0;

  private slideDuration = 5500;
  private progressStep = 50;
  private elapsed = 0;

  private progressTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    this.stopCarousel();
  }

  get currentSlide(): HomeSlide {
    return this.slides[this.currentSlideIndex];
  }

  startCarousel() {
    this.stopCarousel();

    this.elapsed = 0;
    this.progressPercent = 0;

    this.progressTimer = setInterval(() => {
      this.elapsed += this.progressStep;

      this.progressPercent = Math.min(
        100,
        (this.elapsed / this.slideDuration) * 100,
      );

      if (this.elapsed >= this.slideDuration) {
        this.goToNextSlide();
      }
    }, this.progressStep);
  }

  stopCarousel() {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  goToNextSlide() {
    this.currentSlideIndex =
      (this.currentSlideIndex + 1) % this.slides.length;

    this.elapsed = 0;
    this.progressPercent = 0;
  }

  goToSlide(index: number) {
    this.currentSlideIndex = index;
    this.elapsed = 0;
    this.progressPercent = 0;
  }
}
