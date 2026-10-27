import { Page, Button, Div, nextId, shortUUID, uuidv4, injectCSS, CS } from "@codesuma/baseline"
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

    const output = Section('Output')
    output.add(log)

    page.append(title, idSection, rippleSection, cssSection, output)
    page.style({ overflowY: 'auto', background: theme.bg })

    return page
}

export default UtilitiesPage
