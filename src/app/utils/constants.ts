// export const BASE_URL = 'http://localhost:8081';
export const BASE_URL = '/api';
export const ADDRESS_LIST: any = {
  // Management
  API_KPI_THRESHOLD_LIST: BASE_URL + '/threshold/list',
  API_KPI_THRESHOLD_INFO: BASE_URL + '/threshold/detail/{id}',
  API_KPI_THRESHOLD_SAVE: BASE_URL + '/threshold/save',

  // enb
  API_ENB_LIST: BASE_URL + '/bts/list',
  API_ENB_INFO: BASE_URL + '/bts/detail/{id}',
  API_ENB_SAVE: BASE_URL + '/bts/save',
  API_ENB_DELETE: BASE_URL + '/bts/delete/{id}',
  API_ENB_REMOVE_ALL: BASE_URL + '/bts/remove/all',
  API_ENB_IMPORT: BASE_URL + '/bts/import',
  API_ENB_EXPORT: BASE_URL + '/bts/export',
  API_ENB_DOWNLOAD_TEMPLATE: BASE_URL + '/bts/download/template',

  // abnormal kpi
  API_ABNORMAL_KPI_LIST: BASE_URL + '/kpi/abnormal/list',

  // kpis
  API_KPI_LIST: BASE_URL + '/kpi/page',
  API_ALL_KPI_LIST: BASE_URL + '/kpi/list',
  API_KPI_TREND: BASE_URL + '/kpi/trend',
  API_KPI_TREND_BY_KPIID: BASE_URL + '/kpi/trend/{kpiId}',
  API_KPI_EXPORT: BASE_URL + '/kpi/export',

  // user
  API_USER_LIST: BASE_URL + '/user/search?name={username}',
  API_USER_CREATE: BASE_URL + '/user/create',
  API_USER_UPDATE: BASE_URL + '/user/update',
  API_USER_DELETE: BASE_URL + '/user/delete?id={id}',
  API_USER_GROUPS: BASE_URL + '/user/group?user={id}',

  API_ACCOUNT_PROFILE: BASE_URL + '/account/profile',
  API_ACCOUNT_PASSWORD: BASE_URL + '/account/password',

  API_GROUP_LIST: BASE_URL + '/usergroup/search?name={name}',
  API_GROUP_UPDATE: BASE_URL + '/usergroup/update',
  API_GROUP_DELETE: BASE_URL + '/usergroup/delete?id={id}',
  API_GROUP_RELATION_SEARCH: BASE_URL + '/usergroup/user?group={id}',
  API_GROUP_BTS_SEARCH: BASE_URL + '/usergroup/bts?group={id}',
  API_GROUP_RELATION_SAVE: BASE_URL + '/usergroup/relation',
  API_GROUP_RELATION_BTS_SAVE: BASE_URL + '/usergroup/update/bts',

  // permission
  API_PERMISSION_LIST: BASE_URL + '/permission/search',
  API_PERMISSION_UPDATE: BASE_URL + '/permission/update',
  API_PERMISSION_INFO: BASE_URL + '/permission/details?id={id}',
  API_PERMISSION_DELETE: BASE_URL + '/permission/delete?id={id}',
  API_PERMISSION_ACCOUNTS: BASE_URL + '/permission/reset/passwd?account={name}',
  API_PERMISSION_SUBMENU: BASE_URL + '/permission/submenu',
  API_PERMISSION_USERS: BASE_URL + '/permission/user',
  API_PERMISSION_GROUPS: BASE_URL + '/permission/group',

  // data clear config
  API_DATA_CLEAR_CONFIG_LIST: BASE_URL + '/config/list',
  API_DATA_CLEAR_CONFIG_SAVE: BASE_URL + '/config/save',
  API_DATA_CLEAR_CONFIG_DELETE: BASE_URL + '/config/delete/{id}',

  API_AUTH_LOGIN: BASE_URL + '/auth',
  API_USER_MENUS: BASE_URL + '/auth/menus',
  API_SYSTEM_MENUS: BASE_URL + '/auth/system/menus',

  ALARM_EXPORT: BASE_URL + '/alarm/export',
  STATUS_EXPORT: BASE_URL + '/status/export',
};
