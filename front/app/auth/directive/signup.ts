import {Component, Injectable} from 'angular2/core';
import {Response} from 'angular2/http';
import {LoginService} from './../service/login';
import {Email} from '../dto/email';

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
        <div class="row collapse" *ngIf="isSuccess">
            <div class="medium-2 medium-offset-5 columns">
                <div data-alert class="alert-box success radius">
                    <p>{{successMsg}}</p>
                </div>
            </div>
        </div>
        <div class="row collapse" *ngIf="isFailed">
            <div class="medium-2 medium-offset-5 columns">
                <div data-alert class="alert-box alert radius">
                    <p>{{errorMsg}}</p>
                </div>
            </div>
        </div>
      </div>
            `,
})
export class SignUp {
    
    emailTracker: Email = new Email();
    isSuccess = false;
    isFailed = false;
    errorMsg = "";
    successMsg = "";
    
    constructor(private __loginService: LoginService) {
        this.__loginService = __loginService;
    }
    
    getLoginService() {
        return this.__loginService;
    }

    sendTracker() {
        this.isFailed = false;
        this.isSuccess = false;
        let out = this.__loginService.sendTracker(this.emailTracker)
                    .subscribe(res => this.handleSuccess(),
                               error => this.handleError(error));
    }
    
    handleSuccess() {
        this.isSuccess = true;
        this.successMsg = "Check your email box!";
    }
    
    handleError(error: Response) {
        this.isFailed = true;
        if (error.status === 409) {
            this.errorMsg = "Email address is already registered";
        } else if (error.status === 400) {
            this.errorMsg = "Email address not valid";
        } else {
            this.errorMsg = "Internal error has occurred"
        }
    }

}