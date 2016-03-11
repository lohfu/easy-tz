# Easy TZ

Easy TZ is a very tiny, simple and extendable library for
converting JavaScript dates between timezones.

Since you only require the timezones you need, the footprint is only a few
bytes.

Easy TZ does this by actually manipulating the date instance itself,
so that calling any of the standard methods will return the correct time.
This means the actuall UTC/ISO date of the date instance will be wrong and
it is important NOT to pass this converted date instance to other libraries
or databases. Easy TZ should mainly be used for PRINTING dates in
a specific timezone.

Easy TZ was mainly created to work with the `Date.prototype.toLocaleString` and
similar methods.

NOTE: Easy TZ is only meant to be used with NEW dates, not historical. DST is applied
according to <https://en.wikipedia.org/wiki/Daylight_saving_time_by_country>.

Easy TZ intends to implement all timezones defined by the IANA time zone database (available in UNIX folder
`/usr/share/zoneinfo`).

## Installation

```js
npm install easy-tz
```


## Use

### factory(timezone)

Usually you want to convert fromt the same timezone multiple times,
so a factory function is created. Basically it just returns
a partially applied version of the other two methods. Ie, the source code looks like
this:

```js
function factory(timezone) {
	if(!timezone)
		throw new Error('Timezone is required!');

	return {
		to: to.bind(void 0, timezone),

		from: from.bind(void 0, timezone)
	};
}
```

Use:

```js

var tz = require('easy-tz').factory(require('easy-tz/zoneinfo/Europe/Stockholm'));

tz.to(new Date());
```

### to(timezone, date)

```js
var etz = require('easy-tz');

var se = require('easy-tz/zoneinfo/Europe/Stockholm');
var uk = require('easy-tz/zoneinfo/Europe/London');

etz.to(se, new Date()).toLocaleString('en-gb');
etz.to(uk, new Date()).toLocaleString('en-gb');
```

NOTE: Since Easy TZ modifies the timestamp of the date itself, any standard
methods that outputs the timezone will output the wrong timezone. This includes
the `Date.prototype.toString()` and `Date.prototype.toTimeString()`.

It is recommended to use Easy TZ with the `Date.prototype.toLocaleString()`,
`Date.prototype.toLocaleTimeString()` and `Date.prototype.toLocaleDateString()` 

### from(timezone, date)

Converts a time from the timezone to the current timezone.

```js
var tz = require('easy-tz').factory(require('easy-tz/zoneinfo/Europe/Stockholm'));

tz.from({
	date: '2016-01-01',this.get('startDate'),
	time: '11:00'
});
```

### Examples

```js
var locale = require('easy-tz/locales/sv'),
	tz = require('easy-tz').factory(require('easy-tz/zoneinfo/Europe/Stockholm'));

function printDate(date) {
	return [
		locale.days[date.getDay()].slice(0,3),
		date.getDate(),
		locale.months[date.getMonth()],
		date.getFullYear(),
		[ date.getHours(),
			date.getMinutes() 
		].map(twoDigits).join(':'),
		date.tz && date.tz[1]
	]).join(' ');
}

printDate(tz.to('2016-01-01T12:00:00'));

tz.to('2016-01-01T12:00:00').toLocaleString('sv');
```

## Creating your own timezones

Easy TZ provides a `nthOfMonth` helper to assist in creating your own timezones.

```js
var nth = require('easy-tz/util/nth-of-month');

nth(2016,9,0,-1);// 30 (last sunday of october, 2016)
nth(2016,9,0,-2);// 23 (2nd to last sunday of october, 2016)
nth(2016,9,0,-3);// 16 (3rd to last sunday of october, 2016);

nth(2016,9,0,1);// 2 (first sunday of october, 2016)
nth(2016,9,0,2);// 9 (second sunday of october, 2016)
nth(2016,9,0,3);// 16 (third sunday of october, 2016)
```

For example, `easy-tz/dst/europe` looks like this:

```js
var nthOfMonth = require('../util/nth-of-month');

module.exports = function(date) {
	var year = date.getUTCFullYear(),
		dstStart = Date.UTC(year, 2, nthOfMonth(year, 2, 0, -1), 1),
		dstEnd = Date.UTC(year, 9, nthOfMonth(year, 9, 0, -1), 1);

	return date >= dstStart && date < dstEnd;
};
```

The timezone for CET (./zoneinfo/CET.js) looks like this:

```js
module.exports = {
	dst: require('../dst/europe'),
	saving: [ 'CEST', 'GMT+2',	120 ],
	standard: [ 'CET', 'GMT+1', 60 ]
};
```

Which is then used in a file, eg ('./zoneinfo/Europe/Stockholm') like so

```js
module.exports = require('../CET');
```

If your timezone does not use Daylight Saving Time, simply return an array.
The timezone for America/La_Paz looks like this.

```js
module.exports = [ 'BOT', 'GMT-4', -240 ];
```

## Timezones

So far the following are implemented:

- ./zoneinfo/CET
- ./zoneinfo/CEST (Central Europe Summer Time, not in `/usr/share/zoneinfo`)
- ./zoneinfo/EET
- ./zoneinfo/EEST (Eastern Europe Summer Time, not in `/usr/share/zoneinfo`)
- ./zoneinfo/EAT (Eastern African Time, not in `/usr/share/zoneinfo/`)
- ./zoneinfo/GB
- ./zoneinfo/WET
- ./zoneinfo/WEST (Western Europe Summer Time, not in `/usr/share/zoneinfo`)
- ./zoneinfo/US/Alaska
- ./zoneinfo/US/Aleutian
- ./zoneinfo/US/Central
- ./zoneinfo/US/Eastern
- ./zoneinfo/US/Hawaii
- ./zoneinfo/US/Mountain
- ./zoneinfo/US/Pactific
- ./zoneinfo/Europe/Amsterdam
- ./zoneinfo/Europe/Athens
- ./zoneinfo/Europe/Berlin
- ./zoneinfo/Europe/Brussels
- ./zoneinfo/Europe/Chisinau
- ./zoneinfo/Europe/Copenhagen
- ./zoneinfo/Europe/Istanbul
- ./zoneinfo/Europe/Lisbon
- ./zoneinfo/Europe/London
- ./zoneinfo/Europe/Stockholm
