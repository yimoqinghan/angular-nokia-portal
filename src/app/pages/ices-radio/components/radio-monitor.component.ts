import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/app/service/http.service';
import { LeafletMapService } from 'src/app/service/leaflet-map.service';

import { LeafletConfig, LeafletMarker } from 'src/app/clazz/common-clazz';
import { Site, Alarm, CellDetail } from '../clazz/radio-clazz';
import * as L from 'leaflet';
import * as $ from 'jquery';

@Component({
    selector: 'app-radio-monitor',
    templateUrl: './radio-monitor.component.html',
    styleUrls: ['./radio-monitor.component.css']
})
export class RadioMonitorComponent implements OnInit {

    constructor(private leafletMapService:LeafletMapService, private httpService:HttpService,private httpClient:HttpClient) { }

    leafletConfig: LeafletConfig;

    map_div:string = 'leaflet_map_div';
    showDetail: boolean = false;
    btnDisplay: boolean = false;
    site:Site = null;
    public leafletMap: L.Map = null;

    totalItem: number;
    dataLoading:boolean = false;
    btsViewDisplay: boolean = false;
    listOfAlarm: Array<Alarm> = [];
    apiServer: string;

    locateMarker = L.circleMarker([50, 50], {
        radius: 10,
        weight: 2,
        color: '#e03',
        stroke: true,
        fill: false
    });

    ngOnInit(): void {
        this.site = new Site();
        this.httpService.configuration().subscribe(config => {
            this.apiServer = config.apiServer;
            this.httpService.getConfiguration(this.apiServer).subscribe(conf => {
                this.leafletConfig = conf;
                this.showLeafletMarker();
            });
        });
    }

    showLeafletMarker(){
        const markers: Array<LeafletMarker<Site>> = [];
        this.httpClient.get(this.apiServer + '/map/getSiteInfo').subscribe((rep: []) => {
            rep.forEach(item => {
                markers.push({
                    title: item["title"],
                    icon: item["icon"],
                    latitude: item["latitude"],
                    longitude: item["longitude"],
                    count: item["count"],
                    details: {
                        enbId:  item["enbId"],
                        enbName: item["enbName"],
                        enbIp: item["enbIp"],
                        version: item["version"],
                        state: item["state"],
                        trsState: item["trsState"],
                        latitude: item["latitude"],
                        longitude:item["longitude"],
                        alarms: [],
                        cells: []
                    }
                });
            });
            ///console.log(markers);
            this.displayMap(this.leafletConfig, markers, this);
       });

    }


    layerGroup: any;
    markerLayers = [];

    public displayMap(leafletConfig: LeafletConfig, leafletMarkers: Array<LeafletMarker<any>>, self: RadioMonitorComponent){
        if (self.leafletMap !== undefined && this.leafletMap != null) {
            self.leafletMap.remove();
        }
        self.leafletMap = new L.Map(this.map_div, {
            minZoom: leafletConfig.minZoom,
            maxZoom: leafletConfig.maxZoom,
            zoomControl: false,
            trackResize: true,
            maxBounds: L.latLngBounds(
                new L.LatLng(leafletConfig.boundLeftLatitude, leafletConfig.boundLeftLongitude),
                new L.LatLng(leafletConfig.boundRightLatitude, leafletConfig.boundRightLongitude)
            )
        }).setView([leafletConfig.centerLatitude, leafletConfig.centerLongitude], leafletConfig.centerZoom);
        self.leafletMap.invalidateSize(true);

        L.tileLayer(leafletConfig.urlTemplate, {
            minZoom: leafletConfig.minZoom,
            maxZoom: leafletConfig.maxZoom,
            attribution: ''
        }).addTo(self.leafletMap);

        let latitude:number, longitude:number;
        leafletMarkers.forEach(leafletMarker => {
            latitude = leafletMarker.latitude;
            longitude = leafletMarker.longitude;

            let marker: L.Marker = L.marker(L.latLng(latitude, longitude), {
                title: leafletMarker.title,
                icon: this.leafletMapService.getIcon(leafletMarker.icon),
                riseOnHover:true,
                alt:'color'
            });

            marker['site'] = leafletMarker.details;

            if (leafletMarker.count > 1) {
                let markerCount: L.Marker = L.marker( L.latLng(latitude, longitude), {icon: this.leafletMapService.createNumberDivIcon(leafletMarker.count)} ).addTo(this.leafletMap);
                this.markerLayers.push(markerCount);
            }
            marker.on('mouseover', function (e) {
                marker.bindPopup(leafletMarker.title, {
                    offset: [-5, 10],
                    keepInView:false,
                    autoClose:true
                }).openPopup();
            });
            marker.on('click', function (e) {
                //console.log(marker['site']);
                self.site = self.querySiteDetail(marker['site']);
                self.btnDisplay = true;
                self.btsViewDisplay = true;
                if (!self.showDetail) {
                    $("#div_01").css("width","50%");
                    $("#div_02").css("width","50%");
                    self.showDetail = true;
                }
                self.leafletMap.setView([self.site.latitude, self.site.longitude], leafletConfig.maxZoom);
                self.leafletMap.invalidateSize(true);
                self.reloadMarkerLayer(self.site.enbId, leafletConfig, leafletMarkers, self);
            });
            this.markerLayers.push(marker);
        });
        $('.leaflet-control-attribution a').html("");

        this.layerGroup = L.layerGroup(this.markerLayers);
        self.leafletMap.addLayer(this.layerGroup);
    }

