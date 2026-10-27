import { Page, Div, router, IRouteEvent } from "@codesuma/baseline"
import { PageHeader } from '../../components/page-header'
import { Section } from '../../components/section'
import { LogBox } from '../../components/log-box'
import { theme } from '../../theme'

const linkStyle = { padding: '8px 12px', border: `1px solid ${theme.border}`, borderRadius: theme.radiusSm, cursor: 'pointer', fontSize: '14px', background: theme.surface }

export const RouterDemoPage = () => {
    const page = Page()
    const title = PageHeader('Router Demo')
    const log = LogBox()

    const params = Section('Dynamic params: /router-demo/item/:id')
    const item1 = Div('Go to item 1'); item1.style(linkStyle)
    const item2 = Div('Go to item 2'); item2.style(linkStyle)
    item1.on('click', () => router.goto('/router-demo/item/1'))
    item2.on('click', () => router.goto('/router-demo/item/2'))
    params.add(item1, item2)

    const query = Section('Query string')
    // To another path: a goto() to the page you are on does nothing
    const withQuery = Div('Go to item 3 with ?tab=details&sort=asc'); withQuery.style(linkStyle)
    withQuery.on('click', () => router.goto('/router-demo/item/3?tab=details&sort=asc'))
    query.add(withQuery)

    const wildcard = Section('Wildcard fallback (*)')
    const badLink = Div('Go to an unmapped route'); badLink.style(linkStyle)
    badLink.on('click', () => router.goto('/this/route/does/not/exist'))
    wildcard.add(badLink)

    const nav = Section('History navigation')
    const backBtn = Div('router.back()'); backBtn.style(linkStyle)
    const forwardBtn = Div('router.forward()'); forwardBtn.style(linkStyle)
    backBtn.on('click', () => router.back())
    forwardBtn.on('click', () => router.forward())
    nav.add(backBtn, forwardBtn)

    const stateSection = Section('Router state')
    const stateOut = LogBox()
    const refreshBtn = Div('Refresh getPath()/getParams()/getQuery()'); refreshBtn.style(linkStyle)
    refreshBtn.on('click', () => {
        stateOut.clear()
        stateOut.log('getPath(): ' + router.getPath())
        stateOut.log('getParams(): ' + JSON.stringify(router.getParams()))
        stateOut.log('getQuery(): ' + JSON.stringify(router.getQuery()))
    })
    stateSection.add(refreshBtn, stateOut)

    page.on('enter', ({ query, isBack }: IRouteEvent) => {
        log.log(`enter - query=${JSON.stringify(query)} isBack=${isBack}`)
    })

    const output = Section('Enter log')
    output.add(log)

    page.append(title, params, query, wildcard, nav, stateSection, output)
    page.style({ overflowY: 'auto', background: theme.bg })

    return page
}

export default RouterDemoPage
