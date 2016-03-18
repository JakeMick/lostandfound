import {Auth} from './auth';
import {Component, Injectable} from 'angular2/core';
import {Token} from './../dto/token';
import {LoginService} from './../service/login';

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
                <button type="submit">SignUn</button>
            </div>
      </form>
      </div>
            `,
})
export class SignUp implements Auth {
    credential: Credential = new Credential();
    signUpOn = Signum.SignUp;
    token: Token;
    failed: Boolean = false;

    protected authenticate(signUpOn: Signum) {
        this.credential.setSignUpOn(signUpOn);
        this.failed = false;
        this.loginService.authenticate(this.credential)
            .subscribe(token => this.token = token,
            error => this.failed = true);
    }
    
    constructor(private loginService: LoginService) {
        this.loginService = loginService;
    }

    auth() {
        this.authenticate(this.signUpOn);
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
                <button type="submit">SignOn</button>
            </div>
        </form>
      </div>
            `
})
export class SignOn implements Auth {
    credential: Credential = new Credential();
    signUpOn = Signum.SignOn;
    token: Token;
    failed: Boolean = false;

    constructor(private loginService: LoginService) {
        this.loginService = loginService;
    }
    
    protected authenticate(signUpOn: Signum) {
        this.credential.setSignUpOn(signUpOn);
        this.failed = false;
        this.loginService.authenticate(this.credential)
            .subscribe(token => this.token = token,
            error => this.failed = true);
    }
    
    auth() {
        this.authenticate(this.signUpOn);
    }

}