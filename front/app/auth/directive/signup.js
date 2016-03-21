System.register(['angular2/core', './../service/login', '../dto/email'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, login_1, email_1;
    var SignUp;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (login_1_1) {
                login_1 = login_1_1;
            },
            function (email_1_1) {
                email_1 = email_1_1;
            }],
        execute: function() {
            SignUp = (function () {
                function SignUp(__loginService) {
                    this.__loginService = __loginService;
                    this.emailTracker = new email_1.Email();
                    this.isSuccess = false;
                    this.isFailed = false;
                    this.errorMsg = "";
                    this.successMsg = "";
                    this.__loginService = __loginService;
                }
                SignUp.prototype.getLoginService = function () {
                    return this.__loginService;
                };
                SignUp.prototype.sendTracker = function () {
                    var _this = this;
                    this.isFailed = false;
                    this.isSuccess = false;
                    var out = this.__loginService.sendTracker(this.emailTracker)
                        .subscribe(function (res) { return _this.handleSuccess(); }, function (error) { return _this.handleError(error); });
                };
                SignUp.prototype.handleSuccess = function () {
                    this.isSuccess = true;
                    this.successMsg = "Check your email box!";
                };
                SignUp.prototype.handleError = function (error) {
                    this.isFailed = true;
                    if (error.status === 409) {
                        this.errorMsg = "Email address is already registered";
                    }
                    else if (error.status === 400) {
                        this.errorMsg = "Email address not valid";
                    }
                    else {
                        this.errorMsg = "Internal error has occurred";
                    }
                };
                SignUp = __decorate([
                    core_1.Component({
                        selector: 'signup-form',
                        template: "\n      <div class=\"signup-panel\">\n        <p class=\"welcome\">Sign-up</p>\n      <form (ngSubmit)=\"sendTracker()\">\n            <div class=\"row collapse\">\n                <div class=\"small-2 small-offset-3 columns\">\n                    <span class=\"prefix\"><i class=\"fi-mail\"></i></span>\n                </div>\n                <div class=\"small-4 columns\">\n                    <input type=\"text\" [(ngModel)]=\"emailTracker.email\" placeholder=\"email\" required>\n                </div>\n                <div class=\"small-4 columns\">\n                </div>\n            </div>\n            <div class=\"centered\">\n                <button type=\"submit\">Sign Up</button>\n            </div>\n      </form>\n        <div class=\"row collapse\" *ngIf=\"isSuccess\">\n            <div class=\"medium-2 medium-offset-5 columns\">\n                <div data-alert class=\"alert-box success radius\">\n                    <p>{{successMsg}}</p>\n                </div>\n            </div>\n        </div>\n        <div class=\"row collapse\" *ngIf=\"isFailed\">\n            <div class=\"medium-2 medium-offset-5 columns\">\n                <div data-alert class=\"alert-box alert radius\">\n                    <p>{{errorMsg}}</p>\n                </div>\n            </div>\n        </div>\n      </div>\n            ",
                    }), 
                    __metadata('design:paramtypes', [login_1.LoginService])
                ], SignUp);
                return SignUp;
            }());
            exports_1("SignUp", SignUp);
        }
    }
});
//# sourceMappingURL=signup.js.map