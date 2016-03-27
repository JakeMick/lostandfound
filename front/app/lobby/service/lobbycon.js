System.register(['angular2/core', '../../config', '../../auth/service/login'], function(exports_1, context_1) {
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
    var core_1, config_1, login_1;
    var LobbyService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (config_1_1) {
                config_1 = config_1_1;
            },
            function (login_1_1) {
                login_1 = login_1_1;
            }],
        execute: function() {
            LobbyService = (function () {
                function LobbyService(__config, __login) {
                    this.__config = __config;
                    this.__login = __login;
                    this.lobbyData = new Array();
                    this.onopen = function (event) { };
                    this.onclose = function (event) { };
                    this.onmessage = function (event) { };
                    this.onerror = function (event) { };
                    this.send = function (msg) { };
                }
                LobbyService.prototype.ngOnInit = function () {
                    this.ws = this.connect();
                };
                LobbyService.prototype.connect = function () {
                    var _this = this;
                    var ws = new WebSocket(this.__config.lobbyUrl);
                    ws.onopen = function (e) {
                        console.log("Lobby open", e);
                        _this.onopen(e);
                        _this.ws.send("AUTH:" + _this.__login.getToken());
                    };
                    ws.onclose = function (e) {
                        console.log("Lobby close", e);
                        _this.onclose(e);
                    };
                    ws.onerror = function (e) {
                        console.log("Lobby error", e);
                        _this.onerror(e);
                    };
                    ws.onmessage = function (e) {
                        console.log("Lobby message", e);
                        _this.onmessage(e);
                    };
                    return ws;
                };
                LobbyService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [config_1.ConfigService, login_1.LoginService])
                ], LobbyService);
                return LobbyService;
            }());
            exports_1("LobbyService", LobbyService);
        }
    }
});
//# sourceMappingURL=lobbycon.js.map