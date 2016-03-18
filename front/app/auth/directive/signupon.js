System.register(['angular2/core', 'angular2/router', './../service/login'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, router_1, login_1;
    var Signer, Credential, Signum, SignUp, SignOn;
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
            }],
        execute: function() {
            Signer = (function () {
                function Signer() {
                    this.failed = false;
                    this.credential = new Credential();
                }
                Signer.prototype.getCredential = function () {
                    return this.credential;
                };
                Signer.prototype.setToken = function (token) {
                    this.token = token;
                };
                Signer.prototype.authenticate = function (signUpOn) {
                    var _this = this;
                    this.getCredential().setSignUpOn(signUpOn);
                    this.failed = false;
                    return this.getLoginService().authenticate(this.getCredential())
                        .subscribe(function (token) { return _this.setToken(token); }, function (error) { return _this.failed = true; });
                };
                return Signer;
            }());
            Credential = (function () {
                function Credential() {
                    this.email = '';
                    this.password = '';
                }
                Credential.prototype.setSignUpOn = function (signUpOn) {
                    this.signUpOn = signUpOn;
                };
                return Credential;
            }());
            exports_1("Credential", Credential);
            (function (Signum) {
                Signum[Signum["SignUp"] = 0] = "SignUp";
                Signum[Signum["SignOn"] = 1] = "SignOn";
            })(Signum || (Signum = {}));
            exports_1("Signum", Signum);
            SignUp = (function (_super) {
                __extends(SignUp, _super);
                function SignUp(__loginService) {
                    _super.call(this);
                    this.__loginService = __loginService;
                    this.signUpOn = Signum.SignUp;
                    this.__loginService = __loginService;
                }
                SignUp.prototype.getLoginService = function () {
                    return this.__loginService;
                };
                SignUp.prototype.auth = function () {
                    var out = this.authenticate(this.signUpOn);
                };
                SignUp = __decorate([
                    core_1.Component({
                        selector: 'signup-form',
                        template: "\n      <div class=\"signup-panel\">\n        <p class=\"welcome\">Sign-up</p>\n      <form (ngSubmit)=\"auth()\">\n            <div class=\"row collapse\">\n                <div class=\"small-2 small-offset-3 columns\">\n                    <span class=\"prefix\"><i class=\"fi-mail\"></i></span>\n                </div>\n                <div class=\"small-4 columns\">\n                    <input type=\"text\" [(ngModel)]=\"credential.email\" placeholder=\"email\" required>\n                </div>\n                <div class=\"small-4 columns\">\n                </div>\n            </div>\n            <div class=\"row collapse\">\n                <div class=\"small-2 small-offset-3 columns \">\n                    <span class=\"prefix\"><i class=\"fi-lock\"></i></span>\n                </div>\n                <div class=\"small-4 columns\">\n                    <input type=\"text\" [(ngModel)]=\"credential.password\" placeholder=\"password\" required>\n                </div>\n                <div class=\"small-4 columns\">\n                </div>\n            </div>\n            <div class=\"centered\">\n                <button type=\"submit\">Sign Up</button>\n            </div>\n      </form>\n      </div>\n            ",
                    }), 
                    __metadata('design:paramtypes', [login_1.LoginService])
                ], SignUp);
                return SignUp;
            }(Signer));
            exports_1("SignUp", SignUp);
            SignOn = (function (_super) {
                __extends(SignOn, _super);
                function SignOn(__loginService, __router) {
                    _super.call(this);
                    this.__loginService = __loginService;
                    this.__router = __router;
                    this.signUpOn = Signum.SignOn;
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
                    this.authenticate(this.signUpOn);
                };
                SignOn = __decorate([
                    core_1.Component({
                        selector: 'signon-form',
                        template: "\n      <div class=\"signup-panel\">\n        <p class=\"welcome\">Sign-on</p>\n        <form (ngSubmit)=\"auth()\">\n            <div class=\"row collapse\">\n                <div class=\"small-2 small-offset-3 columns\">\n                    <span class=\"prefix\"><i class=\"fi-mail\"></i></span>\n                </div>\n                <div class=\"small-4 columns\">\n                    <input type=\"text\" [(ngModel)]=\"credential.email\" placeholder=\"email\" required>\n                </div>\n                <div class=\"small-4 columns\">\n                </div>\n            </div>\n            <div class=\"row collapse\">\n                <div class=\"small-2 small-offset-3 columns \">\n                    <span class=\"prefix\"><i class=\"fi-lock\"></i></span>\n                </div>\n                <div class=\"small-4 columns\">\n                    <input type=\"text\" [(ngModel)]=\"credential.password\" placeholder=\"password\" required>\n                </div>\n                <div class=\"small-4 columns\">\n                </div>\n            </div>\n            <div class=\"centered\">\n                <button type=\"submit\">Sign On</button>\n            </div>\n            \n        </form>\n        <p>Don't have an account? <a (click)=\"signUp()\">Sign Up</a></p>\n      </div>\n            "
                    }), 
                    __metadata('design:paramtypes', [login_1.LoginService, router_1.Router])
                ], SignOn);
                return SignOn;
            }(Signer));
            exports_1("SignOn", SignOn);
        }
    }
});
//# sourceMappingURL=signupon.js.map