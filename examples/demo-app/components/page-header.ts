import { Div, router } from "@codesuma/baseline"
import { theme } from '../theme'

export const PageHeader = (title = '') => {
    const base = Div(title)
    base.style({
        zIndex: '2',
        minHeight: '60px',
        backgroundColor: theme.bg,
        color: theme.text,
        fontSize: '20px',
        fontWeight: '600',
        padding: '18px 0 14px',
        transition: 'all .24s',
    })


    return Object.assign(base, {
        toggleShadow(v: number) {
            base.style({ boxShadow: v > 10 ? theme.shadowSm : 'none' })
        },
    })
}