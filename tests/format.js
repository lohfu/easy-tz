import test from 'tape'

import { to } from '../src/index.js'
import format from '../src/format.js'

import en from '../src/locales/en.js'
import sv from '../src/locales/sv.js'

import utc from '../src/zoneinfo/UTC.js'
import london from '../src/zoneinfo/Europe/London.js'

const date = new Date('2016-07-01T01:23:45.006Z')

test('format', (t) => {
  t.is(
    format(en, 'yy-MM-DD MMMM MMM dddd ddd HH:mm:ss S SS SSS', to(utc, date)),
    '16-07-01 July Jul Friday Fri 01:23:45 0 00 006',
  )
  t.is(
    format(sv, 'yy-MM-DD MMMM MMM dddd ddd HH:mm:ss S SS SSS', to(london, date)),
    '16-07-01 juli jul fredag fre 02:23:45 0 00 006',
  )
  t.end()
})
