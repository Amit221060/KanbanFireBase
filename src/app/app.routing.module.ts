import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/loginComponent';
import { AppComponent } from './app.component';
import { EntryComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from './service/authGuard.service';
import { verifyEmail } from './verifyEmail/verifyEmail.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'entery',
    component: EntryComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'verifyEmail',
    component: verifyEmail,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
