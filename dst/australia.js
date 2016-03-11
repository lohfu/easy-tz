var nthOfMonth = require('../util/nth-of-month');

module.exports = function(date, timezone) {
	var year = date.getUTCFullYear(),
		dstStart = Date.UTC(year, 9, nthOfMonth(year, 9, 0, 1), 2, timezone.standard[0]),// first sunday in october, 02:00 > 03:00 localtime
		dstEnd = Date.UTC(year, 2, nthOfMonth(year, 2, 0, 1), 3, timezone.saving[0]);// first sunday in march at 03:00 > 02:00 localtime

	return date >= dstStart || date < dstEnd;
};
