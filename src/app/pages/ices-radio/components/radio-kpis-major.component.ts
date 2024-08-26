import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {saveAs} from 'file-saver';
import {AbnormalKpi, CellKpiFilter, Kpi, KpiTrend} from 'src/app/pages/ices-radio/clazz/radio-clazz';
import {ADDRESS_LIST} from '../../../utils/constants';
import {Response} from '../../../clazz/common-clazz';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-radio-kpis-major',
    templateUrl: './radio-kpis-major.component.html',
    styleUrls: ['./radio-kpis-major.component.css']
})
export class RadioKpisMajorComponent implements OnInit {

    dateRange: Array<Date> = [];
    cellKpiFilter: CellKpiFilter = new CellKpiFilter();

    totalKpis: Array<Kpi> = [];
    listOfKpi: Array<Kpi> = [];
    // listOfNormalKpi: Array<Kpi> = [];
    // listOfAbnormalKpi: Array<Kpi> = [];
    listOfCellKpi: Array<AbnormalKpi> = [];

    pageSize = 20;
    pageIndex = 1;
    pageOptions: Array<number> = [10, 15, 20, 25, 50];
    dataLoading = false;
    totalItem = 0;

    kpiId: number;
    isVisible = false;
    abnormalKpi: AbnormalKpi = new AbnormalKpi();
    startTime: Date = new Date();
    stopTime: Date = new Date();
    echartOfKpi: object;
    cellId: number;
    neCode: number;

    constructor(private http: HttpClient, private datePipe: DatePipe) {
      this.startTime.setHours(0, 0 , 0);
      this.stopTime.setHours(23, 59, 59);
    }

    ngOnInit(): void {
      this.queryKpis();
      this.queryAbnormalKpis();
    }


    nzPageIndexChange(pageIndex: number){
        this.pageIndex = pageIndex;
        this.queryAbnormalKpis();
    }

    nzPageSizeChange(pageSize: number){
        this.pageSize = pageSize;
        this.pageIndex = 1;
        this.queryAbnormalKpis();
    }

    onKpiChange() {
        this.queryKpiTrends();
    }

