import {Component, OnInit} from '@angular/core';
import {BtsState, CellStateFilter} from 'src/app/pages/ices-radio/clazz/radio-clazz';
import {HttpClient} from '@angular/common/http';
import {HttpService} from 'src/app/service/http.service';
import {DatePipe} from '@angular/common';
import {saveAs} from 'file-saver';
import {ADDRESS_LIST} from '../../../utils/constants';

@Component({
    selector: 'app-radio-state',
    templateUrl: './radio-state.component.html',
    styleUrls: ['./radio-state.component.css']
})
export class RadioStateComponent implements OnInit {

    dateRange = [];
    cellStateFilter:CellStateFilter = new CellStateFilter();
    listOfCellState: Array<BtsState> = [];

    pageSize: number = 20;
    pageIndex: number = 1;
    pageOptions: Array<number> = [10, 15, 20, 25, 50];
    enbStateList: Array<{ name: string; code: string }> = [{ name: 'onair', code: 'onair' },{ name: 'other', code: 'other' }];
    trsStateList: Array<{ name: string; code: string }> = [{ name: 'OK', code: 'OK' },{ name: 'NOK', code: 'NOK' }];
    adminStateList: Array<{ name: string; code: string }> = [{ name: 'unlocked', code: 'unlocked' },{ name: 'locked', code: 'locked' }];
    operationalStateList: Array<{ name: string; code: string }> = [{ name: 'enabled', code: 'enabled' },{ name: 'disabled', code: 'disabled' }];
    dataLoading: boolean = false;
    totalItem: number = 0;
    apiServer: string;
    heigth: string;

    constructor(private httpClient:HttpClient,private httpService: HttpService,private datePipe: DatePipe) { }

    ngOnInit(): void {
        this.httpService.configuration().subscribe(config => {
            this.apiServer = config.apiServer;
            this.cellStateFilter.adminState = null;
            this.cellStateFilter.enbId = null;
            this.cellStateFilter.enbName = null;
            this.cellStateFilter.enbState = null;
            this.cellStateFilter.operationalState = null;
            this.cellStateFilter.startTime = null;
            this.cellStateFilter.stopTime = null;
            this.cellStateFilter.trsState = null;
            this.cellStateFilter.pageIndex = this.pageIndex;
            this.cellStateFilter.pageSize = this.pageSize;
            this.initComponent();
        });

    }

    tableScroll(){
      const height = window.innerHeight - 380;
      return {
        y: `${height}px`
      };
    }


    initComponent() {
        this.queryCellState();
    }

    nzPageIndexChange(pageIndex: number){
        this.cellStateFilter.pageIndex = pageIndex;
        this.pageIndex = pageIndex;
        this.queryCellState();
    }

    nzPageSizeChange(pageSize: number){
        this.cellStateFilter.pageSize = pageSize;
        this.cellStateFilter.pageIndex = 1;
        this.pageSize = pageSize;
        this.pageIndex = 1;
        this.queryCellState();
    }

    clearFilter() {
        this.dateRange = [];
        this.cellStateFilter = new CellStateFilter();
        this.cellStateFilter.adminState = null;
        this.cellStateFilter.enbId = null;
        this.cellStateFilter.enbName = null;
        this.cellStateFilter.enbState = null;
        this.cellStateFilter.operationalState = null;
        this.cellStateFilter.startTime = null;
        this.cellStateFilter.stopTime = null;
        this.cellStateFilter.trsState = null;
        this.cellStateFilter.pageIndex = 1;
        this.cellStateFilter.pageSize = 20;

        this.queryCellState();
      }

    dateRangeChange(range: any){
        this.cellStateFilter.startTime = this.datePipe.transform(range[0], 'yyyy-MM-dd HH:mm:ss');
        this.cellStateFilter.stopTime = this.datePipe.transform(range[1], 'yyyy-MM-dd HH:mm:ss');
    }

    search() {
      this.pageIndex = 1;
      this.cellStateFilter.pageIndex = 1;
      this.queryCellState();
    }

    queryCellState(){
        this.dataLoading = true;
        console.log(this.cellStateFilter);
        let url: string = this.apiServer+'/status/getStateData';
        this.httpClient.post(url,this.cellStateFilter).subscribe(page => {
            this.listOfCellState = page['content'];
            this.totalItem = page['totalElements'];
            this.dataLoading = false;
        });
    }

    exportState(){
         const url  = ADDRESS_LIST.STATUS_EXPORT +"?startTime=" +this.cellStateFilter.startTime+ "&stopTime="+
        this.cellStateFilter.stopTime + '&operationalState=' + this.cellStateFilter.operationalState + '&enbState=' + this.cellStateFilter.enbState +
        '&adminState=' + this.cellStateFilter.adminState+'&trsState='+this.cellStateFilter.trsState+'&enbId='+this.cellStateFilter.enbId+'&enbName='+this.cellStateFilter.enbName;

        // window.location.href = url;

        this.httpClient.get(url, { responseType: 'arraybuffer' }).subscribe(data => {
          const tableData = new Blob([data], {
            type: 'application/vnd.ms-excel;charset=UTF-8'
          });
          saveAs(tableData,  'BtsStatus.xlsx');
        });
    }

}
