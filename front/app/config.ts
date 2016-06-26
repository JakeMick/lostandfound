import {Injectable} from 'angular2/core';

@Injectable()
export class ConfigService {
    restUrl = "http://192.168.1.87:8080/api/"
    lobbyUrl = "ws://192.168.1.87:8080/lobby"
    initialTimeout = 500
    maxTimeout = 300000
    reconnectIfNotNormalClose = false
}