// Base - A minimal, imperative UI framework
// Main entry point

// Core component factory
export { Base, IBaseComponent } from './components/base'

// Native components
export { Div } from './components/native/div'
export { Span } from './components/native/span'
export { P } from './components/native/p'
export { H1, H2, H3, H4, H5, H6 } from './components/native/h'
export { Button } from './components/native/button'
export { Input } from './components/native/input'
export { A } from './components/native/a'
export { Img } from './components/native/img'
export { Select } from './components/native/select'
export { Option } from './components/native/option'
export { Canvas } from './components/native/canvas'
export { SVG } from './components/native/svg'

// Advanced components
export { Page } from './components/advanced/page'

// Libraries
export { default as router, IRouteEvent } from './lib/router'
export { default as http } from './lib/http'
export { default as ldb } from './lib/ldb'
export { default as idb } from './lib/idb'
export { default as state } from './lib/state'

// Utilities
export { createEmitter, emitter, IEmitter } from './utils/emitter'
export { createStyler, injectCSS, IStyler, CS } from './utils/styler'
export { waitFor } from './utils/wait'
export { initRipple } from './utils/ripple'
export { nextId, shortUUID, uuidv4 } from './utils/id'
