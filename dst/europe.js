var nthOfMonth = require('../util/nth-of-month');

module.exports = function(date) {
	var year = date.getUTCFullYear(),
		dstStart = Date.UTC(year, 2, nthOfMonth(year, 2, 0, -1), 1),// last sunday in march at 01:00 UTC
		dstEnd = Date.UTC(year, 9, nthOfMonth(year, 9, 0, -1), 1);// last sunday in october at 01:00 UTC

	return date >= dstStart && date < dstEnd;
};
