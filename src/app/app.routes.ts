import { Routes } from '@angular/router';

import { MainLayout } from './layouts/main-layout/main-layout';

import { Store } from './pages/store/store';
import { Library } from './pages/library/library';
import { Profile } from './pages/profile/profile';
import { authGuard } from './core/guards/auth-guard';
import { Packs } from './pages/packs/packs';
import { AlbumView } from './pages/album-view/album-view';
import { ChatGlobal } from './pages/chat-global/chat-global';
import { Bafo } from './pages/bafo/bafo';
import { Stickers } from './pages/stickers/stickers';
import { Trades } from './pages/trades/trades';
import { Home } from './pages/home/home';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register').then((m) => m.Register),
  },

  {
    path: '',
    component: MainLayout,

    canActivate: [authGuard],

    children: [
      {
        path: '',
        redirectTo: 'loja',
        pathMatch: 'full',
      },

      {
        path: 'loja',
        component: Store,
      },

      {
        path: 'biblioteca',
        component: Library,
      },

      {
        path: 'figurinhas',
        component: Stickers,
      },

      {
        path: 'perfil',
        component: Profile,
      },

      {
        path: 'packs',
        component: Packs,
      },

      {
        path: 'album/:id',
        component: AlbumView,
      },
      {
        path: 'chat-global',
        component: ChatGlobal
      },

      {
        path: 'bafo',
        component: Bafo
      },

      {
        path: 'trocas',
        component: Trades
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'home',
  }
];
