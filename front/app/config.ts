import {Injectable} from 'angular2/core';

@Injectable()
export class ConfigService {
    restUrl = "http://localhost:8080/api/"
    websocketUrl = "http://localhost:8080/ws/"
}