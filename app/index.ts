import app from './app'
import ldb from './base/lib/ldb'
import db from './services/db'

(async () => {
    await db.init()
    document.body.appendChild(app.el)
    if (!ldb.get('app-id')) ldb.set('app-id', crypto.randomUUID())
})()
