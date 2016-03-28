import {Component} from 'angular2/core'
import {Subject, Observable} from 'rxjs';
import {LobbyService} from '../service/lobbyfilter';
import {ChatMessage} from '../protocol'


@Component({
    selector: 'lobby',
    template: `
      <div class="lobby">
        <div class="row collapse">
            <div class="small-4 small-centered columns">
                <div class="row collapse" *ngFor="#msg of chatMessages">
                    <div class="small-2 large-4 columns">
                        {{msg.author}}
                    </div>
                    <div class="small-4 large-4 columns">
                        {{msg.body}}
                    </div>
                </div>
                <form (ngSubmit)="click()">
                        <div class="row collapse">
                            <div class="large-4 columns">
                                <input [(ngModel)]="textbox" type="text" name="q" />
                            </div>
                        </div>
                </form>
            </div>
        </div>
      </div>
            `
})
export class Lobby {

    private chatMessages = new Array<ChatMessage>();
    private textbox: string;

    constructor(private lobbyService: LobbyService) {
        this.chatMessages = lobbyService.getChatter();
    }

    click() {
        if (this.textbox != "") {
            this.lobbyService.send(this.textbox);
            this.textbox = "";
        }
    }

}
