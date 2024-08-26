import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TransferChange, TransferItem } from 'ng-zorro-antd/transfer';
import { User, UserGroup } from 'src/app/clazz/common-clazz';
import {ADDRESS_LIST} from '../../utils/constants';
import {Bts} from '../ices-radio/clazz/radio-clazz';
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-system-usergrp',
    templateUrl: './system-usergrp.component.html',
    styleUrls: ['./system-usergrp.component.css']
})
export class SystemUsergrpComponent implements OnInit {
    constructor(private httpclient: HttpClient, private messageSercie: NzMessageService, private translate: TranslateService) {
      this.translate.get('group').subscribe(
        value => {
          this.createGroupTip=value.createGroup;
          this.updateGroupTip=value.updateGroup;
          this.inputName=value.inputName;
          this.saved=value.saved;
          this.userGroupTip=value.userTip;
          this.groupBtsBind=value.groupBtsBind;
        }
      )
    }

    apiServer = '';
    totalItem = 0;
    dataLoading = false;
    listOfGroup: Array<UserGroup> = [];
    pageSizeOptions: Array<number> = [10, 20, 30, 40, 50];

    usergroup: UserGroup = new UserGroup();
    groupName = '';
    isNew = false;

    // =====================================================================================================================
    visibleGroup = false;
    titleGroup = '';

    // =====================================================================================================================
    visibleUser = false;
    titleUser = '';
    visibleSelection = false;

    titleBts = '';
    titleBtsBinding = '';
    visibleBtsBinding = false;
    visibleBts = false;

    titleSelection = '';
    listOfItem: TransferItem[] = [];
    listOfUser: Array<User> = [];

    createGroupTip:string;
    updateGroupTip:string;
    inputName:string;
    userGroupTip:string;
    saved:string;
    groupBtsBind:string;
    isDeleteGroup=false;
    delGroup: UserGroup = new UserGroup();
    ngOnInit(): void {
      this.searchGroups();
    }

    contentHeight() {
        const height = window.innerHeight - 196 + 'px';
        return {
            height: height
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
            y: height
        };
    }

    searchGroups(){
        this.dataLoading = true;
        this.httpclient.get<UserGroup[]>(ADDRESS_LIST.API_GROUP_LIST.replace('{name}', this.groupName)).subscribe(items => {
            this.dataLoading = false;
            this.listOfGroup = items;
            this.totalItem = items.length;
        });
    }
    createGroup(){
        this.isNew = true;
        this.usergroup = new UserGroup();
        this.titleGroup = this.createGroupTip;
        this.openGroup();
    }
    updateGroup(group: UserGroup){
        this.isNew = false;
        this.usergroup = group;
        this.titleGroup = this.updateGroupTip;
        this.openGroup();
    }

    showDeleteGroupModal(group: UserGroup){
      this.delGroup=group;
      this.isDeleteGroup=true;
    }


    deleteGroup(){
      this.isDeleteGroup=false;
        this.httpclient.delete(ADDRESS_LIST.API_GROUP_DELETE.replace('{id}', this.delGroup.id)).subscribe(() => {
            this.searchGroups();
        });
    }
    closeGroup(){
        this.visibleGroup = false;
    }
    openGroup(){
        this.visibleGroup = true;
    }
    saveGroup(){
      // tslint:disable-next-line:triple-equals
        if (this.usergroup.name == '') {
            this.messageSercie.error(this.inputName);
            return;
        }
        this.httpclient.post<UserGroup>(ADDRESS_LIST.API_GROUP_UPDATE, this.usergroup).subscribe(item => {
            if (item != null) {
              // tslint:disable-next-line:triple-equals
                if (item.result != 'OK') {
                    this.messageSercie.error(item.result);
                } else {
                    this.messageSercie.success( this.saved);
                    this.closeGroup();
                    this.searchGroups();
                }
            }
        });
    }
    openUser(group: UserGroup){
        this.usergroup = group;
        this.titleSelection = this.userGroupTip + group.name;
        this.searchRelation(group.id);
        this.visibleSelection = true;
    }
    closeUser(){
        this.visibleSelection = false;
        this.visibleUser = false;
        this.searchGroups();
    }

    openBtsBindingSetting(group: UserGroup){
      this.usergroup = group;
      this.titleBtsBinding = this.groupBtsBind;
      this.searchBtsRelation(group.id);
      this.visibleBtsBinding = true;
    }
    closeBtsBinding(){
      this.visibleBtsBinding = false;
      this.searchGroups();
    }
    closeBts(){
      this.visibleBtsBinding = false;
      this.visibleBts = false;
      this.searchGroups();
    }

    searchRelation(groupId: number){
        this.httpclient.get<User[]>(ADDRESS_LIST.API_GROUP_RELATION_SEARCH.replace('{id}', this.usergroup.id)).subscribe(users => {
            const items: TransferItem[] = [];
            users.forEach(user => {
                items.push({
                    key: user.id,
                    title: user.name + '@' + user.account,
                  // tslint:disable-next-line:triple-equals
                    direction: (user.groupId == groupId) ? 'right' : 'left',
                    checked: false,
                    name: user.name,
                    account: user.account
                });
            });
            this.listOfItem = items;
        });
    }

  searchBtsRelation(groupId: number){
    this.httpclient.get<Bts[]>(ADDRESS_LIST.API_GROUP_BTS_SEARCH.replace('{id}', this.usergroup.id)).subscribe(btsList => {
      const items: TransferItem[] = [];
      btsList.forEach(bts => {
        items.push({
          key: bts.neCode,
          title: bts.neCode + '@' + bts.enbName,
          // tslint:disable-next-line:triple-equals
          direction: (bts.groupId == groupId) ? 'right' : 'left',
          checked: false,
          name: bts.enbName,
          account: bts.neCode
        });
      });
      this.listOfItem = items;
    });
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
    saveUserGroupItem(){
        const listOfUser: Array<any> = [];
        this.listOfItem.forEach(item => {
          // tslint:disable-next-line:triple-equals
            if (item.direction == 'right') {
                listOfUser.push(item.key);
            }
        });
        const param = {
            group: this.usergroup.id,
            users: listOfUser
        };
        this.httpclient.post(ADDRESS_LIST.API_GROUP_RELATION_SAVE, param).subscribe(() => {
            this.searchRelation(this.usergroup.id);
            this.searchGroups();
            this.visibleSelection = false;
        });
    }


  saveBtsBinding(){
    const listOfBts: Array<any> = [];
    this.listOfItem.forEach(item => {
      // tslint:disable-next-line:triple-equals
      if (item.direction == 'right') {
        listOfBts.push(item.key);
      }
    });
    const param = {
      group: this.usergroup.id,
      btsList: listOfBts
    };
    this.httpclient.post(ADDRESS_LIST.API_GROUP_RELATION_BTS_SAVE, param).subscribe(() => {
      this.searchRelation(this.usergroup.id);
      this.searchGroups();
      this.visibleBtsBinding = false;
    });
  }

  cancel() {
    this.isDeleteGroup=false;
  }
}
