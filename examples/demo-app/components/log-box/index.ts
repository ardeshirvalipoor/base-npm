import { Div } from "@codesuma/baseline"
import { theme } from '../../theme'

// Small readout box used across the showcase pages to display output/results.
export const LogBox = () => {
    const base = Div()
    base.style({
        fontFamily: 'monospace',
        fontSize: '12px',
        color: theme.text,
        background: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: theme.radiusSm,
        padding: '10px',
        maxHeight: '160px',
        overflowY: 'auto',
        whiteSpace: 'pre-wrap',
        width: '100%',
        boxSizing: 'border-box',
    })

    return Object.assign(base, {
        log(msg: string) {
            base.el.textContent = base.el.textContent ? base.el.textContent + '\n' + msg : msg
            base.el.scrollTop = base.el.scrollHeight
        },
        clear() {
            base.text('')
        }
    })
}

export default LogBox
