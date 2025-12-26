# Base

A minimal, imperative UI framework for building fast web apps. No virtual DOM, no magic, no dependencies.

**~1000 lines** of TypeScript that gives you everything you need for SPAs.

## Installation

```bash
npm install @codesuma/baseline
```

## Why Base?

- **Predictable** - What you write is what happens. No hidden lifecycle, no reactivity magic.
- **Fast** - Direct DOM manipulation. No diffing algorithms.
- **Tiny** - The entire framework is smaller than most framework's "hello world" bundle.
- **Stable** - No dependencies means no breaking changes from upstream.

## Quick Start

```typescript
import { Div, Button, router } from '@nichobase/base'

const App = () => {
    const app = Div()
    const count = { value: 0 }
    
    const counter = Div('0')
    counter.style({ fontSize: '48px', textAlign: 'center' })
    
    const btn = Button('Click me')
    btn.on('click', () => {
        count.value++
        counter.text(String(count.value))
    })
    
    app.style({ display: 'flex', flexDirection: 'column', gap: '20px', padding: '40px' })
    app.append(counter, btn)
    
    return app
}

document.body.appendChild(App().el)
```

## Core Concepts

### Components

Every component is created with the `Base()` factory:

```typescript
import { Base } from 'base/components/base'

const card = Base('div')   // Creates a <div>
card.el                     // The actual DOM element
card.id                     // Unique identifier
```

Or use pre-made native components:

```typescript
import { Div, Button, Input, Span, A, Img } from 'base/components/native'

const container = Div('Hello')
const btn = Button('Click')
const input = Input('Enter name...', 'text')
```

### Events

Components have a built-in event emitter:

```typescript
const btn = Button()

// Listen to events
btn.on('click', () => console.log('clicked!'))
btn.on('mounted', () => console.log('in the DOM'))

// Listen once
btn.once('click', () => console.log('first click only'))

// Emit custom events
btn.emit('my-event', { data: 123 })

// Remove listener
btn.off('click', handler)
```

### Styling

Two approaches: inline styles or CSS Modules.

#### Inline Styles

Use for dynamic values and simple components:

```typescript
// Inline styles
card.style({ 
    opacity: '0.5',
    transform: 'translateY(-10px)',
    transition: 'all 0.3s ease',
})

// Chained styles
card.style({ opacity: '0' })
    .style({ opacity: '1' })
```

#### CSS Modules (Recommended)

Use `.module.css` files for scoped, maintainable styles:

**card/index.module.css**
```css
.base {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 16px;
    transition: all 0.3s ease;
}

.base:hover {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
}

.dark {
    background: #1a1a1a;
    color: #fff;
}
```

**card/index.ts**
```typescript
import { Div } from '../../base/components/native/div'
import styles from './index.module.css'

export const Card = () => {
    const base = Div()
    base.addClass(styles.base)
    
    // Toggle classes
    base.addClass(styles.dark)     // Add dark mode
    base.removeClass(styles.dark)  // Remove dark mode
    base.toggleClass(styles.dark, isDark)  // Conditional
    
    return base
}
```

#### Project Structure with CSS Modules

```
components/
├── card/
│   ├── index.ts           # Component logic
│   └── index.module.css   # Scoped styles
├── button/
│   ├── index.ts
│   └── index.module.css
pages/
├── home/
│   ├── index.ts
│   └── index.module.css
```

#### Rollup Configuration

Ensure your `rollup.config.js` includes postcss:

```javascript
import postcss from 'rollup-plugin-postcss'

export default {
    plugins: [
        postcss({
            modules: true,        // Enable CSS modules
            extract: 'bundle.css', // Output file
            minimize: true,
        }),
    ],
}
```

Link the CSS in your HTML:
```html
<link rel="stylesheet" href="/bundle.css">
```

### DOM Tree

```typescript
const list = Div()
const item1 = Div('First')
const item2 = Div('Second')

// Append children
list.append(item1, item2)

// Prepend
list.prepend(Div('Zero'))

// Conditional rendering
list.append(
    isLoggedIn && UserProfile(),
    showFooter ? Footer() : null
)

// Remove
item1.remove()

// Empty all children
list.empty()

// Access children
list.getChildren()
```

### Lifecycle

```typescript
const card = Div()

card.on('mounted', () => {
    // Called when component enters the DOM
    console.log('Card is visible')
})

card.on('unmounted', () => {
    // Called when component is removed
    console.log('Card removed')
})
```

## Router

Base includes a full-featured SPA router with page lifecycle management. Pages stay in DOM and visibility toggles for smooth transitions.

### Basic Setup

