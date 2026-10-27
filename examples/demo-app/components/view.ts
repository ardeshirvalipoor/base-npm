import { Div } from "@codesuma/baseline";

export const View = () => {
    const base = Div()

    base.style({
        position: 'relative',
        right: '0',
        left: '0',
        top: '0',
        bottom: '0',
        height: window.innerHeight + 'px',
        overflow: 'hidden',
        width: '100vw',
    })

    return base
}

