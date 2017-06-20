import { AppConstant } from '../app.constant';
import * as moment from 'moment';

export class ProgramModel {
  public _id: string;
  public campaign_id: string = '';
  public account_id: string = '';
  public name: string = '';
  public content: string = '';
  public schedule: string = '';
  public schedule_date: string = '';
  public enabled: boolean = false;
  public status: string = '';
  public type: string = '';
  public lists: any[] = [];
  public keywords: string[] = [];

  constructor(data: any = {}) {
    this._id = data._id;
    this.campaign_id = data.campaign_id;
    this.account_id = data.account_id;
    this.name = data.name;
    this.content = data.content;
    this.schedule = data.schedule;
    this.enabled = data.enable;
    this.status = data.status;
    this.type = data.type;
    this.lists = data.lists;
    this.keywords = data.keywords;
  }
}

export class ProgramFilterModel {
  public status: string;
  public since: string;
  public type: string;
  public campaign_id: string;
  public page: number;
  public limit: number;
  public sort: string;
  public search: string;

  constructor(data?: any) {
    this.status = data.status;
    this.since = data.since;
    this.type = data.type;
    this.campaign_id = data.campaign_id;
    this.page = data.page;
    this.limit = data.limit;
    this.sort = data.sort;
    this.search = data.search;
  }
}

export class OptInProgramModel {
  public _id: string;
  public campaign_id: string = '';
  public account_id: string = '';
  public name: string = '';
  public content: string = '';
  public type: string = 'optin';
  public keywords: any[] = [];
  public insert_sql: string = '';
  public select_sql: string = '';
  public status: string = '';

  constructor(data: any = null) {
    if (data) {
      this._id = data._id;
      this.campaign_id = data.campaign_id;
      this.name = data.name;
      this.content = data.content;
      this.keywords = data.keywords;
      this.insert_sql = data.insert_sql;
      this.select_sql = data.select_sql;
      this.status = data.status;
      this.account_id = data.account_id;
    }
  }
}

export class OptInProgramFormControl {
  public _id: string;
  public name: string = '';
  public optInType: string = 'KEYWORD';
  public keywords: string = '';
  public content: string = '';
  public sqlInsert: string = '';
  public sqlSelect: string = '';

  constructor(data: any = null) {
    if (data) {
      this._id = data._id;
      this.name = data.name;
      this.optInType = data.optInType ? data.optInType : 'KEYWORD';
      this.keywords = data.keywords;
      this.content = data.content;
      this.sqlInsert = data.insert_sql;
      this.sqlSelect = data.select_sql;
    }
  }
}

export class Schedule {
  public type: string = 'once';
  public start: string = '';
  public end: string = '';
  public day: number = 15;
  public time: string = '';
  public days: string[] = [];
  public limit: number;
  public enabled: boolean;

  constructor(data: any = null) {
    if (data) {
      this.type = data.type;
      this.start = data.start;
      this.end = data.end;
      this.enabled = data.enabled;
      this.day = data.day;
      this.time = data.time;
      this.days = data.days;
      this.limit = data.limit;
    }
  }
}

export class BroadcastProgramModel {
  public _id: string;
  public campaign_id: string = '';
  public account_id: string = '';
  public name: string = '';
  public content: string = '';
  public schedule: Schedule = new Schedule();

  public enabled: boolean = true;
  public status: string = '';
  public type: string = 'broadcast';
  public code_id: string = '';
  public insert_sql: string = '';
  public select_sql: string = '';

  constructor(data: any = null) {
    if (data) {
      this._id = data._id;
      this.campaign_id = data.campaign_id;
      this.name = data.name;
      this.content = data.content;
      this.schedule = new Schedule(data.schedule);
      this.enabled = data.enabled;
      this.status = data.status;
      this.code_id = data.code_id;
      this.select_sql = data.select_sql;
      this.insert_sql = data.insert_sql;
      this.account_id = data.account_id;
    }
  }
}

export class BroadcastFormControl {
  public _id: string;
  public name: string = '';
  public code_id: string = '';
  public content: string = '';
  public status: string = '';
  public select_sql: string = '';
  public insert_sql: string = '';
  public template: string = 'N/A';
  public scheduleDateTimeStart: Date;
  public scheduleDateTimeEnd: Date;
  public timeOfDay: Date;
  public days: string[] = [];
  public scheduleType: string = '';
  public scheduleStatus: string = 'true';
  public enabled: boolean = true;
  public maxRecur: string = 'nomax';
  public dayOfMonth: number = 15;

  constructor(data: any = null) {
    if (data) {
      this._id = data._id;
      this.name = data.name;
      this.content = data.content;
      this.code_id = data.code_id;
      this.content = data.content;
      this.status = data.status;
      this.select_sql = data.select_sql;
      this.insert_sql = data.insert_sql;
      this.scheduleDateTimeStart = data.schedule && data.schedule.start ? new Date(data.schedule.start) : null;
      this.scheduleDateTimeEnd = data.schedule && data.schedule.end ? new Date(data.schedule.end) : null;
      this.timeOfDay = data.schedule && data.schedule.time ? new Date(moment().format(AppConstant.format.moment.sortDate) + ' ' + data.schedule.time) : null;
      this.scheduleStatus = data.schedule ? data.schedule.enabled ? 'true' : 'false' : 'false';
      this.scheduleType = data.schedule ? data.schedule.type : '';
      this.days = data.schedule ? data.schedule.days : [];
      this.dayOfMonth = data.schedule && data.schedule.day ? data.schedule.day : 15;
    }
  }
}

export const DayList = [
  {id: 0, name: 'SU'},
  {id: 1, name: 'M'},
  {id: 2, name: 'T'},
  {id: 3, name: 'W'},
  {id: 4, name: 'TH'},
  {id: 5, name: 'F'},
  {id: 6, name: 'SA'}
];

export const ScheduleTypeList = [
  {id: 'once', name: 'One Time'},
  {id: 'weekly', name: 'Weekly Recurring'},
  {id: 'monthly', name: 'Monthly Recurring'},
];

export const ProgramStatus = {
  STAGED: 'staged',
  ACTIVE: 'active',
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed'
};
