import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService, AuthTokenService} from '@app/core/services';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router, private authService: AuthService, private authTokenService: AuthTokenService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const azureCode = route.queryParamMap.get('code');
    if (this.authService.isLoggedIn(azureCode)) {
      return true;
    }

    // if (azureCode !== null && azureCode !== undefined) {
    //     console.log(this.authTokenService.getTokenPayload(azureCode));
    //     localStorage.setItem('SessionToken', azureCode);
    //     return true;
    // }

    const currentUrl = `${window.location.protocol}//${window.location.host}${state.url}`;
    this.authService.login(currentUrl)
      .then(() => console.log('External request to Clarivate Azure has been done'));
    return false;
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }
}
