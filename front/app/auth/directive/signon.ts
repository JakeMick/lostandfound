import {Auth} from './auth';
import {Component} from 'angular2/core';
import {Response} from 'angular2/http';
import {Router} from 'angular2/router';
import {Token} from './../dto/token';
import {LoginService} from './../service/login';
import {Credential} from '../dto/email';


@Component({
    selector: 'signon-form',
    template: `
      <div class="signup-panel">
        <p class="welcome">Sign-on</p>
        <form (ngSubmit)="auth()">
            <div class="row collapse">
                <div class="small-2 small-offset-3 columns">
                    <span class="prefix"><i class="fi-mail"></i></span>
                </div>
                <div class="small-4 columns">
                    <input type="text" [(ngModel)]="credential.email" placeholder="email" required>
                </div>
                <div class="small-4 columns">
                </div>
            </div>
            <div class="row collapse">
                <div class="small-2 small-offset-3 columns ">
                    <span class="prefix"><i class="fi-lock"></i></span>
                </div>
                <div class="small-4 columns">
                    <input type="password" [(ngModel)]="credential.password" placeholder="password" required>
                </div>
                <div class="small-4 columns">
                </div>
            </div>
            <div class="centered">
                <button type="submit">Sign On</button>
            </div>
            
        </form>
        <div class="row collapse" *ngIf="isFailed">
            <div class="medium-2 medium-offset-5 columns">
                <div data-alert class="alert-box alert radius">
                    <p>{{errorMsg}}</p>
                </div>
            </div>
        </div>
        <p>Don't have an account? <a (click)="signUp()">Sign Up</a></p>
      </div>
            `
})
export class SignOn {
    isFailed = false;
    errorMsg = '';
    credential: Credential = new Credential();
    token: Token;
    
    constructor(private __loginService: LoginService,
                private __router: Router) {
        this.__loginService = __loginService;
        this.__router = __router;
    }
   
    getLoginService() {
        return this.__loginService;
    }
    
    signUp() {
        this.__router.navigate(['SignUp']);
    }
    
    auth() {
        this.isFailed = false;
        return this.getLoginService()
            .authenticate(this.credential)
            .subscribe(token => this.gotoLobby(),
                       error => this.failLogin(error));
    }
    
    failLogin(error: Response) {
        this.isFailed = true;
        if (error.status == 401) {
            this.errorMsg = 'Email or password is incorrect';
        }
    }
    
    gotoLobby() {
        this.isFailed = false;
        this.__router.navigate(['Lobby']);
    }

}