```typescript
import { Div } from 'base/components/native/div'
import router from 'base/lib/router'
import { HomePage } from './pages/home'
import { AboutPage } from './pages/about'
import { UserPage } from './pages/user'

const view = Div()  // Container for pages
const app = Div()
app.append(view)

// Configure routes - pages stay in DOM, visibility toggles
router.routes({
    '/': HomePage,
    '/about': AboutPage,
    '/users/:id': UserPage,
}, view)

document.body.appendChild(app.el)
```

### Route Configuration

```typescript
router.routes({
    // Simple routes
    '/': HomePage,
    '/about': AboutPage,
    
    // Dynamic parameters
    '/users/:id': UserPage,
    '/posts/:postId/comments/:commentId': CommentPage,
}, view)
```

### How It Works

- All pages are created once and stay in DOM
- Navigation toggles visibility via CSS classes (`.enter` / `.exit`)
- Smooth transitions because both pages exist during animation
- State preserved (scroll position, form inputs)

### Page Component

Base includes a `Page` component with built-in CSS transitions for smooth page navigation:

```typescript
import { Page } from 'base/components/advanced/page'
import { IRouteEvent } from 'base/lib/router'

export const AboutPage = () => {
    const page = Page()  // Comes with enter/exit animations
    
    // Add your content
    page.append(header, body)
    
    // Uses default animations - slide up on enter, slide up on exit
    return page
}
```

**Default animations:**
- Enter: Slides up from bottom, fades in
- Exit: Slides up, fades out

### Customizing Page Transitions

```typescript
import { Page } from 'base/components/advanced/page'
import { IRouteEvent } from 'base/lib/router'

export const HomePage = () => {
    const page = Page()
    
    // Override default enter - show instantly
    page.off('enter')
    page.on('enter', async ({ from }: IRouteEvent) => {
        page.showInstant()
        // Load data...
    })
    
    return page
}

export const AboutPage = () => {
    const page = Page()
    
    // Custom exit - slide DOWN instead of up (for back navigation)
    page.off('exit')
    page.on('exit', async () => {
        await page.exitDown()
    })
    
    return page
}
```

**Page methods:**
- `showInstant()` - Show page without animation
- `exitDown()` - Exit with downward slide (for back navigation)

### Page Lifecycle Events

Pages receive `enter` and `exit` events from the router:

```typescript
page.on('enter', async ({ params, query, from, data }: IRouteEvent) => {
    // params: { id: '123' } for /users/:id
    // query: { sort: 'name' } for ?sort=name
    // from: '/home' - previous path
    // data: custom data from router.goto()
})

page.on('exit', async () => {
    // Called when navigating away
    // Async supported - router waits for completion
})
```

### Navigation

```typescript
import router from 'base/lib/router'

// Navigate to path
router.goto('/about')

// With query params
router.goto('/search?q=hello&page=2')

// With custom data (available in enter event)
router.goto('/users/123', { fromNotification: true })

// Browser history
router.back()
router.forward()

// Get current state
router.getPath()               // '/users/123'
router.getParams()             // { id: '123' }
router.getQuery()              // { sort: 'name' }
router.getQuery('sort')        // 'name'

// For heavy pages - manually destroy to force recreation
router.destroyPage('/heavy-page')
```

### Resetting Heavy Pages

Since pages stay in DOM, you may want to reset state on exit for heavy pages:

```typescript
page.on('exit', () => {
    // Reset scroll position
    page.el.scrollTop = 0
    
    // Clear dynamic content
    list.empty()
    
    // Reset form inputs
    input.val('')
})

// Or completely destroy the page to force recreation on next visit:
page.on('exit', () => {
    router.destroyPage('/heavy-page')
})

### Listening to Route Changes

For global navigation handling:

```typescript
router.on('change', ({ path, params, query, from, data }) => {
    // Update navigation UI
    updateActiveMenuItem(path)
    
    // Analytics
    trackPageView(path)
    
    // Show/hide back button
    backButton.style({ display: from ? 'block' : 'none' })
})
```

### Complete Example

```typescript
// app.ts
import { Div } from './base/components/native/div'
import router from './base/lib/router'
import { FIXED, EASE } from './base/helpers/style'
import { HomePage } from './pages/home'
import { AboutPage } from './pages/about'
import { UserPage } from './pages/user'

const view = Div()
const app = Div()
const nav = Div()

// Navigation
const homeLink = Div('Home')
homeLink.on('click', () => router.goto('/'))

const aboutLink = Div('About')
aboutLink.on('click', () => router.goto('/about'))

nav.style({ display: 'flex', gap: '20px', padding: '10px' })
nav.append(homeLink, aboutLink)

