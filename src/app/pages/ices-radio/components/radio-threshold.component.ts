import {Component, OnInit} from '@angular/core';
import {Threshold} from '../clazz/radio-clazz';
import {HttpClient} from '@angular/common/http';
import {ADDRESS_LIST} from '../../../utils/constants';
import {Response} from '../../../clazz/common-clazz';
import {NzMessageService} from 'ng-zorro-antd/message';

@Component({
    selector: 'app-radio-threshold',
    templateUrl: './radio-threshold.component.html',
    styleUrls: ['./radio-threshold.component.css']
})
export class RadioThresholdComponent implements OnInit {
    constructor(private http: HttpClient, private messageSerivce: NzMessageService) { }

    threshold: Threshold = new Threshold();
    listOfThreshold: Array<Threshold> = [];
    listOfRelation: Array<string> = ['>=', '<='];

    pageSize = 20;
    pageIndex = 1;
    pageOptions: Array<number> = [10, 15, 20, 25, 50];
    dataLoading = false;
    totalItem = 0;
    isVisible = false;

    ngOnInit(): void {
      this.list();
    }
    list() {
      const param = {
        major: 1,
        page: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      };
      this.dataLoading = true;
      this.http.post<Response>(ADDRESS_LIST.API_KPI_THRESHOLD_LIST, param).subscribe(response => {
        this.listOfThreshold = response.data.content;
        this.totalItem = response.data.totalElements;
        this.dataLoading = false;
      });
    }
    thresholdEdit(threshold: Threshold){
        this.threshold = threshold;
        this.isVisible = true;
    }
    closeEditModal(){
        this.isVisible = false;
    }
    thresholdSave(){
      this.http.post<Response>(ADDRESS_LIST.API_KPI_THRESHOLD_SAVE, this.threshold).subscribe(response => {
        if (response.success) {
          this.messageSerivce.success('save success!');
          this.isVisible = false;
        } else {
          this.messageSerivce.error('save data error:' + response.message);
        }
      });
    }


  // page
  nzPageIndexChange(pageIndex: number){
    this.pageIndex = pageIndex;
    this.list();
  }

  nzPageSizeChange(pageSize: number){
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.list();
  }

  tableScroll(){
    const height = window.innerHeight - 380;
    return {
      y: `${height}px`
    };
  }
}
