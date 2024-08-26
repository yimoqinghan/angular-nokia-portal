export class Utils {
    static isNumber(str: string): boolean {
        let is:boolean = false;
        const regExp = /^\d*$/g;
        if (str && str != null && regExp.test(str)) {
            is = true;
        }
        return is;
    }

    static getHref(): string {
        let href:string = window.location.href;
        href = href.replace(window.location.origin, '')
        if (href.indexOf('/#/') != -1) {
            href = href.replace('/#/', '')
        }
        return href;
    }

    static formatNumber(input: string): string {
        let output: string = "";
        if (this.isNumber(input)) {
            const temp:string = input + "";
            let counter:number = 0;
            for (var i = temp.length - 1; i >= 0; i--) {
                counter++;
                output = temp.charAt(i) + output;
                if (!(counter % 3) && i != 0) { 
                    output = ',' + output; 
                }
            }
        } else {
            output = "0";
        }
        return output;
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
}
