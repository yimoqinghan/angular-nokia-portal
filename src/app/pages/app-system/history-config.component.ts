import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import {HistoryDataConfig, User, UserGroup} from 'src/app/clazz/common-clazz';
import {CommonService} from '../../service/common-service.service';
import {ADDRESS_LIST} from '../../utils/constants';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-history-config',
    templateUrl: './history-config.component.html',
    styleUrls: ['./history-config.component.css']
})
export class HistoryconfigComponent implements OnInit {
    constructor(private httpclient: HttpClient, private commonService: CommonService, private messageSercie: NzMessageService,
                private translate: TranslateService) {
      this.translate.get('history').subscribe(
        value => {
          this.updateConfigTip=value.updateConfigTip;
          this.saved=value.saved;
          this.saveError=value.saveError;
        }
      )
    }

    currentUser: User = new User();

    apiServer = '';
    totalItem = 0;
    dataLoading = false;
    configList: Array<HistoryDataConfig> = [];
    pageSizeOptions: Array<number> = [10, 20, 30, 40, 50];

    config: HistoryDataConfig = new HistoryDataConfig();
    tableName = '';
   // =====================================================================================================================
    newConfig = false;
    visibleConfig = false;
    titleConfig = '';
  updateConfigTip:string;
  saved:string;
  saveError:string;

   // =====================================================================================================================
    visibleGroup = false;
    titleGroup = '';
    listOfGroup: Array<UserGroup> = [];

    ngOnInit(): void {
      this.commonService.getConfiguration().subscribe(conf => {
        this.apiServer = conf.apiServer;
        this.commonService.getUser(this.apiServer).subscribe(item => {
          this.currentUser = item;
        });
        this.commonService.createOperationLog(this.apiServer, 'Search users.');
      });

      this.searchConfigs();
    }

    contentHeight() {
        const height = window.innerHeight - 196 + 'px';
        return {
            height: height
        };
    }

    tableHeight() {
        const height = window.innerHeight - 236 + 'px';
        return {
            y: height
        };
    }

    tableScroll() {
        const height = window.innerHeight - 400 + 'px';
        return {
            y: height
        };
    }

    searchConfigs(){
        this.dataLoading = true;
        const param = {
          tableName: this.tableName,
          page: {}
        };
        this.httpclient.post<HistoryDataConfig[]>(ADDRESS_LIST.API_DATA_CLEAR_CONFIG_LIST, param).subscribe(items => {
            this.dataLoading = false;
            const data = items['data'];
            this.configList = data['content'];
            this.totalItem = items.length;
        });
    }
    createConfig(){
        this.config = new HistoryDataConfig();
        this.titleConfig = 'Create config';
        this.newConfig = true;
        this.openConfig();
    }
    updateConfig(dataConfig: HistoryDataConfig){
        this.config = dataConfig;
        this.titleConfig = this.updateConfigTip;
        this.newConfig = false;
        this.openConfig();
    }
    deleteConfig(dataConfig: HistoryDataConfig){
        this.httpclient.get(ADDRESS_LIST.API_DATA_CLEAR_CONFIG_DELETE.replace('{id}', dataConfig.id)).subscribe(() => {
            this.searchConfigs();
        });
    }
    closeConfig(){
        this.visibleConfig = false;
    }
    openConfig(){
        this.visibleConfig = true;
    }
    saveConfig(){
        if (this.config.tableName === '') {
            this.messageSercie.error('Please input table name.');
            return;
        }

      // tslint:disable-next-line:triple-equals
        if (this.config.datasourceType === '') {
            this.messageSercie.error('Please input  datasource type.');
            return;
        }

      if (this.config.partitionType === '') {
        this.messageSercie.error('Please input unit, D or M.');
        return;
      }

      if (this.config.retention === '') {
        this.messageSercie.error('Please input  saving time.');
        return;
      }

        if (this.newConfig) {
            this.httpclient.post<HistoryDataConfig>(ADDRESS_LIST.API_DATA_CLEAR_CONFIG_SAVE, this.config).subscribe(item => {
              // tslint:disable-next-line:triple-equals
                if (item['message'] != 'OK') {
                    this.messageSercie.error('save error');
                } else {
                    this.messageSercie.success('config created successfully.');
                    this.closeConfig();
                    this.searchConfigs();
                }
            });
        } else {
            // this.httpclient.post<User>(this.apiServer + '/user/update', this.user).subscribe(item => {
            this.httpclient.post<HistoryDataConfig>(ADDRESS_LIST.API_DATA_CLEAR_CONFIG_SAVE, this.config).subscribe(item => {
              // tslint:disable-next-line:triple-equals
                if (item['message'] != 'OK') {
                    this.messageSercie.error(this.saveError);
                } else {
                    this.messageSercie.success(this.saved);
                    this.closeConfig();
                    this.searchConfigs();
                }
            });
        }
    }
}
