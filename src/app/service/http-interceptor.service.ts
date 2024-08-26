import {Injectable, Injector} from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest,
  HttpErrorResponse, HttpResponse
} from '@angular/common/http';
import {timeout} from 'rxjs/operators';
import {catchError} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';

@Injectable()
export class RequestOptions implements HttpInterceptor {

  constructor(private injector: Injector, private router: Router) {
  }

  goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  get msg(): NzMessageService {
    return this.injector.get(NzMessageService);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const header = req.headers;
    let authReq = req;
    let token = localStorage.getItem('token');
    if (token == null || token === 'null') {
      token = '';
    }
    authReq = req.clone({
      headers: header.set('Authorization', token)
    });
    return next.handle(authReq).pipe(mergeMap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.status === 200) {
          return this.handleData(event);
        }
        return of(event);
      }), timeout(600000),
      catchError((err: HttpErrorResponse) => this.handleData(err))
    );
  }

  private handleData(event: HttpResponse<any> | HttpErrorResponse): Observable<any> {
    // 业务处理：一些通用操作
    switch (event.status) {
      case 200:
        break;
      // 页面跳转
      case 401: // 未登录状态码
        this.router.navigate(['login']);
        break;
      // tslint:disable-next-line:indent
      case 403:
      case 404:
      case 500:
        break;
      default:
        if (event instanceof HttpErrorResponse) {
          const eventErr = event.error.message || '';
          this.msg.error(event.message + '' + eventErr);
        }
        break;
    }
    return of(event);
  }

}
