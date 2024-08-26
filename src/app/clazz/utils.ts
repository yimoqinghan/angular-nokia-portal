export class Utils {
    static isEmpty(str: string) {
        return str == undefined || str == null || '' == str.trim();
    }

    static isNumeric(num: string): boolean {
        if (num == null || num == undefined) {
            return false;
        }
        const regExp = /^\d*(.\d*)?$/g;
        return regExp.test(num);
    }

    static isInteger(num: string | null): boolean {
        if (num == null || num == undefined || num == '') {
            return false;
        }
        const regExp = /^\d*$/g;
        return regExp.test(num);
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
        return websoket;
    }
}