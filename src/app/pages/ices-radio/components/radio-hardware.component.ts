import {Component, OnInit} from '@angular/core';
import {HardwareMessage, HardwareMessageFilter, Site} from '../clazz/radio-clazz';
import {HttpClient} from '@angular/common/http';
import {TransferChange, TransferItem, TransferSearchChange, TransferSelectChange} from 'ng-zorro-antd/transfer';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-radio-hardware',
    templateUrl: './radio-hardware.component.html',
    styleUrls: ['./radio-hardware.component.css']
})
export class RadioHardwareComponent implements OnInit {

    listOfHardware: Array<HardwareMessage> = [];
    filter: HardwareMessageFilter = new HardwareMessageFilter();
    dateRange: Array<Date> = [];


    pageSize: number = 20;
    pageIndex: number = 1;
    pageOptions: Array<number> = [10, 15, 20, 25, 50];
    dataLoading: boolean = false;
    totalItem: number = 0;

    isVisible = false;
    transferItems: Array<TransferItem> = [];
    totalTransferItems: Array<TransferItem> = [];
    dataId: number = 1000;

    constructor(private http: HttpClient, private datePipe:DatePipe) { }

    ngOnInit(): void {
        this.queryHardwareMessages();
    }

    nzPageIndexChange(pageIndex: number) {
        this.pageIndex = pageIndex;
        // this.queryHardwareMessages();
    }

    nzPageSizeChange(pageSize: number) {
        this.pageSize = pageSize;
        this.pageIndex = 1;
        // this.queryHardwareMessages();
    }

    queryHardwareMessages() {
        this.http.get<HardwareMessage[]>('assets/data/radio/hardware.json').subscribe(items => {
            this.listOfHardware = items;
            this.totalItem = items.length;
        });
    }

    querySites() {
        this.http.get<Site[]>('assets/data/radio/site.json').subscribe(items => {
            items.forEach(item => {
                this.transferItems.push({
                    key: item.id.toString(),
                    title: item.enbName,
                    checked: false,
                    direction: 'left',
                    site: item
                });
                this.totalTransferItems.push({
                    key: item.id.toString(),
                    title: item.enbName,
                    checked: false,
                    direction: 'left',
                    site: item
                });
            });
            this.transferItems = [...this.transferItems];
        });
    }

    openManualModal() {
        this.isVisible = true;
        this.transferItems = [];
        this.totalTransferItems = [];
        this.querySites();
    }

    closeManualModal() {
        this.isVisible = false;
    }

    executeManual() {
        let site: Site = null;
        this.transferItems.forEach(item => {
            if (item.direction = 'right') {
                site = item['site'];
                this.listOfHardware.push({
                    id: this.dataId,
                    enbId: site.enbId,
                    enbName: site.enbName,
                    executeType: 'manual',
                    executeTime: this.datePipe.transform(new Date(), 'yyyy/MM/dd HH:mm:ss'),
                    executor: "admin",
                    status: "pending",
                    result: "",
                    hardware: "",
                    serialNumber: ""
                });
                this.dataId += 1;
            }
        });
        this.listOfHardware = [...this.listOfHardware];
        this.totalItem = this.listOfHardware.length;
        this.transferItems = [];
        this.totalTransferItems = [];
    }

    change(ret: TransferChange): void {
        const listKeys = ret.list.map(l => l.key);
        this.totalTransferItems.forEach(item => {
            if (listKeys.includes(item['key'])) {
                if (ret.to === 'left') {
                    item.direction = 'left';
                } else {
                    item.direction = 'right';
                }
            }
        });
        const hasOwnKey = (e: TransferItem) => e.hasOwnProperty('key');
        this.transferItems = this.transferItems.map(e => {
            if (listKeys.includes(e.key) && hasOwnKey(e)) {
                if (ret.to === 'left') {
                    delete e.hide;
                } else if (ret.to === 'right') {
                    e.hide = false;
                }
            }
            return e;
        });

    }

    select(ret: TransferSelectChange): void {
        console.log('nzSelectChange', ret);
    }

    searchSite(change: TransferSearchChange){
        const items = [];
        const value:string = change.value;
        if (change.direction == 'left') {
            this.transferItems.forEach(item => {
                if (item.direction == 'right') {
                    items.push(item);
                }
            });
            if (value == '') {
                this.totalTransferItems.forEach(item => {
                    if (item.direction == 'left') {
                        items.push(item);
                    }
                });
            } else {
                this.totalTransferItems.forEach(item => {
                    if (item.direction == 'left' && ((item['site']['enbId'] + '').indexOf(value) != -1
                                            || item['site']['enbName'].indexOf(value) != -1
                                            || item['site']['version'].indexOf(value) != -1)) {
                        items.push(item);
                    }
                });
            }
        } else {
            this.transferItems.forEach(item => {
                if (item.direction == 'left') {
                    items.push(item);
                }
            });
            if (value == '') {
                this.totalTransferItems.forEach(item => {
                    if (item.direction == 'right') {
                        items.push(item);
                    }
                });
            } else {
                this.totalTransferItems.forEach(item => {
                    if (item.direction == 'right' && ((item['site']['enbId'] + '').indexOf(value) != -1
                                            || item['site']['enbName'].indexOf(value) != -1
                                            || item['site']['version'].indexOf(value) != -1)) {
                        items.push(item);
                    }
                });
            }
        }
        this.transferItems = items;
    }

}
