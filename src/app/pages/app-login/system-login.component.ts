import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Router } from '@angular/router';
import { LoginUser } from 'src/app/clazz/common-clazz';
import { HttpService } from 'src/app/service/http.service';
import {ADDRESS_LIST} from '../../utils/constants';
import {TranslateService} from "@ngx-translate/core";
@Component({
    selector: 'app-system-login',
    templateUrl: './system-login.component.html',
    styleUrls: ['./system-login.component.css']
})
export class SystemLoginComponent implements OnInit {

    constructor(private fb: FormBuilder, private router: Router, private notification: NzNotificationService, private httpService: HttpService
      , private translate: TranslateService) {
      this.translate.get('login').subscribe(
        value => {
          this.accountErrorMsg=value.inputAccount;
          this.passwordErrorMsg=value.inputPassword;
          this.resetPassword=value.resetPassword;
        }
      )
    }

    validateForm!: FormGroup;
    accountErrorMsg:string;
    passwordErrorMsg:string;
    resetPassword:string;
    // accountErrorMsg = 'Please input your account!';
    // passwordErrorMsg = 'Please input your password!';

    apiServer:string;
    ngOnInit(): void {
        this.validateForm = this.fb.group({
            userName: [null, [Validators.required]],
            password: [null, [Validators.required]],
            remember: [true]
        });
        this.httpService.configuration().subscribe(conf => {
            this.apiServer = conf.apiServer;
        });
    }

    submitForm(): void {
        const loginUser: LoginUser = new LoginUser();
        const username = this.validateForm.value.userName;
        const password = this.validateForm.value.password;
        loginUser.username = username;
        loginUser.password = password;

        if (username == null || username === '') {
            this.notification.create(
                'error', 'Tips', this.accountErrorMsg
            );
            return;
        }

        if (password == null || password === '') {
            this.notification.create(
                'error', 'Tips', this.passwordErrorMsg
            );
            return;
        }

        this.httpService.login(ADDRESS_LIST.API_AUTH_LOGIN, loginUser).subscribe(rep => {
            const user = rep.data;
            if (user) {
                localStorage.setItem('token', user.token);
                this.router.navigate(['radio']);
            } else {
                if (rep.message) {
                  this.notification.create(
                    'error',
                    'Tips',
                    rep.message
                  );
                } else {
                  this.notification.create(
                    'error',
                    'Tips',
                    'system error.'
                  );
                }
            }
        });
    }

    forgotPasswordNotification() {
        this.notification.create(
            'info',
            'Tips',
            this.resetPassword
        );
    }

    // isEmpty(val: string): boolean {
    //     return this.trim(val) == '';
    // }

    // trim(str: string): string {
    //     if (str == undefined || str == null) {
    //         return '';
    //     }
    //     return str.replace(/^\s+|\s+$/gm, '');
    // }

}
