import { Injectable } from '@angular/core';

import * as L from 'leaflet';

import {LeafletConfig, LeafletMarker} from '../clazz/common-clazz';

@Injectable({
    providedIn: 'root'
})
export class LeafletMapService {

    public leafletMap: L.Map = null;

    constructor() { }

    private blueIcon: L.Icon = L.icon({
        iconUrl: 'assets/images/icon-blue.png',
        iconSize: [20, 32],
        iconAnchor: [13, 30],
        popupAnchor: [1, -30],
        shadowSize: [41, 41]
    });

    private redIcon: L.Icon = L.icon({
        iconUrl: 'assets/images/icon-red.png',
        iconSize: [20, 32],
        iconAnchor: [13, 30],
        popupAnchor: [1, -30],
        shadowSize: [41, 41]
    });

    private yellowIcon: L.Icon = L.icon({
        iconUrl: 'assets/images/icon-yellow.png',
        iconSize: [20, 32],
        iconAnchor: [13, 30],
        popupAnchor: [1, -30],
        shadowSize: [41, 41]
    });

    private orangeIcon: L.Icon = L.icon({
        iconUrl: 'assets/images/icon-orange.png',
        iconSize: [20, 32],
        iconAnchor: [13, 30],
        popupAnchor: [1, -30],
        shadowSize: [41, 41]
    });

    private greenIcon: L.Icon = L.icon({
        iconUrl: 'assets/images/icon-green.png',
        iconSize: [20, 32],
        iconAnchor: [13, 30],
        popupAnchor: [1, -30],
        shadowSize: [41, 41]
    });

    private blueIconBigger: L.Icon = L.icon({
        iconUrl: 'assets/images/icon-blue.png',
        iconSize: [35, 56],
        iconAnchor: [13, 30],
        popupAnchor: [1, -30],
        shadowSize: [41, 41]
    });

    private redIconBigger: L.Icon = L.icon({
        iconUrl: 'assets/images/icon-red.png',
        iconSize: [35, 56],
        iconAnchor: [13, 30],
        popupAnchor: [1, -30],
        shadowSize: [41, 41]
    });

    private yellowIconBigger: L.Icon = L.icon({
        iconUrl: 'assets/images/icon-yellow.png',
        iconSize: [35, 56],
        iconAnchor: [13, 30],
        popupAnchor: [1, -30],
        shadowSize: [41, 41]
    });

    private orangeIconBigger: L.Icon = L.icon({
        iconUrl: 'assets/images/icon-orange.png',
        iconSize: [35, 56],
        iconAnchor: [13, 30],
        popupAnchor: [1, -30],
        shadowSize: [41, 41]
    });

    private greenIconBigger: L.Icon = L.icon({
        iconUrl: 'assets/images/icon-green.png',
        iconSize: [35, 56],
        iconAnchor: [13, 30],
        popupAnchor: [1, -30],
        shadowSize: [41, 41]
    });

    public displayMap(divId: string, leafletConfig: LeafletConfig, leafletMarkers: Array<LeafletMarker<any>>, clickAction: any){
        if (this.leafletMap){
            this.leafletMap.off();
            this.leafletMap.remove();
        }
        this.leafletMap = new L.Map(divId, {
            minZoom: leafletConfig.minZoom,
            maxZoom: leafletConfig.maxZoom,
            zoomControl: false,
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

      // tslint:disable-next-line:one-variable-per-declaration
        let latitude: number, longitude: number;
        const markerLayers = [];
        leafletMarkers.forEach(leafletMarker => {
            latitude = leafletMarker.latitude;
            longitude = leafletMarker.longitude;

            const marker: L.Marker = L.marker(L.latLng(latitude, longitude), {
                title: leafletMarker.title,
                icon: this.getIcon(leafletMarker.icon),
                riseOnHover: true,
                alt: 'color'
            });

            if (leafletMarker.count > 1) {
              // tslint:disable-next-line:max-line-length
                const markerCount: L.Marker = L.marker( L.latLng(latitude, longitude), {icon: this.createNumberDivIcon(leafletMarker.count)} ).addTo(this.leafletMap);
                markerLayers.push(markerCount);
            }
          // tslint:disable-next-line:only-arrow-functions
            marker.on('mouseover', function(e) {
                marker.bindPopup(leafletMarker.title, {
                    offset: [0, 0],
                    keepInView: false,
                    autoClose: true
                }).openPopup();
            });
            // marker.on('mouseout', function(){marker.closePopup();});
            // marker.on('click', function (e) {
                //     clickAction(e, leafletMarker.details);
                // });
            markerLayers.push(marker);
        });
        this.leafletMap.addLayer(L.layerGroup(markerLayers));
    }

    public getIcon(colour: string): L.Icon {
      // tslint:disable-next-line:triple-equals
        if (colour == 'red') {
            return this.redIcon;
        } else if (colour === 'yellow') {
            return this.yellowIcon;
        } else if (colour === 'orange') {
            return this.orangeIcon;
        } else if (colour === 'green') {
            return this.greenIcon;
        } else {
            return this.blueIcon;
        }
    }

    public getBigIcon(colour: string): L.Icon {
        if (colour === 'red') {
            return this.redIconBigger;
        } else if (colour === 'yellow') {
            return this.yellowIconBigger;
        } else if (colour === 'orange') {
            return this.orangeIconBigger;
        } else if (colour === 'green') {
            return this.greenIconBigger;
        } else {
            return this.blueIconBigger;
        }
    }

    public createIcon(colour: string, size: Array<number>){
      // tslint:disable-next-line:triple-equals
        if (colour == 'red') {
            return L.icon({
                iconUrl: 'assets/images/icon-red.png',
                iconSize: [size[0], size[1]],
                iconAnchor: [13, 30],
                popupAnchor: [1, -30],
                shadowSize: [41, 41]
            });
          // tslint:disable-next-line:triple-equals
        } else if (colour == 'yellow') {
            return L.icon({
                iconUrl: 'assets/images/icon-yellow.png',
                iconSize: [size[0], size[1]],
                iconAnchor: [13, 30],
                popupAnchor: [1, -30],
                shadowSize: [41, 41]
            });
          // tslint:disable-next-line:triple-equals
        } else if (colour == 'orange') {
            return L.icon({
                iconUrl: 'assets/images/icon-orange.png',
                iconSize: [size[0], size[1]],
                iconAnchor: [13, 30],
                popupAnchor: [1, -30],
                shadowSize: [41, 41]
            });
          // tslint:disable-next-line:triple-equals
        } else if (colour == 'green') {
            return L.icon({
                iconUrl: 'assets/images/icon-green.png',
                iconSize: [size[0], size[1]],
                iconAnchor: [13, 30],
                popupAnchor: [1, -30],
                shadowSize: [41, 41]
            });
        } else {
            return L.icon({
                iconUrl: 'assets/images/icon-blue.png',
                iconSize: [size[0], size[1]],
                iconAnchor: [13, 30],
                popupAnchor: [1, -30],
                shadowSize: [41, 41]
            });
        }
    }

    public createNumberDivIcon(count: number){
        return L.divIcon({
            html:   `<div style="position:relative;color:#fff; text-align:center;line-height:20px;"><span style="width:20px;height:20px;background:red;border-radius:8px;position:absolute;right:-15px;top:-35px;">` + count + `</span>
                    </div>`
        });
    }
}
