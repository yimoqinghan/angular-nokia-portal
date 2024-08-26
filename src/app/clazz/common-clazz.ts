export class LeafletConfig {
    // 地图瓦片地址
    urlTemplate: string;
    // 地图最小层级
    minZoom: number;
    // 地图最大层级
    maxZoom: number;

    // 地图范围
    boundLeftLatitude: number;
    boundLeftLongitude: number;
    boundRightLatitude: number;
    boundRightLongitude: number;
    centerLatitude: number;
    centerLongitude: number;
    centerZoom: number;
}

export class LeafletMarker<T> {
    title: string;
    icon: string;
    latitude: number;
    longitude: number;

    // 该坐标点网元的个数
    count: number;
    details: T;
}

export class Configuration {
    apiServer: string;
}

export class Group<T>{
    name: string | '';
    members: Array<T>;
}

export class Menu {
    flag: string;
    name: string;
    disable: boolean;
}

export class LoginUser {

    username: string;
  // tslint:disable-next-line:indent
	password: string;
  // tslint:disable-next-line:indent
	token ?: string;
  // tslint:disable-next-line:indent
	access ?: boolean;
  // tslint:disable-next-line:indent
	notes ?: string;
}

export class UserGroup {
  id = 0;
  name = '';
  notes = '';
  users = 0;
  btsSize = 0;
  result = '';
}

export class SystemMessage {
    message: any;
}

export class ResponseMessage {
  static STATE_OK = 'OK';
  static STATE_NOK = 'NOK';
  message: any;
}

export class Response {
  success: boolean;
  message: string;
  data: any;
}

export class FileNode {
  type: number;
  value: string;
  label: string;
  isLeaf: boolean;
  filePath: string;
  children: Array<FileNode>;
}

export class User {
  id = 0;
  name = '';
  account = '';
  email = '';
  password = '';
  loginTime = '';
  token = '';
  groups = 0;
  groupId = 0;
  admin = 0;
  errorCode = '';
  result = '';
}

export class HistoryDataConfig {
  id = 0;
  tableName = '';
  datasourceName = '';
  datasourceIp = '';
  datasourcePort = '';
  datasourceUser = '';
  datasourcePassword = '';
  datasourceType = '';
  partitionType = '';
  dataName = '';
  retention = '';
  judgeField = '';
  state = 0;
  isHost = 0;
}

export class Submenu {
  id = 0;
  url = '';
  name = '';
  menu = 0;
}
export class Permission {
  id = 0;
  name = '';
  groups: Array<UserGroup> = [];
  menus: Array<Menu> = [];
  submenus: Array<Submenu> = [];
  checkedGroups: Array<number> = [];
  checkedSubmenus: Array<number> = [];
}

export class DataItem {
  label: any | null = null;
  value: any | null = null;
}

export class GeneralConfig {
  id: number;
  key: string;
  label: string;
  value: any;
  placeholder: string;
  module: string;
  notes: string;
}

export class NokiaLicense {
  customer: string;
  startupTime: string;
  expireTime: string;
  type: string;
  objNum: string;
  status: string;
}
