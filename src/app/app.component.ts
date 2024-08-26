import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private translate: TranslateService) {
    console.log("默认语言加载")
    this.initTranslate();
  }

    pageTitle = 'Smart O&M for RAN compact';
    username = 'Admin';
    // emailSupport = 'support.ices@nokia.com';
    emailSupport = '';

    openNavigation(){
    }

    homepage(){
    }

    logout(){
    }

    systemMng(){
    }

  initTranslate(){
    //设置翻译字符串的默认语言和当前语言
    this.translate.setDefaultLang('zh');
    if (this.translate.getBrowserLang() !==undefined){
      this.translate.use(this.translate.getBrowserLang());
    }else {
      this.translate.use('zh');
    }
  }

}
