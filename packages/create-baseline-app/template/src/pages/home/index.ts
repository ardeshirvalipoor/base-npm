import { Div, Button, Page, router } from '@codesuma/baseline'
import styles from './index.module.css'

export const HomePage = () => {
    const page = Page()
    const count = { value: 0 }

    const title = Div('Welcome to Baseline')
    title.addClass(styles.title)

    const subtitle = Div('A minimal, imperative UI framework')
    subtitle.addClass(styles.subtitle)

    const counter = Div('0')
    counter.addClass(styles.counter)

    const btn = Button('Count')
    btn.addClass(styles.btn)
    btn.on('click', () => {
        count.value++
        counter.text(String(count.value))
    })

    const aboutLink = Button('About →')
    aboutLink.addClass(styles.link)
    aboutLink.on('click', () => router.goto('/about'))

    const content = Div()
    content.addClass(styles.content)
    content.append(title, subtitle, counter, btn, aboutLink)

    page.append(content)
    return page
}
