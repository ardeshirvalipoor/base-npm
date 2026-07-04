import { Page, Div, Button, createEmitter, emitter } from "@codesuma/baseline"
import { PageHeader } from '../../components/page-header'
import { Section } from '../../components/section'
import { LogBox } from '../../components/log-box'
import { emitter as appEmitter } from '../../services/emitter'
import { theme } from '../../theme'

export const EventsPage = () => {
    const page = Page()
    const title = PageHeader('Events & Tree Ops')
    const log = LogBox()

    // --- once() / off() / removeAllListeners() on a standalone emitter ---
    const emitterSection = Section('createEmitter(): once / off / removeAllListeners')
    const local = createEmitter()
    let onceCount = 0
    let normalCount = 0
    local.once('ping', () => { onceCount++; log.log('once handler fired, total=' + onceCount) })
    const normalHandler = () => { normalCount++; log.log('normal handler fired, total=' + normalCount) }
    local.on('poke', normalHandler)

    const emitTwiceBtn = Button('emit "ping" x2 (once should fire once)')
    emitTwiceBtn.on('click', () => { local.emit('ping'); local.emit('ping') })
    const offBtn = Button('off("poke") then emit')
    offBtn.on('click', () => { local.off('poke', normalHandler); local.emit('poke'); log.log('emitted "poke" after off() - should not log a handler line') })
    const removeAllBtn = Button('removeAllListeners()')
    removeAllBtn.on('click', () => { local.removeAllListeners(); log.log('getListeners(): ' + JSON.stringify(local.getListeners())) })
    emitterSection.add(emitTwiceBtn, offBtn, removeAllBtn)

    // --- library-wide `emitter` singleton ---
    const globalSection = Section('global `emitter` singleton (framework-wide event bus)')
    emitter.on('demo:broadcast', (msg: any) => log.log('global emitter received: ' + msg))
    const broadcastBtn = Button('emitter.emit("demo:broadcast", ...)')
    broadcastBtn.on('click', () => emitter.emit('demo:broadcast', 'hello from Events page'))
    globalSection.add(broadcastBtn)

    // --- app's own typed emitter (services/emitter.ts) ---
    const appSection = Section("app's typed emitter (services/emitter.ts, AppEventMap)")
    let pingCount = 0
    appEmitter.on('demo:ping', ({ count }) => log.log('app emitter demo:ping received, count=' + count))
    const pingBtn = Button('appEmitter.emit("demo:ping", { count })')
    pingBtn.on('click', () => appEmitter.emit('demo:ping', { count: ++pingCount }))
    appSection.add(pingBtn)

    // --- tree ops ---
    const treeSection = Section('prepend / appendBefore / appendAfter / getChildren')
    const list = Div()
    list.style({ display: 'flex', gap: '6px' })
    const a = Div('A'); const b = Div('B'); const c = Div('C')
    ;[a, b, c].forEach(el => el.style({ border: `1px solid ${theme.border}`, padding: '4px 8px', borderRadius: theme.radiusSm }))
    list.append(a, b, c)

    const dumpOrder = () => log.log('order: ' + list.getChildren().map((el: any) => el.el.textContent).join(', '))
    const prependBtn = Button('prepend Z')
    prependBtn.on('click', () => { const z = Div('Z'); z.style({ border: `1px solid ${theme.border}`, padding: '4px 8px', borderRadius: theme.radiusSm }); list.prepend(z); dumpOrder() })
    const beforeBtn = Button('appendBefore(c, "X")')
    beforeBtn.on('click', () => { const x = Div('X'); x.style({ border: `1px solid ${theme.border}`, padding: '4px 8px', borderRadius: theme.radiusSm }); list.appendBefore(c, x); dumpOrder() })
    const afterBtn = Button('appendAfter(a, "Y")')
    afterBtn.on('click', () => { const y = Div('Y'); y.style({ border: `1px solid ${theme.border}`, padding: '4px 8px', borderRadius: theme.radiusSm }); list.appendAfter(a, y); dumpOrder() })
    const emptyBtn = Button('empty()')
    emptyBtn.on('click', () => { list.empty(); dumpOrder() })
    treeSection.add(list)
    treeSection.add(prependBtn, beforeBtn, afterBtn, emptyBtn)

    // --- conditional (falsy) and Promise-based append() ---
    const conditionalSection = Section('append(): conditional (falsy) + Promise-based children')
    const conditionalHost = Div()
    conditionalHost.style({ display: 'flex', gap: '6px', minHeight: '30px' })
    let flag = false
    const conditionalBtn = Button('append(flag && Div("shown"))')
    conditionalBtn.on('click', () => {
        flag = !flag
        conditionalHost.empty()
        conditionalHost.append(flag && Div('shown because flag is true'), !flag && null)
        log.log('flag=' + flag + ', appended ' + conditionalHost.getChildren().length + ' child(ren)')
    })
    const asyncHost = Div()
    const asyncBtn = Button('append(Promise) - resolves in 500ms')
    asyncBtn.on('click', () => {
        asyncHost.empty()
        log.log('appended a pending Promise child (nothing in DOM yet)')
        asyncHost.append(new Promise<any>(resolve => setTimeout(() => resolve(Div('resolved async child')), 500)))
        setTimeout(() => log.log('500ms later: ' + asyncHost.getChildren().length + ' child(ren) now present'), 600)
    })
    conditionalSection.add(conditionalHost, conditionalBtn, asyncHost, asyncBtn)

    // --- remove() vs destroy() ---
    const lifecycleSection = Section('remove() vs destroy()')
    const removed = Div('remove() target')
    const destroyed = Div('destroy() target')
    ;[removed, destroyed].forEach(el => el.style({ border: `1px solid ${theme.border}`, padding: '4px 8px', borderRadius: theme.radiusSm }))
    const host = Div()
    host.style({ display: 'flex', gap: '6px' })
    host.append(removed, destroyed)
    removed.on('anyEvent', () => {})
    destroyed.on('anyEvent', () => {})

    const lifecycleBtn = Button('remove() vs destroy(), then compare getListeners()')
    lifecycleBtn.on('click', () => {
        removed.remove()
        destroyed.destroy()
        log.log('after remove(): listeners still attached = ' + (Object.keys(removed.getListeners()).length > 0))
        log.log('after destroy(): listeners still attached = ' + (Object.keys(destroyed.getListeners()).length > 0))
    })
    lifecycleSection.add(host, lifecycleBtn)

    const output = Section('Output')
    output.add(log)

    page.append(title, emitterSection, globalSection, appSection, treeSection, conditionalSection, lifecycleSection, output)
    page.style({ overflowY: 'auto', background: theme.bg })

    return page
}

export default EventsPage
