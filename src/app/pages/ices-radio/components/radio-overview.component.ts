import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpService} from 'src/app/service/http.service';

@Component({
  selector: 'app-radio-overview',
  templateUrl: './radio-overview.component.html',
  styleUrls: ['./radio-overview.component.css']
})
export class RadioOverviewComponent implements OnInit,OnDestroy {
    totalSite: number = 0;
    activeAlarm: number = 0;
    outageStation: number = 0;
    outageCellSite: number = 0;
    totalCell: number = 0;
    apiServer: string;
    now: Date = new Date();
    startTime: Date = new Date();
    nowInterval;
    /**
     * RRC connection setup success ratio
     */
    chart01: object = null;
    /**
     * E-RAB setup success ratio
     */
    chart02: object;

    /**
     * Radio success ratio
     */
    chart03: object;

    /**
     * HO success ratio
     */
    chart04: object;

    /**
     * PDCP SDU Volume Uplink
     */
    chart05: object;

    /**
     * PDCP SDU Volume Downlink
     */
    chart06: object;

    /**
     * Active UE per Cell average
     */
    chart07: object;

    /**
     *  E-RAB drop ratio
     */
    chart08: object;

    constructor(private http:HttpClient,private httpService: HttpService) { }

    initCount(){
        this.httpService.configuration().subscribe(config => {
            this.apiServer = config.apiServer;
            this.http.get(this.apiServer + "/overview/count").subscribe(rep => {
                 this.totalSite = rep["totalSite"];
                 this.activeAlarm = rep["activeAlarm"];
                 this.outageCellSite = rep["outCell"];
                 this.outageStation = rep["outSite"];
                 this.totalCell = rep["totalCell"];
                 this.initComponent();

            });
        });
    }
    initComponent() {
        this.http.get(this.apiServer + '/overview/charData').subscribe(rep => {
          this.chart01 = this.createChartOption(rep[9].xAxis, rep[9].yAxis, rep[9].kpi_name,'bar', rep[9].unit);
          this.chart02 = this.createTwoBarChartOption(rep[2].xAxis, rep[2].yAxis, rep[2].kpi_name,'bar', rep[2].unit, rep[3].yAxis, rep[3].kpi_name,'bar', rep[3].unit);
          this.chart03 = this.createTwoBarChartOption(rep[4].xAxis, rep[4].yAxis, rep[4].kpi_name, 'bar', rep[4].unit, rep[5].yAxis, rep[5].kpi_name,'bar', rep[5].unit);
          this.chart04 = this.createChartOption(rep[10].xAxis, rep[10].yAxis, rep[10].kpi_name, 'line', rep[10].unit);
          this.chart05 = this.createChartOption(rep[6].xAxis, rep[6].yAxis, rep[6].kpi_name, 'line', rep[6].unit);
          this.chart06 = this.createChartOption(rep[0].xAxis, rep[0].yAxis, rep[0].kpi_name, 'line', rep[0].unit);
          this.chart07 = this.createChartOption(rep[1].xAxis, rep[1].yAxis, rep[1].kpi_name, 'line', rep[1].unit);
          this.chart08 = this.createTwoBarChartOption(rep[7].xAxis, rep[7].yAxis, rep[7].kpi_name, 'bar', rep[7].unit, rep[8].yAxis, rep[8].kpi_name,'bar', rep[8].unit);
        });
    }

    runTimer(){
        this.nowInterval = setInterval(() => {
            if (this.startTime) {
                if (new Date().getTime() - this.startTime.getTime() > 60000*5) {
                    //console.log(new Date().getTime() - this.startTime.getTime())
                    this.initCount();
                }
            }
        this.now = new Date();
        }, 1000*60*5);
    }

    ngOnDestroy(){
        clearInterval(this.nowInterval);
    }


    ngOnInit(): void {
        this.now = new Date();
        this.startTime = new Date();
        this.runTimer();
        this.httpService.configuration().subscribe(config => {
            this.apiServer = config.apiServer;
            this.http.get(this.apiServer + "/overview/count").subscribe(rep => {
                 this.totalSite = rep["totalSite"];
                 this.activeAlarm = rep["activeAlarm"];
                 this.outageCellSite = rep["outCell"];
                 this.outageStation = rep["outSite"];
                 this.totalCell = rep["totalCell"];
                 this.initComponent();
            });
        });

    }

    createChartOption(xAxisData: Array<any>, seriesData: Array<number>, title: string, type: string, unit: string) {
        // if(unit == null){
        //     unit = "%";
        // }
      let maxValue = 0;
      // tslint:disable-next-line:prefer-for-of

      for(let i = 0; i < seriesData.length; i++) {
        const value = seriesData[i];
        if (maxValue < Number(value)) {
          maxValue = value;
        }
      }

      // tslint:disable-next-line:triple-equals
      if (unit == '%') {
        maxValue = 100;
      }

      return {
            title: {
                text: title,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                formatter: function(v: any){
					return v[0].name + ': ' + v[0].data + (unit === null ? '' : unit);
				}
            },
            color: '#4472C4',
            grid: {
				show : true,
				left: '15%',
				right: '10%',
				bottom: '15%',
				top: '15%',
				borderWidth : 0
			},
            xAxis: {
                   type: 'category',
                   axisTick: {
                    alignWithLabel: true
                   },
                  data: xAxisData
            },
            yAxis: {
                type: 'value',
                max: maxValue,
                scale: true,
                splitLine : {show : false}
            },
            series: [{
                type: type,
                data: seriesData
                //markLine: {
				//	silent: true,
				//	lineStyle: {type: 'solid', normal: {color: 'red'}},
				//	data: [{ yAxis: threshold}]
				//}
            }]
        };
    }


  createTwoBarChartOption(xAxisData: Array<any>, seriesData: Array<number>, title: string, type: string, unit: string,seriesData1: Array<number>, title1: string, type1: string, unit1: string) {
    if(unit == null){
      unit = "%";
    }
    if(unit1 == null){
      unit1 = "%";
    }
    return {
      title: {
        text: title+"&"+title1,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: function(v: any){
          return title+" "+v[0].name + ': ' + v[0].data + unit +"<br>"+title1+" "+v[1].name + ': ' + v[1].data + unit1 ;
        }
      },
      color: '#4472C4',
      grid: {
        show : true,
        left: '15%',
        right: '10%',
        bottom: '15%',
        top: '15%',
        borderWidth : 0
      },
      xAxis: {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        data: xAxisData
      },
      yAxis: {
        type: 'value',
        max: 100,
        // scale: true,
        splitLine : {show : false}
      },
      series: [{
        type: type,
        data: seriesData,
        itemStyle: {
          normal: {
            color: '#8ED7F8' // 设置柱子的颜色为红色
          }
        },
      },
        {
          type: type1,
          data: seriesData1,
          itemStyle: {
            normal: {
              color: '#4472c4' // 设置柱子的颜色为红色
            }
          },
        }]
    };
  }

    createBarChartOption(xAxisData: Array<any>, seriesData: Array<number>, title: string,type: string, unit: string) {
        if(unit == null){
            unit = "%";
        }
        return {
            title: {
                text: title,
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function(v: any){
					return v[0].name + ': ' + v[0].data + ' ' + unit;
				}
            },
            color: '#4472C4',
            grid: {
              show : true,
              left: '20%',
              right: '15%',
              bottom: '15%',
              top: '15%',
              borderWidth : 0
			      },
            xAxis: {
                // type: 'category',
                data: xAxisData
            },
            yAxis: {
                type: 'value',
                splitLine : {show : false}
            },
            series: [{
                type: 'bar',
                data: seriesData
            }]
        };
    }
}
