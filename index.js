function get(date, timezone) {
	// check if timezone uses DST, and then test if it is in dst
	return timezone.dst ? timezone[timezone.dst(date) ? 'saving' : 'standard'] : timezone;
}

function from(timezone, date) {

	// TODO make sure date argument is valid
	if(date instanceof Date && date.tz) {
		var current = date.getTimezoneOffset();

		date = new Date(date.getTime() - (date.tz[2] + current) * 60000);

		delete date.tz;
	} else if (date.time && date.date) {
		var time = _.defaults(date.time.split(''), '00:00:00.000Z'.split('')).join('');

		date = new Date(date.date + 'T' + time);

		// TODO make sure this handle time just around DST switch
		var tz = get(date, timezone);

		date = new Date(date.getTime() - tz[2] * 60000);
	}


	return date;
}

function to(timezone, date) {
	if(!(date instanceof Date)) date = new Date(date);

	// get actual timezone (DST or standard time)
	var tz = get(date, timezone),
		current = date.getTimezoneOffset();

	// use timezones offset to calculate new date, tz[2] is in minutes, so multiply by 60000 (60 seconds * 10000 milliseconds)
	date = new Date(date.getTime() + (tz[2] + current) * 60000);

	// save reference to tz
	date.tz = tz;

	return date;
}

module.exports = {
	to: to,

	from: from,

	factory: function factory(timezone) {
		if(!timezone)
			throw new Error('Timezone is required!');

		return {
			to: to.bind(void 0, timezone),

			from: from.bind(void 0, timezone)
		};
	}
};
