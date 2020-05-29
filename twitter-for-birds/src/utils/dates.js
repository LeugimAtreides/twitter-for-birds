import moment from 'moment';

/* Converts a 24 hour time string to a 12 hour string
 * with AM/PM appended to the end.
 *
 * ex. 13:30 -> 1:30pm
 * ex. 09:45 -> 9:45am
 */
export function convert24HourTime(time = '13:30') {
  const [hour24, minute] = time.split(':');
  const hour = ((Number(hour24) + 11) % 12) + 1;
  const ampm = (Number(hour24) > 11) ? 'pm' : 'am';
  const twoDigitMinute = (`0${minute}`).slice(-2);

  return `${hour}:${twoDigitMinute}${ampm}`;
}

/**
 * Format a date of birth string in the form m/d/y ex. 10/18/1988
 * in ISO format y-m-d ex. 1988-10-18
 * This method intentionally DOES NOT use built in ISO formatting
 * methods in JavaScript Date objects, because those are subject
 * to timezones which can modify a users date of birth
 */
export function formatDobAsISO(dobString) {
  const parts = dobString.split('/');
  const month = parts[0];
  const day = parts[1];
  const year = parts[2];

  return [year, month, day].join('-');
}

/**
 * Format timestamp to date in form m/d/y
 * ex. 2018-03-21T00:26:00.000+0000 -> 03/20/2018
 */
export function convertTimestampToDate(timestamp) {
  return moment(timestamp).format('MMM DD, YYYY');
}
