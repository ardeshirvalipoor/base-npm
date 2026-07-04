import { Page, Button, Input, Div, http, idb, state } from "@codesuma/baseline"
import { PageHeader } from '../../components/page-header'
import { Section } from '../../components/section'
import { LogBox } from '../../components/log-box'
import { Loading } from '../../components/loading'
import { theme } from '../../theme'

const TEST_URL = 'https://jsonplaceholder.typicode.com/todos/1'
const TEST_POST_URL = 'https://jsonplaceholder.typicode.com/posts'

export const DataPage = () => {
    const page = Page()
    const title = PageHeader('Data')
    const log = LogBox()
    const spinner = Loading('#0d9aad', 40)
    spinner.style({ display: 'none' })
    const withSpinner = async (fn: () => Promise<void>) => {
        spinner.style({ display: 'block' })
        try { await fn() } finally { spinner.style({ display: 'none' }) }
    }

    // --- http ---
    const httpSection = Section('http')
    const getBtn = Button('GET')
    getBtn.on('click', () => withSpinner(async () => {
        const { status, data } = await http.get(TEST_URL)
        log.log(`GET ${status}: ${JSON.stringify(data)}`)
    }))
    const postBtn = Button('POST')
    postBtn.on('click', async () => {
        const { status, data } = await http.post(TEST_POST_URL, { title: 'from baseline demo' })
        log.log(`POST ${status}: ${JSON.stringify(data)}`)
    })
    const putBtn = Button('PUT')
    putBtn.on('click', async () => {
        const { status, data } = await http.put(`${TEST_POST_URL}/1`, { title: 'updated' })
        log.log(`PUT ${status}: ${JSON.stringify(data)}`)
    })
    const patchBtn = Button('PATCH')
    patchBtn.on('click', async () => {
        const { status, data } = await http.patch(`${TEST_POST_URL}/1`, { title: 'patched' })
        log.log(`PATCH ${status}: ${JSON.stringify(data)}`)
    })
    const deleteBtn = Button('DELETE')
    deleteBtn.on('click', async () => {
        const { status } = await http.delete(`${TEST_POST_URL}/1`)
        log.log(`DELETE ${status}`)
    })
    const dedupeBtn = Button('Dedup check (same URL x2)')
    dedupeBtn.on('click', () => {
        const p1 = http.get(TEST_URL)
        const p2 = http.get(TEST_URL)
        log.log('two concurrent GETs to same URL share one promise: ' + (p1 === p2))
    })
    const uploadInput = Input('', 'file')
    const uploadBtn = Button('Upload selected file')
    uploadBtn.on('click', async () => {
        const file = (uploadInput.el as HTMLInputElement).files?.[0]
        if (!file) { log.log('upload: pick a file first'); return }
        const { status } = await http.upload(TEST_POST_URL, file, {
            onProgress: (loaded, total) => log.log(`upload progress: ${loaded}/${total}`)
        })
        log.log('upload done, status ' + status)
    })
    httpSection.add(getBtn, postBtn, putBtn, patchBtn, deleteBtn, dedupeBtn, uploadInput, uploadBtn)

    // --- idb ---
    const idbSection = Section('idb')
    const db = idb('baseline-demo')
    let idbReady = db.createStore('todos', 1, { keyPath: 'id', autoIncrement: true, indices: ['priority'] })

    const seedBtn = Button('Seed 3 todos')
    seedBtn.on('click', async () => {
        await idbReady
        await db.save('todos', [
            { text: 'Low priority', priority: 1 },
            { text: 'Medium priority', priority: 5 },
            { text: 'High priority', priority: 9 },
        ])
        log.log('seeded 3 todos')
    })
    const allBtn = Button('all()')
    allBtn.on('click', async () => {
        await idbReady
        const rows = await db.all('todos')
        log.log('all(): ' + JSON.stringify(rows))
    })
    const rangeBtn = Button("find priority > 3")
    rangeBtn.on('click', async () => {
        await idbReady
        const rows = await db.find('todos', { index: 'priority', gt: 3 })
        log.log('find gt 3: ' + JSON.stringify(rows))
    })
    const betweenBtn = Button('find priority between 2-8')
    betweenBtn.on('click', async () => {
        await idbReady
        const rows = await db.find('todos', { index: 'priority', between: [2, 8] })
        log.log('find between 2-8: ' + JSON.stringify(rows))
    })
    const countBtn = Button('count()')
    countBtn.on('click', async () => {
        await idbReady
        log.log('count(): ' + await db.count('todos'))
    })
    const clearBtn = Button('clear()')
    clearBtn.on('click', async () => {
        await idbReady
        await db.clear('todos')
        log.log('cleared todos store')
    })
    idbSection.add(seedBtn, allBtn, rangeBtn, betweenBtn, countBtn, clearBtn)

    // --- state ---
    const stateSection = Section('state (shared across pages)')
    const counterOut = Div('visits: ' + (state.get<number>('demo-visits') ?? 0))
    const incBtn = Button('state.set(demo-visits, +1)')
    incBtn.on('click', () => {
        state.set('demo-visits', (state.get<number>('demo-visits') ?? 0) + 1)
    })
    state.on('demo-visits', (v: number) => counterOut.text('visits: ' + v))
    stateSection.add(counterOut, incBtn)

    const output = Section('Output')
    output.add(log)

    page.append(title, spinner, httpSection, idbSection, stateSection, output)
    page.style({ overflowY: 'auto', background: theme.bg })

    return page
}

export default DataPage
