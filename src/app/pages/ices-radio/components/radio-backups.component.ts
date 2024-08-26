import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BackupMessage, BackupMessageFilter, Site} from '../clazz/radio-clazz';
import {TransferChange, TransferItem, TransferSearchChange, TransferSelectChange} from 'ng-zorro-antd/transfer';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-radio-backups',
    templateUrl: './radio-backups.component.html',
    styleUrls: ['./radio-backups.component.css']
})
export class RadioBackupsComponent implements OnInit {

    /**
     * 0: backups; 1:recovery
     */
    dataType:string = '0';
    listOfRecovery:Array<BackupMessage> = [];
    listOfBackups:Array<BackupMessage>  = [];

    dataFilter: BackupMessageFilter = new BackupMessageFilter();dateRange: Array<Date> = [];

    pageSize: number = 20;
    pageIndex: number = 1;
    pageOptions: Array<number> = [10, 15, 20, 25, 50];
    dataLoading: boolean = false;
    totalItem: number = 0;
    recoveryItem: number = 0;

    isVisible = false;
    transferItems: Array<TransferItem> = [];
    totalTransferItems: Array<TransferItem> = [];
    dataId: number = 1000;

    checked = false;
    indeterminate = false;
    setOfCheckedId = new Set<number>();

    constructor(private http:HttpClient, private datePipe:DatePipe) { }

    ngOnInit(): void {
        this.queryBackupMessages();
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

    nzDataTypeChange(e: any){
        console.log(e);
    }

    queryBackupMessages() {
        this.http.get<BackupMessage[]>('assets/data/radio/backups.json').subscribe(items => {
            this.listOfBackups = items;
            this.totalItem = items.length;

            items.forEach(item => {
                if (item.recoverTime != null && item.recoverTime != '') {
                    this.listOfRecovery.push(item);
                }
            });
            this.recoveryItem = this.listOfRecovery.length;
        });
    }

    updateCheckedSet(id: number, checked: boolean): void {
        if (checked) {
            this.setOfCheckedId.add(id);
        } else {
            this.setOfCheckedId.delete(id);
        }
    }

    onItemChecked(id: number, checked: boolean): void {
        this.updateCheckedSet(id, checked);
        this.refreshCheckedStatus();
    }
    onAllChecked(value: boolean): void {
        this.listOfBackups.forEach(item => this.updateCheckedSet(item.id, value));
        this.refreshCheckedStatus();
    }

    refreshCheckedStatus(): void {
        this.checked = this.listOfBackups.every(item => this.setOfCheckedId.has(item.id));
        this.indeterminate = this.listOfBackups.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
    }

    batchRecovery(){
        this.listOfBackups.forEach(data => {
            if(this.setOfCheckedId.has(data.id)){
                this.listOfRecovery.push({
                    id: this.dataId,
                    enbId: data.enbId,
                    enbName: data.enbName,
                    backupStatus: data.backupStatus,
                    backupTime: data.backupTime,
                    backupExecutor: data.backupExecutor,
                    backupResult: data.backupResult,
                    backupType: data.backupType,

                    recoverExecutor: "Admin",
                    recoverResult: "",
                    recoverStatus: "pending",
                    recoverTime: this.datePipe.transform(new Date(), 'yyyy/MM/dd HH:mm:ss')
                });
            }
        });
        this.recoveryItem = this.listOfRecovery.length;
        this.listOfRecovery = [...this.listOfRecovery];
    }

    // queryRecoveryMessages(){
    //     this.http.get<BackupMessage[]>('assets/data/radio/hardware.json').subscribe(items => {
    //         this.listOfRecovery = items;
    //         this.totalItem = items.length;
    //     });
    // }

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

    /**
     * 手动执行基站配置备份
     */
    executeBackups() {
        let site: Site = null;
        this.transferItems.forEach(item => {
            if (item.direction = 'right') {
                site = item['site'];
                this.listOfBackups.push({
                    id: this.dataId,
                    enbId: site.enbId,
                    enbName: site.enbName,
                    backupTime: this.datePipe.transform(new Date(), 'yyyy/MM/dd HH:mm:ss'),
                    backupStatus: "pending",
                    backupType: "manual",
                    backupExecutor: "admin",
                    backupResult: ""
                });
                this.dataId += 1;
            }
        });
        this.listOfBackups = [...this.listOfBackups];
        this.totalItem = this.listOfBackups.length;
        this.transferItems = [];
        this.totalTransferItems = [];
    }

    executeRecovery(data: BackupMessage){
        this.listOfRecovery.push({
            id: this.dataId,
            enbId: data.enbId,
            enbName: data.enbName,
            backupStatus: data.backupStatus,
            backupTime: data.backupTime,
            backupExecutor: data.backupExecutor,
            backupResult: data.backupResult,
            backupType: data.backupType,

            recoverExecutor: "Admin",
            recoverResult: "",
            recoverStatus: "pending",
            recoverTime: this.datePipe.transform(new Date(), 'yyyy/MM/dd HH:mm:ss')
        });
        this.recoveryItem = this.listOfRecovery.length;
        this.listOfRecovery = [...this.listOfRecovery];
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
