import nthOfMonth from '../util/nth-of-month.js'

export default (date) => {
  const year = date.getUTCFullYear()
  // eslint-disable-next-line
  const dstStart = Date.UTC(year, 8, nthOfMonth(year, 8, 0, 1), 2, timezone.standard[0]) // first sunday in september at 02:00 > 03:00 localtime
  // eslint-disable-next-line
  const dstEnd = Date.UTC(year, 3, nthOfMonth(year, 3, 0, 1), 2, timezone.saving[0]) // first sunday in april at 02:00 > 01:00 localtime

  return date >= dstStart || date < dstEnd
}
