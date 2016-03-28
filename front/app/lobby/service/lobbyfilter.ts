import {Injectable} from 'angular2/core';
import {Subject, Observable} from 'rxjs';
import {WebSocketService} from './ws';
import {Protocol, ChatMessage, messageType} from '../protocol';


@Injectable()
export class LobbyService {
    private msgs = Array<ChatMessage>();
    private seen = new Set<number>();

    constructor(private webSocketService: WebSocketService) {
        this.webSocketService = webSocketService;
        webSocketService
            .getDataStream()
            .subscribe(e => {
                if (messageType(e) === Protocol.MESG) {
                    let chatMessage = new ChatMessage(e);
                    if (!this.seen.has(chatMessage.id)) {
                        this.seen.add(chatMessage.id);
                        this.msgs.push(chatMessage);
                    }
                }
            });
    }

    getChatter(): Array<ChatMessage> {
        return this.msgs;
    }

    send(mesg: string) {
        let arr = Protocol.MESG + ":" + mesg;
        this.webSocketService.send(arr);
    }

}