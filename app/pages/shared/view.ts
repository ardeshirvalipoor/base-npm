import { Base, Div } from "../../baseline/index";

export const View = () => {

    const base = Div() // Fragment later
    // console.log('is running in browser', isRunningInBrowser());

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

    setTimeout(() => {
        // base.style({ height: window.innerHeight + 'px' })
    }, 3000);
    // setTimeout(() => {
    //     base.style({ height: window.innerHeight + 'px' })
    // }, 3000);
    window.addEventListener('resize', () => {
        // base.style({ height: window.innerHeight + 'px' })
    })

    return base
}

