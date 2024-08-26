import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GeneralConfig, LeafletConfig } from 'src/app/clazz/common-clazz';
import { HttpService } from 'src/app/service/http.service';

import * as L from 'leaflet';

@Component({
    selector: 'app-google-map',
    templateUrl: './google-map.component.html',
    styleUrls: ['./google-map.component.css']
})
export class GoogleMapComponent implements OnInit {

    constructor(private httpService: HttpService, private http: HttpClient) { }

    map_url = 'map_url';
    max_zoom = 'max_zoom';
    min_zoom = 'min_zoom';
    default_zoom = 'default_zoom';
    center_longitude = 'center_longitude';
    center_latitude = 'center_latitude';
    left_longitude = 'left_longitude';
    left_latitude = 'left_latitude';
    right_longitude = 'right_longitude';
    right_latitude = 'right_latitude';

    map_url_confg: GeneralConfig = new GeneralConfig();
    max_zoom_confg: GeneralConfig = new GeneralConfig();
    min_zoom_confg: GeneralConfig = new GeneralConfig();
    default_zoom_confg: GeneralConfig = new GeneralConfig();
    center_longitude_confg: GeneralConfig = new GeneralConfig();
    center_latitude_confg: GeneralConfig = new GeneralConfig();
    left_longitude_confg: GeneralConfig = new GeneralConfig();
    left_latitude_confg: GeneralConfig = new GeneralConfig();
    right_longitude_confg: GeneralConfig = new GeneralConfig();
    right_latitude_confg: GeneralConfig = new GeneralConfig();

    apiServer: string;

    public leafletMap: L.Map = null;

    leafletpop = L.popup();

    longitude: number;
    latitude: number;
    zoom: number;

    ngOnInit(): void {

        this.httpService.configuration().subscribe(conf => {
            this.apiServer = conf.apiServer;
            this.http.get<GeneralConfig[]>(this.apiServer + '/setting/general/get/map').subscribe(items => {
                items.forEach(item => {
                    if (item.key === 'map_url') {
                        this.map_url_confg = item;
                    } else if (item.key === 'max_zoom') {
                        this.max_zoom_confg = item;
                    } else if (item.key === 'min_zoom') {
                        this.min_zoom_confg = item;
                    } else if (item.key === 'default_zoom') {
                        this.default_zoom_confg = item;
                    } else if (item.key === 'center_longitude') {
                        this.center_longitude_confg = item;
                    } else if (item.key === 'center_latitude') {
                        this.center_latitude_confg = item;
                    } else if (item.key === 'left_longitude') {
                        this.left_longitude_confg = item;
                    } else if (item.key === 'left_latitude') {
                        this.left_latitude_confg = item;
                    } else if (item.key === 'right_longitude') {
                        this.right_longitude_confg = item;
                    } else if (item.key === 'right_latitude') {
                        this.right_latitude_confg = item;
                    }
                });
            });
            this.refreshMap();
        });
    }

    pageHeight(){
        const height = (window.innerHeight - 185) + 'px';
        const width = (window.innerWidth - 185) + 'px';
        return {
            height,width
        };
    }

    mapHeight(){
        const height = (window.innerHeight - 185 - 36) + 'px';
        return {
            height
        };
    }

    refreshMap(){
        this.httpService.queryLeafletConfig(this.apiServer).subscribe(config => {
            this.displayMap(config);
        });
    }

    saveSettings(){
        this.map_url_confg.key = this.map_url;
        this.max_zoom_confg.key = this.max_zoom;
        this.min_zoom_confg.key = this.min_zoom;
        this.default_zoom_confg.key = this.default_zoom;
        this.center_latitude_confg.key = this.center_latitude;
        this.center_longitude_confg.key = this.center_longitude;
        this.left_latitude_confg.key = this.left_latitude;
        this.left_longitude_confg.key = this.left_longitude;
        this.right_latitude_confg.key = this.right_latitude;
        this.right_longitude_confg.key = this.right_longitude;

        this.save(this.map_url_confg);
        this.save(this.max_zoom_confg);
        this.save(this.min_zoom_confg);
        this.save(this.default_zoom_confg);
        this.save(this.center_latitude_confg);
        this.save(this.center_longitude_confg);
        this.save(this.left_latitude_confg);
        this.save(this.left_longitude_confg);
        this.save(this.right_latitude_confg);
        this.save(this.right_longitude_confg);
    }

    save(config: GeneralConfig){
        this.http.post(this.apiServer + '/setting/general/update/map', config).subscribe();
    }
    /**
     * 显示地图
     * @param div_id
     * @param leafletConfig
     */
    displayMap(leafletConfig: LeafletConfig){
        this.zoom = leafletConfig.centerZoom;
        if (this.leafletMap){
            this.leafletMap.off();
            this.leafletMap.remove();
        }
        this.leafletMap = new L.Map('setting_leaflet_map_div', {
            minZoom: leafletConfig.minZoom,
            maxZoom: leafletConfig.maxZoom,
            zoomDelta: 1,
            zoomControl: true,
            maxBounds: L.latLngBounds(
                new L.LatLng(leafletConfig.boundLeftLatitude, leafletConfig.boundLeftLongitude),
                new L.LatLng(leafletConfig.boundRightLatitude, leafletConfig.boundRightLongitude)
            )
        }).setView([leafletConfig.centerLatitude, leafletConfig.centerLongitude], leafletConfig.centerZoom);

        L.tileLayer(leafletConfig.urlTemplate, {
            minZoom: leafletConfig.minZoom,
            maxZoom: leafletConfig.maxZoom,
            attribution: ''
        }).addTo(this.leafletMap);

        // let latitude:number, longitude:number;
        const markerLayers = [];
        this.leafletMap.addLayer(L.layerGroup(markerLayers));

        this.leafletMap.on('mousemove', (e) =>{
          this.longitude = e['latlng']['lng'];
          this.latitude = e['latlng']['lat'];
        });

        this.leafletMap.on('zoom', (e) => {
            this.zoom = this.leafletMap.getZoom();
        });
    }
}
