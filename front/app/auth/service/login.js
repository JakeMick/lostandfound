System.register(['angular2/core', 'angular2/http', 'rxjs/Observable', '../../config'], function(exports_1, context_1) {
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
    var core_1, http_1, Observable_1, config_1;
    var LoginService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            }],
        execute: function() {
            LoginService = (function () {
                function LoginService(http, config) {
                    this.http = http;
                    this.config = config;
                    this.loginUrl = this.config.restUrl + 'auth/authenticate';
                    this.trackerUrl = this.config.restUrl + 'auth/tracker';
                }
                LoginService.prototype.sendTracker = function (emailTracker) {
                    //let body = JSON.stringify(emailTracker);
                    var params = new http_1.URLSearchParams();
                    params.set('email', emailTracker.email);
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    var options = new http_1.RequestOptions({
                        headers: headers,
                        search: params
                    });
                    return this.http.post(this.trackerUrl, '', options)
                        .map(function (res) { return res.json().data; })
                        .catch(this.handleError);
                };
                LoginService.prototype.authenticate = function (credential) {
                    var body = JSON.stringify(credential);
                    var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                    return this.http.post(this.loginUrl, body)
                        .map(function (res) { return res.json().data; })
                        .catch(this.handleError);
                };
                LoginService.prototype.handleError = function (error) {
                    console.error(error);
                    return Observable_1.Observable.throw(error.json().error || 'Server error');
                };
                LoginService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http, config_1.ConfigService])
                ], LoginService);
                return LoginService;
            }());
            exports_1("LoginService", LoginService);
        }
    }
});
//# sourceMappingURL=login.js.map