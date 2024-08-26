import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User, UserGroup } from 'src/app/clazz/common-clazz';
import {CommonService} from '../../service/common-service.service';
import {ADDRESS_LIST} from '../../utils/constants';
import {TranslateService} from "@ngx-translate/core";
@Component({
    selector: 'app-system-user',
    templateUrl: './system-user.component.html',
    styleUrls: ['./system-user.component.css']
})
export class SystemUserComponent implements OnInit {
    constructor(private httpclient: HttpClient, private commonService: CommonService, private messageSercie: NzMessageService,
                private translate: TranslateService) {
      this.translate.get('user').subscribe(
        value => {
          this.createUserTip=value.createUser;
          this.updateUserTip=value.updateUser;
          this.groupsTip=value.groupsTip;
          this.inputName=value.inputName;
          this.inputAccount=value.inputAccount;
          this.createSuccess=value.createSuccess;
          this.saved=value.saved;
          this.deleteSuccess=value.deleteSuccess;
        }
      )
    }

    currentUser: User = new User();

    apiServer = '';
    totalItem = 0;
    dataLoading = false;
    listOfUser: Array<User> = [];
    pageSizeOptions: Array<number> = [10, 20, 30, 40, 50];

    user: User = new User();
    userName = '';
   // =====================================================================================================================
    newUser = false;
    visibleUser = false;
    titleUser = '';

   // =====================================================================================================================
    visibleGroup = false;
    titleGroup = '';
    listOfGroup: Array<UserGroup> = [];
  createUserTip:string;
  updateUserTip:string;
  groupsTip:string;
  inputName:string;
  inputAccount:string;
  createSuccess:string;
  saved:string;
  deleteSuccess:string;
  isDeleteUser=false;
  delUser: User = new User();

    ngOnInit(): void {
      this.commonService.getConfiguration().subscribe(conf => {
        this.apiServer = conf.apiServer;
        this.commonService.getUser(this.apiServer).subscribe(item => {
          this.currentUser = item;
        });
        this.commonService.createOperationLog(this.apiServer, 'Search users.');
      });

      this.searchUsers();
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

    searchUsers(){
        this.dataLoading = true;
        this.httpclient.get<User[]>(ADDRESS_LIST.API_USER_LIST.replace('{username}', this.userName)).subscribe(items => {
            this.dataLoading = false;
            this.listOfUser = items;
            this.totalItem = items.length;
        });
    }
    createUser(){
        this.user = new User();
        this.titleUser = this.createUserTip;
        this.newUser = true;
        this.openUser();
    }
    updateUser(user: User){
        this.user = user;
        this.titleUser = this.updateUserTip;
        this.newUser = false;
        this.openUser();
    }

  showDeleteUserModal(user:User){
      this.delUser=user;
      this.isDeleteUser=true;
  }
    deleteUser(){
      this.isDeleteUser=false;
        this.httpclient.delete(ADDRESS_LIST.API_USER_DELETE.replace('{id}', this.delUser.id)).subscribe(() => {
          this.messageSercie.success(this.deleteSuccess);
            this.searchUsers();
        });
    }
    closeUser(){
        this.visibleUser = false;
    }
    openUser(){
        this.visibleUser = true;
    }
    saveUser(){

      // tslint:disable-next-line:triple-equals
        if (this.user.name == '') {
            this.messageSercie.error(this.inputName);
            return;
        }

      // tslint:disable-next-line:triple-equals
        if (this.user.account == '') {
            this.messageSercie.error(this.inputAccount);
            return;
        }

        if (this.newUser) {
            this.httpclient.post<User>(ADDRESS_LIST.API_USER_CREATE, this.user).subscribe(item => {
              // tslint:disable-next-line:triple-equals
                if (item.result != 'OK') {
                    this.messageSercie.error(item.result);
                } else {
                    this.messageSercie.success(this.createSuccess);
                    this.closeUser();
                    this.searchUsers();
                }
            });
        } else {
            // this.httpclient.post<User>(this.apiServer + '/user/update', this.user).subscribe(item => {
            this.httpclient.post<User>(ADDRESS_LIST.API_USER_UPDATE, this.user).subscribe(item => {
              // tslint:disable-next-line:triple-equals
                if (item.result != 'OK') {
                    this.messageSercie.error(item.result);
                } else {
                    this.messageSercie.success(this.createSuccess);
                    this.closeUser();
                    this.searchUsers();
                }
            });
        }
    }
    openGroup(user: User){
        this.visibleGroup = true;
        this.titleGroup =  this.groupsTip +  user.account;
        this.httpclient.get<UserGroup[]>(ADDRESS_LIST.API_USER_GROUPS.replace('{id}', user.id) ).subscribe(items => {
            this.listOfGroup = items;
        });
    }
    closeGroup(){
        this.visibleGroup = false;
    }

  cancel() {
    this.isDeleteUser=false;
  }
}
