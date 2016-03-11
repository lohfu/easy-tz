var nthOfMonth = require('../util/nth-of-month');

module.exports = function(date) {
	var year = date.getUTCFullYear(),
		dstStart = Date.UTC(year, 8, nthOfMonth(year, 8, 0, 1), 2, timezone.standard[0]),// first sunday in september at 02:00 > 03:00 localtime
		dstEnd = Date.UTC(year, 3, nthOfMonth(year, 3, 0, 1), 2, timezone.saving[0]);// first sunday in april at 02:00 > 01:00 localtime
	
	return date >= dstStart || date < dstEnd;
};
