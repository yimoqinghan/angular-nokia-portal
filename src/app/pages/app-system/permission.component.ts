import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Permission, ResponseMessage, User, UserGroup } from 'src/app/clazz/common-clazz';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { TransferChange, TransferItem } from 'ng-zorro-antd/transfer';
import {ADDRESS_LIST} from '../../utils/constants';
import {CommonService} from '../../service/common-service.service';
import {isNumeric} from 'rxjs/internal-compatibility';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-permission',
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {

    apiServer: string = "";
    dataLoading: boolean = false;
    permission: Permission = new Permission();
    listOfPermission: Array<Permission> = [];
    totalItem: number = 0;
    isNew = false;
    pageSizeOptions: Array<number> = [10, 20, 30, 40, 50];

  create:string;
  update:string;
  inputName:string;
  saved:string;
  inputAccount:string;
  resetPassword:string;
  isDeletePermission=false;
  delPermission: Permission = new Permission();

    constructor( private httpclient: HttpClient, private messageSercie: NzMessageService, private commonService: CommonService,private translate: TranslateService) {
      this.translate.get('permission').subscribe(
        value => {
          this.create=value.create;
          this.update=value.update;
          this.inputName=value.inputName;
          this.saved=value.saved;
        }
      )
    }

    ngOnInit(): void {
        this.loadMenu();
        this.commonService.getConfiguration().subscribe(conf => {
            this.apiServer = conf.apiServer;
            this.searchPermissions();
        });
    }

    contentHeight() {
        const height = window.innerHeight - 196 + 'px';
        return {
            'height': height
        };
    }

    tableHeight() {
        const height = window.innerHeight - 236 + 'px';
        return {
            y: height
        };
    }

    tableScroll() {
        const height = window.innerHeight - 400 + 'px';
        return {
            'y': height
        };
    }

    createPermission(){
        this.isNew = true;
        this.permission = new Permission();
        this.openPermisstion(this.create);
    }
    updatePermission(data: Permission){
        this.isNew = false;
        this.permission = data;
        this.openPermisstion(this.update);
    }
    updateSubmenu(data: Permission){
        this.permission = data;
        this.searchPermissionDetails(data.id).subscribe(item => {
            this.permission = item;
            this.defaultCheckedKeys = [];
            this.checkedSubmenus = [];
            if (item.checkedSubmenus != null) {
                item.checkedSubmenus.forEach(id => {
                    this.defaultCheckedKeys.push(id);
                    this.checkedSubmenus.push(id);
                });
            }

            this.openSubmenu();
        });
    }
    updateGroup(data: Permission){
        this.permission = data;
        this.searchPermissionDetails(data.id).subscribe(item => {
            this.permission = item;
            const checkedGroups = item.checkedGroups;
            this.listOfGroup = item.groups;
            const items: TransferItem[] = [];
            this.listOfGroup.forEach(user => {
                items.push({
                    key: user.id,
                    title: user.name,
                    direction: (checkedGroups.indexOf(user.id) != -1) ? 'right' : 'left',
                    checked: false,
                    name: user.name,
                    account: user.id
                });
            });
            this.listOfItem = items;
            this.openUser();
        });
    }
    searchPermissions(){
        this.dataLoading = true;
        this.httpclient.get<Permission[]>(ADDRESS_LIST.API_PERMISSION_LIST).subscribe(items => {
            this.listOfPermission = items;
            this.totalItem = items.length;
            this.dataLoading = false;
        });
    }
    searchPermissionDetails(id: number){
        return this.httpclient.get<Permission>(ADDRESS_LIST.API_PERMISSION_INFO.replace('{id}', id));
    }
    savePermission(){
        if (this.permission.name === '') {
            this.messageSercie.error(this.inputName);
            return;
        }
        this.httpclient.post<ResponseMessage>(ADDRESS_LIST.API_PERMISSION_UPDATE, this.permission).subscribe(response => {
            if (response.message === 'OK') {
                if (this.isNew) {
                    this.commonService.createOperationLog(this.apiServer, this.create+': ' + this.permission.name);
                } else {
                    this.commonService.createOperationLog(this.apiServer, this.update+': ' +  + this.permission.name);
                }
                this.messageSercie.success(this.saved);
                this.searchPermissions();
            } else {
                this.messageSercie.error(response.message);
            }
        });

        this.visiblePermission = false;
    }
    cancel() {
      this.isDeletePermission=false;
    }
    showDeletePermissionModal(permission: Permission){
      this.delPermission=permission;
      this.isDeletePermission=true;
    }
    deletePermission(){
      this.isDeletePermission=false;
        this.httpclient.delete(ADDRESS_LIST.API_PERMISSION_DELETE.replace('{id}',this.delPermission.id)).subscribe(() => {
            // this.commonService.createOperationLog(this.apiServer, "Delete permission: " + permission.name);
            this.searchPermissions();
        });
    }
    visiblePassword: boolean = false;
    account: string = "";
    openPassword(){
        this.visiblePassword = true;
    }
    colsePassword(){
        this.visiblePassword = false;
    }
    resetUserPassword(){
        if (this.account == null || this.account === '') {
            this.messageSercie.error(this.inputAccount);
            return;
        }
        this.httpclient.get<ResponseMessage>(ADDRESS_LIST.API_PERMISSION_ACCOUNTS.replace('{name}', this.account)).subscribe(response => {
            if (response.message === 'OK') {
                // this.commonService.createOperationLog(this.apiServer, "Reset password of account: " + this.account);
                this.messageSercie.success(this.resetPassword);
            } else {
                this.messageSercie.error(response.message);
            }
        });
    }
    // ====================================================================================================================================
    // ====================================================================================================================================
    // ====================================================================================================================================
    visiblePermission: boolean = false;
    titlePermission: string = "Create new";
    openPermisstion(title: string){
        this.titlePermission = title;
        this.visiblePermission = true;
    }

    closePermisstion(){
        this.visiblePermission = false;
    }

    // ====================================================================================================================================
    // ====================================================================================================================================
    // ====================================================================================================================================
    visibleSubmenu: boolean = false;
    defaultCheckedKeys: any[] = [];
    checkedSubmenus: any[] = [];
    submenus: any[any] = [];

    loadMenu(): void {
      this.httpclient.get<any>(ADDRESS_LIST.API_SYSTEM_MENUS).subscribe(data => {
        this.submenus = data;
      });
    }

    nzEvent(event: NzFormatEmitEvent): void {
      /*if (event.node) {
        const treeNode = event.node;
        const key = treeNode.key;
        const checked = treeNode.isChecked;
        if (checked) {
          if (!this.checkedSubmenus.includes(key)) {
            this.checkedSubmenus.push(key);
          }
        } else {
          if (this.checkedSubmenus.indexOf(key) > -1) {
            const index = this.checkedSubmenus.indexOf(key);
            this.checkedSubmenus.splice(index, 1);
          }
        }
      }*/
        this.checkedSubmenus = [];
        if (event.checkedKeys) {
          event.checkedKeys.forEach(node => {
            if (node.level === 0) {
              node.children.forEach(item => {
                this.checkedSubmenus.push(item.key);
              });
            } else {
              this.checkedSubmenus.push(node.key);
            }
          });
        }
        /*if (event.keys && event.nodes) {
            event.nodes.forEach(node => {
              if (node.level === 0) {
                node.children.forEach(item => {
                  this.checkedSubmenus.push(item.key);
                });
              } else {
                this.checkedSubmenus.push(node.key);
              }
            });
        }*/
    }
    openSubmenu(){
        this.visibleSubmenu = true;
    }
    closeSubmenu(){
        this.visibleSubmenu = false;
    }
    savePermissionSubmenus(){
        const resources: Array<number> = [];
        this.checkedSubmenus.forEach(item => {
          const val = item + '';
          if (!val.includes('top')) {
            resources.push(item);
          }
        });
        const param = {
            permission: this.permission.id,
            resources
        };
        this.httpclient.post<ResponseMessage>(ADDRESS_LIST.API_PERMISSION_SUBMENU, param).subscribe(response => {
          // tslint:disable-next-line:triple-equals
            if (response.message == 'OK') {
                // this.commonService.createOperationLog(this.apiServer, "Update menus of permission: " + this.permission.name);
                this.messageSercie.success(this.saved);
            } else {
                this.messageSercie.error(response.message);
            }
        });
    }
    // ====================================================================================================================================
    // ====================================================================================================================================
    // ====================================================================================================================================
    visibleUser: boolean = false;
    listOfGroup: Array<UserGroup> = [];
    listOfItem: TransferItem[] = [];
    openUser(){
        this.visibleUser = true;
    }
    closeUser(){
        this.visibleUser = false;
    }
    changeItems(ret: TransferChange): void {
        const listKeys = ret.list.map(l => l.key);
        const hasOwnKey = (e: TransferItem) => e.hasOwnProperty('key');
        this.listOfItem = this.listOfItem.map(e => {
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
    savePermissionUser(){
        const resources: Array<number> = [];
        this.listOfItem.forEach(item => {
            if (item.direction === 'right') {
                resources.push(item['key']);
            }
        });
        const param = {
            permission: this.permission.id,
            resources: resources
        };
        this.httpclient.post<ResponseMessage>(ADDRESS_LIST.API_PERMISSION_GROUPS, param).subscribe(response => {
            if (response.message === 'OK') {
                // this.commonService.createOperationLog(this.apiServer, "Update users of permission: " + this.permission.name);
                this.messageSercie.success(this.saved);
            } else {
                this.messageSercie.error(response.message);
            }
        });

        this.visibleUser = false;
    }
}
