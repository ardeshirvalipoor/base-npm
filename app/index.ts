import app from './app'
import { ldb } from '@codesuma/baseline'
import db from './services/db'

(async () => {
    await db.init()
    document.body.appendChild(app.el)
    if (!ldb.get('app-id2')) ldb.set('app-id', crypto.randomUUID())
})()
