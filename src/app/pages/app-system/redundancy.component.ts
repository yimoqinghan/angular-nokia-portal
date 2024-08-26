import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {GeneralConfig} from 'src/app/clazz/common-clazz';
import { HttpService } from 'src/app/service/http.service';

import * as L from 'leaflet';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
    selector: 'app-redundancy',
    templateUrl: './redundancy.component.html',
    styleUrls: ['./redundancy.component.css']
})
export class RedundancyComponent implements OnInit {

    constructor(private httpService: HttpService, private messageSercie: NzMessageService, private http: HttpClient) { }
    apiServer: string;

  // tslint:disable-next-line:variable-name
    master_host = 'master_host';
  // tslint:disable-next-line:variable-name
    redundancy_host = 'redundancy_host';
    masterHost: GeneralConfig = new GeneralConfig();
    redundancyHost: GeneralConfig = new GeneralConfig();

    ngOnInit(): void {

        this.httpService.configuration().subscribe(conf => {
            this.apiServer = conf.apiServer;
            this.http.get<GeneralConfig[]>(this.apiServer + '/setting/general/get/host').subscribe(items => {
              items.forEach(item => {
                if (item.key === 'master_host') {
                  this.masterHost = item;
                } else if (item.key === 'redundancy_host') {
                  this.redundancyHost = item;
                }
              });
            });
        });
    }

    pageHeight(){
        const height = (window.innerHeight - 185) + 'px';
        const width = (window.innerWidth - 185) + 'px';
        return {
            height, width
        };
    }

    saveSettings(){
      this.masterHost.key = this.master_host;
      this.redundancyHost.key = this.redundancy_host;
      this.masterHost.module = 'redundancy';
      this.masterHost.label = 'Master Host IP';
      this.redundancyHost.module = 'redundancy';
      this.redundancyHost.label = 'Redundancy host IP';
      this.save(this.masterHost);
      this.save(this.redundancyHost);
      this.messageSercie.success('Saved successfully.');
    }

    save(config: GeneralConfig){
        this.http.post(this.apiServer + '/setting/general/save', config).subscribe();
    }
}
