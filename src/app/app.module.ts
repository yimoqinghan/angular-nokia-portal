import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {CommonModule, DatePipe, HashLocationStrategy, LocationStrategy, registerLocaleData} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {NZ_ICONS, NzIconModule} from 'ng-zorro-antd/icon';

import {DashboardOutline, FormOutline, MenuFoldOutline, MenuUnfoldOutline} from '@ant-design/icons-angular/icons';
import {AppComponent} from './app.component';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NZ_I18N, zh_CN} from 'ng-zorro-antd/i18n';

import zh from '@angular/common/locales/zh';

import {RequestOptions} from './service/http-interceptor.service';
import {LeafletMapService} from 'src/app/service/leaflet-map.service';
import {NzMessageModule, NzMessageService} from 'ng-zorro-antd/message';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';

import {HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule,TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

export function createTranslateHttpLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline];

registerLocaleData(zh);

const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: '/login' },
    { path: 'login', loadChildren: () => import('./pages/app-login/system-login.module').then(m => m.SystemLoginModule) },
    { path: 'system-logger', loadChildren: () => import('./pages/app-logger/app-logger.module').then(m => m.AppLoggerModule) },
    { path: 'system', loadChildren: () => import('./pages/app-system/system.module').then(m => m.SystemModule) },
    { path: 'radio', loadChildren: () => import('./pages/ices-radio/radio.module').then(m => m.RadioModule) }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        NzIconModule,
        NzLayoutModule,
        NzMenuModule,
        FormsModule,
        HttpClientModule,
        NzPopconfirmModule,
        BrowserAnimationsModule,
        NzMessageModule,
        CommonModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateHttpLoader,
            deps: [HttpClient]
          }
        })
    ],
    exports: [NzIconModule],
    providers: [
        { provide: NZ_I18N, useValue: zh_CN },
        { provide: NZ_ICONS, useValue: icons },
        { provide: HTTP_INTERCEPTORS, useClass: RequestOptions, multi: true },
        { provide: LocationStrategy, useClass: HashLocationStrategy},
        { provide: NzMessageService},
        DatePipe,
        LeafletMapService,
        TranslateService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
