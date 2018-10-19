import moment from 'moment';
import 'moment/locale/es';
import 'moment-timezone';

moment.locale('es');
moment.tz('America/Argentina/Buenos_Aires');

export const monthDayYear = (timestamp, timezone) => (
  !timezone ? moment(timestamp).format('MMMM DD, YYYY') :
    moment(timestamp).tz(timezone).format('MMMM DD, YYYY')
);

export const dayMonthYearWithHours = timestamp => (
  moment(timestamp).format('DD/MM/YYYY hh:mm')
);

export const dayMonthYear = timestamp => (
  moment(timestamp).format('DD/MM/YYYY')
);

export const monthDayYearAtTime = (timestamp, timezone) => (
  !timezone ? moment(timestamp).format('MMMM Do, YYYY [at] hh:mm a') :
    moment(timestamp).tz(timezone).format('MMMM Do, YYYY [at] hh:mm a')
);

export const timeago = (timestamp, timezone) => (
  !timezone ? moment(timestamp).fromNow() :
    moment(timestamp).tz(timezone).fromNow()
);

export const add = (timestamp, amount, range, timezone) => (
  !timezone ? moment(timestamp).add(amount, range).format() :
    moment(timestamp).tz(timezone).add(amount, range).format()
);

export const year = (timestamp, timezone) => (
  !timezone ? moment(timestamp).format('YYYY') :
    moment(timestamp).tz(timezone).format('YYYY')
);

export const secondsToHMS = seconds =>
  moment('1900-01-01 00:00:00')
    .add(seconds, 'seconds')
    .format('HH:mm:ss');
