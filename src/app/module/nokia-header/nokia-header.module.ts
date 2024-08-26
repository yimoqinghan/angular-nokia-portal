import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { NokiaHeaderComponent } from './nokia-header.component';
import {RouterModule} from '@angular/router';
import {ZorroAntdModule} from '../../zorro-antd.module';

const antDesignIcons = AllIcons as {
    [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
    declarations: [NokiaHeaderComponent],
    imports: [
        CommonModule,
        NzLayoutModule,
        NzMenuModule,
        FormsModule,
        ReactiveFormsModule,
        NzIconModule,
        RouterModule,
        ZorroAntdModule
    ],
    exports: [
        NokiaHeaderComponent
    ],
    providers: [
        { provide: NZ_ICONS, useValue: icons }
    ]
})
export class NokiaHeaderModule { }
