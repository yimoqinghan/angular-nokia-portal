import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNotificationModule } from 'ng-zorro-antd/notification';


import { SystemLoginComponent } from './system-login.component';

import { TranslateModule }from "@ngx-translate/core";
const routers: Routes = [
    { path: "", component: SystemLoginComponent }
];

@NgModule({
    declarations: [SystemLoginComponent],
    imports: [
        RouterModule.forChild(routers),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ScrollingModule,

        NzLayoutModule,
        NzFormModule,
        NzInputModule,
        NzButtonModule,
        NzNotificationModule,
        TranslateModule
    ]
})
export class SystemLoginModule { }
