import { Div, Button, Page, router } from '@codesuma/baseline'
import styles from './index.module.css'

export const AboutPage = () => {
    // Page Shell
    const page = Page()

    // Main Container
    const base = Div()
    base.addClass(styles.base)

    // Title
    const title = Div('About')
    title.addClass(styles.title)
    base.append(title)

    // Description
    const description = Div(
        'This app was built with Baseline — a minimal, imperative UI framework. ' +
        'No virtual DOM, no magic, no dependencies.'
    )
    description.addClass(styles.description)
    base.append(description)

    // Back Button
    const backBtn = Button('← Back Home')
    backBtn.addClass(styles.btn)
    backBtn.on('click', () => router.goto('/'))
    base.append(backBtn)

    page.append(base)
    return page
}
