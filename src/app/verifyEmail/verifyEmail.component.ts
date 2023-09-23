import { Component, OnInit } from "@angular/core";
import { AuthService } from "../service/authService.service";

@Component({
    selector: 'app-verifyEmail',
    templateUrl: './verifyEmail.html',
    styleUrls: ['./verifyEmail.css'],
  })

  export class verifyEmail implements OnInit{

    constructor( public authService: AuthService){

    }

    ngOnInit() {
    }

  }
