import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ZorroAntdModule } from 'src/app/zorro-antd.module';
import { NgxEchartsModule } from 'ngx-echarts';

import { NokiaFooterModule } from 'src/app/module/nokia-footer/nokia-footer.module';
import { NokiaHeaderModule } from 'src/app/module/nokia-header/nokia-header.module';

import { SystemAccountComponent } from './system-account.component';
import { SystemUserComponent } from './system-user.component';
import { SystemComponent } from './system.component';
import { SystemUsergrpComponent } from './system-usergrp.component';
import { PermissionComponent } from './permission.component';
import {GoogleMapComponent} from './google-map.component';
import {LicenseComponent} from './license.component';
import {HistoryconfigComponent} from './history-config.component';
import {RedundancyComponent} from './redundancy.component';
import { TranslateModule }from "@ngx-translate/core";
const routes: Routes = [
    { path: '', component: SystemComponent },
    { path: 'account', component: SystemAccountComponent }
];

@NgModule({
    declarations: [
        SystemComponent,
        SystemAccountComponent,
        SystemUserComponent,
        SystemUsergrpComponent,
        HistoryconfigComponent,
        RedundancyComponent,
        PermissionComponent,
        GoogleMapComponent,
        LicenseComponent
        // OperationLogComponent,
        // ProgramLogComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ZorroAntdModule,
        NgxEchartsModule,
        NokiaFooterModule,
        NokiaHeaderModule,
      TranslateModule
    ]
})
export class SystemModule { }
