// jsdom has no IndexedDB, so these tests run on fake-indexeddb.
import 'fake-indexeddb/auto'
import { describe, it, expect, vi, afterEach } from 'vitest'
import idb from './idb'

let count = 0
const open = async (indices: string[] = []) => {
    const db = idb('test-' + count++)
    await db.info()
    await db.createStore('items', 2, { indices })
    return db
}

afterEach(() => {
    vi.restoreAllMocks()
})

describe('idb', () => {
    it('rejects with the error of the request that failed', async () => {
        // A store with a unique index, which createStore() cannot make.
        const name = 'test-' + count++
        await new Promise<void>((resolve, reject) => {
            const req = indexedDB.open(name, 1)
            req.onupgradeneeded = () =>
                req.result.createObjectStore('users', { keyPath: 'id' }).createIndex('email', 'email', { unique: true })
            req.onsuccess = () => { req.result.close(); resolve() }
            req.onerror = () => reject(req.error)
        })
        const db = idb(name)
        await db.save('users', { id: 1, email: 'ada@example.com' })

        const failed = db.save('users', { id: 2, email: 'ada@example.com' })

        await expect(failed).rejects.toMatchObject({ name: 'ConstraintError' })
        db.close()
    })

    it('save() of a list stores nothing when one item cannot be stored', async () => {
        const db = await open()

        const failed = db.save('items', [{ id: 1 }, { id: 2 }, { id: 3, run() {} }])

        await expect(failed).rejects.toMatchObject({ name: 'DataCloneError' })
        expect(await db.count('items')).toBe(0)
        db.close()
    })

    it('opens the database once for calls that come together', async () => {
        const db = await open()
        db.close()
        const opened = vi.spyOn(indexedDB, 'open')

        await Promise.all([db.count('items'), db.all('items'), db.get('items', 1)])

        expect(opened).toHaveBeenCalledTimes(1)
        db.close()
    })

    it('find() takes a range, a limit and a direction', async () => {
        const db = await open(['createdAt'])
        await db.save('items', [1, 2, 3, 4, 5].map(n => ({ id: n, createdAt: n * 10 })))
        const ids = async (options?: Parameters<typeof db.find>[1]) =>
            (await db.find<{ id: number }>('items', options)).map(item => item.id)

        expect(await ids()).toEqual([1, 2, 3, 4, 5])
        expect(await ids({ index: 'createdAt', gte: 20, limit: 2 })).toEqual([2, 3])
        expect(await ids({ index: 'createdAt', gt: 20, lt: 50 })).toEqual([3, 4])
        expect(await ids({ index: 'createdAt', reverse: true, limit: 2 })).toEqual([5, 4])
        expect(await ids({ limit: 0 })).toEqual([])
        db.close()
    })

    it('find() takes a limit too large to count, as a way to ask for all', async () => {
        const db = await open()
        await db.save('items', [1, 2, 3].map(id => ({ id })))
        // getAll() throws on a count past 2^32 - 1, so a limit that large
        // has to reach it as no count at all.
        const getAll = vi.spyOn(IDBObjectStore.prototype, 'getAll')

        expect(await db.find('items', { limit: Infinity })).toHaveLength(3)
        expect(await db.find('items', { limit: Number.MAX_SAFE_INTEGER })).toHaveLength(3)

        expect(getAll.mock.calls.map(call => call[1])).toEqual([undefined, undefined])
        db.close()
    })
})
