import {Component, OnInit} from '@angular/core';
import {HttpService} from 'src/app/service/http.service';
import {HttpClient} from '@angular/common/http';
import {Bts, SiteFilter} from '../clazz/radio-clazz';
import {ADDRESS_LIST} from '../../../utils/constants';
import {Response, User} from '../../../clazz/common-clazz';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzMessageService} from 'ng-zorro-antd/message';
import {saveAs} from 'file-saver';
import {NzUploadFile} from 'ng-zorro-antd';
import {CommonService} from '../../../service/common-service.service';
import {Router} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-radio-enb',
  templateUrl: './radio-enb.component.html',
  styleUrls: ['./radio-enb.component.css']
})
export class RadioEnbComponent implements OnInit {

  constructor(private http: HttpClient,
              private httpService: HttpService,
              private commonService: CommonService,
              private router: Router,
              private modalService: NzModalService,
              private messageSerivce: NzMessageService,
              private translate: TranslateService) {

    this.translate.get('tip').subscribe(
      value => {
        this.saveSuccess = value.saveSuccess;
        this.saveError = value.saveError;
        this.cannotEmpty = value.cannotEmpty;
        this.dataImportSuccess = value.dataImportSuccess;
        this.fileUploadedSuccess = value.fileUploadedSuccess;
        this.fileUploadFault = value.fileUploadFault;
        this.deleteSuccess=value.deleteSuccess;
        this.deleteError=value.deleteError;
      }
    )
    this.translate.get('enb').subscribe(
      value => {
        this.id = value.id;
        this.name = value.name;
        this.ip = value.ip;
        this.longitude = value.longitude;
        this.latitude = value.latitude;
        this.type = value.type;
        this.netWorkType = value.networkType;
      }
    )
  }

  maxId = 6;
  site: Bts = new Bts();
  siteFilter: SiteFilter = new SiteFilter();
  listOfSite: Array<Bts> = [];

  btsTypes: Array<string> = ['FLEXI', 'SBTS'];
  networkTypes: Array<string> = ['4', '5'];
  pageSize = 20;
  pageIndex = 1;
  pageOptions: Array<number> = [10, 15, 20, 25, 50];
  dataLoading = false;
  totalItem = 0;
  isVisible = false;
  isDeleteVisible = false;
  fileList: any;
  uploadApi = ADDRESS_LIST.API_ENB_IMPORT;
  apiServer: string;
  currentUser: User = new User();
  saveSuccess:string;
  saveError:string;
  cannotEmpty:string;
  id:string;
  name:string;
  ip:string;
  longitude:string;
  latitude:string;
  type:string;
  netWorkType:string;
  dataImportSuccess:string;
  fileUploadedSuccess:string;
  fileUploadFault:string;
  deleteSuccess:string;
  deleteError:string;
  isDeleteEnb=false;
  enbId:string;

  ngOnInit(): void {
    this.getCurrentUser();
    this.querySites();
  }

  getCurrentUser() {
    this.httpService.configuration().subscribe(conf => {
      this.apiServer = conf.apiServer;
      this.commonService.getUser(this.apiServer).subscribe(user => {
        if (user.id > 0) {
          this.currentUser = user;
        } else {
          this.router.navigate(['login']);
        }
      });
    });
  }

  nzPageIndexChange(pageIndex: number) {
    this.pageIndex = pageIndex;
    this.querySites();
  }

  nzPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pageIndex = 1;
    this.querySites();
  }

  openEditModal() {
    this.site = new Bts();
    this.isVisible = true;
  }

  editSite(site: Bts) {
    this.site = site;
    this.isVisible = true;
  }

  closeEditModal() {
    this.isVisible = false;
  }

  querySites() {
    const param = {
      neCode: this.siteFilter.enbIp,
      siteCode: this.siteFilter.siteCode,
      neName: this.siteFilter.enbName,
      ip: this.siteFilter.enbIp,
      neVersion: this.siteFilter.version,
      page: {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      }
    };

    this.list(param);
  }

  list(param) {
    this.dataLoading = true;
    this.http.post<Response>(ADDRESS_LIST.API_ENB_LIST, param).subscribe(response => {
      this.listOfSite = response.data.content;
      this.totalItem = response.data.totalElements;
      this.dataLoading = false;
    });
  }

  saveSite() {
    if (this.validateForm()) {
      this.http.post<Response>(ADDRESS_LIST.API_ENB_SAVE, this.site).subscribe(response => {
        if (response.success) {
          this.messageSerivce.success(this.saveSuccess);
          this.querySites();
        } else {
          this.messageSerivce.error(this.saveError + + response.message);
        }
      });
      this.closeEditModal();
    }
  }

  validateForm() {
    if (!this.site.neCode) {
      this.messageSerivce.info(this.id+this.cannotEmpty);
      return false;
    }

    if (!this.site.enbName) {
      this.messageSerivce.info(this.name+this.cannotEmpty);
      return false;
    }

    if (!this.site.ip) {
      this.messageSerivce.info(this.ip+this.cannotEmpty);
      return false;
    }

    if (!this.site.btsType) {
      this.messageSerivce.info(this.type+this.cannotEmpty);
      return false;
    }

    if (!this.site.gpsLongitude) {
      this.messageSerivce.info(this.longitude+this.cannotEmpty);
      return false;
    }

    if (!this.site.gpsLatitude) {
      this.messageSerivce.info(this.latitude+this.cannotEmpty);
      return false;
    }
    if (!this.site.netWorkType) {
      this.messageSerivce.info(this.netWorkType+this.cannotEmpty);
      return false;
    }

    return true;
  }


  deleteSite() {
    this.isDeleteEnb=false;
    this.http.get<Response>(ADDRESS_LIST.API_ENB_DELETE.replace('{id}', this.enbId)).subscribe(response => {
      if (response.success) {
        this.messageSerivce.success(this.deleteSuccess);
        this.querySites();
      } else {
        this.messageSerivce.error(this.deleteError +response.message);
      }
    });
  }

  search() {
    const param = {
      neCode: this.siteFilter.enbId,
      siteCode: this.siteFilter.siteCode,
      neName: this.siteFilter.enbName,
      ip: this.siteFilter.enbIp,
      neVersion: this.siteFilter.version,
      page: {}
    };
    this.list(param);
  }

  reset() {
    this.siteFilter = new SiteFilter();
    const param = {page: {}};
    this.list(param);
  }

  downloadTemplate() {
    const url = ADDRESS_LIST.API_ENB_DOWNLOAD_TEMPLATE;
    this.http.get(url,  { responseType: 'arraybuffer' }).subscribe(data => {
      const tableData = new Blob([data], {
        type: 'application/vnd.ms-excel;charset=UTF-8'
      });
      saveAs(tableData,  'BtsTemplate.xlsx');
    });
  }

  export() {
    const param = {
      neCode: this.siteFilter.enbId,
      siteCode: this.siteFilter.siteCode,
      neName: this.siteFilter.enbName,
      ip: this.siteFilter.enbIp,
      neVersion: this.siteFilter.version,
    };
    this.http.post(ADDRESS_LIST.API_ENB_EXPORT, param, { responseType: 'arraybuffer' }).subscribe(data => {
      const tableData = new Blob([data], {
        type: 'application/vnd.ms-excel;charset=UTF-8'
      });
      saveAs(tableData,  'BtsList.xlsx');
    });
  }


  uploadFile = (file: NzUploadFile): boolean => {
    this.dataLoading = false;
    const formData = new FormData();
    // formData.set('file', file);
    // file.status = 'uploading';
    // file.status = 'error';
    this.dataLoading = true;
    this.http.post(ADDRESS_LIST.API_ENB_IMPORT, file).subscribe((res: any) => {
      if (res.success) {
        file.status = 'success';
        this.modalService.success({
          nzTitle:   this.dataImportSuccess,
        });
        this.querySites();
      } else {
        file.status = 'error';
        this.modalService.error({
          nzTitle:  res.message,
        });
      }
      file.status = 'done';
      this.dataLoading = false;
    });
    return true;
  }

  // 导入
  beforeUpload = (file): boolean => {
    this.fileList = [file];
    return true;
  }

  fileChange({ file, fileList }) {
    const status = file.status;
    if (status !== 'uploading') {
      console.log(file, fileList);
    }
    if (status === 'done') {
      this.messageSerivce.success(this.fileUploadedSuccess);
    } else if (status === 'error') {
      this.messageSerivce.error(this.fileUploadFault);
    }

    this.querySites();
    console.log(status);
  }

  removeAll() {
    this.isDeleteVisible = false;
    this.http.get<Response>(ADDRESS_LIST.API_ENB_REMOVE_ALL).subscribe(response => {
      if (response.success) {
        this.messageSerivce.success(this.deleteSuccess);
        this.querySites();
      } else {
        this.messageSerivce.error(this.deleteError + response.message);
      }
    });
  }

  cancel() {
    this.isDeleteVisible = false;
    this.isDeleteEnb=false;
  }

  showModal() {
    this.isDeleteVisible = true;
  }

  showDeleteEnbModal(id){
    this.enbId=id;
    this.isDeleteEnb=true;
  }

  tableScroll(){
    const height = window.innerHeight - 380;
    return {
      y: `${height}px`
    };
  }
}
