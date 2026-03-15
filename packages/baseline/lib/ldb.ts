function set(key: string, value: any) {
    if (typeof value === 'object') value = JSON.stringify(value)
    localStorage.setItem(key, value)
}

function get(key: string) {
    const raw = String(localStorage.getItem(key) || '')
    try {
        return JSON.parse(raw)
    } catch (err) {
        return raw
    }
}

function remove(key: string) {
    localStorage.removeItem(key)
}

function clear() {
    localStorage.clear()
}

export default {
    get,
    set,
    remove,
    clear
}
