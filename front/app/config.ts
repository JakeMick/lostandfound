import {Injectable} from 'angular2/core';

@Injectable()
export class ConfigService {
    restUrl = "http://localhost:8080/api/"
    lobbyUrl = "ws://localhost:8080/lobby"
}