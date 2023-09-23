import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TaskComponent } from './task/task.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { LoginComponent } from './login/loginComponent';
import { AppRoutingModule } from './app.routing.module';
import { EntryComponent } from './dashboard/dashboard.component';
import { AuthGuardService } from './service/authGuard.service';
import { BaseService } from './service/base.service';
import { AuthService } from './service/authService.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/auth';
import { verifyEmail } from './verifyEmail/verifyEmail.component';





@NgModule({
  declarations: [AppComponent, TaskComponent, TaskDialogComponent,LoginComponent,EntryComponent,verifyEmail],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    DragDropModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireAuthModule
  ],
  providers: [AuthGuardService,BaseService,AuthService,AngularFireAuth],
  bootstrap: [AppComponent],
})
export class AppModule {}
