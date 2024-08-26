import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HttpService} from 'src/app/service/http.service';
import {CommonService} from '../../service/common-service.service';
import {Response, User} from '../../clazz/common-clazz';
import {NzModalService} from 'ng-zorro-antd/modal';
import {HttpClient} from '@angular/common/http';
import {Utils} from '../../clazz/utils-clazz';

@Component({
    selector: 'app-nokia-header',
    templateUrl: './nokia-header.component.html',
    styleUrls: ['./nokia-header.component.css']
})
export class NokiaHeaderComponent implements OnInit {

    @Input() pageHref = '';
    pageTitle = '无线网元管理系统';
    username = 'sign in';
    alreadyLogin = false;
    currentUser: User = new User();
    emailSupport = '';
    // emailSupport = 'support.ices@nokia.com';
    logwebsocket: WebSocket;

    constructor(private httpService: HttpService,
                private http: HttpClient,
                private router: Router,
                private modal: NzModalService,
                private commonService: CommonService) { }
    apiServer: string;
    monitorVisiable = false;
    monitorContent: any;
    monitorTitle = 'Host warning ';
    nzCancelText = null;


    ngOnInit(): void {
        this.httpService.configuration().subscribe(conf => {
            this.apiServer = conf.apiServer;
            this.commonService.getUser(this.apiServer).subscribe(user => {
              if (user.id > 0) {
                this.currentUser = user;
                this.username = user.name;
                this.alreadyLogin = true;
              } else {
                this.router.navigate(['login']);
              }
            });

            {
              const wsurl = Utils.getWebsoket(this.apiServer);
              this.logwebsocket = new WebSocket(wsurl + '/searchlog/ws/alarm');
              this.logwebsocket.onmessage = (ev: MessageEvent) => {
                if (ev.data !== 'OK') {
                  const content =  ' Port ' + ev.data + ' used to connect the active and standby servers is disconnected. Please check the connection immediately! ';
                  this.warning(content);
                }
              };
              this.logwebsocket.onerror = (e: Event) => {
                console.log('error:', e);
              };
              this.logwebsocket.onopen = (e: Event) => {
                console.log('open: ', e);
              };
              this.logwebsocket.onclose = (e: Event) => {
                console.log('close: ', e);
              };
            }
        });

        // clearInterval();
        // this.monitor();
    }

  warning(content: string): void {
    this.modal.closeAll();
    this.modal.warning({
      nzTitle: 'Host warning !!!',
      nzContent: content
    });
  }

  monitor(): void {
    setInterval( () => { this.ping(); }, 1000 *  60 * 2 );
  }

  ping(): void {
    this.httpService.configuration().subscribe(conf => {
      this.http.get<Response>( conf.apiServer + '/setting/general/monitor').subscribe(result => {
        if (result.success && result.data != null && 'OK' !== result.data) {
          const content =  ' Port ' + result.data + ' used to connect the active and standby servers is disconnected. Please check the connection immediately! ';
          this.warning(content);
        }
      });
    });
  }

  homepage() {
    this.router.navigate(['/']);
  }

  logout() {
    this.httpService.logout(this.apiServer).subscribe(rep => {
      localStorage.removeItem('token');
      this.router.navigate(['login']);
    });
  }

  user() {
    //
  }

  closeMonitor() {
    this.monitorVisiable = false;
  }
}
