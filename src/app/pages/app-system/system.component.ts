import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {NokiaFooterComponent} from '../../module/nokia-footer/nokia-footer.component';
import {NokiaHeaderComponent} from '../../module/nokia-header/nokia-header.component';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit, AfterViewInit {

    @ViewChild(NokiaHeaderComponent, { static: false }) pageHeader: NokiaHeaderComponent | null = null;
    @ViewChild(NokiaFooterComponent, { static: false }) pageFooter: NokiaFooterComponent | null = null;

    apiServer = '';
    pageHref = 'radio';

    defaultHref = 'systemUser';
    listOfHref: Array<string> = [
        'systemUser', 'systemUsergrp', 'permission', 'googleMap', 'license', 'historyConfig', 'redundancy'
    ];
    hrefMap: Map<string, boolean> = new Map<string, boolean>();

    constructor() { }

    ngAfterViewInit(): void { }
    ngOnInit(): void {
        this.listOfHref.forEach(item => {
            this.hrefMap.set(item, false);
        });
        this.hrefMap.set(this.defaultHref, true);
    }

    navigation(href: string) {
        this.listOfHref.forEach(item => {
            this.hrefMap.set(item, href === item);
        });
    }

    contentStyle() {
        const height = window.innerHeight - 148 + 'px';
        return {
            height
        };
    }

}
