import {Injectable}              from 'angular2/core';
import {Http, Response, Headers} from 'angular2/http';
import {Credential}              from '../directive/signupon';
import {Token}                   from '../dto/token';
import {Observable}              from 'rxjs/Observable';

@Injectable()
export class LoginService {
    constructor(private http: Http) { }

    private loginUrl = 'api/authenticate';

    authenticate(credential: Credential) : Observable<Token> {
        let body = JSON.stringify(credential);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        return this.http.post(this.loginUrl, body)
            .map(res => <Token>res.json().data)
            .catch(this.handleError);
    }
    
    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
