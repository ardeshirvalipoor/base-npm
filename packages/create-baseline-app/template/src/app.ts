import { router, Div } from '@codesuma/baseline'
import { HomePage } from './pages/home'
import { AboutPage } from './pages/about'

const view = Div()
const app = Div()

app.style({
    position: 'fixed',
    right: '0',
    top: '0',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
})
app.append(view)

router.routes({
    '/': HomePage,
    '/about': AboutPage,
}, view)

export default app
