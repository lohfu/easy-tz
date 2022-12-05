function padZeroes(nbr, length) {
  nbr += ''

  return '0'.repeat(Math.max(length - nbr.length), 0) + nbr
}

const convert = [
  [/z{1,2}/, () => 'EST, CST, MST, PST'],
  [/Z{1,2}/, () => '+12:00 Offset from UTC as +-HH:mm, +-HHmm, or Z'],
  [/yy|YY/, (date) => date.getFullYear().toString().slice(2)],
  [/YYYY|yyyy/, (date) => date.getFullYear()],
  ['M', (date) => date.getMonth() + 1],
  ['MM', (date) => padZeroes(date.getMonth() + 1, 2)],
  ['MMM', (date, locale) => locale.months[date.getMonth()].slice(0, 3)],
  ['MMMM', (date, locale) => locale.months[date.getMonth()]],
  ['D', (date) => date.getDate()],
  ['DD', (date) => padZeroes(date.getDate(), 2)],
  ['ddd', (date, locale) => locale.days[date.getDay()].slice(0, 3)],
  ['dddd', (date, locale) => locale.days[date.getDay()]],
  ['H', (date) => date.getHours()],
  ['HH', (date) => padZeroes(date.getHours(), 2)],
  ['m', (date) => date.getMinutes()],
  ['mm', (date) => padZeroes(date.getMinutes(), 2)],
  ['s', (date) => date.getSeconds()],
  ['ss', (date) => padZeroes(date.getSeconds(), 2)],
  ['S', (date) => Math.floor(date.getMilliseconds() / 100)],
  ['SS', (date) => padZeroes(Math.floor(date.getMilliseconds() / 10), 2)],
  ['SSS', (date) => padZeroes(date.getMilliseconds(), 3)],
].reverse()

export default (locale, str, date) => {
  if (!(date instanceof Date)) date = new Date(date)

  if (isNaN(date.getTime())) {
    // should return localized 'Invalid Date'
    return date.toString()
  }

  return convert.reduce((str, [pattern, fnc]) => {
    const arr = str.split(pattern)

    if (arr.length === 1) {
      return arr[0]
    }

    return arr.join(fnc(date, locale))
  }, str)
}
