import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { environment } from 'src/environment';
import { LocalstorageService } from './shared/service/localstorage.service';
import { Router } from '@angular/router';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(private localstorage: LocalstorageService, private router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let httpParams = request.params;
    let httpHeaders = request.headers;

    if (this.localstorage.isLoggedIn() &&
      this.localstorage.getUserId() != '' &&
      this.localstorage.getUserToken() != '') {
      httpHeaders = new HttpHeaders({
        'userid': this.localstorage.getUserId(),
        'usertoken': this.localstorage.getUserToken()
      });
    }

    const httpOptions = {
      headers: httpHeaders,
      params: httpParams,
    };

    request = request.clone(httpOptions);
    return next.handle(request).pipe(catchError(error => this.handleAuthError(error)));;
  }

  private handleAuthError(error: HttpErrorResponse): Observable<any> {
    console.log('handle error: ' + error.status);
    //handle your auth error or rethrow
    if (error.status === 401 || error.status === 403) {
      this.localstorage.removeUser();
      this.router.navigate(['login']);

      return of(error.message);
    }

    return throwError(error);
  }
}
