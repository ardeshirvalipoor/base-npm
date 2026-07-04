import { Page, Input, Button, Div } from "@codesuma/baseline"
import { formatDate, formatTime } from "@codesuma/baseline/helpers/date"
import { formatNumber, formatCurrency, formatPercent } from "@codesuma/baseline/helpers/format"
import { isRTL, toPersianDigits, toLatinDigits } from "@codesuma/baseline/helpers/locales"
import { isEmail, isUrl, isPhone, isStrongPassword } from "@codesuma/baseline/helpers/regex"
import { isMobile, isTouch, isIOS, isAndroid } from "@codesuma/baseline/helpers/device"
import { PageHeader } from '../../components/page-header'
import { Section } from '../../components/section'
import { LogBox } from '../../components/log-box'
import { theme } from '../../theme'

export const HelpersPage = () => {
    const page = Page()
    const title = PageHeader('Helpers')
    const log = LogBox()

    // --- date ---
    const dateSection = Section('helpers/date')
    const dateBtn = Button('formatDate(now) / formatTime(now)')
    dateBtn.on('click', () => {
        const now = new Date()
        log.log(`formatDate: ${formatDate(now)} | formatTime: ${formatTime(now)}`)
    })
    dateSection.add(dateBtn)

    // --- format ---
    const formatSection = Section('helpers/format')
    const formatBtn = Button('formatNumber / formatCurrency / formatPercent')
    formatBtn.on('click', () => {
        log.log(`formatNumber(1234567.891, 2): ${formatNumber(1234567.891, 2)}`)
        log.log(`formatCurrency(42.5): ${formatCurrency(42.5)}`)
        log.log(`formatPercent(0.256, 1): ${formatPercent(0.256, 1)}`)
    })
    formatSection.add(formatBtn)

    // --- locales ---
    const localesSection = Section('helpers/locales')
    const localesInput = Input('Type some text...', 'text')
    const localesBtn = Button('isRTL / toPersianDigits / toLatinDigits')
    localesBtn.on('click', () => {
        const value = localesInput.value()
        log.log(`isRTL("${value}"): ${isRTL(value)}`)
        log.log(`toPersianDigits("123"): ${toPersianDigits('123')}`)
        log.log(`toLatinDigits(toPersianDigits("123")): ${toLatinDigits(toPersianDigits('123'))}`)
    })
    localesSection.add(localesInput, localesBtn)

    // --- regex ---
    const regexSection = Section('helpers/regex')
    const regexInput = Input('test@example.com', 'text', { value: 'test@example.com' })
    const regexBtn = Button('isEmail / isUrl / isPhone / isStrongPassword')
    regexBtn.on('click', () => {
        const value = regexInput.value()
        log.log(`isEmail("${value}"): ${isEmail(value)}`)
        log.log(`isUrl("${value}"): ${isUrl(value)}`)
        log.log(`isPhone("${value}"): ${isPhone(value)}`)
        log.log(`isStrongPassword("${value}"): ${isStrongPassword(value)}`)
    })
    regexSection.add(regexInput, regexBtn)

    // --- device ---
    const deviceSection = Section('helpers/device')
    const deviceOut = Div()
    deviceOut.text(`isMobile: ${isMobile()} | isTouch: ${isTouch()} | isIOS: ${isIOS()} | isAndroid: ${isAndroid()}`)
    deviceSection.add(deviceOut)

    const output = Section('Output')
    output.add(log)

    page.append(title, dateSection, formatSection, localesSection, regexSection, deviceSection, output)
    page.style({ overflowY: 'auto', background: theme.bg })

    return page
}

export default HelpersPage
