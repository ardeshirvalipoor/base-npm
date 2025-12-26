// Device detection helpers

export const isMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

export const isTouch = () =>
    'ontouchstart' in window || navigator.maxTouchPoints > 0

export const isIOS = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent)

export const isAndroid = () =>
    /Android/.test(navigator.userAgent)
