// Device detection helpers

// An iPad reports the user agent of a Mac. Of the two, only the iPad has a
// touch screen.
const isIPad = () => /Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1

export const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || isIPad()

export const isTouch = () =>
    'ontouchstart' in window || navigator.maxTouchPoints > 0

export const isIOS = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) || isIPad()

export const isAndroid = () =>
    /Android/.test(navigator.userAgent)
