import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/operators';

import {SessionManagementService, UserDetails} from './session-management.service';
import {SessionValidation, TokenValidationService} from './token-validation.service';
import {config} from '../../editorial-selection.config';
import {RoleManagementService} from './role-management.service';

@Injectable()
export class AuthorizationService {

    constructor(private sessionManagementService: SessionManagementService,
                private tokenValidationService: TokenValidationService,
                private roleManagementService: RoleManagementService) {
    }

    get sessionToken(): string {
        return localStorage.getItem(config.SESSION_TOKEN);
    }

    /**
     * Setter for Session Token that stores all user details to local storage.
     * @param token Token provided by authentication service.
     */
    set sessionToken(token: string) {
        // Setting temporary token to local storage
        localStorage.setItem(config.SESSION_TOKEN, token);
        this.getUserDetails(token).subscribe(user => {
            localStorage.setItem(config.SESSION_TOKEN, user.access_token);
            localStorage.setItem('userId', user.userid);
            localStorage.setItem('employeeId', user.employeeId);
            localStorage.setItem('email', user.loginid);
            localStorage.setItem('name', `${user.lastName}, ${user.firstName}`);
            localStorage.setItem('roles', this.roleManagementService.getRoles(user.groups).toString());
        });
    }

    /* ------------------------------------------------------------------------------ */
    /* Those functions were used when user information was retrieved by decrypting it */

    /* ------------------------------------------------------------------------------ */
    static readPayload(token) {
        return AuthorizationService.getTokenPayload(token);
    }

    private static getTokenPayload(token) {
        return token
            ? JSON.parse(AuthorizationService.b64DecodeUnicode(token.split('.')[1]))
            : null;
    }

    /**
     * Going backwards: from bytestream, to percent-encoding, to original string.
     * @param str
     */
    private static b64DecodeUnicode(str) {
        return decodeURIComponent(
            atob(str)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        );
    }

    /* ------------------------------------------------------------------------------ */

    /**
     * Given the token from single sign on, we request for user information to
     * get a longer expiration token and the groups the user belongs to.
     *
     * @param token Token retrieve from single sign on
     */
    getUserDetails(token: string): Observable<UserDetails> {
        return this.sessionManagementService.read(token);
    }

    /**
     * Given the provided token, checks if it is valid or whether it is expired
     *
     * @param token Retrieved token from single sign on
     */
    validateToken(token: string): Observable<SessionValidation> {
        return this.tokenValidationService.read(token);
    }

    /**
     * Whenever an access token is required to access a specific resource, a client may use a refresh token to get a new access token
     * issued by the authentication server. Common use cases include getting new access tokens after old ones have expired,
     * or getting access to a new resource for the first time.
     *
     * @param token Current token available to the user.
     */
    refreshToken(token: string) {
        const payload = AuthorizationService.readPayload(token);
        console.log(payload);
        const sessionValidation = {uid: payload.sub, token: token};
        return this.sessionManagementService.refresh(sessionValidation).pipe(flatMap(newSession => {
            localStorage.setItem(config.SESSION_TOKEN, newSession.token);
            return of(newSession.token);
        }));
    }

    clearSession() {
        localStorage.clear();
    }


    /* Groups management */

}
