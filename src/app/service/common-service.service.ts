import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Configuration, DataItem, ResponseMessage, User} from '../clazz/common-clazz';
import {DatePipe} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

    constructor(private httpclient: HttpClient, private datePipe: DatePipe) { }

    public getConfiguration(): Observable<Configuration> {
        return this.httpclient.get<Configuration>('assets/config/app-config.json');
    }

  public getApi(url: string) {
    return this.getConfiguration() + url;
  }


  public now() {
        return this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss.SSS');
    }

    public login(url: string, username: string, password: string) {
        return this.httpclient.post<User>(url + '/auth/login', {
            username,
            password
        });
    }

    public logout(url: string) {
        return this.httpclient.get(url + '/auth/logout');
    }

    public getUser(url: string) {
        return this.httpclient.get<User>(url + '/auth/token');
    }

    public validateToken(url: string) {
        return this.httpclient.get<ResponseMessage>(url + '/auth/validate');
    }

    public createOperationLog(url: string, content: string){
        const param = {
            content
        };

        // TODO write log
        // this.httpclient.post(url + '/oplog/create', param).subscribe();
    }

    public async downloadFileV2(url: string, filePath: string, fileName: string) {
        const res = await this.httpclient.get(url + '/download/v2/file?filePath=' + filePath, { responseType: 'arraybuffer' }).toPromise();
        const blob = new Blob([res]);
        const link = document.createElement('a');
        const body = document.querySelector('body');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.style.display = 'none'; // Firefox
        if (body != null) {
            body.appendChild(link);
            link.click();
            body.removeChild(link);
            window.URL.revokeObjectURL(link.href);
        }
    }

    public getState(): Observable<DataItem[]>{
        return of([
            {value: 0, label: 'waiting'},
            {value: 1, label: 'running'},
            {value: 2, label: 'finished'}
        ]);
    }
}
