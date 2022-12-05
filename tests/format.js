import format from '../src/format.js'

import en from '../src/locales/en.js'

import london from '../src/zoneinfo/Europe/London.js'

import * as etz from '../src/index.js'

const date = new Date('2016-07-01')

/* eslint-disable no-console */
console.log(format(en, 'yy-MM-DD MMMM MMM dddd ddd HH:mm:ss S SS SSS', etz.to(london, date)))
console.log(format(en, 'yy-MM-DD MMMM MMM dddd ddd HH:mm:ss S SS SSS', date))
