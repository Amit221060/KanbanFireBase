import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '../service/base.service';
import { AuthService } from '../service/authService.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';



@Component({
  selector: 'app-login',
  templateUrl: './loginComponent.html',
  styleUrls: ['./loginComponent.css'],
})
export class LoginComponent {
  issingnup = 'login';
  constructor(
    private router: Router,
    private baseService: BaseService,
    private authSer: AuthService,
    private store: AngularFirestore,
    public afAuth: AngularFireAuth
  ) {
    this.form.valueChanges.subscribe(data =>{
      this.error = null;
    })
  }
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  manageSingnup(value?) {
    this.issingnup = value;
    this.error = null;
  }

  async signupSubmit() {
    if (this.form.valid) {
      let isSignedUp: any = await this.authSer.userSignUp(this.form.value);
      if (!isSignedUp.status) {
        this.error = isSignedUp.msg + `User Not signed Up `;
        return;
      }
    } else {
      this.error = 'Enter Proper UserName or Password';
    }
  }

  async login() {
    if (this.form.valid) {
      let isValid: any = await this.authSer.checkUser(this.form.value);
      if (!isValid?.status) {
        let error = isValid.msg.includes('error')
          ? JSON.parse(isValid.msg)
          : isValid.msg;
        if (error?.error?.message) {
          this.error = JSON.parse(isValid.msg).error.message;
          return;
        }
        this.error = isValid.msg;
        return;
      }
      this.baseService.setisLoggedIn(true);
      this.router.navigate(['/entery']);
    } else {
      this.error = 'Enter Proper UserName or Password';
    }
  }

  // Sign in with Google
  GoogleAuth() {
    this.authSer.GoogleAuth();
  }
}
