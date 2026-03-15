// Validation regex patterns

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const URL = /^https?:\/\/[^\s/$.?#].[^\s]*$/i
export const PHONE = /^\+?[\d\s-()]+$/
export const PASSWORD_STRONG = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/

// Validators (return boolean)
export const isEmail = (s: string) => EMAIL.test(s)
export const isUrl = (s: string) => URL.test(s)
export const isPhone = (s: string) => PHONE.test(s)
export const isStrongPassword = (s: string) => PASSWORD_STRONG.test(s)