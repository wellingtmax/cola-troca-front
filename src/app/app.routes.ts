import { Routes } from '@angular/router';

import { MainLayout } from './layouts/main-layout/main-layout';

import { Store } from './pages/store/store';
import { Library } from './pages/library/library';
import { Duplicates } from './pages/duplicates/duplicates';
import { Profile } from './pages/profile/profile';
import { AlbumDetail } from './pages/album-detail/album-detail';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { authGuard } from './core/guards/auth-guard';
import { Packs } from './pages/packs/packs';
import { AlbumView } from './pages/album-view/album-view';

export const routes: Routes = [

 {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
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
        path: 'repetidas',
        component: Duplicates,
      },

      {
        path: 'perfil',
        component: Profile,
      },

      {
        path: 'album/:id',
        component: AlbumDetail,
      },
      
      {
        path: 'packs',
        component: Packs,
      },

      {
        path: 'album/:id',
        component: AlbumView,
      },
    ],
  },

  {
    path: '**',
    redirectTo: 'login',
  }
];
