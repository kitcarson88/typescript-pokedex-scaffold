import moment from "moment";

/////////////////////// MOMENT EXTENSIONS //////////////////////////
declare module "moment" {
  export interface Moment {
    // toTaiwaneseYear(): number;
    isSameDay(date: moment.Moment): boolean;
    isSameMonth(date: moment.Moment): boolean;
    isSameYear(date: moment.Moment): boolean;
  }
}

/*(moment.fn as any).toTaiwaneseYear = function ()
{
    const _self = this as moment.Moment;
    return _self.year() - 1911;
};*/

(moment.fn as any).isSameDay = function(date: moment.Moment) {
  const _self = this as moment.Moment;
  return _self.isSame(date, "day");
};

(moment.fn as any).isSameMonth = function(date: moment.Moment) {
  const _self = this as moment.Moment;
  return _self.isSame(date, "month");
};

(moment.fn as any).isSameYear = function(date: moment.Moment) {
  const _self = this as moment.Moment;
  return _self.isSame(date, "year");
};

/////////////////////// DATE EXTENSIONS //////////////////////////
declare global {
  interface Date {
    toMomentDate(): moment.Moment;
    format(format: string): string;
  }
}

Date.prototype.toMomentDate = function() {
  const value = this as Date;
  return moment(value.toISOString());
};

Date.prototype.format = function(format: string) {
  const value = this as Date;
  const momentDate = value.toMomentDate();

  return momentDate.format(format);
};

/////////////////////// STRING EXTENSION TO GET DATE /////////////////////
declare global {
  interface String {
    toMomentDate(format?: string): moment.Moment;
    toDate(format?: string): Date;
    toISOString(format?: string): string; // 2011-10-05T14:48:00.000Z
    toUTCString(format?: string): string; // Wed, 14 Jun 2017 07:00:00 GMT
    formatDateTo(formatFrom: string, formatTo: string): string;
  }
}

String.prototype.toMomentDate = function(format) {
  const value = this as string;
  return moment(value, format);
};
String.prototype.toDate = function(format) {
  const value = this as string;
  return value.toMomentDate(format).toDate();
};
String.prototype.toISOString = function(format) {
  const value = this as string;
  return value.toDate(format).toISOString();
};
String.prototype.toUTCString = function(format) {
  const value = this as string;
  return value.toDate(format).toUTCString();
};
String.prototype.formatDateTo = function(formatFrom: string, formatTo: string) {
  const value = this as string;
  const date = value.toDate(formatFrom);
  return date.format(formatTo);
};