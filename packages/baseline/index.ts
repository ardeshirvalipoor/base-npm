// Base - A minimal, imperative UI framework
// Main entry point

// Core component factory
export { Base, BaseSVG } from './components/base'
export type { IBaseComponent, IBaseSVGComponent } from './components/base'

// Native components
export { Div } from './components/native/div'
export { Span } from './components/native/span'
export { P } from './components/native/p'
export { H1, H2, H3, H4, H5, H6 } from './components/native/h'
export { Button } from './components/native/button'
export { Input } from './components/native/input'
export type { InputType, InputOptions, IInputComponent, ITextAreaComponent, ICheckboxComponent } from './components/native/input'
export { A } from './components/native/a'
export { Img } from './components/native/img'
export { Select } from './components/native/select'
export { Option } from './components/native/option'
export { Canvas } from './components/native/canvas'
export { SVG } from './components/native/svg'

// Advanced components
export { Page } from './components/advanced/page'

// Libraries
export { default as router, createRouter } from './lib/router'
export type { IRouteEvent } from './lib/router'
export { default as http } from './lib/http'
export { default as ldb } from './lib/ldb'
export { default as idb } from './lib/idb'
export type { IDatabase } from './lib/idb'
export { default as state } from './lib/state'

// Utilities
export { createEmitter, emitter } from './utils/emitter'
export type { IEmitter } from './utils/emitter'
export { createStyler, injectCSS } from './utils/styler'
export type { IStyler, CS } from './utils/styler'
export { createContent } from './utils/content'
export type { IContent } from './utils/content'
export { waitFor } from './utils/wait'
export { initRipple } from './utils/ripple'
export { nextId, shortUUID, uuidv4 } from './utils/id'
