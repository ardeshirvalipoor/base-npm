import { router, Div, initRipple } from "@codesuma/baseline"
import { HomePage } from "./pages/home"
import { AboutPage } from "./pages/about"
import { MenuPage } from "./pages/menu"
import { ComponentsPage } from "./pages/components"
import { FormsPage } from "./pages/forms"
import { RouterDemoPage } from "./pages/router-demo"
import { RouterItemPage } from "./pages/router-demo/item"
import { TransitionsPage } from "./pages/transitions"
import { InstantPage } from "./pages/transitions/instant"
import { DataPage } from "./pages/data"
import { EventsPage } from "./pages/events"
import { UtilitiesPage } from "./pages/utilities"
import { HelpersPage } from "./pages/helpers"
import { NotFoundPage } from "./pages/not-found"
import { BackIcon } from "./components/back-icon"
import { MenuIcon } from "./components/menu-icon"
import { View } from "./components/view"

initRipple()

const view = View()
const app = Div()
const menuIcon = MenuIcon()
const backIcon = BackIcon()

app.style({
    position: 'fixed',
    right: '0',
    top: '0',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    paddingTop: 'env(safe-area-inset-top)',
    paddingBottom: 'env(safe-area-inset-bottom)',
})
app.append(menuIcon, backIcon, view)

// Configure routes - all pages stay in DOM, visibility toggles
router.routes({
    '/': HomePage,
    '/menu': MenuPage,
    '/about': AboutPage,
    '/components': ComponentsPage,
    '/forms': FormsPage,
    '/router-demo': RouterDemoPage,
    '/router-demo/item/:id': RouterItemPage,
    '/transitions': TransitionsPage,
    '/transitions/instant': InstantPage,
    '/data': DataPage,
    '/events': EventsPage,
    '/utilities': UtilitiesPage,
    '/helpers': HelpersPage,
    '*': NotFoundPage,
}, view)

export default app