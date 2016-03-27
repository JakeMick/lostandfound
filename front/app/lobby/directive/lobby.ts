import {Component} from 'angular2/core'
import {LobbyService} from '../service/lobbycon'

@Component({
    selector: 'lobby',
    template: `
      <div class="lobby">
        <div class="row">
            <div class="small-4 small-centered columns">
                kitties
            </div>
        </div>
      </div>
            `
})
export class Lobby {
    
    constructor(private lobbyService: LobbyService) {
        lobbyService.ngOnInit();
    }    

}