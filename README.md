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

Easy TZ intends to implement all timezones defined by the IANA time zone database (available in UNIX folder
`/usr/share/zoneinfo`).

NOTE: ALWAYS save your dates in UTC!

NOTE: Easy TZ is only meant to be used with NEW dates, not historical. DST is applied
according to <https://en.wikipedia.org/wiki/Daylight_saving_time_by_country>.

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
	date: '2016-01-01',
	time: '11:00'
});
```

### Examples

```js
var locale = require('easy-tz/locales/sv'),
	tz = require('easy-tz').factory(require('easy-tz/zoneinfo/Europe/Stockholm'));

function twoDigits(val) {
	return val >= 10 ? val : '0' + val;
}

function printLong(date) {
	return [
		locale.days[date.getDay()].slice(0,3),
		date.getDate(),
		locale.months[date.getMonth()],
		date.getFullYear(),
		[ date.getHours(), date.getMinutes() ].map(twoDigits).join(':'),
		date.tz && date.tz[1]
	].join(' ');
}

function printShort(date) {
	var dateStr = [
		date.getFullYear(),
		date.getMonth() + 1,
		date.getDate()
	].map(twoDigits).join('-');

	var timeStr = [ date.getHours(), date.getMinutes() ].map(twoDigits).join(':');

	return dateStr + ' ' + timeStr;
}

printLong(tzStockholm.to('2016-01-31T12:00:00.000Z'));// sön 31 januari 2016 13:00 CET
printShort(tzStockholm.to('2016-01-31T12:00:00.000Z'));// 2016-01301 13:00

tzStockholm.to('2016-01-31T12:00:00.000Z').toLocaleString('sv');// 2016-01-31 13:00:00
tzStockholm.to('2016-01-31T12:00:00.000Z').toLocaleString('en-GB');// 31/01/2016, 13:00:00
tzStockholm.to('2016-01-31T12:00:00.000Z').toLocaleString('en-US');// 1/31/2016, 1:00:00 PM
```

## Creating your own timezones

Easy TZ provides a `nthOfMonth` helper to assist in creating your own
timezones.

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
		dstStart = Date.UTC(year, 2, nthOfMonth(year, 2, 0, -1), 1),// last sunday in march at 01:00 UTC
		dstEnd = Date.UTC(year, 9, nthOfMonth(year, 9, 0, -1), 1);// last sunday in october at 01:00 UTC

	return date >= dstStart && date < dstEnd;
};
```

For example, `easy-tz/dst/usa` looks like this:

```js
var nthOfMonth = require('../util/nth-of-month');

module.exports = function(date, timezone) {
	var year = date.getUTCFullYear(),
		dstStart = Date.UTC(year, 2, nthOfMonth(year, 2, 0, 2), 2, timezone.standard[0]),// starts second sunday in march at 2 am local time (2am > 3am, "spring forward")
		dstEnd = Date.UTC(year, 9, nthOfMonth(year, 10, 0, 1), 2, timezone.saving[0]);// ends first sunday in november at 2 am local time (2am > 1am, "fall back")

	return date >= dstStart && date < dstEnd;
};
```

The timezone for CET (./zoneinfo/CET.js) looks like this:

```js
module.exports = [ 60, 'CET', 'GMT+1', 'UTC+1' ];
```

Which is then used in a file, eg ('./zoneinfo/Europe/Stockholm') like so:

```js
module.exports = {
	dst: require('../../dst/europe'),
	saving: require('../CEST'),
	standard: require('../CET')
};
```

If your timezone does not use Daylight Saving Time, simply return an array.
The timezone for America/La_Paz looks like this.

```js
module.exports = [ -240, 'BOT', 'GMT-4', 'UTC-4' ];
```

## Timezones

So far the following are implemented:

