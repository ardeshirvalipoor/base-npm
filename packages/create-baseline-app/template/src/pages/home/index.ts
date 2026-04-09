import { Div, Button, Page, router } from '@codesuma/baseline'
import { Counter } from '../../components'
import styles from './index.module.css'

export const HomePage = () => {
    // Page Shell
    const page = Page()
    
    // Main Container
    const base = Div()
    base.addClass(styles.base)

    // Title
    const title = Div('Welcome to Baseline')
    title.addClass(styles.title)
    base.append(title)

    // Subtitle
    const subtitle = Div('A minimal, imperative UI framework')
    subtitle.addClass(styles.subtitle)
    base.append(subtitle)

    // Counter Component
    const counter = Counter()
    base.append(counter)

    // Navigation Link
    const aboutLink = Button('About →')
    aboutLink.addClass(styles.link)
    aboutLink.on('click', () => router.goto('/about'))
    base.append(aboutLink)

    page.append(base)
    return page
}