app.style({ ...FIXED })
app.append(nav, view)

// Configure routes
router.routes({
    '/': { page: HomePage, cache: true },
    '/about': { page: AboutPage, cache: false },
    '/users/:id': { page: UserPage, cache: true },
}, view)

export default app
```

```typescript
// pages/user/index.ts
import { Div } from '../../base/components/native/div'
import http from '../../base/lib/http'

export const UserPage = () => {
    const page = Div()
    const name = Div()
    const email = Div()
    
    page.append(name, email)
    
    page.on('enter', async ({ params }) => {
        const { data } = await http.get(`/api/users/${params.id}`)
        name.text(data.name)
        email.text(data.email)
    })
    
    return page
}
```

## HTTP Client

Built-in fetch wrapper with request deduplication:

```typescript
import http from 'base/lib/http'

// GET (automatically deduplicated - same URL = same request)
const { status, data } = await http.get('/api/users')

// POST, PUT, PATCH, DELETE
await http.post('/api/users', { name: 'John' })
await http.put('/api/users/1', { name: 'Jane' })
await http.patch('/api/users/1', { active: true })
await http.delete('/api/users/1')

// With auth
await http.get('/api/me', { auth: 'my-token' })

// Upload with progress
await http.upload('/api/upload', file, {
    onProgress: (loaded, total) => {
        console.log(`${Math.round(loaded/total * 100)}%`)
    }
})
```

## Storage

### localStorage

```typescript
import ldb from 'base/lib/ldb'

ldb.set('user', { name: 'John' })  // Auto JSON stringify
ldb.get('user')                     // Auto JSON parse
ldb.remove('user')
ldb.clear()
```

### IndexedDB

```typescript
import createDB from 'base/lib/idb'

const db = createDB('my-app')

// Create store (run once on app init)
await db.createStore('users', 1, { keyPath: 'id', indices: ['email'] })

// CRUD
await db.save('users', { id: '1', name: 'John', email: 'john@example.com' })
const user = await db.get('users', '1')
const allUsers = await db.all('users')
await db.update('users', { id: '1', name: 'Jane' })
await db.delete('users', '1')

// Query
const results = await db.find('users', { 
    index: 'email', 
    value: 'john@example.com',
    limit: 10,
    reverse: true
})
```

### Global State

```typescript
import state from 'base/lib/state'

// Simple get/set
state.set('user', { name: 'John', id: 123 })
state.get('user')  // { name: 'John', id: 123 }

// Subscribe to changes
state.on('user', (user) => {
    console.log('User changed:', user)
})

// Subscribe to any change
state.on('change', ({ key, value }) => {
    console.log(`${key} changed`)
})
```

## Helpers

### Style Helpers

```typescript
import { ABSOLUTE, FIXED, FLEX, CENTER, HIDE, SHOW, EASE, WH, X, Y, SCALE, ROTATE } from 'base/helpers/style'

card.style({ ...ABSOLUTE })           // position: absolute; inset: 0;
card.style({ ...CENTER })             // display: flex; align-items: center; justify-content: center;
card.style({ ...EASE(0.3) })          // transition: all 0.3s ease;
card.style({ ...WH(100, 50) })        // width: 100px; height: 50px;
card.style({ ...Y(-10) })             // transform: translateY(-10px);
```

### Ripple Effect

```typescript
import { withRipple } from 'base/utils/ripple'
import { Button } from 'base/components/native/button'

const btn = withRipple(Button('Click me'))
// Now has Material Design ripple effect on click/touch
```

### Device Detection

```typescript
import { isMobile, isTouch, isIOS, isAndroid } from 'base/helpers/device'

if (isMobile()) { /* mobile layout */ }
if (isTouch()) { /* touch interactions */ }
```

### Validation

```typescript
import { isEmail, isUrl, isPhone, isStrongPassword } from 'base/helpers/regex'

if (isEmail(input.value())) { /* valid */ }
```

## Project Structure

```
my-app/
├── base/                 # The framework (copy or npm install)
├── components/           # Your reusable components
│   └── card/
│   └── index.module.css  # CSS module
│   └── index.ts          # Component
├── pages/                # Page components
│   ├── home/
│   │   └── index.ts
│   └── about/
│       └── index.ts
├── services/             # API, state management
├── styles/               # CSS files
├── app.ts                # App setup with router
├── index.ts              # Entry point
└── index.html
```

## Philosophy

1. **Imperative over declarative** - You control the DOM directly
2. **Explicit over implicit** - No hidden state updates or re-renders
3. **Composition over inheritance** - Mix capabilities with Object.assign
4. **Simplicity over features** - Small API surface, easy to learn

---

MIT License