    queryAbnormalKpis(){
        let stopTime: string | null = '';
        let beginTime: string | null = '';
        if (this.dateRange != null && this.dateRange.length === 2) {
          stopTime = this.datePipe.transform(this.dateRange[1], 'yyyy-MM-dd HH:mm:ss');
          beginTime = this.datePipe.transform(this.dateRange[0], 'yyyy-MM-dd HH:mm:ss');
        }

        const param = {
          neCode: this.cellKpiFilter.enbId,
          cellId: this.cellKpiFilter.cellId,
          major: 1,
          startTime: beginTime,
          endTime: stopTime,
          page: {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        };

        this.list(param);
    }

    list(param) {
      this.dataLoading = true;
      this.http.post<Response>(ADDRESS_LIST.API_KPI_LIST, param).subscribe(response => {
        if (response.data != null) {
          this.listOfCellKpi = response.data.content;
          this.totalItem = response.data.totalElements;
        }

        this.dataLoading = false;
      });
    }

    queryKpis(){
        this.http.get<Response>(ADDRESS_LIST.API_ABNORMAL_KPI_LIST).subscribe(response => {
            this.totalKpis = response.data;
            const kpis: Array<Kpi> = [];
            this.totalKpis.forEach(kpi => {
                if (kpi.major === 1) {
                    kpis.push(kpi);
                }
            });
            this.listOfKpi = kpis;
        });
    }

    openKpiModal(cellKpi: AbnormalKpi){
        console.log(cellKpi);
        this.neCode = cellKpi.neCode;
        this.cellId = cellKpi.cellId;
        this.abnormalKpi = cellKpi;
        this.kpiId = this.listOfKpi[0].id;

        this.queryKpiTrends();
        this.isVisible = true;
    }
    closeKpiModal(){
        this.isVisible = false;
    }

    randomKpis(flag: string, base?:number){
        const values:Array<number> = [];
        let kpi:number = null;
        if (flag == '%') {
            if (base == undefined) {
                base = 0.89;
            }
            for (let index = 0; index < 24; index++) {
                kpi = base + (Math.random() * 0.11);
                values.push(parseFloat((kpi * 100).toFixed(2)));
            }
        } else {
            if (base == undefined) {
                base = 900;
            }
            for (let index = 0; index < 24; index++) {
                kpi = base + (Math.random() * 100);
                values.push(parseFloat(kpi.toFixed(0)));
            }
        }
        return values;
    }

    queryKpiTrends(){
        const param = {
          stopTime: this.datePipe.transform(this.startTime, 'yyyy-MM-dd HH:mm:ss'),
          beginTime: this.datePipe.transform(this.stopTime, 'yyyy-MM-dd HH:mm:ss'),
          cellId: this.cellId,
          kpiId: this.kpiId,
          neCode: this.neCode
        };

        this.trend(param);
    }

    trend(param) {
      let trends:Array<KpiTrend> = [];
      this.dataLoading = true;
      this.http.post<Response>(ADDRESS_LIST.API_KPI_TREND_BY_KPIID.replace('{kpiId}', param.kpiId), param).subscribe(response => {
        trends = response.data;
        this.dataLoading = false;
        const xAxis:Array<string> = trends[0].periods;
        // const threshold = trends[0].threshold;
        this.echartOfKpi = this.createChartOption(xAxis, trends);
      });
    }

    getKpi(dataMap:any, key:number) {
      const kpiValue = dataMap[key];
      if (kpiValue === null || kpiValue === 'null') {
        return '-';
      }
      return kpiValue + ' %';
    }

    createChartOption(xAxis:Array<string>, kpis:Array<KpiTrend>){
        const legends:Array<string> = [];
        const series = [];
        kpis.forEach(kpi => {
            legends.push(kpi.kpiName);
            series.push({
                type: 'line',
                name: kpi.kpiName,
                data: kpi.values,
                markLine: {
                  silent: true,
                  lineStyle: {type: 'solid', normal: {color: 'red'}},
                  data: [{ yAxis: kpi.threshold}]
                }
            });
        });
        var colors = ['#5793f3', '#d14a61', '#675bba'];
        return {
            title: {
                text: kpis[0].kpiName
            },
            tooltip: {
                trigger: 'axis',
                position: function (pos: any, params: any, dom: any, rect: any, size: any) {
                    var obj = {top: 10};
                    obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
                    return obj;
                },
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
                top: '15%'
            },
            color: colors,
            // legend: {
            //     x: 'left',
            //     type: 'scroll',
            //     orient: 'vertical',
            //     top: 30,
            //     data: legends
            // },
            xAxis: [{
                type: 'category',
                axisTick: {
                    alignWithLabel: true
                },
                data: xAxis
            }],
            yAxis: [{
                type: 'value',
                name: '%',
                min: 0,
                max: 100,
                position: 'left',
                axisLabel: {
                    formatter: '{value} %'
                }
            }],
            series: series
        };
    }

  search() {
    this.pageIndex = 1;
    this.pageSize = 20;
    let stopTime: string | null = '';
    let beginTime: string | null = '';
    if(this.dateRange != null && this.dateRange.length === 2) {
      stopTime = this.datePipe.transform(this.dateRange[1], 'yyyy-MM-dd HH:mm:ss');
      beginTime = this.datePipe.transform(this.dateRange[0], 'yyyy-MM-dd HH:mm:ss');
    }

    const param = {
      neCode: this.cellKpiFilter.enbId,
      cellId: this.cellKpiFilter.cellId,
      startTime: beginTime,
      endTime: stopTime,
      page: {},
      major: 1
    };
    this.list(param);
  }

  reset() {
    this.dateRange = [];
    this.cellKpiFilter = new CellKpiFilter();
    const param = {page: {}, major: 1};
    this.list(param);
  }

  trendSearch() {
    const param = {
      neCode: this.neCode,
      kpiId: this.kpiId,
      cellId: this.cellId,
      startTime: this.datePipe.transform(this.startTime, 'yyyy-MM-dd HH:mm:ss'),
      endTime: this.datePipe.transform(this.stopTime, 'yyyy-MM-dd HH:mm:ss')
    };

    this.trend(param);
  }

  export() {
    let stopTime: string | null = '';
    let beginTime: string | null = '';
    if(this.dateRange != null && this.dateRange.length === 2) {
      stopTime = this.datePipe.transform(this.dateRange[1], 'yyyy-MM-dd HH:mm:ss');
      beginTime = this.datePipe.transform(this.dateRange[0], 'yyyy-MM-dd HH:mm:ss');
    }
    const param = {
      neCode: this.cellKpiFilter.enbId,
      neName: this.cellKpiFilter.enbName,
      cellId: this.cellKpiFilter.cellId,
      cellName: this.cellKpiFilter.cellName,
      startTime: beginTime,
      endTime: stopTime,
      major: 1,
      page: {pageNo: -1}
    };
    this.http.post(ADDRESS_LIST.API_KPI_EXPORT, param, { responseType: 'arraybuffer' }).subscribe(data => {
      const tableData = new Blob([data], {
        type: 'application/vnd.ms-excel;charset=UTF-8'
      });
      saveAs(tableData,  'Abnormal_KPI_List.xlsx');
    });
  }

  tableScroll(){
    const height = window.innerHeight - 380;
    return {
      y: `${height}px`
    };
  }
}
