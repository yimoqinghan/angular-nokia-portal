export class AlarmFilter {
    /**
     * 1: active alarm, 0: history alarm
     */
    alarmType: string;
    enbId: string;
    siteCode: string;
    alarmNo: string;
    faultId: string;
    pageSize: number;
    pageIndex: number;
    startTime: string;
    endTime: string;
}

export class AlarmQuery {
    neCode: string;
    siteCode: string;
    alarmNo: number;
    faultyId: string;
    alarmFaultid: string;
    alarmSource: string;
    alarmDescription: string;
    alarmSeverity: string;
    alarmTime: string;
    cancelTime: string;
}

export class Alarm {

    enbId: number;
    alarmNo: number;
    faultId: number;
    additionalFaultId: number;
    alarmResource: string;
    alarmDetail: string;
    alarmSeverity: string;
    alarmTime: string;
    cancelTime: string;
}

export class CellStateFilter {
    startTime: string;
    stopTime: string;
    enbId: number;
    enbName: string;
    enbState: string;
    trsState: string;
    adminState: string;
    operationalState: string;
    pageIndex: number;
    pageSize: number;
}

export class BtsState {
    cellAdminState: string;
    cellId: string;
    cellOperationalState: string;
    enbSw: string;
    enbWrokingState: string;
    neCode: string;
    neName: string;
    period: string;
    trsStatus: string;
    blockingState: string;
    remarks: string;
}



export class CellSate {
    period: string;
    enbId: number;
    enbName: string;
    enbSW: string;
    enbState: string;
    trsState: string;
    cellId: number;
    adminState: string;
    operationalState: string;
}

export class CellKpi {
    periodStartTime: string;
    neCode: number;
    neName: string;
    cellId: number;
    cellName: string;
    cellState: string;
}

export class CellKpiFilter {
    enbId: number;
    enbName: string;
    cellId: number;
    cellName: string;
    // enbState: string;
    // cellState: string;

    startTime: string;
    stopTime: string;
    pageIndex: number;
    pageSize: number;
}

export class KpiFilter {
    enbId: number;
    cellId: number;

    /**
     * 15分钟：15m；1小时：60m
     */
    interval: string;
    stopTime: string;
}

export class KpiTrend {
    kpiId: number;
    kpiName: string;
    unit: string;
    threshold: number;
    values: Array<number>;
    periods: Array<string>;
}

export class KpiGroupTrend {
    groupId: number;
    groupName: string;
    groupIndex: number;
    kpis: Array<KpiTrend>;
    periods: Array<string>;
}

export class KpiGroupChart {
    group: KpiGroupTrend;
    echarts: any;
}

export class AbnormalKpi {
    periodStartTime: string;
    neCode: number;
    neName: string;
    cellId: number;
    enbState: string;
    cellState: string;
    dataMap: any;
    abnormal: Array<number> = [];
}

export class KpiGroup {
    groupId: number;
    groupName: string;
    groupIndex: number;
    kpis: Array<Kpi> = [];
}

export class Kpi {
    // groupId: number;
    id: number;
    kpiName: string;
    unit: string;
    major: number;
    view: string;
}

export class Site {
    id ?: number;
    enbId: number;
    enbName = '';
    enbIp: string;
    version: string;
    state ?: string;
    trsState ?: string;
    latitude: number;
    longitude: number;
    enbKpi ?: Array<KpiData>=[];
    cells ?: Array<CellDetail> = [];
    alarms ?: Array<Alarm> = [];

}

export class Bts {
  id ?: number;
  neCode: string;
  siteCode: string;
  enbName = '';
  ip: string;
  neVersion: string;
  gpsLongitude: number;
  gpsLatitude: number;
  btsType: string;
  groupId: number;
  netWorkType:string;
}

export class SiteFilter {
    enbId: number;
    siteCode: string;
    enbName: string;
    enbIp: string;
    version: string;
}

export class CellDetail {
    cellId: number;
    cellName: string;
    // trsState: string;
    adminState: string;
    operationalState: string;
    kpis: Array<KpiData> = [];
}

export class KpiData {
    kpiId: number;
    kpiName: string;
    kpiValue: number;
    period: string;
}

export class Threshold {
    id: number;
    sign: number;
    interval: number;
    kpiName: string;
    relation: string;
    threshold: number;
    auxRelation1: string;
    auxThreshold1: number;
    auxRelation2: string;
    auxThreshold2: number;
    abnormalPeriod: number;
}

// export class
export class HardwareMessage {
    id: number;
    enbId: number;
    enbName: string;
    executeTime: string;
    executeType: string;
    executor: string;
    status: string;
    result: string;
    hardware: string;
    serialNumber: string;

    expand ?: false;

    hardwares ?: Array<Hardware> = [];
}

export class Hardware {
    hardware: string;
    serialNumber: string;
}

export class HardwareMessageFilter {
    startTime: string;
    stopTime: string;
    enbId: number;
    enbName: string;
    executeType: string;
    executor: string;
    // status: string;
    hardware: string;
    serialNumber: string;

    pageIndex: number;
    pageSize: string;
}

export class BackupMessage {
    id: number;
    enbId: number;
    enbName: string;
    backupTime: string;
    backupStatus: string;
    backupResult?: string;
    backupType?: string;
    backupExecutor?: string;

    recoverExecutor?: string;
    recoverTime?: string;
    recoverStatus?: string;
    recoverResult?: string;
}

export class BackupMessageFilter {
    startTime: string;
    stopTime: string;
    enbId: number;
    enbName: string;
    executeType: string;
    executor: string;
    status: string;
    /**
     * 0: backups; 1: recovery
     */
    dataType: string;

    pageIndex: number;
    pageSize: string;
}
