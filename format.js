function twoDigits(val) {
  return val >= 10 ? val : '0' + val;
}

var convert = [
  [/z{1,2}/, (date) => 'EST, CST, MST, PST'],
  [/Z{1,2}/, (date) => '+12:00	Offset from UTC as +-HH:mm, +-HHmm, or Z'],
  [/yy|YY/, (date) => date.getFullYear().toString().slice(2)],
  [/YYYY|yyyy/, (date) => date.getFullYear()],
  ['M', (date) => date.getMonth() + 1],
  ['MM', (date) => twoDigits(date.getMonth() + 1)],
  ['MMM', (date, locale) => locale.months[date.getMonth()].slice(0, 3)],
  ['MMMM', (date, locale) => locale.months[date.getMonth()]],
  ['D', (date) => date.getDate()],
  ['DD', (date) => twoDigits(date.getDate())],
  ['ddd', (date, locale) => locale.days[date.getDay()].slice(0, 3)],
  ['dddd', (date, locale) => locale.days[date.getDay()]],
  ['H', (date) => date.getHours()],
  ['HH', (date) => twoDigits(date.getHours())],
  ['m', (date) => date.getMinutes()],
  ['mm', (date) => twoDigits(date.getMinutes())],
  ['s', (date) => date.getSeconds()],
  ['ss', (date) => twoDigits(date.getSeconds())],
  ['S', (date) => Math.floor(date.getMilliseconds() / 100)],
  ['SS', (date) => Math.floor(date.getMilliseconds() / 10)],
  ['SSS', (date) => date.getMilliseconds()],
].reverse();

// export default function format(date, str) {
module.exports = function format(locale, str, date) {
  if (!(date instanceof Date)) date = new Date(date);

  return convert.reduce((str, [pattern, fnc]) => {
    const arr = str.split(pattern);

    if (arr.length === 1) {
      return arr[0];
    }

    return arr.join(fnc(date, locale));
  }, str);
};
