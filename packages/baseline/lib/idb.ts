// Simplified IndexedDB wrapper with connection caching

type StoreOptions = { keyPath?: string; autoIncrement?: boolean; indices?: string[] }

interface FindOptions {
    index?: string
    value?: any
    gt?: any
    gte?: any
    lt?: any
    lte?: any
    between?: [any, any]
    limit?: number
    reverse?: boolean
}

// --- Connection cache ---
// Reuses open connections per dbName, auto-closes after idle timeout

const connections: Record<string, IDBDatabase> = {}
const closeTimers: Record<string, ReturnType<typeof setTimeout>> = {}
const IDLE_TIMEOUT = 2000

// Keeps a connection for reuse, and lets it go when the browser closes it or
// when an upgrade asks for it: opening the database at a newer version — from
// another tab, or from createStore below — fires versionchange on every open
// connection, and the upgrade waits until they close. Closing here lets it
// through; the next call reopens at the new version.
const cache = (name: string, db: IDBDatabase) => {
    connections[name] = db
    db.onclose = () => { if (connections[name] === db) delete connections[name] }
    db.onversionchange = () => {
        db.close()
        if (connections[name] === db) delete connections[name]
    }
    resetIdleTimer(name)
}

const getConnection = (name: string): Promise<IDBDatabase> => {
    // Reuse cached connection
    if (connections[name]) {
        resetIdleTimer(name)
        return Promise.resolve(connections[name])
    }

    return new Promise((resolve, reject) => {
        const req = indexedDB.open(name)
        req.onsuccess = () => {
            cache(name, req.result)
            resolve(req.result)
        }
        req.onerror = () => reject(req.error)
    })
}

const resetIdleTimer = (name: string) => {
    if (closeTimers[name]) clearTimeout(closeTimers[name])
    closeTimers[name] = setTimeout(() => closeConnection(name), IDLE_TIMEOUT)
}

const closeConnection = (name: string) => {
    if (closeTimers[name]) clearTimeout(closeTimers[name])
    if (connections[name]) {
        connections[name].close()
        delete connections[name]
    }
    delete closeTimers[name]
}

// --- Core transaction helper ---

const withStore = async <T>(
    dbName: string,
    storeName: string,
    mode: IDBTransactionMode,
    fn: (store: IDBObjectStore) => IDBRequest | void
): Promise<T> => {
    const db = await getConnection(dbName)

    if (!db.objectStoreNames.contains(storeName)) {
        throw new Error(`Store "${storeName}" does not exist in database "${dbName}"`)
    }

    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, mode)
        const store = tx.objectStore(storeName)
        const req = fn(store)

        tx.oncomplete = () => {
            resolve(req ? (req.result as T) : (undefined as T))
        }
        tx.onerror = () => reject(tx.error)
        // A transaction can abort with no error event, for example when
        // storage is full at commit. Without this the promise never settles.
        tx.onabort = () => reject(tx.error)
    })
}

// --- Cursor-based query helper ---

const withCursor = async <T>(
    dbName: string,
    storeName: string,
    options: FindOptions = {}
): Promise<T[]> => {
    const { index, value, gt, gte, lt, lte, between, limit = 1000, reverse = false } = options
    const db = await getConnection(dbName)

    if (!db.objectStoreNames.contains(storeName)) {
        throw new Error(`Store "${storeName}" does not exist in database "${dbName}"`)
    }

    return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, 'readonly')
        const store = tx.objectStore(storeName)
        const source = index ? store.index(index) : store

        // Build key range
        let range: IDBKeyRange | undefined
        if (value !== undefined) range = IDBKeyRange.only(value)
        else if (between) range = IDBKeyRange.bound(between[0], between[1])
        else if (gte !== undefined && lte !== undefined) range = IDBKeyRange.bound(gte, lte)
        else if (gte !== undefined && lt !== undefined) range = IDBKeyRange.bound(gte, lt, false, true)
        else if (gt !== undefined && lte !== undefined) range = IDBKeyRange.bound(gt, lte, true, false)
        else if (gt !== undefined && lt !== undefined) range = IDBKeyRange.bound(gt, lt, true, true)
        else if (gte !== undefined) range = IDBKeyRange.lowerBound(gte)
        else if (gt !== undefined) range = IDBKeyRange.lowerBound(gt, true)
        else if (lte !== undefined) range = IDBKeyRange.upperBound(lte)
        else if (lt !== undefined) range = IDBKeyRange.upperBound(lt, true)

        const req = source.openCursor(range, reverse ? 'prev' : 'next')
        const results: T[] = []

        req.onsuccess = () => {
            const cursor = req.result
            if (cursor && results.length < limit) {
                results.push(cursor.value)
                cursor.continue()
            } else {
                resolve(results)
            }
        }
        tx.onerror = () => reject(tx.error)
        tx.onabort = () => reject(tx.error)
    })
}

// --- Database factory ---

function createDatabase(dbName: string) {
    return {
        info: async () => {
            const db = await getConnection(dbName)
            return { version: db.version, stores: Array.from(db.objectStoreNames) }
        },

        createStore: (name: string, version: number, options: StoreOptions = {}) => {
            const opts = { keyPath: 'id', autoIncrement: true, indices: [] as string[], ...options }

            // Close any cached connection (version upgrade requires a fresh open)
            closeConnection(dbName)

            return new Promise<void>((resolve, reject) => {
                const req = indexedDB.open(dbName, version)
                req.onupgradeneeded = (e) => {
                    const db = (e.target as IDBOpenDBRequest).result
                    if (!db.objectStoreNames.contains(name)) {
                        const store = db.createObjectStore(name, {
                            keyPath: opts.keyPath,
                            autoIncrement: opts.autoIncrement
                        })
                        opts.indices.forEach(idx => store.createIndex(idx, idx))
                    }
                }
                req.onsuccess = () => {
                    cache(dbName, req.result)
                    resolve()
                }
                req.onerror = () => reject(req.error)
            })
        },

        save: <T>(store: string, data: T | T[]): Promise<T | T[]> => {
            const items = Array.isArray(data) ? data : [data]
            return withStore<T | T[]>(dbName, store, 'readwrite', (s) => {
                for (const item of items) s.put(item)
            }).then(() => data)
        },

        get: <T>(store: string, id: any): Promise<T | undefined> =>
            withStore<T | undefined>(dbName, store, 'readonly', s => s.get(id)),

        all: <T>(store: string): Promise<T[]> =>
            withStore<T[]>(dbName, store, 'readonly', s => s.getAll()),

        delete: (store: string, id: any): Promise<void> =>
            withStore<void>(dbName, store, 'readwrite', s => s.delete(id)),

        clear: (store: string): Promise<void> =>
            withStore<void>(dbName, store, 'readwrite', s => s.clear()),

        count: (store: string): Promise<number> =>
            withStore<number>(dbName, store, 'readonly', s => s.count()),

        find: <T>(store: string, options?: FindOptions): Promise<T[]> =>
            withCursor<T>(dbName, store, options),

        close: () => closeConnection(dbName),
    }
}

export type IDatabase = ReturnType<typeof createDatabase>

export default createDatabase