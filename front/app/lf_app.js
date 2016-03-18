System.register(['angular2/core', './auth/directive/signupon', 'angular2/http', './auth/service/login', 'angular2/router'], function(exports_1, context_1) {
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
    var core_1, signupon_1, signupon_2, http_1, login_1, router_1;
    var LFApp;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (signupon_1_1) {
                signupon_1 = signupon_1_1;
                signupon_2 = signupon_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
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
                            signupon_1.SignUp,
                            signupon_2.SignOn],
                        providers: [router_1.ROUTER_PROVIDERS,
                            http_1.HTTP_PROVIDERS,
                            login_1.LoginService]
                    }),
                    router_1.RouteConfig([
                        {
                            path: '/signup',
                            name: 'SignUp',
                            component: signupon_1.SignUp
                        },
                        {
                            path: '/',
                            name: 'SignOn',
                            component: signupon_2.SignOn,
                            useAsDefault: true
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