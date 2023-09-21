import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '../service/base.service';
import { AuthService } from '../service/authService.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './loginComponent.html',
  styleUrls: ['./loginComponent.css'],
})
export class LoginComponent {
  issingnup = 'login';
  constructor(private router:Router,private baseService:BaseService,private authSer:AuthService,private store: AngularFirestore){}
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();

  form: FormGroup = new FormGroup({
    username: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
  });


  manageSingnup(value){
    this.issingnup  = value;
    this.error= null;
  }

  signupSubmit(){   
    if (this.form.valid) {
    const generateID = Math.ceil(Math.random()*100000).toString();
    this.form.value['uniqueId']=generateID;
    this.store.collection('users').doc(generateID).set(this.form.value); 
    this.issingnup='login';
  }else{
    this.error = "Enter Proper UserName or Password"
  }
  }

  async submit() {
    if (this.form.valid) {
      const isValid = await this.authSer.checkUser(this.form.value);
      if(!isValid){
        this.error = `User Not Found !!
      Please Check UserName or Password`
        return;
      }
      this.baseService.setisLoggedIn(true);
      this.router.navigate(['/entery'])

    }else{
      this.error = "Enter Proper UserName or Password"
    }
  }
}
