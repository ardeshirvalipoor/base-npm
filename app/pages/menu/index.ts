import { Page } from "@codesuma/baseline"
import { PageHeader } from '../../components/page-header'
import { MenuItem } from './shared/item'

export const MenuPage = () => {
    const page = Page()
    const title = PageHeader('Menu')
    const about = MenuItem('About', '/about')
    const login = MenuItem('Login', '/login')

    page.append(title, about, login)

    page.on('exit', () => {
        console.log('exit')
        setTimeout(() => {
            console.log('removed');

            page.remove()
        }, 1000);
    })
    return page
}