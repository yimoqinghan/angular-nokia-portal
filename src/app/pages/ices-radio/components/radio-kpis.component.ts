import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {saveAs} from 'file-saver';
import {CellKpi, CellKpiFilter, KpiFilter, KpiGroupChart, KpiGroupTrend, KpiTrend} from 'src/app/pages/ices-radio/clazz/radio-clazz';
import {Response} from '../../../clazz/common-clazz';
import {ADDRESS_LIST} from '../../../utils/constants';

@Component({
  selector: 'app-radio-kpis',
  templateUrl: './radio-kpis.component.html',
  styleUrls: ['./radio-kpis.component.css']
})
export class RadioKpisComponent implements OnInit {

  dateRange: Array<Date> = [];
  listOfCellKpi: Array<CellKpi> = [];
  cellKpiFilter: CellKpiFilter = new CellKpiFilter();

  pageSize = 20;
  pageIndex = 1;
  pageOptions: Array<number> = [10, 15, 20, 25, 50];
  dataLoading = false;
  totalItem = 0;

  startTime: Date = new Date();
  stopTime: Date = new Date();
  isVisible = false;
  kpiFilter: KpiFilter = new KpiFilter();
  listOfChart: Array<KpiGroupChart> = [];
  listOfGroup: KpiGroupTrend[] = [];
  cellId: number;
  neCode: number;

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.startTime.setHours(0, 0 , 0);
    this.stopTime.setHours(23, 59, 59);
  }

  ngOnInit(): void {
    this.queryCellKpis();
  }

  nzPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.queryCellKpis();
  }

  nzPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.queryCellKpis();
  }

  echartLegendSelect(selectIdex: number, select: boolean) {
    const echarts: Array<KpiGroupChart> = [];
    this.listOfGroup.forEach((group, index) => {
      if (index === selectIdex) {
        const selected = this.listOfChart[index].echarts.legend.selected;
        for (const key in selected) {
          selected[key] = select;
        }
        echarts.push(this.createChartOption(group, selected));
      } else {
        echarts.push(this.listOfChart[index]);
      }
    });
    this.listOfChart = echarts;
  }

  queryCellKpis() {
    let stopTime: string | null = '';
    let beginTime: string | null = '';
    if (this.dateRange != null && this.dateRange.length === 2) {
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

  randomKpis(flag: string) {
    const values: Array<number> = [];
    let kpi: number = null;
    if (flag === '%') {
      for (let index = 0; index < 24; index++) {
        kpi = 0.89 + (Math.random() * 0.11);
        values.push(parseFloat((kpi * 100).toFixed(2)));
      }
    } else {
      for (let index = 0; index < 24; index++) {
        kpi = 900 + (Math.random() * 100);
        values.push(parseFloat(kpi.toFixed(0)));
      }
    }
    return values;
  }

  queryKpiTrends(cellKpi: CellKpi) {
    const param = {
      neCode: cellKpi.neCode,
      cellId: cellKpi.cellId,
      startTime: this.datePipe.transform(this.startTime, 'yyyy-MM-dd HH:mm:ss'),
      endTime: this.datePipe.transform(this.stopTime, 'yyyy-MM-dd HH:mm:ss')
    };

    this.neCode = cellKpi.neCode;
    this.cellId = cellKpi.cellId;
    this.trend(param);
  }

  trend(param) {
    this.dataLoading = true;
    this.http.post<Response>(ADDRESS_LIST.API_KPI_TREND, param).subscribe(response => {

      this.listOfGroup = response.data;
      this.listOfChart = this.createGroupCharts(response.data);
      this.openKpiModal();
      this.dataLoading = false;
    });
  }

  openKpiModal() {
    this.isVisible = true;
  }

  closeKpiModal() {
    this.isVisible = false;
  }

  createGroupCharts(groups: Array<KpiGroupTrend>): Array<KpiGroupChart> {
    const charts: Array<KpiGroupChart> = [];
    groups.forEach(group => {
      charts.push(this.createChartOption(group));
    });
    return charts;
  }

  createChartOption(group: KpiGroupTrend, selected ?: any): KpiGroupChart {
    const xAxis: Array<string> = group.periods;
    const legends: Array<string> = [];
    const kpis: Array<KpiTrend> = group.kpis;
    const series = [];
    let type = '';
    let yAxisIndex = 0;
    kpis.forEach(kpi => {
      legends.push(kpi.kpiName);
      if (kpi.unit == '%') {
        type = 'line';
        yAxisIndex = 0;
      } else {
        type = 'bar';
        yAxisIndex = 1;
      }
      series.push({
        type,
        name: kpi.kpiName,
        yAxisIndex,
        data: kpi.values
      });
    });
    // var colors = ['#5793f3', '#d14a61', '#675bba'];
    if (selected == undefined) {
      selected = {};
      legends.forEach(legend => {
        selected[legend] = true;
      });
    }
    return {
      group,
      echarts: {
        tooltip: {
          trigger: 'axis',
          position(pos: any, params: any, dom: any, rect: any, size: any) {
            let obj = {top: 10};
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
            return obj;
          },
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          x: 420,
          y: 60
        },
        legend: {
          x: 'left',
          type: 'scroll',
          orient: 'vertical',
          top: 30,
          data: legends,
          selected
        },
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
          axisLine: {
            lineStyle: {
              color: '#5793f3'
            }
          },
          axisLabel: {
            formatter: '{value} %'
          }
        }, {
          type: 'value',
          min: 0,
          position: 'right',
          axisLine: {
            lineStyle: {
              color: '#d14a61'
            }
          },
          axisLabel: {
            formatter: '{value}'
          }
        }],
        series
      }
    };
  }

  search() {
    this.pageIndex = 1;
    this.pageSize = 20;
    let stopTime: string | null = '';
    let beginTime: string | null = '';
    if (this.dateRange != null && this.dateRange.length === 2) {
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
      page: {}
    };
    this.list(param);
  }

  reset() {
    this.dateRange = [];
    this.cellKpiFilter = new CellKpiFilter();
    const param = {page: {}};
    this.list(param);
  }

  trendSearch() {
    const param = {
      neCode: this.neCode,
      cellId: this.cellId,
      startTime: this.datePipe.transform(this.startTime, 'yyyy-MM-dd HH:mm:ss'),
      endTime: this.datePipe.transform(this.stopTime, 'yyyy-MM-dd HH:mm:ss')
    };

    this.trend(param);
  }

  export() {
    let stopTime: string | null = '';
    let beginTime: string | null = '';
    if (this.dateRange != null && this.dateRange.length === 2) {
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
      page: {pageNo: -1}
    };
    this.http.post(ADDRESS_LIST.API_KPI_EXPORT, param, { responseType: 'arraybuffer' }).subscribe(data => {
      const tableData = new Blob([data], {
        type: 'application/vnd.ms-excel;charset=UTF-8'
      });
      saveAs(tableData,  'KPI_List.xlsx');
    });
  }

  tableScroll(){
    const height = window.innerHeight - 380;
    return {
      y: `${height}px`
    };
  }
}
