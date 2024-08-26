import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgZorroAntdModule, NZ_ICONS } from 'ng-zorro-antd';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { AppLoggerComponent } from './app-logger.component';
import {NokiaHeaderModule} from '../../module/nokia-header/nokia-header.module';
import {NokiaFooterModule} from '../../module/nokia-footer/nokia-footer.module';

const routes: Routes = [
    { path: '', component: AppLoggerComponent }
];

const antDesignIcons = AllIcons as {
    [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NzMenuModule,
        NgZorroAntdModule,
        ReactiveFormsModule,
        ScrollingModule,
        NokiaHeaderModule,
        NokiaFooterModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        AppLoggerComponent
    ],
    providers: [{ provide: NZ_ICONS, useValue: icons }]
})
export class AppLoggerModule { }
