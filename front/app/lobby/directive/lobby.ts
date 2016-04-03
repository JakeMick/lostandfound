import {Component, AfterViewChecked, ViewChild, ElementRef} from 'angular2/core'
import {Subject, Observable} from 'rxjs';
import {LobbyService} from '../service/lobbyfilter';
import {ChatMessage} from '../protocol'


@Component({
    selector: 'lobby',
    template: `
<div class="lobby">
    <div class="row collapse">
        <div class="small-3 columns">
            <ul class="members inline-list">
                <li *ngFor="#member of members">{{member}}</li>
            </ul>
        </div>
        <div class="small-9 columns">
            <div class="row collapse">
                <div #chat class="chat">
                    <div class="row collapse" *ngFor="#msg of chatMessages">
                        <div class="author small-2 columns">
                            {{msg.author}}
                        </div>
                        <div [ngSwitch]="msg.isSystemMessage">
                            <div *ngSwitchWhen="true" class="system small-10 columns">
                                {{msg.body}}
                            </div>
                            <div *ngSwitchDefault class="message small-10 columns">
                                {{msg.body}}
                            </div>
                        </div>
                    </div>
                </div>
                <form (ngSubmit)="click()">
                    <div class="row collapse">
                        <div class="small-12 columns end">
                            <input [(ngModel)]="textbox" type="text" name="q"/>
                        </div>
                    </div>
                </form>
            </div>
         </div>
    </div>
</div>
            `
})
export class Lobby implements AfterViewChecked {

    @ViewChild('chat')
    private scrollControl: ElementRef;
    
    private chatMessages = new Array<ChatMessage>();
    private textbox: string;
    private members: Set<string>;

    constructor(private lobbyService: LobbyService) {
        this.chatMessages = lobbyService.getChatter();
        this.members = lobbyService.getActiveUsers();
    }
    
    warn(message: String) {
        alert(message);
    }
    
    click() {
        if (this.textbox != "") {
            if (this.textbox.length > 9000) {
                this.warn("Message too big");
            } else {
                this.lobbyService.send(0, btoa(this.textbox));
                this.textbox = "";
            }
        }
    }
    
    ngAfterViewChecked() {
        this.scrollControl.nativeElement.scrollTop = this.scrollControl.nativeElement.scrollHeight;
    }

}
