import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { HttpService } from 'src/app/service/http.service';
import { NzMessageService } from 'ng-zorro-antd';
import { FileNode } from 'src/app/clazz/common-clazz';
import { Utils } from 'src/app/clazz/utils-clazz';
import {NokiaHeaderComponent} from '../../module/nokia-header/nokia-header.component';

@Component({
    selector: 'app-app-logger',
    templateUrl: './app-logger.component.html',
    styleUrls: ['./app-logger.component.css']
})

export class AppLoggerComponent implements OnInit, AfterViewInit {
    constructor(private httpclient: HttpClient,
                private httpService: HttpService,
                private datePipe: DatePipe,
                private messageService: NzMessageService) { }

    @ViewChild(NokiaHeaderComponent, { static: false }) headerService: NokiaHeaderComponent;

    apiServer: string;
    pageTitle = 'Fault Collection';
    selectProgram: number;
    listOfProgram: Array<any> = [];
    selectLogFile: string = null;
    listOfProgramLogFile: Array<string> = [];
    logwebsocket: WebSocket = null;
    loadingFile = false;
    loglistLoading = false;
    listOfLog: Array<string> = [];
    listOfLogFile: Array<FileNode> = [];
    values: any[] | null = null;
    logfileSettingVisible = false;

    exporting = false;

    ngOnInit(): void {
        this.httpService.configuration().subscribe(item => {
            this.apiServer = item.apiServer;
            this.queryPrograms();
        });
    }

    ngAfterViewInit(): void { }

    queryPrograms() {
      this.httpclient.get<any[]>(this.apiServer + '/syslog/program').subscribe(items => {
        this.listOfProgram = items;
      });
    }
    queryProgramLogFiles() {
      this.loadingFile = true;
      this.httpclient.get<FileNode[]>(this.apiServer + '/syslog/program/logfile?id=' + this.selectProgram).subscribe(items => {
        this.values = null;
        this.listOfLogFile = items;
        this.loadingFile = false;
      });
    }
    progaramChange() {
        this.queryProgramLogFiles();
    }

    /**
     * 查看程序日志文件内容
     */
    searchLog() {

      if (this.selectLogFile == null) {
        this.messageService.error('Please select a log file.');
        return;
      }

      this.listOfLog = [];
      this.loglistLoading = true;
      setInterval(() => {
        this.listOfLog = this.listOfLog.concat([]);
      }, 1000);

      const sessionId = this.selectLogFile;
      if (this.logwebsocket != null) {
        this.logwebsocket.close();
      }
      let wsurl = Utils.getWebsoket(this.apiServer);
      this.logwebsocket = new WebSocket(wsurl + '/searchlog/' + sessionId);

      this.logwebsocket.onmessage = (ev: MessageEvent) => {
        this.loglistLoading = false;
        this.listOfLog.push(ev.data);
      };

      this.logwebsocket.onerror = (e: Event) => {
        console.log('error:', e);
      };
      this.logwebsocket.onopen = (e: Event) => {
        console.log('open: ', e);
      }
      this.logwebsocket.onclose = (e: Event) => {
        console.log('close: ', e);
      }
    }

  exportLog() {
    if (this.selectLogFile == null) {
      this.messageService.error('Please select a log file.');
      return;
    }
    this.exporting = true;
    const url = this.apiServer + '/syslog/export/logfile?sessionId=' + this.selectLogFile;
    this.httpclient.get(url).subscribe(rep => {
      this.exporting = false;
      const path = rep['message'];
      if (path !== '0') {
        this.httpService.exportFile(this.apiServer, path);
      }
    });
  }

    onChanges(values: Array<string>): void {
        if (values == null || values.length === 0) {
            this.selectLogFile = null;
        } else {
            this.selectLogFile = values[values.length - 1];
        }
        console.log(this.selectLogFile);
    }

  contentStyle(){
    return {
      height: `${window.innerHeight - 200}px`
    };
  }
}
