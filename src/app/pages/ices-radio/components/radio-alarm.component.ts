import {Component, OnInit} from '@angular/core';

import {AlarmFilter, AlarmQuery} from 'src/app/pages/ices-radio/clazz/radio-clazz';
import {HttpClient} from '@angular/common/http';
import {HttpService} from 'src/app/service/http.service';
import {DatePipe} from '@angular/common';
import {saveAs} from 'file-saver';
import {ADDRESS_LIST} from '../../../utils/constants';

@Component({
    selector: 'app-radio-alarm',
    templateUrl: './radio-alarm.component.html',
    styleUrls: ['./radio-alarm.component.css']
})
export class RadioAlarmComponent implements OnInit {

    /**
     * 1: active alarm, 0: history alarm
     */
    alarmType: string = '1';
    listOfAlarm: Array<AlarmQuery> = [];
    pageSize: number = 20;
    pageIndex: number = 1;
    pageOptions: Array<number> = [10, 15, 20, 25, 50];
    dataLoading: boolean = false;
    totalItem: number = 0;
    dateRange: Array<Date> = [];
    alarmFilter: AlarmFilter = new AlarmFilter();
    apiServer: string;

    constructor(private httpClient: HttpClient, private httpService: HttpService,private datePipe: DatePipe) { }

    ngOnInit(): void {
        this.httpService.configuration().subscribe(config => {
            this.dateRange = [];
            this.apiServer = config.apiServer;
            this.alarmFilter.startTime = null;
            this.alarmFilter.endTime = null;
            this.alarmFilter.alarmType = this.alarmType;
            this.alarmFilter.enbId = null;
            this.alarmFilter.siteCode = null;
            this.alarmFilter.faultId = null;
            this.alarmFilter.pageIndex = this.pageIndex;
            this.alarmFilter.pageSize = this.pageSize;
            this.initComponent();
        });


    }

    clearFilter() {
        this.dateRange = [];
        this.alarmFilter.startTime = null;
        this.alarmFilter.endTime = null;
        this.alarmFilter.alarmType = this.alarmType;
        this.alarmFilter.enbId = null;
        this.alarmFilter.siteCode = null;
        this.alarmFilter.alarmNo = null;
        this.alarmFilter.faultId = null;
        this.alarmFilter.pageIndex = 1;
        this.alarmFilter.pageSize = 20;

        this.queryAlarms();
    }
    initComponent() {
        this.queryAlarms();
    }

    nzPageIndexChange(pageIndex: number){
        this.alarmFilter.pageIndex = pageIndex;
        this.pageIndex = pageIndex;
        this.queryAlarms();
    }

    nzPageSizeChange(pageSize: number){
        this.pageSize = pageSize;
        this.pageIndex = 1;
        this.alarmFilter.pageSize = pageSize;
        this.alarmFilter.pageIndex = 1;
        this.queryAlarms();
    }

    nzAlarmTypeChange(alarmType: string){
        this.dateRange = [];
        this.alarmFilter.alarmType = alarmType;
        this.alarmType = alarmType;
        this.alarmFilter.startTime = null;
        this.alarmFilter.endTime = null;
        this.alarmFilter.enbId = null;
        this.alarmFilter.siteCode = null;
        this.alarmFilter.alarmNo = null;
        this.alarmFilter.faultId = null;
        this.alarmFilter.pageIndex = 1;
        this.alarmFilter.pageSize = 20;
        this.pageIndex = 1;
        this.pageSize = 20;
        this.queryAlarms();
    }

    search() {
      this.pageIndex = 1;
      this.alarmFilter.pageIndex = 1;
      this.queryAlarms();
    }

    queryAlarms(){
        this.alarmFilter.startTime = this.datePipe.transform(this.dateRange[0], 'yyyy-MM-dd HH:mm:ss');
        this.alarmFilter.endTime = this.datePipe.transform(this.dateRange[1], 'yyyy-MM-dd HH:mm:ss');
        this.dataLoading = true;
        let url: string = this.apiServer+'/alarm/getAlarmData';

        this.httpClient.post(url,this.alarmFilter).subscribe(page => {
            this.listOfAlarm = page['content'];
            this.totalItem = page['totalElements'];
            this.dataLoading = false;
        });
    }

    exportAlarm(){
        const url =  ADDRESS_LIST.ALARM_EXPORT +"?startTime=" +this.alarmFilter.startTime+ "&endTime="+this.alarmFilter.endTime +
        '&alarmNo=' + this.alarmFilter.alarmNo + '&faultId=' + this.alarmFilter.faultId + '&neCode=' +
        this.alarmFilter.enbId + '&siteCode=' + this.alarmFilter.siteCode +'&searchType='+this.alarmFilter.alarmType;

        // window.location.href = url;

        this.httpClient.get(url, { responseType: 'arraybuffer' }).subscribe(data => {
            const tableData = new Blob([data], {
              type: 'application/vnd.ms-excel;charset=UTF-8'
            });
            saveAs(tableData,  'alarm.xlsx');
        });
    }

  tableScroll(){
    const height = window.innerHeight - 380;
    return {
      x: '2000px',
      y: `${height}px`
    };
  }

}
