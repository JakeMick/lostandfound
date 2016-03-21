System.register(['angular2/core', 'angular2/router', './../service/login', '../dto/email'], function(exports_1, context_1) {
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
    var core_1, router_1, login_1, email_1;
    var SignOn;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (login_1_1) {
                login_1 = login_1_1;
            },
            function (email_1_1) {
                email_1 = email_1_1;
            }],
        execute: function() {
            SignOn = (function () {
                function SignOn(__loginService, __router) {
                    this.__loginService = __loginService;
                    this.__router = __router;
                    this.failed = false;
                    this.credential = new email_1.Credential();
                    this.__loginService = __loginService;
                    this.__router = __router;
                }
                SignOn.prototype.getLoginService = function () {
                    return this.__loginService;
                };
                SignOn.prototype.signUp = function () {
                    this.__router.navigate(['SignUp']);
                };
                SignOn.prototype.auth = function () {
                    var _this = this;
                    this.failed = false;
                    return this.getLoginService()
                        .authenticate(this.credential)
                        .subscribe(function (token) { return _this.token = token; }, function (error) { return _this.failed = true; });
                };
                SignOn = __decorate([
                    core_1.Component({
                        selector: 'signon-form',
                        template: "\n      <div class=\"signup-panel\">\n        <p class=\"welcome\">Sign-on</p>\n        <form (ngSubmit)=\"auth()\">\n            <div class=\"row collapse\">\n                <div class=\"small-2 small-offset-3 columns\">\n                    <span class=\"prefix\"><i class=\"fi-mail\"></i></span>\n                </div>\n                <div class=\"small-4 columns\">\n                    <input type=\"text\" [(ngModel)]=\"credential.email\" placeholder=\"email\" required>\n                </div>\n                <div class=\"small-4 columns\">\n                </div>\n            </div>\n            <div class=\"row collapse\">\n                <div class=\"small-2 small-offset-3 columns \">\n                    <span class=\"prefix\"><i class=\"fi-lock\"></i></span>\n                </div>\n                <div class=\"small-4 columns\">\n                    <input type=\"password\" [(ngModel)]=\"credential.password\" placeholder=\"password\" required>\n                </div>\n                <div class=\"small-4 columns\">\n                </div>\n            </div>\n            <div class=\"centered\">\n                <button type=\"submit\">Sign On</button>\n            </div>\n            \n        </form>\n        <p>Don't have an account? <a (click)=\"signUp()\">Sign Up</a></p>\n      </div>\n            "
                    }), 
                    __metadata('design:paramtypes', [login_1.LoginService, router_1.Router])
                ], SignOn);
                return SignOn;
            }());
            exports_1("SignOn", SignOn);
        }
    }
});
//# sourceMappingURL=signon.js.map