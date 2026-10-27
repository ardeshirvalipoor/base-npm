import { Page, Input, Div, Button } from "@codesuma/baseline"
import { PageHeader } from '../../components/page-header'
import { Section } from '../../components/section'
import { LogBox } from '../../components/log-box'
import { theme } from '../../theme'

export const FormsPage = () => {
    const page = Page()
    const title = PageHeader('Forms')
    const log = LogBox()

    // Text-like inputs
    const textInputs = Section('Text-like inputs')
    const text = Input('Enter name...', 'text')
    const number = Input('Age', 'number', { min: 0, max: 100 })
    const dateInput = Input('Date', 'date')
    const color = Input('', 'color', { value: '#ff8800' })
    const textarea = Input('Notes', 'textarea')
    text.on('enter', ({ value }: any) => log.log('text enter: ' + value))
    number.on('change', ({ value }: any) => log.log('number change: ' + value))
    dateInput.on('change', ({ value }: any) => log.log('date change: ' + value))
    color.on('change', ({ value }: any) => log.log('color change: ' + value))
    textarea.on('input', ({ value }: any) => log.log('textarea input: ' + value))
    textInputs.add(text, number, dateInput, color, textarea)

    // Checkbox / radio + their dedicated methods
    const checkRadio = Section('Checkbox / radio')
    const checkbox = Input('Stay signed in', 'checkbox', { checked: true })
    const radioA = Input('Option A', 'radio', { name: 'demo-radio' })
    const radioB = Input('Option B', 'radio', { name: 'demo-radio' })
    checkbox.on('change', ({ value }: any) => log.log('checkbox change: ' + value))

    const toggleBtn = Button('toggle()')
    toggleBtn.on('click', () => { checkbox.toggle(); log.log('isChecked() -> ' + checkbox.isChecked()) })
    const clearBtn = Button('clear() text field')
    clearBtn.on('click', () => { text.clear(); log.log('text field cleared') })
    const focusBtn = Button('focus() text field')
    focusBtn.on('click', () => text.focus())
    const selectBtn = Button('select() text field')
    selectBtn.on('click', () => { text.setValue('select me'); text.select() })

    checkRadio.add(checkbox, radioA, radioB, toggleBtn, clearBtn, focusBtn, selectBtn)

    // toggleClass demo
    const toggleClassSection = Section('toggleClass()')
    const box = Div('Highlight box')
    box.style({ padding: '10px 14px', border: '1px solid #ccc', borderRadius: '6px' })
    let highlighted = false
    const highlightBtn = Button('Toggle highlight')
    highlightBtn.on('click', () => {
        highlighted = !highlighted
        box.toggleClass('demo-highlight', highlighted)
        box.style({ background: highlighted ? '#fff3b0' : 'transparent' })
        log.log('toggleClass demo-highlight -> ' + highlighted)
    })
    toggleClassSection.add(box, highlightBtn)

    const output = Section('Output')
    output.add(log)

    page.append(title, textInputs, checkRadio, toggleClassSection, output)
    page.style({ overflowY: 'auto', background: theme.bg })

    return page
}

export default FormsPage
