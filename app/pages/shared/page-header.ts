import { Base, Div } from '@codesuma/baseline'

export const PageHeader = (title = '') => {
    const base = Div(title)
    base.style({
        zIndex: '2',
        height: '60px',
        backgroundColor: '#fff',//COLORS.MAIN,
        // boxShadow: '0 0 6px #00000020',
        fontSize: '22px',
        fontWeight: 'bold',
        padding: '18px 60px 17px 0px',
        transition: 'all .24s',
    })


    return Object.assign(base, {
        toggleShadow(v: number) {
            base.style({ boxShadow: v > 10 ? '#00000012 0px 5px 8px' : '#00000000 0px 5px 8px' })
        },
    })
}