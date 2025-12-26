import { router, Div } from "@codesuma/baseline"
import { HomePage } from "./pages/home"
import { AboutPage } from "./pages/about"
import { MenuPage } from "./pages/menu"
import { BackIcon } from "./components/back-icon"
import { MenuIcon } from "./components/menu-icon"

const view = Div()
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
}, view)

export default app