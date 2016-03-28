import {Injectable}                               from 'angular2/core';
import {Http, Response, Headers, URLSearchParams,
        RequestOptions}                           from 'angular2/http';
import {Credential, Email, User}                  from '../dto/email';
import {Token}                                    from '../dto/token';
import {Observable}                               from 'rxjs/Observable';
import {ConfigService}                            from '../../config';

@Injectable()
export class LoginService {
    constructor(private http: Http,
                private config: ConfigService) { }

    private loginUrl = this.config.restUrl + 'auth/token';
    private trackerUrl = this.config.restUrl + 'auth/tracker';
    private userUrl = this.config.restUrl + 'auth/user';  
    private token;
    isAuthenticated = false;
    
    create(user: User) : Observable<any> {
        let body = JSON.stringify(user);
        let headers = new Headers({'Content-Type' : 'application/json'});
        let options = new RequestOptions({
            headers: headers
        });
        return this.http.post(this.userUrl, body, options);
    }
    
    sendTracker(emailTracker: Email) : Observable<any> {
        let params = new URLSearchParams();
        params.set('email', emailTracker.email); 
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({
            headers: headers,
            search: params
        });
        
        return this.http.post(this.trackerUrl, '', options);
    }

    authenticate(credential: Credential) : Observable<any> {
        let body = JSON.stringify(credential)
        let headers = new Headers({
            'Content-Type': 'application/json',
        });
        let options = new RequestOptions({
            headers: headers
        });
        let obs = this.http.post(this.loginUrl, body, options);
        obs.subscribe(res => {
            this.setToken(res.text())
            this.isAuthenticated = true;
        });
        return obs;
    }
    
    private setToken(token: string) {
        this.token = token;
    }
    
    getToken() : string {
        return this.token;
    }
}


