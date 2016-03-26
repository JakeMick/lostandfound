import {Component} from 'angular2/core';
import {SignUp} from './auth/directive/signup';
import {SignOn} from './auth/directive/signon';
import {Respond} from './auth/directive/respond';

import {Lobby} from './lobby/directive/lobby';
import {LobbyService} from './lobby/service/lobbycon';

import {HTTP_PROVIDERS} from 'angular2/http';
import {ConfigService} from './config'
import {LoginService} from './auth/service/login';
import {RouteConfig, ROUTER_PROVIDERS, ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'lf-app',
    template: `
    <nav class="top-bar" data-topbar role="navigation">
        <ul class="title-area">
            <li class="name">
                <h1><a href="/">LF</a></h1>
            </li>
            <li class="toggle-topbar menu-icon">
                <a href="#"><span>Menu</span></a>
            </li>
        </ul>

        <section class="top-bar-section">
            <ul class="left">
                <li><a [routerLink]="['SignOn']">Login</a></li>
            </ul>
        </section>
    </nav>
    <router-outlet></router-outlet>

    `,
    directives: [ROUTER_DIRECTIVES,
                 SignUp,
                 SignOn],
    providers: [ROUTER_PROVIDERS,
                HTTP_PROVIDERS,
                LoginService,
                ConfigService,
                LobbyService
                ] 
})
@RouteConfig([
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    },
    {
        path: '/',
        name: 'SignOn',
        component: SignOn,
        useAsDefault: true
    },
    {
        path: '/respond/:tracker',
        name: 'Respond',
        component: Respond
    },
    {
        path: '/lobby',
        name: 'Lobby',
        component: Lobby
    }
])
export class LFApp {
}
