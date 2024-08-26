import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {Group, Menu, User, UserGroup} from 'src/app/clazz/common-clazz';
import * as $ from 'jquery';
import { HttpService } from 'src/app/service/http.service';
import {ADDRESS_LIST} from '../../utils/constants';
import {HttpClient} from '@angular/common/http';
import {CommonService} from '../../service/common-service.service';

@Component({
    selector: 'app-radio',
    templateUrl: './radio.component.html',
    styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit, AfterViewInit {

    components: any = {};

    navigationVisible:boolean = false;
    menuGroups: any[any] = [];

    currentUser: User = new User();

    apiServer: string;
    constructor(private router: Router, private httpService: HttpService, private httpclient: HttpClient, private commonService: CommonService) { }
    ngOnInit(): void {
        this.httpService.configuration().subscribe(conf => {
            this.apiServer = conf.apiServer;
            this.commonService.validateToken(this.apiServer).subscribe(rep => {
                if (!rep.message) {
                    this.router.navigate(['login']);
                }
            });
        });

        this.commonService.getConfiguration().subscribe(conf => {
          this.apiServer = conf.apiServer;
          this.commonService.getUser(this.apiServer).subscribe(item => {
            this.currentUser = item;
          });
        });

        this.loadMenu();
    }

    loadMenu(): void {
      this.httpclient.get<any>(ADDRESS_LIST.API_USER_MENUS).subscribe(data => {
        this.menuGroups = data.menus;
        this.components = data.components;
      });
    }

    ngAfterViewInit(): void {
    }

    openNavigation(){
        this.navigationVisible = true;
        $('.ant-drawer-content-wrapper').css('margin-top', '125px');
        $('.ant-drawer-content-wrapper').css('height', 'calc(75vh)');
    }

    closeNavigation(){
        this.navigationVisible = false;
    }

    menuNavigation(menu: string){
        // for (const key in this.components) {
        //     this.components[key] = false;
        // }
        // this.components[menu] = true;
        // this.closeNavigation();

        // const token: string = localStorage.getItem("token");
        this.commonService.validateToken(this.apiServer).subscribe(rep => {
            if (rep.message) {
              // tslint:disable-next-line:forin
                for (const key in this.components) {
                    this.components[key] = false;
                }
                this.components[menu] = true;
                this.closeNavigation();
            } else {
                this.router.navigate(['login']);
            }
        });
    }

}
