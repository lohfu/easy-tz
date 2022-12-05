import nthOfMonth from '../util/nth-of-month.js'

export default (date) => {
  const year = date.getUTCFullYear()
  // eslint-disable-next-line
  const dstStart = Date.UTC(year, 2, nthOfMonth(year, 2, 0, -1), 1) // last sunday in march at 01:00 UTC
  // eslint-disable-next-line
  const dstEnd = Date.UTC(year, 9, nthOfMonth(year, 9, 0, -1), 1) // last sunday in october at 01:00 UTC

  return date >= dstStart && date < dstEnd
}
