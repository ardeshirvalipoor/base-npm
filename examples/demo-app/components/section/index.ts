import { Div, H2 } from "@codesuma/baseline"
import { theme } from '../../theme'

// Small layout helper used across the showcase pages: a titled group of demo controls.
export const Section = (title: string) => {
    const base = Div()
    const heading = H2(title)
    const content = Div()

    heading.style({ fontSize: '13px', margin: '0 0 12px', color: theme.brand, fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' })
    content.style({ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' })

    base.append(heading, content)
    base.style({
        marginBottom: '16px',
        padding: '16px 18px',
        background: theme.surface,
        borderRadius: theme.radiusMd,
        boxShadow: theme.shadowSm,
    })

    return Object.assign(base, {
        content,
        add(...children: any[]) {
            content.append(...children)
            return base
        }
    })
}

export default Section
