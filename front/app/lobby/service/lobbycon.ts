import {Injectable, OnInit } from 'angular2/core';
import {ConfigService} from '../../config';
import {LoginService} from '../../auth/service/login';
import {Observable, Subscription} from 'rxjs';

@Injectable()
export class LobbyService implements OnInit {
    
    private ws: WebSocket;
    private lobbyData = new Array();
    
    constructor(private __config: ConfigService, private __login: LoginService) {
    }
    
    ngOnInit() {
        this.ws = this.connect();
    }
    
    public onopen:(ev:Event) => void = function (event:Event) {};
    public onclose:(ev:CloseEvent) => void = function (event:CloseEvent) {};
    public onmessage:(ev:MessageEvent) => void = function (event:MessageEvent) {};
    public onerror:(ev:ErrorEvent) => void = function (event:ErrorEvent) {};
    public send:(msg:String) => void = function (msg: String){};
    
    private connect(): WebSocket {
        let ws = new WebSocket(this.__config.lobbyUrl);
        ws.onopen = (e: MessageEvent) => {
            console.log("Lobby open", e);
            this.onopen(e);
            this.ws.send("AUTH:" + this.__login.getToken());
        }
        ws.onclose = (e: CloseEvent) => {
            console.log("Lobby close", e);
            this.onclose(e);
        }
        ws.onerror = (e: ErrorEvent) => {
            console.log("Lobby error", e);
            this.onerror(e);
        }
        ws.onmessage = (e: MessageEvent) => {
            console.log("Lobby message", e);
            this.onmessage(e);
        }
        return ws;
    }
}