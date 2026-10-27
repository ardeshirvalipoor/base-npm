import { Page, Button, A, Img, Select, Canvas, H1, H2, H3, H4, H5, H6, Div } from "@codesuma/baseline"
import { PageHeader } from '../../components/page-header'
import { Section } from '../../components/section'
import { LogBox } from '../../components/log-box'
import { theme } from '../../theme'

export const ComponentsPage = () => {
    const page = Page()
    const title = PageHeader('Components')
    const log = LogBox()

    // Headings
    const headings = Section('Headings (H1-H6)')
    const headingStack = Div()
    headingStack.style({ display: 'flex', flexDirection: 'column', gap: '2px' })
    headingStack.append(H1('Heading 1'), H2('Heading 2'), H3('Heading 3'), H4('Heading 4'), H5('Heading 5'), H6('Heading 6'))
    headings.add(headingStack)

    // Button
    const buttons = Section('Button')
    const btn = Button('Click me')
    btn.on('click', () => log.log('Button clicked'))
    const disableBtn = Button('Disable click me')
    disableBtn.on('click', () => {
        btn.disable()
        setTimeout(() => btn.enable(), 1000)
        log.log('Disabled "Click me" for 1s')
    })
    buttons.add(btn, disableBtn)

    // A
    const links = Section('A (anchor)')
    const link = A('#', 'A link (prevented)', '_self')
    link.on('click', (e: MouseEvent) => { e.preventDefault(); log.log('Anchor clicked, href=' + link.el.href) })
    const download = A('data:text/plain,hello%20baseline', 'Download link')
    download.download('hello.txt')
    links.add(link, download)

    // Img
    const images = Section('Img')
    const img = Img('', { width: 60, height: 60, alt: 'placeholder' })
    const swapBtn = Button('Swap src')
    swapBtn.on('click', () => {
        img.src('https://picsum.photos/60')
        log.log('Img src swapped')
    })
    images.add(img, swapBtn)

    // Select
    const selects = Section('Select')
    const select = Select([
        { value: 'a', text: 'Option A' },
        { value: 'b', text: 'Option B' },
    ])
    select.on('change', (value: string) => log.log('Select changed: ' + value))
    const addOptionBtn = Button('Add option C')
    addOptionBtn.on('click', () => { select.add('c', 'Option C'); log.log('Added Option C') })
    const setValueBtn = Button('Set value to b')
    setValueBtn.on('click', () => { select.setValue('b'); log.log('Select value: ' + select.value()) })
    selects.add(select, addOptionBtn, setValueBtn)

    // Canvas
    const canvases = Section('Canvas')
    const canvas = Canvas(120, 60)
    canvas.style({ border: '1px solid #ccc' })
    canvas.ctx.fillStyle = '#0d9aad'
    canvas.ctx.fillRect(10, 10, 40, 40)
    const resizeBtn = Button('Resize + redraw')
    resizeBtn.on('click', () => {
        canvas.resize(160, 80)
        canvas.ctx.fillStyle = '#ff9cb7'
        canvas.ctx.fillRect(20, 20, 60, 30)
        log.log('Canvas resized to 160x80')
    })
    canvases.add(canvas, resizeBtn)

    const output = Section('Output')
    output.add(log)

    page.append(title, headings, buttons, links, images, selects, canvases, output)
    page.style({ overflowY: 'auto', background: theme.bg })

    return page
}

export default ComponentsPage
