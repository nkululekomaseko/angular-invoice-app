import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AUTH_ROUTES } from './auth/components/auth.routes';
import { isAuthenticatedGuard } from './services/auth/auth.guard';
import { InvoiceDetailsComponent } from './components/invoice-details/invoice-details.component';

export const routes: Routes = [
  { path: 'auth', children: AUTH_ROUTES },
  {
    path: 'home',
    canActivate: [isAuthenticatedGuard()],
    component: HomeComponent,
  },
  {
    path: 'invoice/:invoiceId',
    canActivate: [isAuthenticatedGuard()],
    component: InvoiceDetailsComponent,
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
