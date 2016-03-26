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
    var Respond;
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
            Respond = (function () {
                function Respond(__loginService, __router, __params) {
                    this.__loginService = __loginService;
                    this.__router = __router;
                    this.__params = __params;
                    this.isFailed = false;
                    this.user = new email_1.User();
                    this.tracker = '';
                    this.errorMsg = '';
                    this.user.tracker = __params.get("tracker");
                    this.__loginService = __loginService;
                    this.__router = __router;
                }
                Respond.prototype.getLoginService = function () {
                    return this.__loginService;
                };
                Respond.prototype.signOn = function () {
                    this.__router.navigate(['SignOn']);
                };
                Respond.prototype.handleError = function (error) {
                    this.isFailed = true;
                    if (error.status === 417) {
                        this.errorMsg = 'The email address isn\'t know to us or they already made an account';
                    }
                };
                Respond.prototype.create = function () {
                    var _this = this;
                    this.isFailed = false;
                    return this.getLoginService()
                        .create(this.user)
                        .subscribe(function (token) { return _this.signOn; }, function (error) { return _this.handleError(error); });
                };
                Respond = __decorate([
                    core_1.Component({
                        selector: 'respond-form',
                        template: "\n      <div class=\"signup-panel\">\n        <p class=\"welcome\">Create User</p>\n        <form (ngSubmit)=\"create()\">\n            <div class=\"row collapse\">\n                <div class=\"small-2 small-offset-3 columns\">\n                    <span class=\"prefix\"><i class=\"fi-torsos-all\"></i></span>\n                </div>\n                <div class=\"small-4 columns\">\n                    <input type=\"text\" [(ngModel)]=\"user.username\" placeholder=\"username\" required>\n                </div>\n                <div class=\"small-4 columns\">\n                </div>\n            </div>\n            <div class=\"row collapse\">\n                <div class=\"small-2 small-offset-3 columns\">\n                    <span class=\"prefix\"><i class=\"fi-mail\"></i></span>\n                </div>\n                <div class=\"small-4 columns\">\n                    <input type=\"text\" [(ngModel)]=\"user.email\" placeholder=\"email\" required>\n                </div>\n                <div class=\"small-4 columns\">\n                </div>\n            </div>\n            <div class=\"row collapse\">\n                <div class=\"small-2 small-offset-3 columns \">\n                    <span class=\"prefix\"><i class=\"fi-lock\"></i></span>\n                </div>\n                <div class=\"small-4 columns\">\n                    <input type=\"password\" [(ngModel)]=\"user.password\" placeholder=\"password\" required>\n                </div>\n                <div class=\"small-4 columns\">\n                </div>\n            </div>\n            <div class=\"centered\">\n                <button type=\"submit\">Create</button>\n            </div>\n            \n        </form>\n        <div class=\"row collapse\" *ngIf=\"isFailed\">\n            <div class=\"medium-2 medium-offset-5 columns\">\n                <div data-alert class=\"alert-box alert radius\">\n                    <p>{{errorMsg}}</p>\n                </div>\n            </div>\n        </div>\n      </div>\n            "
                    }), 
                    __metadata('design:paramtypes', [login_1.LoginService, router_1.Router, router_1.RouteParams])
                ], Respond);
                return Respond;
            }());
            exports_1("Respond", Respond);
        }
    }
});
//# sourceMappingURL=respond.js.map