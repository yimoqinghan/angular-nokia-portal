import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { UploadXHRArgs } from 'ng-zorro-antd/upload';
import {CommonService} from '../../service/common-service.service';
import {HttpService} from '../../service/http.service';
import { NokiaLicense } from '../../clazz/common-clazz';
@Component({
    selector: 'app-license',
    templateUrl: './license.component.html',
    styleUrls: ['./license.component.css']
})
export class LicenseComponent implements OnInit {

    constructor(private httpService: HttpService, private http: HttpClient) { }

    apiServer: string;
    listOfLicense: Array<NokiaLicense> = [];
    fileUplaodVisible = false;

    ngOnInit(): void {
        this.httpService.configuration().subscribe(conf => {
            this.apiServer = conf.apiServer;
            this.queryLicenses();
        });
    }

    queryLicenses(){
        this.http.get<NokiaLicense[]>(this.apiServer + '/license/get/all').subscribe(items => {
            this.listOfLicense = items;
            console.log(items);
        });
    }

    handleCancel() {
        this.fileUplaodVisible = false;
    }
    importFile() {
        this.fileUplaodVisible = true;
    }

    customReq = (item: UploadXHRArgs) => {
        const formData = new FormData();
        formData.append('file', item.file as any);
        const req = new HttpRequest('POST', this.apiServer + '/license/upload', formData, {
            reportProgress: true,
            withCredentials: true
        });
        return this.http.request(req)
            .subscribe(
            (event: HttpEvent<any>) => {
                if (event.type === HttpEventType.UploadProgress) {
                  // tslint:disable-next-line:no-non-null-assertion
                    if (event.total! > 0) {
                      // tslint:disable-next-line:no-non-null-assertion
                        (event as any).percent = (event.loaded / event.total!) * 100;
                    }
                  // tslint:disable-next-line:no-non-null-assertion
                    item.onProgress!(event, item.file!);
                } else if (event instanceof HttpResponse) {
                  // tslint:disable-next-line:no-non-null-assertion
                    item.onSuccess!(event.body, item.file!, event);
                    this.queryLicenses();
                }
            },
            err => {
              // tslint:disable-next-line:no-non-null-assertion
                item.onError!(err, item.file!);
                console.log('fail');
            }
        );
    }


    contentHeight() {
      const height = (window.innerHeight - 185) + 'px';
      const width = (window.innerWidth - 185) + 'px';
      return {
        height,width
      };
    }

    tableHeight() {
      const height = window.innerHeight - 136 + 'px';
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
}


