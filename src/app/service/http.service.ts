import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Configuration, LeafletConfig, LoginUser, NokiaLicense, Response, SystemMessage} from 'src/app/clazz/common-clazz';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(private http: HttpClient) { }

    public configuration(): Observable<Configuration> {
        return this.http.get<Configuration>('assets/config/app-config.json');
    }

    public getConfiguration(url: string): Observable<LeafletConfig> {
        return this.http.get<LeafletConfig>(url + '/setting/general/get/map/config');
    }

    public getApi(url: string) {
      return this.configuration() + url;
    }

    public leafletConfig(): Observable<LeafletConfig> {
        return this.http.get<LeafletConfig>('assets/config/map-config.json');
    }


    /**
     * 从数据库中查询 地图配置
     */
    public queryLeafletConfig(url: string): Observable<LeafletConfig>{
      return this.http.get<LeafletConfig>(url + '/setting/general/get/leaflet').pipe();
    }

    public login(url: string, loginUser: LoginUser): Observable<Response> {
        return this.http.post<Response>(url + '/login', loginUser).pipe();
    }

    public logout(url: string): Observable<SystemMessage> {
        return this.http.get<SystemMessage>(url + '/auth/logout').pipe();
    }

    public currentUser(url: string){
        return this.http.get(url + '/user/token').pipe();
    }

  public queryLicense(url: string, module: string): Observable<NokiaLicense>{
    const href = '/license/get/v2?module=' + module;
    return this.http.get<NokiaLicense>(url + href).pipe();
  }

  public exportFile(url: string, path: string): void {
    window.location.href = url + '/download/v1/file?filePath=' + path;
   /* const downloadUrl = url + '/download/v1/file?filePath=' + path;
    this.http.get(downloadUrl,  { responseType: 'arraybuffer' }).subscribe(data => {
      const tableData = new Blob([data], {
        // type: 'application/vnd.ms-excel;charset=UTF-8'
      });
      saveAs(tableData);
    });*/
  }
}
