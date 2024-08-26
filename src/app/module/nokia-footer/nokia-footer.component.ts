import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-nokia-footer',
    templateUrl: './nokia-footer.component.html',
    styleUrls: ['./nokia-footer.component.css']
})
export class NokiaFooterComponent implements OnInit {

    emailSupport = '';
    // emailSupport = 'support.ices@nokia.com';
    @Input() pageHref: string = '';

    constructor() { }

    ngOnInit(): void {
    }

}
