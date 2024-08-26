import { HttpClient } from '@angular/common/http';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from 'src/app/clazz/common-clazz';
import {NokiaFooterComponent} from '../../module/nokia-footer/nokia-footer.component';
import {NokiaHeaderComponent} from '../../module/nokia-header/nokia-header.component';
import { CommonService } from 'src/app/service/common-service.service';
import {ADDRESS_LIST} from '../../utils/constants';
import {TranslateService} from "@ngx-translate/core";
@Component({
    selector: 'app-system-account',
    templateUrl: './system-account.component.html',
    styleUrls: ['./system-account.component.css']
})
export class SystemAccountComponent implements OnInit, AfterViewInit {

  constructor(private fb: FormBuilder, private commonService: CommonService, private httpclient: HttpClient, private message: NzMessageService, private router: Router
    ,private translate: TranslateService) {
    this.translate.get('user').subscribe(
      value => {
        this.inputPassword = value.inputPassword;
        this.password8=value.password8;
        this.checkPassword=value.checkPassword;
      }
    )
    this.translate.get('tip').subscribe(
      value => {
        this.fileUploadedSuccess = value.fileUploadedSuccess;
        this.fileUploadFault = value.fileUploadFault;
        this.success=value.success;
      }
    )
  }

  @ViewChild(NokiaHeaderComponent, { static: false }) pageHeader: NokiaHeaderComponent | null = null;
  @ViewChild(NokiaFooterComponent, { static: false }) pageFooter: NokiaFooterComponent | null = null;

    user: User = new User();
    account = '';
    apiServer = '';
    pageHref = 'toolsvr';

    validateProfile!: FormGroup;
    validatePassword!: FormGroup;

    pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}');

    passwordError = 'Please input your password!';

  inputPassword:string;
  password8:string;
  checkPassword:string;
  fileUploadedSuccess:string;
  fileUploadFault:string;
  success:string;

    ngAfterViewInit(): void { }

    ngOnInit(): void {
        this.validateProfile = this.fb.group({
            name: [null, [Validators.required]],
            email: [null, [Validators.email]]
        });
        this.validatePassword = this.fb.group({
            password: [null, [Validators.required, this.passwordValidator]],
            checkPassword: [null, [Validators.required, this.confirmationValidator]]
        });
        this.commonService.getConfiguration().subscribe(conf => {
            this.apiServer = conf.apiServer;
            this.commonService.getUser(this.apiServer).subscribe(item => {
                this.user = item;
                this.account = item.account;
                this.validateProfile.patchValue({
                    name: this.user.name
                });
                this.validateProfile.patchValue({
                    email: this.user.email
                });
            });
        });
    }
    passwordValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
          this.passwordError = this.inputPassword;
            return { required: true };
        } else if (control.value.length < 8) {
          this.passwordError = this.password8;
            return { confirm: true, error: true };
        }else if (!this.pwdRegex.test(control.value)) {
          this.passwordError = this.checkPassword;
            return { confirm: true, error: true };
        }
        return {};
    }

    confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
        if (!control.value) {
            return { required: true };
        } else if (control.value !== this.validatePassword.controls.password.value) {
            return { confirm: true, error: true };
        }
        return {};
    }

    updateConfirmValidator(): void {
        Promise.resolve().then(() => this.validatePassword.controls.checkPassword.updateValueAndValidity());
    }

    submitProfileForm(): void {
        let valid = true;
        for(const i in this.validateProfile.controls) {
            if (this.validateProfile.controls.hasOwnProperty(i)) {
                this.validateProfile.controls[i].markAsDirty();
                this.validateProfile.controls[i].updateValueAndValidity();
            }
            valid = valid && this.validateProfile.controls[i].valid;
        }
        if (valid) {
            this.user.name = this.validateProfile.value.name;
            this.user.email = this.validateProfile.value.email;
            this.httpclient.post<User>(ADDRESS_LIST.API_ACCOUNT_PROFILE, this.user).subscribe((user) => {
                if (user.result == 'OK') {
                    this.commonService.createOperationLog(this.apiServer, 'Update account profile.');
                    this.message.success(this.fileUploadedSuccess);
                } else {
                    this.message.success('Failed to update profile.');
                }
            });
        }
    }

    submitPasswdForm(): void {
        let valid = true;
        for (const i in this.validatePassword.controls) {
            if (this.validatePassword.controls.hasOwnProperty(i)) {
                this.validatePassword.controls[i].markAsDirty();
                this.validatePassword.controls[i].updateValueAndValidity();
            }
            valid = valid && this.validatePassword.controls[i].valid;
        }
        if (valid) {
            this.user.password = this.validatePassword.value.password;
            this.httpclient.post<User>(ADDRESS_LIST.API_ACCOUNT_PASSWORD, this.user).subscribe(user => {
                if (user.result === 'OK') {
                    this.commonService.createOperationLog(this.apiServer, 'Update account password.');
                    this.message.success(this.success);
                    this.commonService.logout(this.apiServer).subscribe(() => {
                        this.router.navigate(['login']);
                    });
                } else {
                  this.message.success(this.fileUploadFault);
                }
            });
        }
    }

    contentStyle() {
        const height = window.innerHeight - 100 + 'px';
        return {
            height: height
        };
    }

}
