import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import * as AllIcons from '@ant-design/icons-angular/icons';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { IconDefinition } from '@ant-design/icons-angular';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTreeSelectModule } from 'ng-zorro-antd/tree-select';
import { NzTransferModule } from 'ng-zorro-antd/transfer';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

import { NgxEchartsModule } from 'ngx-echarts';

import { SystemMenuModule } from 'src/app/module/menu/system-menu.module';
import { NokiaFooterModule } from 'src/app/module/nokia-footer/nokia-footer.module';
import { NokiaHeaderModule } from 'src/app/module/nokia-header/nokia-header.module';

import { RadioComponent } from './radio.component';
import { RadioOverviewComponent } from './components/radio-overview.component';
import { RadioStateComponent } from './components/radio-state.component';
import { RadioAlarmComponent } from './components/radio-alarm.component';
import { RadioKpisComponent } from './components/radio-kpis.component';
import { RadioKpisMajorComponent } from './components/radio-kpis-major.component';
import { RadioHardwareComponent } from './components/radio-hardware.component';
import { RadioRecoveryComponent } from './components/radio-recovery.component';
import { RadioMonitorComponent } from './components/radio-monitor.component';
import { RadioEnbComponent } from './components/radio-enb.component';
import { RadioThresholdComponent } from './components/radio-threshold.component';
import { RadioBackupsComponent } from './components/radio-backups.component';
import {NzUploadModule} from 'ng-zorro-antd';
import { TranslateModule }from "@ngx-translate/core";

const antDesignIcons = AllIcons as {
    [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

const routers: Routes = [
    { path: "", component: RadioComponent }
];

@NgModule({
    declarations: [
        RadioComponent,
        RadioOverviewComponent,
        RadioStateComponent,
        RadioAlarmComponent,
        RadioKpisComponent,
        RadioKpisMajorComponent,
        RadioHardwareComponent,
        RadioRecoveryComponent,
        RadioMonitorComponent,
        RadioEnbComponent,
        RadioThresholdComponent,
        RadioBackupsComponent
    ],
    imports: [
        RouterModule.forChild(routers),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ScrollingModule,
        NgxEchartsModule,

        NzLayoutModule,
        NzMenuModule,
        NzDrawerModule,
        NzGridModule,
        NzIconModule,
        NzStatisticModule,
        NzTabsModule,
        NzTableModule,
        NzButtonModule,
        NzRadioModule,
        NzFormModule,
        NzInputModule,
        NzDividerModule,
        NzPopoverModule,
        NzDatePickerModule,
        NzSelectModule,
        NzNotificationModule,
        NzToolTipModule,
        NzTreeSelectModule,
        NzTransferModule,
        NzDescriptionsModule,
        NzModalModule,
        NzInputNumberModule,

        SystemMenuModule,
        NokiaFooterModule,
        NokiaHeaderModule,
        NzUploadModule,
        TranslateModule
    ],
    exports: [
        RouterModule,

        RadioComponent,
        RadioOverviewComponent,
        RadioStateComponent,
        RadioAlarmComponent,
        RadioKpisComponent,
        RadioKpisMajorComponent,
        RadioHardwareComponent,
        RadioRecoveryComponent
    ]
})
export class RadioModule { }
