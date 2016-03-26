import {Auth} from './auth';
import {Component} from 'angular2/core';
import {Response} from 'angular2/http';
import {Router, RouteParams } from 'angular2/router';
import {Token} from './../dto/token';
import {LoginService} from './../service/login';
import {User} from '../dto/email';


@Component({
    selector: 'respond-form',
    template: `
      <div class="signup-panel">
        <p class="welcome">Create User</p>
        <form (ngSubmit)="create()">
            <div class="row collapse">
                <div class="small-2 small-offset-3 columns">
                    <span class="prefix"><i class="fi-torsos-all"></i></span>
                </div>
                <div class="small-4 columns">
                    <input type="text" [(ngModel)]="user.username" placeholder="username" required>
                </div>
                <div class="small-4 columns">
                </div>
            </div>
            <div class="row collapse">
                <div class="small-2 small-offset-3 columns">
                    <span class="prefix"><i class="fi-mail"></i></span>
                </div>
                <div class="small-4 columns">
                    <input type="text" [(ngModel)]="user.email" placeholder="email" required>
                </div>
                <div class="small-4 columns">
                </div>
            </div>
            <div class="row collapse">
                <div class="small-2 small-offset-3 columns ">
                    <span class="prefix"><i class="fi-lock"></i></span>
                </div>
                <div class="small-4 columns">
                    <input type="password" [(ngModel)]="user.password" placeholder="password" required>
                </div>
                <div class="small-4 columns">
                </div>
            </div>
            <div class="centered">
                <button type="submit">Create</button>
            </div>
            
        </form>
        <div class="row collapse" *ngIf="isFailed">
            <div class="medium-2 medium-offset-5 columns">
                <div data-alert class="alert-box alert radius">
                    <p>{{errorMsg}}</p>
                </div>
            </div>
        </div>
      </div>
            `
})
export class Respond {
    isFailed = false;
    user: User = new User();
    token: Token;
    tracker = '';
    errorMsg = '';
    
    constructor(private __loginService: LoginService,
                private __router: Router,
                private __params: RouteParams) {
        this.user.tracker = __params.get("tracker");
        this.__loginService = __loginService;
        this.__router = __router;
    }
   
    getLoginService() {
        return this.__loginService;
    }
    
    signOn() {
        this.__router.navigate(['SignOn']);
    }
    
    handleError(error: Response) {
        this.isFailed = true;
        if (error.status === 417) {
            this.errorMsg = 'The email address isn\'t know to us or they already made an account'
        }
    }
    
    create() {
        this.isFailed = false;
        return this.getLoginService()
            .create(this.user)
            .subscribe(token => this.signOn,
                       error => this.handleError(error));
    }

}