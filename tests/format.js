require('babel-register')

const format = require('../format')

const en = require('../locales/en')

const london = require('../zoneinfo/Europe/London')

const etz = require('../')

const date = new Date('2016-07-01')

console.log(format(en, 'yy-MM-DD MMMM MMM dddd ddd HH:mm:ss S SS SSS', etz.to(london, date)))
console.log(format(en, 'yy-MM-DD MMMM MMM dddd ddd HH:mm:ss S SS SSS', date))
