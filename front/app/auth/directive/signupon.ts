import {Auth} from './auth';
import {Component, Injectable} from 'angular2/core';
import {Router} from 'angular2/router';
import {Token} from './../dto/token';
import {LoginService} from './../service/login';

abstract class Signer {
    failed = false;
    credential: Credential = new Credential();
    token: Token;
    
    getCredential() {
        return this.credential;
    }
    
    setToken(token) {
        this.token = token;
    }
    
    abstract getLoginService() : LoginService;
    
    protected authenticate(signUpOn: Signum) {
        this.getCredential().setSignUpOn(signUpOn);
        this.failed = false;
        return this.getLoginService().authenticate(this.getCredential())
            .subscribe(token => this.setToken(token),
            error => this.failed = true);
    }
}

export class Credential {
    private signUpOn: Signum;

    email: string;
    password: string;

    constructor() {
        this.email = '';
        this.password = '';
    }

    setSignUpOn(signUpOn: Signum) {
        this.signUpOn = signUpOn;
    }
}

export enum Signum {
    SignUp,
    SignOn
}

@Component({
    selector: 'signup-form',
    template: `
      <div class="signup-panel">
        <p class="welcome">Sign-up</p>
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
                <button type="submit">Sign Up</button>
            </div>
      </form>
      </div>
            `,
})
export class SignUp extends Signer implements Auth {
    signUpOn = Signum.SignUp;
    
    constructor(private __loginService: LoginService) {
        super();
        this.__loginService = __loginService;
    }
    
    getLoginService() {
        return this.__loginService;
    }

    auth() {
        let out = this.authenticate(this.signUpOn);
        
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
export class SignOn extends Signer implements Auth{

    signUpOn = Signum.SignOn;

    constructor(private __loginService: LoginService,
                private __router: Router) {
        super();
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
        this.authenticate(this.signUpOn);
    }

}

