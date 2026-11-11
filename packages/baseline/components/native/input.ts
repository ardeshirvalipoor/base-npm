import { Base, IBaseComponent } from '../base'

export type InputType = 'text' | 'password' | 'email' | 'number' | 'search' | 'tel' | 'url' | 'checkbox' | 'radio' | 'date' | 'time' | 'datetime-local' | 'month' | 'week' | 'color' | 'file' | 'range' | 'hidden' | 'textarea'

export interface InputOptions {
    value?: string | number
    accept?: string
    checked?: boolean
    name?: string
    id?: string
    min?: string | number
    max?: string | number
    step?: string | number
    autocomplete?: string
    autofocus?: boolean
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    multiple?: boolean
    pattern?: string
}

export interface IInputComponent extends IBaseComponent<'input'> {
    value(): string
    setValue(v: string): void
    clear(): void
    select(): void
    focus(): void
    blur(): void
}

export interface ITextAreaComponent extends IBaseComponent<'textarea'> {
    value(): string
    setValue(v: string): void
    clear(): void
    select(): void
    focus(): void
    blur(): void
}

export interface ICheckboxComponent extends IBaseComponent<any> {
    isChecked(): boolean
    setChecked(v: boolean): void
    toggle(): void
    focus(): void
    blur(): void
}

export function Input(placeholder: string, type: 'checkbox' | 'radio', options?: InputOptions): ICheckboxComponent
export function Input(placeholder: string, type: 'textarea', options?: InputOptions): ITextAreaComponent
export function Input(placeholder?: string, type?: InputType, options?: InputOptions): IInputComponent
export function Input(placeholder = '', type: InputType = 'text', options: InputOptions = {}) {
    const isCheckOrRadio = type === 'checkbox' || type === 'radio'
    const hasLabel = isCheckOrRadio && placeholder.length > 0

    // If it's a checkbox/radio with a label, the main component is a Label wrapper
    // Otherwise, it's the Input element itself
    const base = hasLabel
        ? Base('label')
        : (type === 'textarea' ? Base('textarea') : Base('input'))

    // The actual input element to interact with
    let inputEl: HTMLInputElement | HTMLTextAreaElement

    if (hasLabel) {
        // Create internal input for the wrapper
        const inputComp = Base('input')
        inputEl = inputComp.el as HTMLInputElement

        // Setup wrapper styles
        base.style({ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' })

        // Assemble: Input + Text
        const text = Base('span')
        text.el.textContent = placeholder
        base.append(inputComp, text)
    } else {
        inputEl = base.el as HTMLInputElement | HTMLTextAreaElement
    }

    // --- Common Setup Logic (applied to inputEl) ---

    if (type !== 'textarea') {
        inputEl.setAttribute('type', type)
        // Fix for global appearance: none which hides checkboxes
        if (isCheckOrRadio) {
            inputEl.style.setProperty('-webkit-appearance', 'auto')
            inputEl.style.setProperty('appearance', 'auto')
        }
    }

    // For non-checkboxes, placeholder goes on input. For checkboxes, it's already used as label text.
    if (!isCheckOrRadio && placeholder) {
        inputEl.setAttribute('placeholder', placeholder)
    }

    // Attributes
    if (options.accept) inputEl.setAttribute('accept', options.accept)
    if (options.name) inputEl.setAttribute('name', options.name)
    // ID goes on the input element normally, but if wrapped, user might expect ID on wrapper?
    // Standard practice: ID on input, wrapper usually wraps it. 
    if (options.id) inputEl.setAttribute('id', options.id)

    if (options.min !== undefined) inputEl.setAttribute('min', String(options.min))
    if (options.max !== undefined) inputEl.setAttribute('max', String(options.max))
    if (options.step !== undefined) inputEl.setAttribute('step', String(options.step))
    // After min, max and step: a range fits its value to the limits it has then
    if (options.value !== undefined) inputEl.value = String(options.value)
    if (options.autocomplete) inputEl.setAttribute('autocomplete', options.autocomplete)
    if (options.pattern) inputEl.setAttribute('pattern', options.pattern)
    if (options.multiple) inputEl.setAttribute('multiple', '')

    // Boolean properties
    if (options.checked !== undefined && 'checked' in inputEl) (inputEl as HTMLInputElement).checked = options.checked
    if (options.disabled) inputEl.disabled = true
    if (options.readonly) inputEl.readOnly = true
    if (options.required) inputEl.required = true
    if (options.autofocus) setTimeout(() => inputEl.focus(), 0)

    // Events - Proxy to the base emitter. Bubbling events are forwarded from
    // base.el (for a label wrapper that's the label the inner input's events
    // bubble to); assigning the on<event> property there also stops
    // proxyDomEvents from adding a second native listener for the same event,
    // which would call `.on()` handlers twice — once with this payload and
    // once with the raw DOM event.
    const eventEl: HTMLElement = hasLabel ? base.el as HTMLElement : inputEl

    // focus/blur don't bubble, so they stay on the input itself
    inputEl.onblur = (e) => base.emit('blur', e)
    inputEl.onfocus = (e) => base.emit('focus', e)

    const emitValue = () => {
        const val = isCheckOrRadio && 'checked' in inputEl
            ? (inputEl as HTMLInputElement).checked
            : inputEl.value
        return val
    }

    eventEl.oninput = (e) => base.emit('input', { value: emitValue(), event: e })
    eventEl.onchange = (e) => base.emit('change', { value: emitValue(), event: e })

    eventEl.onkeydown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') base.emit('enter', { value: inputEl.value, event: e })
        if (e.key === 'Escape') base.emit('escape', e)
        base.emit('keydown', { key: e.key, value: inputEl.value, event: e })
    }

    return Object.assign(base, {
        focus() { inputEl.focus() },
        blur() { inputEl.blur() },
        select() { inputEl.select() },
        value() { return inputEl.value },
        setValue(v: string) { inputEl.value = v },
        clear() { inputEl.value = '' },
        // Checkbox/Radio specific
        isChecked() { return 'checked' in inputEl ? (inputEl as HTMLInputElement).checked : false },
        setChecked(v: boolean) { if ('checked' in inputEl) (inputEl as HTMLInputElement).checked = v },
        toggle() {
            if ('checked' in inputEl) {
                (inputEl as HTMLInputElement).checked = !(inputEl as HTMLInputElement).checked
                base.emit('change', { value: (inputEl as HTMLInputElement).checked })
            }
        }
    }) as any
}