- ./zoneinfo/ACST (Australian Central Standard Time, not in `/usr/share/zoneinfo/`)
- ./zoneinfo/AEDT (Australian Eastern Dayling Time, not in `/usr/share/zoneinfo/`)
- ./zoneinfo/AEST (Australian Eastern Standard Time, not in `/usr/share/zoneinfo/`)
- ./zoneinfo/AWST (Australian Western Standard Time, not in `/usr/share/zoneinfo/`)
- ./zoneinfo/CEST (Central Europe Summer Time, not in `/usr/share/zoneinfo/`)
- ./zoneinfo/CET
- ./zoneinfo/EAT (Eastern African Time, not in `/usr/share/zoneinfo/`)
- ./zoneinfo/EEST (Eastern Europe Summer Time, not in `/usr/share/zoneinfo/`)
- ./zoneinfo/EET
- ./zoneinfo/EET
- ./zoneinfo/FET (Further-eastern Europe Time, not in `/usr/share/zoneinfo/`)
- ./zoneinfo/GB
- ./zoneinfo/GB
- ./zoneinfo/GMT
- ./zoneinfo/IST (Moscow Time, not in `/usr/share/zoneinfo/`)
- ./zoneinfo/MSK (Moscow Time, not in `/usr/share/zoneinfo/`)
- ./zoneinfo/US
- ./zoneinfo/UTC
- ./zoneinfo/WAST
- ./zoneinfo/WAT
- ./zoneinfo/WEST (Western Europe Summer Time, not in `/usr/share/zoneinfo/`)
- ./zoneinfo/WET
- ./zoneinfo/Africa/Addis_Adaba
- ./zoneinfo/Africa/Brazzaville
- ./zoneinfo/Africa/Cairo
- ./zoneinfo/Africa/Casablanca
- ./zoneinfo/Africa/Dakar
- ./zoneinfo/Africa/Johannesburg
- ./zoneinfo/Africa/Lagos
- ./zoneinfo/Africa/Mogadishu
- ./zoneinfo/Africa/Nairobi
- ./zoneinfo/Africa/Timbuktu
- ./zoneinfo/Africa/Tripoli
- ./zoneinfo/Africa/Windhoek
- ./zoneinfo/America/Chicago
- ./zoneinfo/America/Denver
- ./zoneinfo/America/La_Paz
- ./zoneinfo/America/Los_Angeles
- ./zoneinfo/America/New_York
- ./zoneinfo/Antarctica/Casey
- ./zoneinfo/Antarctica/Davis
- ./zoneinfo/Antarctica/DumontDUrville
- ./zoneinfo/Antarctica/Macquarie
- ./zoneinfo/Antarctica/Mawson
- ./zoneinfo/Antarctica/McMurdo
- ./zoneinfo/Antarctica/Palmer
- ./zoneinfo/Antarctica/Rothera
- ./zoneinfo/Antarctica/South_Pole
- ./zoneinfo/Antarctica/Syowa
- ./zoneinfo/Antarctica/Troll
- ./zoneinfo/Antarctica/Vostok
- ./zoneinfo/Asia/Singapore
- ./zoneinfo/Asia/Tokyo
- ./zoneinfo/Australia/Brisbane
- ./zoneinfo/Australia/Sydney
- ./zoneinfo/Europe/Amsterdam
- ./zoneinfo/Europe/Andorra
- ./zoneinfo/Europe/Athens
- ./zoneinfo/Europe/Barcelona
- ./zoneinfo/Europe/Belfast
- ./zoneinfo/Europe/Belgrade
- ./zoneinfo/Europe/Berlin
- ./zoneinfo/Europe/Bratislava
- ./zoneinfo/Europe/Brussels
- ./zoneinfo/Europe/Bucharest
- ./zoneinfo/Europe/Budapest
- ./zoneinfo/Europe/Busingen
- ./zoneinfo/Europe/Chisinau
- ./zoneinfo/Europe/Copenhagen
- ./zoneinfo/Europe/Dublin
- ./zoneinfo/Europe/Gibraltar
- ./zoneinfo/Europe/Guernsey
- ./zoneinfo/Europe/Helsinki
- ./zoneinfo/Europe/Isle_of_Man
- ./zoneinfo/Europe/Istanbul
- ./zoneinfo/Europe/Jersey
- ./zoneinfo/Europe/Kaliningrad
- ./zoneinfo/Europe/Kiev
- ./zoneinfo/Europe/Lisbon
- ./zoneinfo/Europe/Ljubljana
- ./zoneinfo/Europe/London
- ./zoneinfo/Europe/Luxembourg
- ./zoneinfo/Europe/Madrid
- ./zoneinfo/Europe/Malta
- ./zoneinfo/Europe/Mariehamn
- ./zoneinfo/Europe/Minsk
- ./zoneinfo/Europe/Monaco
- ./zoneinfo/Europe/Moscow
- ./zoneinfo/Europe/Nicosia
- ./zoneinfo/Europe/Oslo
- ./zoneinfo/Europe/Paris
- ./zoneinfo/Europe/Podgorica
- ./zoneinfo/Europe/Prague
- ./zoneinfo/Europe/Riga
- ./zoneinfo/Europe/Rome
- ./zoneinfo/Europe/Samara
- ./zoneinfo/Europe/San_Morino
- ./zoneinfo/Europe/Sarajevo
- ./zoneinfo/Europe/Simferopol
- ./zoneinfo/Europe/Skopje
- ./zoneinfo/Europe/Sofia
- ./zoneinfo/Europe/Stockholm
- ./zoneinfo/Europe/Tallinn
- ./zoneinfo/Europe/Tirane
- ./zoneinfo/Europe/Tiraspol
- ./zoneinfo/Europe/Uzhgorod
- ./zoneinfo/Europe/Vaduz
- ./zoneinfo/Europe/Vatican
- ./zoneinfo/Europe/Vienna
- ./zoneinfo/Europe/Vilnius
- ./zoneinfo/Europe/Volgograd
- ./zoneinfo/Europe/Warsaw
- ./zoneinfo/Europe/Zagreb
- ./zoneinfo/Europe/Zaporozhye
- ./zoneinfo/Europe/Zurich
- ./zoneinfo/US/Alaska
- ./zoneinfo/US/Aleutian
- ./zoneinfo/US/Central
- ./zoneinfo/US/Eastern
- ./zoneinfo/US/Hawaii
- ./zoneinfo/US/Mountain
- ./zoneinfo/US/Pactific
