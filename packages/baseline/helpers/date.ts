// Date formatting helpers

export const dateFormatter = (locale = 'en-US', options: Intl.DateTimeFormatOptions = {}) =>
    new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    })

// Persian/Jalali date formatter
export const jDateFormatter = dateFormatter('fa-IR', { weekday: 'long' })

// Common formatters. Building an Intl formatter costs far more than using
// one, so each locale keeps its own. A formatter stays in the time zone it
// was built in, so they are all dropped when the device's offset from UTC
// changes: the user has travelled, or the clocks have moved.
let kept: Record<string, Intl.DateTimeFormat> = {}
let offset = NaN

const formatter = (key: string, build: () => Intl.DateTimeFormat) => {
    const now = new Date().getTimezoneOffset()
    if (now !== offset) {
        offset = now
        kept = {}
    }
    return kept[key] || (kept[key] = build())
}

export const formatDate = (date: Date, locale = 'en-US') =>
    formatter('date ' + locale, () => dateFormatter(locale)).format(date)
export const formatTime = (date: Date, locale = 'en-US') =>
    formatter('time ' + locale, () => new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' })).format(date)