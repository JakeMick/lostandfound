import {Injectable} from 'angular2/core';
import {Subject, Observable} from 'rxjs';
import {WebSocketService} from './ws';
import {Protocol, ChatMessage, messageType} from '../protocol';


@Injectable()
export class LobbyService {
    private msgs = Array<ChatMessage>();
    private users = new Set<string>()
    private seen = new Set<number>();

    constructor(private webSocketService: WebSocketService) {
        this.webSocketService = webSocketService;
        webSocketService
            .getDataStream()
            .subscribe(e => {
                if (messageType(e) === Protocol.MESG) {
                    let chatMessage = new ChatMessage(e);
                    if (!this.seen.has(chatMessage.id)) {
                        // Add user
                        if (chatMessage.chatroom == -1) {
                            this.users.add(chatMessage.author);
                            chatMessage.userAdded = true;
                        }
                        // Remove user
                        if (chatMessage.chatroom == -2) {
                            this.users.delete(chatMessage.author);
                            chatMessage.userRemoved = true;
                        }
                        this.seen.add(chatMessage.id);
                        this.msgs.push(chatMessage);
                    }
                }
            });
    }
    
    getChatter(): Array<ChatMessage> {
        return this.msgs;
    }
    
    getActiveUsers(): Set<string> {
        return this.users;
    }

    send(chatNum: number, mesg: string) {
        let arr = Protocol.MESG + ":" + chatNum+ ":" + mesg;
        this.webSocketService.send(arr);
    }

}