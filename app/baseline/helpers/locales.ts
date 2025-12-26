// Locale and text direction helpers

const RTL_CHARS = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/

export const isRTL = (text: string) => RTL_CHARS.test(text)

// Persian/Arabic digits to Latin
export const toLatinDigits = (str: string) =>
    str.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, d =>
        String(d.charCodeAt(0) - (d >= '۰' ? 0x06F0 : 0x0660))
    )

// Latin digits to Persian
export const toPersianDigits = (str: string) =>
    str.replace(/[0-9]/g, d => String.fromCharCode(0x06F0 + parseInt(d)))