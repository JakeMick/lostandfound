System.register(['angular2/core', './auth/directive/signup', './auth/directive/signon', './auth/directive/respond', 'angular2/http', './config', './auth/service/login', 'angular2/router'], function(exports_1, context_1) {
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
    var core_1, signup_1, signon_1, respond_1, http_1, config_1, login_1, router_1;
    var LFApp;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (signup_1_1) {
                signup_1 = signup_1_1;
            },
            function (signon_1_1) {
                signon_1 = signon_1_1;
            },
            function (respond_1_1) {
                respond_1 = respond_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (login_1_1) {
                login_1 = login_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            }],
        execute: function() {
            LFApp = (function () {
                function LFApp() {
                }
                LFApp = __decorate([
                    core_1.Component({
                        selector: 'lf-app',
                        template: "\n    <nav class=\"top-bar\" data-topbar role=\"navigation\">\n        <ul class=\"title-area\">\n            <li class=\"name\">\n                <h1><a href=\"/\">LF</a></h1>\n            </li>\n            <li class=\"toggle-topbar menu-icon\">\n                <a href=\"#\"><span>Menu</span></a>\n            </li>\n        </ul>\n\n        <section class=\"top-bar-section\">\n            <ul class=\"left\">\n                <li><a [routerLink]=\"['SignOn']\">Login</a></li>\n            </ul>\n        </section>\n    </nav>\n    <router-outlet></router-outlet>\n\n    ",
                        directives: [router_1.ROUTER_DIRECTIVES,
                            signup_1.SignUp,
                            signon_1.SignOn],
                        providers: [router_1.ROUTER_PROVIDERS,
                            http_1.HTTP_PROVIDERS,
                            login_1.LoginService,
                            config_1.ConfigService]
                    }),
                    router_1.RouteConfig([
                        {
                            path: '/signup',
                            name: 'SignUp',
                            component: signup_1.SignUp
                        },
                        {
                            path: '/',
                            name: 'SignOn',
                            component: signon_1.SignOn,
                            useAsDefault: true
                        },
                        {
                            path: '/respond/:tracker',
                            name: 'Respond',
                            component: respond_1.Respond
                        }
                    ]), 
                    __metadata('design:paramtypes', [])
                ], LFApp);
                return LFApp;
            }());
            exports_1("LFApp", LFApp);
        }
    }
});
//# sourceMappingURL=lf_app.js.map