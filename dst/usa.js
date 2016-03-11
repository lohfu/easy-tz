var nthOfMonth = require('../util/nth-of-month');

module.exports = function(date, timezone) {
	var year = date.getUTCFullYear(),
		dstStart = Date.UTC(year, 2, nthOfMonth(year, 2, 0, 2), 2, timezone.standard[0]),// starts second sunday in march at 2 am local time (2am > 3am, "spring forward")
		dstEnd = Date.UTC(year, 9, nthOfMonth(year, 10, 0, 1), 2, timezone.saving[0]);// ends first sunday in november at 2 am local time (2am > 1am, "fall back")

	return date >= dstStart && date < dstEnd;
};
