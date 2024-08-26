import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRadioComponent } from './menu-radio.component';

@NgModule({
    declarations: [MenuRadioComponent],
    imports: [
        CommonModule
    ],
    exports: [
        MenuRadioComponent
    ]
})
export class SystemMenuModule { }
