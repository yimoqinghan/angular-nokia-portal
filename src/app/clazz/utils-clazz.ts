export class Utils {

    static isNumber(str: string): boolean {
        let is:boolean = false;
        const regExp = /^\d*$/g;
        //const regExp = /^\d+(\.\d+)?$/
        //if (str && str != null && regExp.test(str.trim())) {
        if (str && str != null && regExp.test(str)) {
            is = true;
        }
        return is;
    }

    static isNumeric(num: string): boolean {
        if (num == null || num == undefined) {
            return false;
        }
        const regExp = /^\d*(.\d*)?$/g;
        return regExp.test(num);
    }

    static getHref(): string {
        let href:string = window.location.href;
        href = href.replace(window.location.origin, '')
        if (href.indexOf('/#/') != -1) {
            href = href.replace('/#/', '')
        }
        return href;
    }

    static formatKpis(kpis:any[]) {
        const list = [];
        kpis.forEach(item => {
            list.push({
                id: item['kpiId'],
                name: item['kpiName']
            });
        });
        return list;
    }

    static uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";
        var uuid = s.join("");
        return uuid;
    }

    static isEmpty(str: string): boolean {
        return str == undefined || str == null || str.trim() == '';
    }

    static isNull(obj: any){
        return obj == undefined || obj == null;
    }

    /**
     * 字符串 按升序 排序
     * @param list
     */
    static sort(list: Array<string>) {
        list.sort((t1: string, t2:string) => {
            if (t1 > t2) {
                return 1;
            } else if (t1 == t2) {
                return 0;
            } else {
                return -1;
            }
        });
    }

    static getWebsoket(url: string){
        let websoket: string = "";
        if (url != undefined && url != null) {
            if (url.startsWith("https")){
                websoket = url.replace("https", "wss");
            } else if (url.startsWith("http")){
                websoket = url.replace("http", "ws");
            } else {
                if (window.location.protocol.startsWith("https")) {
                    websoket = "wss://" + window.location.host + "/" + url;
                } else {
                    websoket = "ws://" + window.location.host + "/" + url;
                }
            }
        }
        console.log(websoket);
        return websoket;
    }

    /**
     * 判断时间是否为 HH:mm:ss格式时间
     * @param time
     * @returns
     */
    static isTime(time: string){
        if (time == undefined || time == null) {
            return false;
        }
        const regExp = /^(([1-9]{1})|([0-1][0-9])|([1-2][0-3])):([0-5][0-9]):([0-5][0-9])$/g
        return regExp.test(time);
    }

    /**
     * 解析HH:mm:ss格式时间
     * @param time
     * @returns
     */
    static parseTime(time: string){
        if (this.isTime(time)) {
            const arr = time.split(":");
            return new Date(0, 0, 0, parseInt(arr[0]), parseInt(arr[1]), parseInt(arr[2]));
        } else {
            return null;
        }
    }

}