    reloadMarkerLayer(enbId:number, leafletConfig: LeafletConfig, leafletMarkers: Array<LeafletMarker<any>>, self: RadioMonitorComponent){
        this.layerGroup.remove();
        this.layerGroup = {};
        this.markerLayers = [];

        let latitude: number, longitude: number;
        // const markerLayers = [];
        leafletMarkers.forEach(leafletMarker => {
            latitude = leafletMarker.latitude;
            longitude = leafletMarker.longitude;

            let offset = [-5, 10];
            let marker: L.Marker = L.marker(L.latLng(latitude, longitude), {
                title: leafletMarker.title,
                icon: this.leafletMapService.getIcon(leafletMarker.icon),
                riseOnHover: true,
                alt: 'color'
            });
            if (leafletMarker.details['enbId'] === enbId) {
                offset = [5, 10];
                marker = L.marker(L.latLng(latitude, longitude), {
                    title: leafletMarker.title,
                    icon: this.leafletMapService.getBigIcon(leafletMarker.icon),
                    riseOnHover:true,
                    alt:'color'
                });
            } else {
                marker.on('mouseover', function (e) {
                    marker.bindPopup(leafletMarker.title, {
                        offset: [offset[0], offset[1]],
                        keepInView:false,
                        autoClose:true
                    }).openPopup();
                });
            }

            marker['site'] = leafletMarker.details;

            if (leafletMarker.count > 1) {
                let markerCount: L.Marker = L.marker( L.latLng(latitude, longitude), {icon: this.leafletMapService.createNumberDivIcon(leafletMarker.count)} ).addTo(this.leafletMap);
                this.markerLayers.push(markerCount);
            }
            marker.on('click', function (e) {
                self.site = self.querySiteDetail(marker['site']);
                self.btnDisplay = true;
                self.btsViewDisplay = true;
                if (!self.showDetail) {
                    $("#div_01").css("width","50%");
                    $("#div_02").css("width","50%");
                    self.showDetail = true;
                }
                // self.locateMarker.addTo(self.leafletMap).setLatLng(new L.LatLng(self.site.latitude, self.site.longitude));

                self.leafletMap.setView([self.site.latitude, self.site.longitude], leafletConfig.maxZoom);
                self.leafletMap.invalidateSize(true);
                self.reloadMarkerLayer(self.site.enbId, leafletConfig, leafletMarkers, self);
            });
            this.markerLayers.push(marker);
        });
        $('.leaflet-control-attribution a').html("");

        this.layerGroup = L.layerGroup(this.markerLayers);
        self.leafletMap.addLayer(this.layerGroup);

    }

    querySiteDetail(site: Site){
        this.httpClient.get(this.apiServer + "/map/getSiteDetailInfo?neCode="+site.enbId).subscribe(rep => {
            const alarms = rep["alarms"];
            site.alarms = [];
            alarms.forEach(item => {

              this.listOfAlarm.push({
                 enbId:item["neCode"],
                 alarmNo:item["alarmNo"],
                 faultId:item["faultyId"],
                 additionalFaultId: item["alarmFaultid"],
                 alarmResource:item["alarmSource"],
                 alarmDetail:item["alarmDescription"],
                 alarmSeverity:item["alarmSeverity"],
                 alarmTime:item["alarmTime"],
                 cancelTime:""
              });
              site.alarms.push({
                enbId:item["neCode"],
                alarmNo:item["alarmNo"],
                faultId:item["faultyId"],
                additionalFaultId: item["alarmFaultid"],
                alarmResource:item["alarmSource"],
                alarmDetail:item["alarmDescription"],
                alarmSeverity:item["alarmSeverity"],
                alarmTime:item["alarmTime"],
                cancelTime:""
              });
            });

            const recells = rep["cells"];
            site.cells = [];
            recells.forEach(item => {
              const kpis = item["kpis"];
              const kpiList=[];
              kpis.forEach(item1 => {
                if(item1['kpiId']!='312'&& item1['kpiId']!='1531' && item1['kpiId']!='1539'){
                  kpiList.push(item1)
                }
              });
              site.cells.push({
                cellId:item["cell_id"],
                cellName:item["cell_id"],
                adminState:item["cell_admin_state"],
                operationalState: item["cell_operational_state"],
                kpis: kpiList
              });
            });


          const kpis = rep["cells"][0]["kpis"];
          site.enbKpi = [];
            kpis.forEach(item => {
              if(item['kpiId']=='312' || item['kpiId']=='1531' ||item['kpiId']=='1539'){
                site.enbKpi.push(item);
              }
            })
          });
        //console.log(site);
        return site;
    }

  backToTop() {
    this.showDetail = false;
    this.btnDisplay = false;
    this.btsViewDisplay = false;
    $('#div_01').css('width','100%');
    this.leafletMap.remove();
    this.leafletMap = null;
    this.dataLoading = false;
    this.listOfAlarm = [];
    this.markerLayers = [];
    // this.showLeafletMarker();
    this.ngOnInit();

  }

}

