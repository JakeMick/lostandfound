import {Injectable}                               from 'angular2/core';
import {Http, Response, Headers, URLSearchParams,
        RequestOptions} from 'angular2/http';
import {Credential, EmailTracker}                 from '../dto/email';
import {Token}                                    from '../dto/token';
import {Observable}                               from 'rxjs/Observable';
import {ConfigService}                            from '../../config';

@Injectable()
export class LoginService {
    constructor(private http: Http,
                private config: ConfigService) { }

    private loginUrl = this.config.restUrl + 'auth/authenticate';
    private trackerUrl = this.config.restUrl + 'auth/tracker';
    
    sendTracker(emailTracker: EmailTracker) : Observable<String> {
        //let body = JSON.stringify(emailTracker);
        let params = new URLSearchParams();
        params.set('email', emailTracker.email); 
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({
            headers: headers,
            search: params
        });
        
        return this.http.post(this.trackerUrl, '', options)
            .map(res => <String>res.json().data)
            .catch(this.handleError)
    }

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


