import { Page, Button, Div, nextId, shortUUID, uuidv4, injectCSS, createStyler, createContent, createEmitter, CS } from "@codesuma/baseline"
import { createAppender } from "@codesuma/baseline/utils/appender"
import { PageHeader } from '../../components/page-header'
import { Section } from '../../components/section'
import { LogBox } from '../../components/log-box'
import { theme } from '../../theme'

injectCSS('utilities-demo-flash', `
@keyframes utilities-demo-flash { from { background: #fff3b0; } to { background: transparent; } }
.utilities-demo-flash { animation: utilities-demo-flash 0.6s ease-out; }
`)

export const UtilitiesPage = () => {
    const page = Page()
    const title = PageHeader('Utilities')
    const log = LogBox()

    // --- id generators ---
    const idSection = Section('nextId() / shortUUID() / uuidv4()')
    const nextIdBtn = Button('nextId()')
    nextIdBtn.on('click', () => log.log('nextId(): ' + nextId()))
    const shortUUIDBtn = Button('shortUUID()')
    shortUUIDBtn.on('click', () => log.log('shortUUID(): ' + shortUUID()))
    const uuidv4Btn = Button('uuidv4()')
    uuidv4Btn.on('click', () => log.log('uuidv4(): ' + uuidv4()))
    idSection.add(nextIdBtn, shortUUIDBtn, uuidv4Btn)

    // --- ripple effect (initRipple() is called once in app.ts) ---
    const rippleSection = Section('initRipple() (see app.ts)')
    const rippleBtn = Button('Click me (ripple)')
    rippleBtn.attr('data-ripple', '')
    rippleSection.add(rippleBtn)

    // --- injectCSS() + CS type ---
    const cssSection = Section('injectCSS()')
    const flashTarget = Div('Click "Flash" - injectCSS() added this @keyframes once at module load')
    flashTarget.style({ padding: '10px', border: `1px solid ${theme.border}`, borderRadius: theme.radiusSm })
    const flashStyle: CS = { padding: '10px' }
    flashTarget.style(flashStyle)
    const flashBtn = Button('Flash')
    flashBtn.on('click', () => {
        flashTarget.removeClass('utilities-demo-flash')
        void flashTarget.el.offsetWidth
        flashTarget.addClass('utilities-demo-flash')
    })
    cssSection.add(flashTarget, flashBtn)

    // --- composing a component by hand from the raw mixins (matches what Base() does internally) ---
    const mixinSection = Section('Manual mixin composition (createEmitter + createAppender + createStyler + createContent)')
    const customEl = document.createElement('div')
    const custom: any = { el: customEl, isMounted: false, parent: undefined }
    Object.assign(custom, createEmitter(), createAppender(custom), createStyler(custom), createContent(custom))
    custom.style({ padding: '10px', border: `1px dashed ${theme.brand}`, borderRadius: theme.radiusSm })
    custom.text('This element was assembled by hand from the same mixins Base() uses internally.')
    custom.on('click', () => log.log('manually-composed component emitted click'))
    mixinSection.add(custom)

    const output = Section('Output')
    output.add(log)

    page.append(title, idSection, rippleSection, cssSection, mixinSection, output)
    page.style({ overflowY: 'auto', background: theme.bg })

    return page
}

export default UtilitiesPage
