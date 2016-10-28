var test = require('tape');



var nth = require('../util/nth-of-month');

test('nth of month', function(t) {
	t.equal(nth(2016,9,0,-1), 30);
	t.equal(nth(2016,9,0,-2), 23);
	t.equal(nth(2016,9,0,-3), 16);
	t.equal(nth(2016,9,0,-4), 9);
	t.equal(nth(2016,9,0,-5), 2);
	t.equal(nth(2016,9,0,-6), null);
	t.equal(nth(2016,9,1,-1), 31);
	t.equal(nth(2016,9,2,-1), 25);
	t.equal(nth(2016,9,3,-1), 26);
	t.equal(nth(2016,9,4,-1), 27);
	t.equal(nth(2016,9,5,-1), 28);
	t.equal(nth(2016,9,6,-1), 29);
	t.equal(nth(2016,9,0,1), 2);
	t.equal(nth(2016,9,0,2), 9);
	t.equal(nth(2016,9,0,3), 16);
	t.equal(nth(2016,9,0,4), 23);
	t.equal(nth(2016,9,0,5), 30);
	t.equal(nth(2016,9,0,6), null);
	t.equal(nth(2016,9,1,1), 3);
	t.equal(nth(2016,9,2,1), 4);
	t.equal(nth(2016,9,3,1), 5);
	t.equal(nth(2016,9,4,1), 6);
	t.equal(nth(2016,9,5,1), 7);
	t.equal(nth(2016,9,6,1), 1);
	t.end();
});

var dst = require('../dst/europe');

test('dst: europe', function(t) {
	t.equal(dst(new Date(Date.UTC(2010,2,28,0,59))), false);
	t.equal(dst(new Date(Date.UTC(2010,2,28,1,0))), true);
	t.equal(dst(new Date(Date.UTC(2010,9,31,0,59))), true);
	t.equal(dst(new Date(Date.UTC(2010,9,31,1,0))), false);
	t.equal(dst(new Date(Date.UTC(2016,2,27,0,59))), false);
	t.equal(dst(new Date(Date.UTC(2016,2,27,1,0))), true);
	t.equal(dst(new Date(Date.UTC(2016,9,30,0,59))), true);
	t.equal(dst(new Date(Date.UTC(2016,9,30,1,0))), false);
	t.end();
});

var dst2 = require('../dst/usa');

var newYork = require('../zoneinfo/America/New_York');


test('dst: America/New_York', function(t) {
	t.equal(dst2(new Date(Date.UTC(2010,1,28)), newYork), false);
	t.equal(dst2(new Date(Date.UTC(2010,7,28)), newYork), true);
	//t.equal(dst(new Date(Date.UTC(2010,2,28,0,59))), false);
	//t.equal(dst(new Date(Date.UTC(2010,2,28,1,0))), true);
	//t.equal(dst(new Date(Date.UTC(2010,9,31,0,59))), true);
	//t.equal(dst(new Date(Date.UTC(2010,9,31,1,0))), false);
	//t.equal(dst(new Date(Date.UTC(2016,2,27,0,59))), false);
	//t.equal(dst(new Date(Date.UTC(2016,2,27,1,0))), true);
	//t.equal(dst(new Date(Date.UTC(2016,9,30,0,59))), true);
	//t.equal(dst(new Date(Date.UTC(2016,9,30,1,0))), false);
	t.end();
});

var tz = require('../');

var tzs = {
	utc: tz.factory(require('../zoneinfo/UTC')),
	uk: tz.factory(require('../zoneinfo/Europe/London')),
	se: tz.factory(require('../zoneinfo/Europe/Stockholm'))
};

test('tz: Europe/London', function(t) {
	t.equal(tzs.uk.to(Date.UTC(2016,11,1,15,0)).toLocaleString('sv'), '2016-12-01 15:00:00');
	t.equal(tzs.uk.to(Date.UTC(2016,6,1,15,0)).toLocaleString('sv'), '2016-07-01 16:00:00');
	t.end();
});

test('tz: Europe/Stockholm', function(t) {
	t.equal(tzs.se.to(Date.UTC(2016,11,1,15,0)).toLocaleString('sv'), '2016-12-01 16:00:00');
	t.equal(tzs.se.to(Date.UTC(2016,6,1,15,0)).toLocaleString('sv'), '2016-07-01 17:00:00');
	t.end();
});

var locale = require('../locales/sv'),
	tzStockholm = require('../').factory(require('../zoneinfo/Europe/Stockholm'));

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

console.log(printLong(tzStockholm.to('2016-01-31T12:00:00.000Z')));// sön 31 januari 2016 13:00 CET
console.log(printShort(tzStockholm.to('2016-01-31T12:00:00.000Z')));// 2016-01301 13:00

console.log(tzStockholm.to('2016-01-31T12:00:00.000Z').toLocaleString('sv'));// 2016-01-31 13:00:00
console.log(tzStockholm.to('2016-01-31T12:00:00.000Z').toLocaleString('en-GB'));// 31/01/2016, 13:00:00
console.log(tzStockholm.to('2016-01-31T12:00:00.000Z').toLocaleString('en-US'));// 1/31/2016, 1:00:00 PM


