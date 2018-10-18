import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

import {config} from '../../editorial-selection.config';
import {AuthorizationService} from './authorization.service';
import {SessionValidationError} from './token-validation.service';

@Injectable()
export class AuthenticationService {

    constructor(private router: Router, private authorizationService: AuthorizationService, private location: Location) {
    }

    /**
     * Builds URL for Azure login, using return url for turning back.
     * @param returnUrl location from which the request is made
     */
    private static buildLoginUrl(returnUrl: string): string {
        return `${config.azure.baseUrl}/${config.azure.authorize}${returnUrl}`;
    }

    /**
     * Checks if a value really exists
     * @param value under testing value
     */
    private static isPresent(value: string) {
        return value !== null && value !== undefined;
    }

    /**
     * Checks if a session token is present on localStorage.
     * If it is true, checks token validity.
     * @return true if a session token exists, false otherwise
     */
    isLoggedIn(azureCode: string, targetUrl: string): boolean {
        const token = this.authorizationService.sessionToken;
        if (!AuthenticationService.isPresent(token) && !AuthenticationService.isPresent(azureCode)) {
            return false;
        }
        if (AuthenticationService.isPresent(azureCode)) {
            this.authorizationService.sessionToken = azureCode;
            this.router.navigate([this.cleanCodeFromCurrentUrl(targetUrl)], {queryParamsHandling: 'preserve'})
                .then(() => console.debug('Clean navigation to target URL'));
            return true;
        }
        if (AuthenticationService.isPresent(token)) {
            this.authorizationService.validateToken(token).subscribe(
                val => console.debug(`Employee ${val.employeeId} successfully logged in.`),
                err => this.handleValidationError(err));
            return true;
        }
        return false;
    }

    /*
    Support methods
    */

    /**
     * Manage errors on token validation.
     *
     * @param error
     */
    handleValidationError(error: SessionValidationError) {
        switch (error.status) {
            case 419:
                this.authorizationService.refreshToken(this.authorizationService.sessionToken)
                    .subscribe(value => console.log('New session token obtained: ' + value.substr(value.length - 10, 10)));
                break;
            default:
                this.login(this.location.path(false))
                    .then(() => console.log(`Redirected to login by token validation error: ${error.message}`));
        }
    }

    login(returnUrl: string): Promise<boolean> {
        const currentUrl = `${window.location.protocol}//${window.location.host}${returnUrl}`;
        const azureUrl = AuthenticationService.buildLoginUrl(currentUrl);
        return this.router.navigate([config.LOGIN_URL], {
            queryParams: {externalUrl: azureUrl},
            queryParamsHandling: 'merge'
        });
        // return of(true)
        //   .pipe(
        //     delay(1000),
        //     tap(val => this.isLoggedIn = true)
        //   )
    }

    logout(): void {
        this.authorizationService.clearSession();
    }

    private cleanCodeFromCurrentUrl(url: string) {
        return url.split('?')[0];
    }
}
