import nthOfMonth from '../util/nth-of-month';

export default (date, timezone) => {
  const year = date.getUTCFullYear();
  // eslint-disable-next-line
  const dstStart = Date.UTC(year, 2, nthOfMonth(year, 2, 0, 2), 2, timezone.standard[0]); // starts second sunday in march at 2 am local time (2am > 3am, "spring forward")
  // eslint-disable-next-line
  const dstEnd = Date.UTC(year, 9, nthOfMonth(year, 10, 0, 1), 2, timezone.saving[0]);// ends first sunday in november at 2 am local time (2am > 1am, "fall back")

  return date >= dstStart && date < dstEnd;
};
