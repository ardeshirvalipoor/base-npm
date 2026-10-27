import { Page, Div, Button, router, IRouteEvent } from "@codesuma/baseline"
import { PageHeader } from '../../../components/page-header'
import { Section } from '../../../components/section'
import { theme } from '../../../theme'

let factoryCalls = 0

export const RouterItemPage = () => {
    factoryCalls++
    const page = Page()
    const title = PageHeader('Item detail')

    const info = Section('Params (from :id) and query')
    const idOut = Div()
    info.add(idOut)

    const cache = Section('Page cache / destroyPage()')
    const createdOut = Div(`This page instance was created by the factory ${factoryCalls} time(s) so far`)
    const destroyBtn = Button('destroyPage(this path), then back to Router Demo')
    destroyBtn.on('click', () => {
        const path = router.getPath()
        router.destroyPage(path)
        router.goto('/router-demo')
    })
    cache.add(createdOut, destroyBtn)
    cache.content.append(Div('Revisit this item from the Router Demo page - the factory count above should increase, proving the cached page was evicted.'))

    page.on('enter', ({ params, query }: IRouteEvent) => {
        idOut.text('id = ' + params.id + ', query = ' + JSON.stringify(query))
    })

    page.append(title, info, cache)
    page.style({ overflowY: 'auto', background: theme.bg })

    return page
}

export default RouterItemPage
