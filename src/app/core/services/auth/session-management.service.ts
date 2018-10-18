import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Resource} from '../../model/resource';
import {ResourceService} from '../resource.service';
import {config} from '../../editorial-selection.config';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

export interface UserDetails extends Resource {
    access_token: string;
    employeeId: string;
    expires_in: number;
    expires_on: number;
    firstName: string;
    lastName: string;
    groups: string[];
    loginid: string;
    userid: string;
}

export interface SessionRefresh extends Resource {
    uid: string;
    token: string;
}

@Injectable()
export class SessionManagementService extends ResourceService<UserDetails> {
    constructor(httpClient: HttpClient) {
        super(httpClient, config.azure.baseUrl, config.azure.session.endpoint);
    }

    /**
     * Usually, a user will need a new access token only after the previous one expires,
     * or when gaining access to a new resource for the first time.
     * @param session representation for current session, containing access token and user subject from azure.
     */
    refresh(session: SessionRefresh): Observable<SessionRefresh> {
        return this.httpClient
            .post<SessionRefresh>(`${this.url}/${this.endpoint}/${session.uid}`,
                this.serializer ? this.serializer.toJson(session) : session)
            .pipe(map(data => this.serializer ? this.serializer.fromJson(data) as SessionRefresh : data as SessionRefresh));
    }
}
