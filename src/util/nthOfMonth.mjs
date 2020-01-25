export default (year, month, weekday, n) => {
  const days = new Date(year, month + 1, 0).getDate();
  let num;
  let refWeekday;

  if (n > 0) {
    refWeekday = new Date(year, month, 1).getDay();

    num = 1 + ((n - 1) * 7) + (7 - (refWeekday - weekday)) % 7;

    if (num > days) {
      return null;
    }
  } else if (n < 0) {
    refWeekday = new Date(year, month, days).getDay();

    num = days + ((n + 1) * 7) - (7 - (weekday - refWeekday)) % 7;

    if (num < 1) {
      return null;
    }
  }

  return num;// new Date(Date.UTC(year, month, num));
};
