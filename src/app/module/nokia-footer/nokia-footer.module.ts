import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NzLayoutModule } from 'ng-zorro-antd/layout';
// import { NzMenuModule } from 'ng-zorro-antd/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NokiaFooterComponent } from './nokia-footer.component';

@NgModule({
    declarations: [NokiaFooterComponent],
    imports: [
        CommonModule,
        NzLayoutModule,
        // NzMenuModule,
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [
        NokiaFooterComponent
    ]
})
export class NokiaFooterModule { }
