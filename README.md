# Baseline

Baseline is an imperative UI framework for web apps. You tell the page what to change, and when.

Writing a Baseline app feels like writing vanilla JavaScript, but organized. Components, events, styles, pages and data each have one clear pattern. There is no special syntax and little to set up. The app stays easy to follow as it grows.

Some parts look more verbose than in React or Vue, because you create each element and update it yourself. In return:

- **Performance is the baseline.** Your code changes the DOM directly. The DOM is the browser's tree of page elements. There is no virtual DOM to compare and no reactive state to track. An update changes the element you name, and nothing else.
- **You can learn it in a day** if you know JavaScript. There is no JSX, no template language and no compiler of its own. The whole API fits in the [reference](#api-reference) at the end of this page.
- **You can follow every change.** Each change on screen comes from a line of your own code.

It is also small:

- No runtime dependencies.
- Under 1,600 lines of TypeScript, with types included.
- About 6 KB of JavaScript for the whole library, minified and gzipped. A small counter app comes to about 1.6 KB, because the bundler leaves out the parts it does not use.

## Use what you need

Baseline is a base, not a cage. Each part stands on its own. Use the parts you like and replace the rest:

- Use plain `fetch` or your own HTTP client instead of `http`.
- Use your own storage code instead of `ldb` or `idb`.
- Keep shared data in your own store instead of `state`.
- Use another router, or none.
- Use any library that works with DOM elements. Every component's real element is at `.el`, so you can hand it to a chart or map library.

With the starter's build settings, a part you do not import stays out of your bundle.

## Get started

### Start a new app

```bash
npx @codesuma/create-baseline-app my-app
cd my-app
npm run dev
```

The first command creates an app with TypeScript, CSS Modules, a router and two pages. `npm run dev` rebuilds the app on every change and serves it at http://localhost:3000.

New apps also include `AGENTS.md` and `AI_GUIDE.md`. They teach coding agents the same patterns that this page teaches you.

### Add Baseline to an existing project

```bash
npm install @codesuma/baseline
```

Baseline ships its TypeScript source, not compiled JavaScript. Your build must do two things:

1. Compile the `.ts` files in `node_modules/@codesuma/baseline` together with your own code.
2. Support CSS Modules, because `Page` imports a `.module.css` file.

The starter app does both with Rollup and its official TypeScript plugin. This is the tested setup. To copy it, take `rollup.config.js`, `tsconfig.json` and `src/css-modules.d.ts` from a new app.

## Your first component

```ts
import { Div, Button } from '@codesuma/baseline'

const Counter = () => {
    const base = Div()
    const display = Div('0')
    const plus = Button('Add one')
    let count = 0

    plus.on('click', () => {
        count++
        display.text(String(count))
    })

    base.append(display, plus)
    return base
}

document.body.appendChild(Counter().el)
```

- `Div()` and `Button()` create real elements. Each comes in a small wrapper with methods such as `on`, `text`, `append` and `addClass`.
- `count` is a plain variable. Changing it does nothing on screen by itself.
- `display.text(...)` changes the one element that shows the count. That line is the whole update.
- `.el` is the real DOM element. Here it puts the app into the page.

## How Baseline does the jobs of a framework

These are the jobs people usually pick a framework for. Each row links to how the job works in Baseline.

| Job | In Baseline |
|---|---|
| [Reactivity](#1-reactivity) | A component emits an event. A handler updates the page. |
| [Components](#2-components) | Plain functions that return elements. No JSX. |
| [Styling](#3-styling) | CSS Modules, and `style()` for values set while the app runs. |
| [Lists and conditions](#4-lists-and-conditional-content) | JavaScript's own `for` and `if`. |
| [Shared state](#5-shared-state) | Services that hold data and announce changes. |
| [Forms](#6-forms) | `Input` and `Select`, with events that carry the value. |
| [Routing](#7-routing-and-pages) | `router` and `Page`. |
| [Lifecycle](#8-lifecycle) | The `mounted`, `unmounted`, `enter` and `exit` events. |
| [Fetching data](#9-fetching-data) | `http`. |
| [Storing data](#10-storing-data-in-the-browser) | `ldb` for localStorage and `idb` for IndexedDB. |
| [Animation](#11-animation) | CSS transitions, started by a class or a style. |

### 1. Reactivity

React and Vue keep your data in reactive state. When the state changes, the framework works out what to redraw. React does this with a virtual DOM. A virtual DOM is a copy of the page kept in memory. React compares the new copy with the old one and applies the difference. Vue tracks which data each part of the page reads.

Baseline has no state system and no virtual DOM. Components talk through events:

1. A component emits an event when something happens.
2. Another component listens to it with `on()`.
3. The handler updates the elements that need to change.

The simplest place to emit is `emitter`. It is one emitter that the whole app shares. This button emits on it. It does not know who listens:

```ts
// components/save-button/index.ts
import { Button, emitter } from '@codesuma/baseline'

export const SaveButton = () => {
    const base = Button('Save')
    base.on('click', () => emitter.emit('toast', 'Saved'))
    return base
}
```

This toast listens with `emitter.on()` and shows the message:

```ts
// components/toast/index.ts
import { Div, emitter } from '@codesuma/baseline'
import styles from './index.module.css'

export const Toast = () => {
    const base = Div()
    base.addClass(styles.base)

    emitter.on('toast', (message: string) => {
        base.text(message)
        base.addClass(styles.visible)
    })

    return base
}
```

The two components never import each other. They can sit anywhere in the app. When the user taps Save, only the toast changes. Nothing else is touched, and nothing is redrawn.

Nothing in Baseline redraws on its own, so nothing redraws that you did not ask for. That is where the speed comes from. The cost is that you write each update yourself.

`emitter` is not the only emitter you can use:

- `createEmitter()` makes a new one. Use it as a separate event bus, for example one for each feature.
- Composition adds an emitter to any object. `Object.assign` copies the emitter's methods onto the object. Baseline builds every component by composition, so every component already has its own `emit()` and `on()`.

```ts
import { createEmitter } from '@codesuma/baseline'

const chatEvents = createEmitter()                             // A separate event bus
const player = Object.assign({ volume: 1 }, createEmitter())   // An emitter composed into an object
```

Because every component has its own emitter, a component can emit on itself. Its parent then listens to it directly, with no shared bus. This card emits `add` on itself:

```ts
// components/product-card/index.ts
import { Div, H3, Button } from '@codesuma/baseline'
import styles from './index.module.css'

export const ProductCard = (name: string) => {
    const base = Div()
    base.addClass(styles.base)

    const title = H3(name)
    const add = Button('Add to cart')
    add.on('click', () => base.emit('add', name))

    base.append(title, add)
    return base
}
```

The page listens to each card with `on()` and updates the badge:

```ts
// pages/shop/index.ts
import { Page, Span } from '@codesuma/baseline'
import { ProductCard } from '../../components/product-card'

export const ShopPage = () => {
    const page = Page()
    const badge = Span('0')
    const cart: string[] = []

    const coffee = ProductCard('Coffee')
    const tea = ProductCard('Tea')

    const add = (name: string) => {
        cart.push(name)
        badge.text(String(cart.length))
    }
    coffee.on('add', add)
    tea.on('add', add)

    page.append(badge, coffee, tea)
    return page
}
```

Only the badge's text changes. The cards are not touched.

Each part stays simple. The card owns its elements and says what happened. The page decides what it means.

Which emitter to use depends on who listens:

| Who listens | Emit on |
|---|---|
| The component's parent | The component itself, with `base.emit()` |
| Anything, anywhere in the app | `emitter`, or a bus made with `createEmitter()` |

> **Tip:** Give custom events names that the browser does not use, such as `add`, `save` or `pick`. `on()` also listens to native DOM events. So a custom event named `change` on a `Div` would also catch every native `change` event that bubbles up from an input inside it.

To share data across pages, see [Shared state](#5-shared-state).

### 2. Components

Baseline does not use JSX or templates. JSX is the HTML-like syntax that React puts inside JavaScript. In Baseline, a component is a plain function. It creates its elements, connects their events and returns its root element.

```ts
// components/user-card/index.ts
import { Div, Img, H3, P } from '@codesuma/baseline'
import styles from './index.module.css'

export const UserCard = (user: User) => {
    const base = Div()
    base.addClass(styles.base)

    const photo = Img(user.photo, { alt: user.name })
    photo.addClass(styles.photo)

    const name = H3(user.name)
    const role = P(user.role)

    base.append(photo, name, role)
    return base
}
```

You use a component like any element: `page.append(UserCard(ada))`.

The conventions:

- Each component has its own folder with `index.ts` and `index.module.css`.
- The root element is named `base` and gets the `.base` class. CSS Modules keep class names unique per file, so every component can use `.base`.
- The name is in PascalCase, like the built-in factories `Div` and `Button`.

**Add methods** when a parent needs to control a component. `Object.assign` attaches them to the root:

```ts
export const UserCard = (user: User) => {
    const base = Div()
    const name = H3(user.name)
    base.append(name)

    const setUser = (next: User) => name.text(next.name)

    return Object.assign(base, { setUser })
}

const card = UserCard(ada)
card.setUser(grace)
```

**Any tag** works with `Base(tag)`. It has the same methods as `Div()`:

```ts
const figure = Base('figure')
```

**The real element** is always at `.el`. Use it for browser features that Baseline does not wrap, such as measuring or scrolling:

```ts
const box = card.el.getBoundingClientRect()
card.el.scrollIntoView({ behavior: 'smooth' })
```

### 3. Styling

There are two tools:

| Tool | Use it for |
|---|---|
| CSS Modules | How things look: layout, colors and states. |
| `style()` | Values your code computes while the app runs, such as a width or a position. |

**CSS Modules.** A CSS Module is a CSS file whose class names belong to the file that imports it. The bundler renames each class, so two components can both use `.base` without a clash.

```css
/* components/card/index.module.css */
.base {
    padding: 16px;
    border-radius: 12px;
    background: #fff;
}

.selected {
    outline: 2px solid #6c5ce7;
}
```

```ts
// components/card/index.ts
import { Div } from '@codesuma/baseline'
import styles from './index.module.css'

export const Card = () => {
    const base = Div()
    base.addClass(styles.base)

    const setSelected = (selected: boolean) => base.toggleClass(styles.selected, selected)

    return Object.assign(base, { setSelected })
}
```

To show a state, add or remove a class with `addClass`, `removeClass` or `toggleClass`. The CSS file decides how the state looks.

**Inline styles.** `style()` takes CSS properties in camelCase. These are the same names that `element.style` uses.

```ts
bar.style({ width: `${percent}%` })
tooltip.style({ top: `${y}px`, left: `${x}px` })
```

`style()` also sets CSS custom properties. Give them the name they have in CSS: `card.style({ '--accent': color })`.

**Reuse a look** by wrapping a factory. Every primary button in the app then comes from one place:

```ts
// components/buttons/index.ts
import { Button } from '@codesuma/baseline'
import styles from './index.module.css'

export const PrimaryButton = (text: string) => {
    const base = Button(text)
    base.addClass(styles.base, styles.primary)
    return base
}
```

### 4. Lists and conditional content

There is no template syntax for loops or conditions. You use JavaScript.

**Lists.** Build the rows in a loop. To show new data, empty the list and build it again:

```ts
const list = Div()

const render = (todos: Todo[]) => {
    list.empty()
    for (const todo of todos) {
        const row = TodoRow(todo)
        row.on('remove', () => removeTodo(todo.id))
        list.append(row)
    }
}
```

`empty()` removes every child component. This is the simplest way, and it is fine for most lists.

For a long list that changes often, keep each row and update only the one that changed:

```ts
const rows = new Map<string, ReturnType<typeof TodoRow>>()

for (const todo of todos) {
    const row = TodoRow(todo)
    rows.set(todo.id, row)
    list.append(row)
}

// Later, when one todo changes
rows.get(changed.id)?.setDone(changed.done)
```

Here `TodoRow` is a component with a `setDone` method. It adds the method with `Object.assign`, as shown in [Components](#2-components).

**Conditions.** `append()` skips `false`, `null` and `undefined`. So a condition can sit inside the call:

```ts
page.append(header, !user && SignUpBanner(), list)
```

To show or hide an element that already exists, toggle a class:

```ts
error.toggleClass(styles.hidden, !message)
```

**Order.** To insert at a position, use `prepend(child)`, `appendBefore(ref, child)` or `appendAfter(ref, child)`.

> **Text from users:** `Div(content)` sets HTML. For text that comes from users or from a server, use `P`, `Span` or `H1` to `H6`, or call `.text()`. These set plain text.

### 5. Shared state

Data that several components need lives in a service. A service is a plain module. It holds the data, offers functions that change it, and announces each change. Components listen and update themselves.

`state` is the quickest way to announce a change. `state.set(key, value)` stores the value and emits an event named after the key:

```ts
// services/cart.ts
import { state } from '@codesuma/baseline'

let items: string[] = []

export default {
    all: () => items,
    add(name: string) {
        items = [...items, name]
        state.set('cart', items)
    },
}
```

```ts
// components/cart-badge/index.ts
import { Span, state } from '@codesuma/baseline'
import cart from '../../services/cart'

export const CartBadge = () => {
    const base = Span()
    const render = () => base.text(String(cart.all().length))

    state.on('cart', render)
    render()

    return base
}
```

Any page can call `cart.add('Tea')`. Every badge updates, wherever it is.

For typed events, give the service its own emitter with `createEmitter`. TypeScript then checks the event names and payloads:

```ts
// services/cart.ts
import { createEmitter } from '@codesuma/baseline'

const events = createEmitter<{ change: string[] }>()
let items: string[] = []

export default {
    on: events.on.bind(events),
    all: () => items,
    add(name: string) {
        items = [...items, name]
        events.emit('change', items)
    },
}
```

```ts
// In a component
cart.on('change', items => badge.text(String(items.length)))
```

A handler on `state` or on a service stays for as long as the app runs. For components that come and go, see [Lifecycle](#8-lifecycle).

### 6. Forms

`Input` creates every kind of form field. The second argument is the type, such as `'text'`, `'email'`, `'number'`, `'date'`, `'checkbox'`, `'radio'`, `'file'` or `'textarea'`. Its events carry the value, so you rarely read the element yourself.

```ts
// components/signup-form/index.ts
import { Div, Input, Button } from '@codesuma/baseline'
import styles from './index.module.css'

export const SignupForm = () => {
    const base = Div()
    base.addClass(styles.base)

    const email = Input('Email', 'email', { required: true })
    const terms = Input('I accept the terms', 'checkbox')
    const send = Button('Sign up')
    send.disable()

    const submit = () => {
        if (terms.isChecked()) base.emit('signup', { email: email.value() })
    }

    terms.on('change', ({ value }) => (value ? send.enable() : send.disable()))
    email.on('enter', submit)
    send.on('click', submit)

    base.append(email, terms, send)
    return base
}
```

For a checkbox or a radio, the first argument is its label. Its `value` is `true` or `false`.

There is no two-way binding. Read a value when you need it with `value()`. Listen to `input` to react while the user types.

| Event | When it fires | Payload |
|---|---|---|
| `input` | On every change while the user types | `{ value, event }` |
| `change` | When the user commits a value | `{ value, event }` |
| `enter` | When the user presses Enter | `{ value, event }` |
| `escape` | When the user presses Escape | The keyboard event |
| `keydown` | On every key | `{ key, value, event }` |
| `focus`, `blur` | When the field gains or loses focus | The focus event |

`Select` takes a list of options. It emits `change` with the chosen value:

```ts
const size = Select([
    { value: 's', text: 'Small' },
    { value: 'm', text: 'Medium' },
])
size.on('change', (value: string) => console.log(value))
```

### 7. Routing and pages

The router maps paths to page functions. It builds each page the first time someone opens it. After that the page stays in the DOM, hidden, and the router shows it again on the next visit. So scroll positions and form fields survive.

```ts
// app.ts
import { Div, router } from '@codesuma/baseline'
import { HomePage } from './pages/home'
import { UserPage } from './pages/user'
import { NotFoundPage } from './pages/not-found'

const view = Div()

router.routes({
    '/': HomePage,
    '/users/:id': UserPage,
    '*': NotFoundPage,
}, view)

document.body.appendChild(view.el)
```

`:id` marks a parameter. `*` catches every path that no other route matches.

Build each page with `Page()`. The router only emits `enter` and `exit` on pages. `Page()` answers them. It hides the old page and slides the new one in. Pages move up when the user goes forward and down when the user goes back.

```ts
// pages/user/index.ts
import { Page, H1, http, IRouteEvent } from '@codesuma/baseline'

export const UserPage = () => {
    const page = Page()
    const name = H1()
    page.append(name)

    page.on('enter', async ({ params }: IRouteEvent) => {
        const { data } = await http.get(`/api/users/${params.id}`)
        name.text(data.name)
    })

    return page
}
```

Navigate with `router.goto()`. The router does not catch clicks on `<a>` links, so call it from a click handler:

```ts
const profile = Button('Open profile')
profile.on('click', () => router.goto('/users/42'))

router.goto('/search?q=tea')
router.goto('/users/42', { from: 'list' })   // The second argument arrives as `data`
router.back()
```

The `enter` event carries these fields:

| Field | Value |
|---|---|
| `params` | Values from the path, decoded, such as `{ id: '42' }` for `/users/:id` |
| `query` | Values from the query string, such as `{ q: 'tea' }` |
| `from` | The path the user came from |
| `to` | The path being opened |
| `data` | The second argument of `goto()` |
| `isBack` | `true` when the user went back |

Good to know:

- `exit` handlers can be async. The router waits for them before it shows the next page.
- Each path gets its own page. `/users/1` and `/users/2` are two pages, and both stay in the DOM. Call `router.destroyPage(path)` to drop one. The next visit builds it again.
- `goto()` to the current path does nothing, even when the query string differs.
- The values in `params` are decoded. Encode a value again when you build a path from it: `router.goto('/tags/' + encodeURIComponent(tag))`.
- The browser keeps `data` with the history entry, so the page gets it again when the user comes back to that entry. The browser cannot keep a function or an element. Such `data` still reaches the page, but only on the way in.
- `router.on('change', handler)` runs on every navigation. Use it for things outside the pages, such as a menu that marks the current page.
- `Page()` is a fixed, full-screen layer with a white background and 60px of padding on each side. To change its look or its transition, write your own page function the same way. Listen to `enter` and `exit`, and switch classes.
- When the user reloads, the browser asks your server for the current path. Set up the server to answer every app path with `index.html`.

### 8. Lifecycle

Components emit events when they enter and leave the page. Pages also get `enter` and `exit` from the router.

| When | Listen to |
|---|---|
| A component enters the page | `mounted` |
| A component leaves through `remove()`, `destroy()` or a parent's `empty()` | `unmounted` |
| A page opens | `enter`, on the page |
| A page closes | `exit`, on the page |

```ts
const search = Input('Search')
search.on('mounted', () => search.focus())
```

A page is built once and then shown and hidden. So its `mounted` event fires once. Use `enter` for work that should happen on every visit, such as loading fresh data.

`remove()` takes a component out of the page. It keeps its children, so you can append it again later. `destroy()` also takes it out, and drops all of its handlers. Use `destroy()` for a component you will not use again.

**Clean up outside handlers.** A component may add a handler to something outside itself, such as `state`, `router` or a service. That handler stays after the component is gone, and keeps it in memory. For components that you create and remove often, such as list rows, take the handler off on `unmounted`:

```ts
const render = () => badge.text(String(cart.all().length))
state.on('cart', render)
badge.on('unmounted', () => state.off('cart', render))
```

Pages and other components that last as long as the app do not need this.

### 9. Fetching data

`http` wraps `fetch`. It sends JSON, parses the JSON it gets back, and returns the status with the data.

```ts
import { http } from '@codesuma/baseline'

const loadUsers = async () => {
    const { status, data } = await http.get<User[]>('/api/users')
    if (status === 200) render(data)
}

await http.post('/api/users', { name: 'Ada' })
await http.patch('/api/users/1', { name: 'Ada Lovelace' })
await http.delete('/api/users/1')

// Sends the header Authorization: Bearer <token>
await http.get('/api/me', { auth: token })

// Uploads a file and reports progress
await http.upload('/api/photos', file, {
    onProgress: (loaded, total) => bar.style({ width: `${(loaded / total) * 100}%` }),
})
```

Good to know:

- `http` does not throw on error statuses such as 404 or 500. Check `status`. It throws only when the request cannot be made, for example when the device is offline.
- Identical GET requests that run at the same time share one network request.
- Every request includes cookies.

### 10. Storing data in the browser

**localStorage** is the browser's simple key-value storage. `ldb` wraps it. It saves objects as JSON and parses them when you read them back.

```ts
import { ldb } from '@codesuma/baseline'

ldb.set('settings', { theme: 'dark' })
ldb.get('settings')   // { theme: 'dark' }
ldb.remove('settings')
```

Two things to know:

- A key that does not exist reads back as an empty string.
- A string that looks like JSON comes back parsed. `ldb.set('n', '1')` reads back as the number `1`.

**IndexedDB** is the browser's built-in database. It holds much more than localStorage, and it can search by field. `idb` wraps it. Keep the database in a service:

```ts
// services/notes.ts
import { idb } from '@codesuma/baseline'

const db = idb('my-app')

// Call once at startup. IndexedDB adds a store only when the version goes up.
const init = async () => {
    const { version, stores } = await db.info()
    if (!stores.includes('notes')) await db.createStore('notes', version + 1, { indices: ['createdAt'] })
}

const add = (text: string) => db.save('notes', { text, createdAt: Date.now() })
const latest = () => db.find('notes', { index: 'createdAt', reverse: true, limit: 10 })

export default { init, add, latest }
```

`init()` reads the current version with `info()` and creates the store at the next one. A store uses `id` as its key by default, and numbers new items for you.

`idb` keeps the connection open between calls. It closes the connection after two seconds without use.

### 11. Animation

Baseline has no animation API. CSS does the animating. Your code starts it by changing a class or a style.

```css
.panel {
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.2s, transform 0.2s;
}

.open {
    opacity: 1;
    transform: none;
}
```

```ts
panel.toggleClass(styles.open, isOpen)
```

`style()` takes a delay in milliseconds as its second argument:

```ts
toast.style({ opacity: '1' })
toast.style({ opacity: '0' }, 3000)   // Fades out after three seconds
```

`waitFor(ms)` returns a promise that resolves after a delay. It helps with steps in a sequence:

```ts
panel.addClass(styles.closing)
await waitFor(200)
panel.remove()
```

For a ripple effect on tap, call `initRipple()` once at startup. Then mark any element with the `data-ripple` attribute:

```ts
initRipple()
save.attr('data-ripple', '')
```

Page transitions come from `Page()`. See [Routing](#7-routing-and-pages).

## Rules of thumb

**Use the Baseline method first.** Write raw DOM code only where Baseline has no method.

| Instead of | Write |
|---|---|
| `document.createElement('div')` | `Div()`, or `Base('tag')` for any tag |
| `el.addEventListener('click', h)` | `c.on('click', h)` |
| `parent.appendChild(child)` | `parent.append(child)` |
| `el.innerHTML = ''` | `c.empty()` |
| `el.classList.add(name)` | `c.addClass(name)` |
| `el.textContent = 'x'` | `c.text('x')` |
| `el.setAttribute('k', 'v')` | `c.attr('k', 'v')` |
| `el.style.color = 'red'` | `c.style({ color: 'red' })` |
| `fetch()` | `http` |
| `localStorage` | `ldb` |
| `indexedDB` | `idb` |
| `history.pushState()` | `router.goto()` |
| Global variables for shared data | A service with `state` or `createEmitter` |

The last five rows apply only if you use Baseline's services. Your own tools are fine too. See [Use what you need](#use-what-you-need).

**Use `.el` at the edges.** Measuring, observers, the clipboard and other browser APIs work on the real element.

**Children emit, parents listen.** Prefer events to callback options. The parent then wires its children in one place.

**Keep files small.** When a component file passes about 200 lines, split it. A list and its row, for example, belong in two files in the same folder.

## Project layout

The starter app uses this layout:

```
src/
├── index.ts          Puts the app into the page
├── app.ts            Sets up the router
├── components/       Reusable components, one folder each
│   └── card/
│       ├── index.ts
│       └── index.module.css
├── pages/            One folder per page
│   └── home/
│       ├── index.ts
│       └── index.module.css
└── services/         Data, API calls and shared state
```

The [example app](https://github.com/ardeshirvalipoor/base-npm/tree/HEAD/examples/demo-app) in the repository uses every feature on this page.

## API reference

### Every component

Every factory returns a component made by `Base`. All components share these members.

| Member | What it does |
|---|---|
| `el` | The real DOM element. |
| `id` | A unique id. Baseline also writes it to the `data-base-id` attribute. |
| `parent` | The component this one was appended to. |
| `isMounted` | `true` while the component is in the page. |
| `append(...children)` | Adds children at the end. Skips `false`, `null` and `undefined`. Also takes a promise of a component, and adds the component when the promise resolves. |
| `prepend(...children)` | Adds children at the start. |
| `appendBefore(ref, ...children)` | Adds children before `ref`. |
| `appendAfter(ref, ...children)` | Adds children after `ref`. |
| `getChildren()` | Returns the child components. |
| `empty()` | Removes all child components. Text set with `text()` or `html()` stays. |
| `remove()` | Takes the component out of the page and emits `unmounted`. Keeps its children, so you can append it again. |
| `destroy()` | Does what `remove()` does, then drops all handlers. |
| `text(value)` | Sets the text. |
| `html(value)` | Sets the HTML. Never pass it text from users. |
| `style(styles, delay?)` | Sets inline styles, named in camelCase. A custom property keeps its CSS name, such as `--accent`. With a delay in milliseconds, sets them later. |
| `addClass(...names)` | Adds classes. Skips empty and false values, so a condition can sit in the call. |
| `removeClass(...names)` | Removes classes. Skips the same values. |
| `toggleClass(name, on?)` | Adds the class if it is missing and removes it if it is there. With `on`, adds it when `on` is true and removes it when `on` is false. |
| `attr(name, value?)` | Sets an attribute. Without a value, returns the attribute. With `null`, removes it. |
| `on(event, handler)` | Adds a handler. `event` can be one name or a list of names. Native DOM events such as `click` work too, and the handler receives the browser's event. |
| `once(event, handler)` | Adds a handler that runs one time. |
| `off(event, handler?)` | Removes a handler. Without a handler, removes every handler for the event. |
| `emit(event, payload?)` | Calls the event's handlers with the payload. |
| `emitAsync(event, payload?)` | Like `emit`, but waits for each async handler in turn. |
| `removeAllListeners()` | Removes every handler. |

The methods that add children, set content, set styles or handle events return the component, so calls chain: `Button('Save').addClass(styles.save).attr('data-ripple', '')`. The result keeps the factory's own methods, such as `disable()`.

### Element factories

| Factory | Creates | Notes |
|---|---|---|
| `Div(html?)` | `<div>` | Sets the argument as HTML. |
| `Span(text?)`, `P(text?)` | `<span>`, `<p>` | |
| `H1(text?)` to `H6(text?)` | `<h1>` to `<h6>` | |
| `Button(text?)` | `<button>` | Adds `disable()`, `enable()`, `focus()` and `blur()`. |
| `Input(placeholder?, type?, options?)` | `<input>` or `<textarea>` | A checkbox or radio with a label is a `<label>` around the input. See below. |
| `Select(options?)` | `<select>` | `options` is a list of `{ value, text }`. `change` carries the value. Adds `add(value, text)`, `value()` and `setValue(value)`. |
| `Option(value, text)` | `<option>` | |
| `A(href?, text?, target?)` | `<a>` | Adds `href(url)`, `target(name)` and `download(filename)`. |
| `Img(src?, options?)` | `<img>` | Options: `width`, `height` and `alt`. Adds `src(url)` and `alt(text)`. |
| `Canvas(width, height)` | `<canvas>` | Adds `ctx`, the 2D context, and `resize(width, height)`. |
| `SVG(viewBox, height?)` | `<svg>` | A string sets `viewBox`. A number sets `viewBox`, `width` and `height`. |
| `Base(tag)` | Any tag | |
| `BaseSVG(tag)` | Any SVG tag, such as `<path>` | For the parts inside an `SVG()`. |
| `Page()` | A full-screen `<div>` | See [Routing](#7-routing-and-pages). Adds `showInstant()`, which shows the page with no animation, and `exitDown()`. |

`Input` methods:

- `value()`, `setValue(value)` and `clear()`.
- `focus()`, `blur()` and `select()`.
- For a checkbox or radio: `isChecked()`, `setChecked(checked)` and `toggle()`.

`Input` options: `value`, `checked`, `name`, `id`, `min`, `max`, `step`, `pattern`, `accept`, `multiple`, `autocomplete`, `autofocus`, `disabled`, `readonly` and `required`.

`Input` events are listed in [Forms](#6-forms).

### router

| Member | What it does |
|---|---|
| `routes(map, view)` | Sets the routes and the component that holds the pages. Then opens the current URL. |
| `goto(path, data?)` | Opens a path and adds it to the browser history. |
| `back()`, `forward()` | Moves through the browser history. |
| `getPath()` | Returns the current path. |
| `getParams()` | Returns the parameters of the current path. |
| `getQuery(key?)` | Returns all query values, or the one for `key`. |
| `destroyPage(path)` | Drops the kept page for `path`. The next visit builds it again. |
| `on('change', handler)` | Runs the handler on every navigation. `off` and `once` work too. |

`createRouter()` makes a separate router with the same methods.

### http

| Method | What it does |
|---|---|
| `get(url, options?)` | Sends a GET. Identical requests in flight share one. |
| `post(url, body?, options?)` | Sends a POST with a JSON body. |
| `put(url, body?, options?)` | Sends a PUT with a JSON body. |
| `patch(url, body?, options?)` | Sends a PATCH with a JSON body. |
| `delete(url, options?)` | Sends a DELETE. |
| `upload(url, file, options?)` | Sends a file as the body of a POST, and reports progress. |

The options are `headers`, `auth` and `onProgress(loaded, total)`. `http` sends `auth` as the header `Authorization: Bearer <auth>`. `onProgress` works with `upload` only.

Every method returns `{ status, data }`. `data` is the parsed JSON when the response is JSON, and text otherwise.

### state

| Member | What it does |
|---|---|
| `set(key, value)` | Stores the value. Emits `key` with the value, and `change` with `{ key, value }`. |
| `get(key)` | Returns the value. |
| `remove(key)` | Deletes the value. Emits the same events as `set`, with `undefined`. |
| `clear()` | Deletes every value. Emits each key with `undefined`, then `change` with the key `'*'`. |
| `all()` | Returns a copy of every value. |
| `on(key, handler)` | Runs the handler when `key` changes. `off` and `once` work too. |

### ldb

`set(key, value)`, `get(key)`, `remove(key)` and `clear()`. See [Storing data](#10-storing-data-in-the-browser).

### idb

`idb(name)` opens a database by name. It returns these methods:

| Method | What it does |
|---|---|
| `info()` | Returns `{ version, stores }`. |
| `createStore(name, version, options?)` | Creates a store. See the options below. |
| `save(store, items)` | Adds or replaces one item or a list of items. |
| `get(store, key)` | Returns one item. |
| `all(store)` | Returns every item. |
| `find(store, query?)` | Returns the matching items. See the query fields below. |
| `count(store)` | Returns the number of items. |
| `delete(store, key)` | Deletes one item. |
| `clear(store)` | Deletes every item. |
| `close()` | Closes the connection now. |

`createStore` options:

| Option | Meaning | Default |
|---|---|---|
| `keyPath` | The field that holds each item's key. | `'id'` |
| `autoIncrement` | Numbers new items that have no key. | `true` |
| `indices` | The fields you want to search by. | None |

`find` query fields:

| Field | Meaning |
|---|---|
| `index` | The field to search by. Without it, `find` searches by key. |
| `value` | An exact match. |
| `gt`, `gte`, `lt`, `lte` | Greater than, greater or equal, less than, and less or equal. Give one lower and one upper bound for a range. |
| `between` | `[low, high]`, with both ends included. |
| `limit` | The most items to return. The default is 1000. |
| `reverse` | `true` returns the items in reverse order. |

### Emitters

| Export | What it does |
|---|---|
| `createEmitter<Events>()` | Makes a standalone emitter with `on`, `once`, `off`, `emit` and `emitAsync`. The type parameter maps event names to payload types. |
| `emitter` | One shared emitter for app-wide events. |

### Utilities

| Export | What it does |
|---|---|
| `waitFor(ms)` | Returns a promise that resolves after `ms` milliseconds. |
| `initRipple()` | Turns on the ripple effect for every element with `data-ripple`. |
| `injectCSS(id, css)` | Adds a `<style>` tag with the CSS, once per id. |
| `nextId()` | Returns the next id in a sequence, as a string. |
| `shortUUID()` | Returns a short random id of 12 characters. |
| `uuidv4()` | Returns a random version 4 UUID. |
| `createStyler`, `createContent` | The building blocks that `Base` uses. You rarely need them. |

The exported types are `IBaseComponent`, `IBaseSVGComponent`, `IRouteEvent`, `IEmitter`, `IStyler`, `IContent`, `IDatabase` and `CS`. `CS` is the type of a style object. `Input` has its own: `InputType`, `InputOptions`, `IInputComponent`, `ITextAreaComponent` and `ICheckboxComponent`.

### Helpers

Helpers are not part of the main import. Import each file by its path:

```ts
import { formatDate } from '@codesuma/baseline/helpers/date'
```

| Path | Exports |
|---|---|
| `helpers/date` | `formatDate(date, locale?)`, `formatTime(date, locale?)`, `dateFormatter(locale?, options?)`, and `jDateFormatter` for Persian dates |
| `helpers/format` | `formatNumber(n, decimals?)`, `formatCurrency(n, currency?, locale?)` and `formatPercent(n, decimals?)` |
| `helpers/locales` | `isRTL(text)`, `toPersianDigits(text)` and `toLatinDigits(text)` |
| `helpers/regex` | `isEmail`, `isUrl`, `isPhone` and `isStrongPassword`, with their patterns `EMAIL`, `URL`, `PHONE` and `PASSWORD_STRONG` |
| `helpers/device` | `isMobile()`, `isTouch()`, `isIOS()` and `isAndroid()` |

## Working on Baseline

These sections are for changing Baseline itself, in this repository.

### Repository structure

```
├── packages/baseline/     ← The npm package (@codesuma/baseline)
├── examples/demo-app/     ← Example app (not published)
└── package.json           ← Root workspace config
```

### Development

**Important**: Because this uses npm workspaces, you **must** run `npm install` from the root directory first. Do not run it inside the examples folder.

```bash
npm install                 # Install dependencies for ALL workspaces (run this at the root!)
npm run build:example       # Build example app
npm run start:example       # Serve at localhost:9876
```

### Publishing

This project uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

```bash
npm run changeset           # 1. Create a new changeset (describe your changes)
npm run version-packages    # 2. Bump versions and update CHANGELOG.md
npm run release             # 3. Publish to npm
```

## License

MIT
