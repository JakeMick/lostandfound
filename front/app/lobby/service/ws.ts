import {Injectable } from 'angular2/core';
import {ConfigService} from '../../config';
import {LoginService} from '../../auth/service/login';
import {Observable} from "rxjs/Observable";
import {isPresent, isString, isArray,isFunction} from 'angular2/src/facade/lang';
import {Scheduler} from "rxjs/Rx";
import {Subject} from "rxjs/Subject";
import {Protocol, AuthRequest} from "../protocol";

@Injectable()
export class WebSocketService {

    private reconnectAttempts = 0;
    private sendQueue = [];
    private onOpenCallbacks = [];
    private onMessageCallbacks = [];
    private onErrorCallbacks = [];
    private onCloseCallbacks = [];
    private readyStateConstants = {
        'CONNECTING': 0,
        'OPEN': 1,
        'CLOSING': 2,
        'CLOSED': 3,
        'RECONNECT_ABORTED': 4
    };
    private normalCloseCode = 1000;
    private reconnectableStatusCodes = [4000];
    private socket: WebSocket;
    private dataStream: Subject<string>;
    private internalConnectionState: number;
    private url: string;
    private protocols: string[];
    
    constructor(private config: ConfigService,
                private login: LoginService) {
        this.config = config;
        this.login = login;
        this.url = config.lobbyUrl;
        this.dataStream = new Subject<string>();
    }

    private connect(force:boolean = false) {
        var self = this;
        if (force || !this.socket || this.socket.readyState !== this.readyStateConstants.OPEN) {
            self.socket = new WebSocket(this.url, []);

            self.socket.onopen = (ev: Event) => {
                this.onOpenHandler(ev);
            };
            self.socket.onmessage = (ev: MessageEvent) => {
                self.onMessageHandler(ev);
                this.dataStream.next(ev.data);
            };
            this.socket.onclose = (ev: CloseEvent) => {
                self.onCloseHandler(ev);
                this.dataStream.complete()
            };

            this.socket.onerror = (ev: ErrorEvent) => {
                self.onErrorHandler(ev);
            };
            let authMesg = new AuthRequest(this.login.getToken()).build();
            this.sendQueue.push(authMesg);
            this.fireQueue();
        }
    }
    
    send(data: String) {
        var self = this;
        if (this.login.isAuthenticated &&
            this.getReadyState() != this.readyStateConstants.OPEN &&
            this.getReadyState() != this.readyStateConstants.CONNECTING ){
            this.connect();
        }
        return new Promise((resolve, reject) => {
            if (self.socket.readyState === self.readyStateConstants.RECONNECT_ABORTED) {
                reject('Socket connection has been closed');
            } else {
                self.sendQueue.push(data);
                self.fireQueue();
            }
        });
    }
    
    getDataStream():Subject<string>{
        return this.dataStream;
    }

    private onOpenHandler(event: Event) {
        this.reconnectAttempts = 0;
        this.notifyOpenCallbacks(event);
        this.fireQueue();
    };
    private notifyOpenCallbacks(event) {
        for (let i = 0; i < this.onOpenCallbacks.length; i++) {
            this.onOpenCallbacks[i].call(this, event);
        }
    }
    
    private fireQueue() {
        while (this.sendQueue.length && this.socket.readyState === this.readyStateConstants.OPEN) {
            let data = this.sendQueue.shift();
            this.socket.send(data);
        }
    }

    private notifyCloseCallbacks(event) {
        for (let i = 0; i < this.onCloseCallbacks.length; i++) {
            this.onCloseCallbacks[i].call(this, event);
        }
    }

    private notifyErrorCallbacks(event) {
        for (var i = 0; i < this.onErrorCallbacks.length; i++) {
            this.onErrorCallbacks[i].call(this, event);
        }
    }

    private onOpen(cb) {
        this.onOpenCallbacks.push(cb);
        return this;
    };

    private onClose(cb) {
        this.onCloseCallbacks.push(cb);
        return this;
    }

    private onError(cb) {
        this.onErrorCallbacks.push(cb);
        return this;
    };


    private onMessage(callback, options) {
        if (!isFunction(callback)) {
            throw new Error('Callback must be a function');
        }

        this.onMessageCallbacks.push({
            fn: callback,
            pattern: options ? options.filter : undefined,
            autoApply: options ? options.autoApply : true
        });
        return this;
    }

    private onMessageHandler(message: MessageEvent) {
        var pattern;
        var self = this;
        var currentCallback;
        for (var i = 0; i < self.onMessageCallbacks.length; i++) {
            currentCallback = self.onMessageCallbacks[i];
            currentCallback.fn.apply(self, [message]);
        }

    };
    private onCloseHandler(event: CloseEvent) {
        this.notifyCloseCallbacks(event);
        if ((this.config.reconnectIfNotNormalClose && event.code !== this.normalCloseCode) || this.reconnectableStatusCodes.indexOf(event.code) > -1) {
            this.reconnect();
        }
    };

    private onErrorHandler(event) {
        this.notifyErrorCallbacks(event);
    };

    private reconnect() {
        this.close(true);
        let backoffDelay = this.getBackoffDelay(++this.reconnectAttempts);
        let backoffDelaySeconds = backoffDelay / 1000;
        setTimeout( this.connect(), backoffDelay);
        return this;
    }

    private close(force: boolean) {
        if (force || !this.socket.bufferedAmount) {
            this.socket.close();
        }
        return this;
    };
   
    private getBackoffDelay(attempt) {
        let R = Math.random() + 1;
        let T = this.config.initialTimeout;
        let F = 2;
        let N = attempt;
        let M = this.config.maxTimeout;
        return Math.floor(Math.min(R * T * Math.pow(F, N), M));
    };

    private setInternalState(state) {
        if (Math.floor(state) !== state || state < 0 || state > 4) {
            throw new Error('state must be an integer between 0 and 4, got: ' + state);
        }
        this.internalConnectionState = state;

    }

    private getReadyState() {
        if (this.socket == null) {
            return -1;
        }
        return this.internalConnectionState || this.socket.readyState;
    }

}