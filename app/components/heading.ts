import { Div } from "@codesuma/baseline"

export const Heading = (text: string, color = 'gray') => {
    const base = Div(text)
    base.style({
        textAlign: 'right',
        fontSize: '16px',
        margin: '20px 0 30px 0',
        fontWeight: 'bold',
        color
    })
    return base
}