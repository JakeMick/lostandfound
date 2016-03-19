import {Auth} from './auth';
import {Component, Injectable} from 'angular2/core';
import {Router} from 'angular2/router';
import {Token} from './../dto/token';
import {LoginService} from './../service/login';
import {Credential, EmailTracker} from '../dto/email';


@Component({
    selector: 'signup-form',
    template: `
      <div class="signup-panel">
        <p class="welcome">Sign-up</p>
      <form (ngSubmit)="sendTracker()">
            <div class="row collapse">
                <div class="small-2 small-offset-3 columns">
                    <span class="prefix"><i class="fi-mail"></i></span>
                </div>
                <div class="small-4 columns">
                    <input type="text" [(ngModel)]="emailTracker.email" placeholder="email" required>
                </div>
                <div class="small-4 columns">
                </div>
            </div>
            <div class="centered">
                <button type="submit">Sign Up</button>
            </div>
      </form>
      </div>
            `,
})
export class SignUp {
    
    emailTracker: EmailTracker = new EmailTracker();
    
    constructor(private __loginService: LoginService) {
        this.__loginService = __loginService;
    }
    
    getLoginService() {
        return this.__loginService;
    }

    sendTracker() {
        let out = this.__loginService.sendTracker(this.emailTracker)
                    .subscribe(res => console.log(res),
                               error => console.log(error));
        
    }

}

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
                    <input type="text" [(ngModel)]="credential.password" placeholder="password" required>
                </div>
                <div class="small-4 columns">
                </div>
            </div>
            <div class="centered">
                <button type="submit">Sign On</button>
            </div>
            
        </form>
        <p>Don't have an account? <a (click)="signUp()">Sign Up</a></p>
      </div>
            `
})
export class SignOn {
    failed = false;
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
        this.failed = false;
        return this.getLoginService()
            .authenticate(this.credential)
            .subscribe(token => this.token = token,
                       error => this.failed = true);
    }

}

