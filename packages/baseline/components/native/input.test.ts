import { describe, it, expect, vi, afterEach } from 'vitest'
import { Input } from './input'

afterEach(() => {
    document.body.innerHTML = ''
})

describe('Input range', () => {
    it('keeps a starting value that max and step allow', () => {
        // The browser fits a range value to the limits it has at that moment,
        // so the value has to be set after them.
        const range = Input('', 'range', { value: 150, min: 0, max: 200 })

        expect(range.value()).toBe('150')
    })
})

describe('Input checkbox/radio change events', () => {
    it('label-wrapped checkbox fires .on("change") exactly once per click, with the payload', () => {
        const checkbox = Input('Enable thing', 'checkbox')
        document.body.appendChild(checkbox.el)

        const handler = vi.fn()
        checkbox.on('change', handler)

        const inputEl = checkbox.el.querySelector('input')!
        inputEl.click()

        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler).toHaveBeenCalledWith(expect.objectContaining({ value: true }))
    })

    it('label-wrapped radio fires .on("change") exactly once per click, with the payload', () => {
        const radio = Input('Option A', 'radio', { name: 'group' })
        document.body.appendChild(radio.el)

        const handler = vi.fn()
        radio.on('change', handler)

        radio.el.querySelector('input')!.click()

        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler).toHaveBeenCalledWith(expect.objectContaining({ value: true }))
    })

    it('bare checkbox (no label) still fires .on("change") once with the payload', () => {
        const checkbox = Input('', 'checkbox')
        document.body.appendChild(checkbox.el)

        const handler = vi.fn()
        checkbox.on('change', handler)

        ;(checkbox.el as HTMLInputElement).click()

        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler).toHaveBeenCalledWith(expect.objectContaining({ value: true }))
    })

    it('label-wrapped input fires .on("input") exactly once per input event', () => {
        const checkbox = Input('Enable thing', 'checkbox')
        document.body.appendChild(checkbox.el)

        const handler = vi.fn()
        checkbox.on('input', handler)

        const inputEl = checkbox.el.querySelector('input')!
        inputEl.dispatchEvent(new Event('input', { bubbles: true }))

        expect(handler).toHaveBeenCalledTimes(1)
    })

    it('toggle() flips checked and emits change with a { value } payload', () => {
        const checkbox = Input('Enable thing', 'checkbox')

        const handler = vi.fn()
        checkbox.on('change', handler)

        checkbox.toggle()

        expect(checkbox.isChecked()).toBe(true)
        expect(handler).toHaveBeenCalledTimes(1)
        expect(handler).toHaveBeenCalledWith(expect.objectContaining({ value: true }))
    })
})
