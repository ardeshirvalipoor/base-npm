// Simplified IndexedDB wrapper

type StoreOptions = { keyPath?: string; autoIncrement?: boolean; indices?: string[] }

const openDB = (name: string, version?: number): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
        const req = indexedDB.open(name, version)
        req.onsuccess = () => resolve(req.result)
        req.onerror = () => reject(req.error)
    })

const withStore = async <T>(
    dbName: string,
    storeName: string,
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore, db: IDBDatabase) => IDBRequest | void
): Promise<T> => {
    const db = await openDB(dbName)
    return new Promise((resolve, reject) => {
        if (!db.objectStoreNames.contains(storeName)) {
            db.close()
            return resolve([] as any)
        }
        const tx = db.transaction(storeName, mode)
        const store = tx.objectStore(storeName)
        const req = fn(store, db)

        tx.oncomplete = () => {
            db.close()
            resolve(req ? (req.result as T) : (undefined as any))
        }
        tx.onerror = () => {
            db.close()
            reject(tx.error)
        }
    })
}

export default (dbName: string) => ({
    // Get database info
    async info(): Promise<{ version: number; objectStoreNames: DOMStringList }> {
        const db = await openDB(dbName)
        const result = { version: db.version, objectStoreNames: db.objectStoreNames }
        db.close()
        return result
    },

    // Create or upgrade store
    async createStore(name: string, version: number, options: StoreOptions = {}) {
        const opts = { keyPath: 'id', autoIncrement: true, indices: [], ...options }
        return new Promise<void>((resolve, reject) => {
            const req = indexedDB.open(dbName, version)
            req.onupgradeneeded = (e) => {
                const db = (e.target as IDBOpenDBRequest).result
                if (!db.objectStoreNames.contains(name)) {
                    const store = db.createObjectStore(name, { keyPath: opts.keyPath, autoIncrement: opts.autoIncrement })
                    opts.indices!.forEach(idx => store.createIndex(idx, idx))
                }
            }
            req.onsuccess = () => { req.result.close(); resolve() }
            req.onerror = () => reject(req.error)
        })
    },

    // CRUD operations
    async save<T>(store: string, data: T | T[]): Promise<T | T[]> {
        const items = Array.isArray(data) ? data : [data]
        await withStore(dbName, store, 'readwrite', (s) => {
            items.forEach(item => s.add(item))
        })
        return data
    },

    async get<T>(store: string, id: any): Promise<T | undefined> {
        return withStore(dbName, store, 'readonly', s => s.get(id))
    },

    async all<T>(store: string): Promise<T[]> {
        return withStore(dbName, store, 'readonly', s => s.getAll())
    },

    async update<T>(store: string, data: T): Promise<T> {
        await withStore(dbName, store, 'readwrite', s => s.put(data))
        return data
    },

    async delete(store: string, id: any): Promise<void> {
        await withStore(dbName, store, 'readwrite', s => s.delete(id))
    },

    async clear(store: string): Promise<void> {
        await withStore(dbName, store, 'readwrite', s => s.clear())
    },

    async count(store: string): Promise<number> {
        return withStore(dbName, store, 'readonly', s => s.count())
    },

    // Query with options
    async find<T>(store: string, options: {
        index?: string
        value?: any
        limit?: number
        reverse?: boolean
    } = {}): Promise<T[]> {
        const { index, value, limit = 1000, reverse = false } = options
        const db = await openDB(dbName)

        return new Promise((resolve, reject) => {
            if (!db.objectStoreNames.contains(store)) {
                db.close()
                return resolve([])
            }

            const tx = db.transaction(store, 'readonly')
            const s = tx.objectStore(store)
            const source = index ? s.index(index) : s
            const range = value !== undefined ? IDBKeyRange.only(value) : undefined
            const req = source.openCursor(range, reverse ? 'prev' : 'next')

            const results: T[] = []
            req.onsuccess = () => {
                const cursor = req.result
                if (cursor && results.length < limit) {
                    results.push(cursor.value)
                    cursor.continue()
                } else {
                    db.close()
                    resolve(results)
                }
            }
            tx.onerror = () => { db.close(); reject(tx.error) }
        })
    }
})
