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

// Common formatters
export const formatDate = (date: Date, locale = 'en-US') => dateFormatter(locale).format(date)
export const formatTime = (date: Date, locale = 'en-US') =>
    new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(date)