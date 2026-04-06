import { Div, Button, Page, router } from '@codesuma/baseline'
import styles from './index.module.css'

export const AboutPage = () => {
    const page = Page()

    const title = Div('About')
    title.addClass(styles.title)

    const description = Div(
        'This app was built with Baseline — a minimal, imperative UI framework. ' +
        'No virtual DOM, no magic, no dependencies.'
    )
    description.addClass(styles.description)

    const backBtn = Button('← Back Home')
    backBtn.addClass(styles.btn)
    backBtn.on('click', () => router.goto('/'))

    const content = Div()
    content.addClass(styles.content)
    content.append(title, description, backBtn)

    page.append(content)
    return page
}
