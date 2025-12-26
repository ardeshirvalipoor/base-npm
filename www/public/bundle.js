(function () {
    'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var idGenerator = function (id) {
        if (id === void 0) { id = 0; }
        return function () { return (id++).toString(); };
    };
    var nextId = idGenerator();

    // Lightweight observer - only checks if element entered document.body
    var observer = null;
    var pendingRoots = new Set();
    var initObserver = function () {
        if (observer)
            return;
        observer = new MutationObserver(function () {
            pendingRoots.forEach(function (component) {
                if (document.body.contains(component.el)) {
                    pendingRoots.delete(component);
                    markMounted(component);
                }
            });
            if (pendingRoots.size === 0 && observer) {
                observer.disconnect();
                observer = null;
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    };
    var markMounted = function (component) {
        if (component.isMounted)
            return;
        component.isMounted = true;
        component.emit('mounted');
        component.getChildren().forEach(markMounted);
    };
    function createAppender(base) {
        var children = [];
        // Register for root detection (will be cleaned up once mounted)
        pendingRoots.add(base);
        initObserver();
        return {
            children: children,
            getChildren: function () { return children; },
            setChildren: function (c) { children = c; },
            append: function () {
                var e_1, _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                try {
                    for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                        var c = args_1_1.value;
                        if (!c)
                            continue;
                        if (c instanceof Promise) {
                            c.then(function (resolved) {
                                if (!(resolved === null || resolved === void 0 ? void 0 : resolved.el))
                                    return;
                                base.el.appendChild(resolved.el);
                                children.push(resolved);
                                resolved.parent = base;
                                pendingRoots.delete(resolved); // No longer pending
                                if (base.isMounted)
                                    markMounted(resolved);
                            });
                            continue;
                        }
                        if (!c.el)
                            continue;
                        base.el.appendChild(c.el);
                        children.push(c);
                        c.parent = base;
                        pendingRoots.delete(c); // No longer pending - has parent
                        if (base.isMounted)
                            markMounted(c);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                base.emit('append', args);
                return base;
            },
            prepend: function () {
                var e_2, _a;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                try {
                    for (var args_2 = __values(args), args_2_1 = args_2.next(); !args_2_1.done; args_2_1 = args_2.next()) {
                        var c = args_2_1.value;
                        if (!(c === null || c === void 0 ? void 0 : c.el))
                            continue;
                        base.el.insertBefore(c.el, base.el.firstChild);
                        children.unshift(c);
                        c.parent = base;
                        pendingRoots.delete(c);
                        if (base.isMounted)
                            markMounted(c);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (args_2_1 && !args_2_1.done && (_a = args_2.return)) _a.call(args_2);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
                base.emit('prepend', args);
                return base;
            },
            appendBefore: function (ref) {
                var e_3, _a;
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                try {
                    for (var args_3 = __values(args), args_3_1 = args_3.next(); !args_3_1.done; args_3_1 = args_3.next()) {
                        var c = args_3_1.value;
                        if (!(c === null || c === void 0 ? void 0 : c.el))
                            continue;
                        base.el.insertBefore(c.el, ref.el);
                        var idx = children.indexOf(ref);
                        children.splice(idx, 0, c);
                        c.parent = base;
                        pendingRoots.delete(c);
                        if (base.isMounted)
                            markMounted(c);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (args_3_1 && !args_3_1.done && (_a = args_3.return)) _a.call(args_3);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                return base;
            },
            appendAfter: function (ref) {
                var e_4, _a;
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                try {
                    for (var args_4 = __values(args), args_4_1 = args_4.next(); !args_4_1.done; args_4_1 = args_4.next()) {
                        var c = args_4_1.value;
                        if (!(c === null || c === void 0 ? void 0 : c.el))
                            continue;
                        base.el.insertBefore(c.el, ref.el.nextSibling);
                        var idx = children.indexOf(ref);
                        children.splice(idx + 1, 0, c);
                        c.parent = base;
                        pendingRoots.delete(c);
                        if (base.isMounted)
                            markMounted(c);
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (args_4_1 && !args_4_1.done && (_a = args_4.return)) _a.call(args_4);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                return base;
            },
            empty: function () {
                children.forEach(function (c) { return c.remove(); });
                children = [];
            },
            remove: function () {
                children.forEach(function (c) { return c.remove(); });
                if (base.parent) {
                    base.parent.setChildren(base.parent.getChildren().filter(function (c) { return c !== base; }));
                }
                base.removeAllListeners();
                pendingRoots.delete(base);
                base.el.remove();
                base.emit('unmounted');
            }
        };
    }

    function createStyler(base) {
        return {
            style: function (s, delay) {
                var apply = function () {
                    var keys = Object.keys(s);
                    for (var i = 0; i < keys.length; i++) {
                        var k = keys[i];
                        var v = s[k];
                        base.el.style[k] = typeof v === 'function' ? v() : v;
                    }
                };
                delay ? setTimeout(apply, delay) : apply();
                return base;
            },
            addClass: function () {
                var classes = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    classes[_i] = arguments[_i];
                }
                base.el.classList.add.apply(base.el.classList, classes);
                return base;
            },
            removeClass: function () {
                var classes = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    classes[_i] = arguments[_i];
                }
                base.el.classList.remove.apply(base.el.classList, classes);
                return base;
            },
            toggleClass: function (cls, force) {
                base.el.classList.toggle(cls, force);
                return base;
            }
        };
    }
    // Inject CSS once - for components that need self-contained styles
    var injected = {};
    function injectCSS(id, css) {
        if (injected[id])
            return;
        injected[id] = true;
        var el = document.createElement('style');
        el.id = id;
        el.textContent = css;
        document.head.appendChild(el);
    }

    function createEmitter() {
        var listeners = {};
        return {
            on: function (event, handler) {
                var e_1, _a;
                var events = Array.isArray(event) ? event : [event];
                try {
                    for (var events_1 = __values(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
                        var e = events_1_1.value;
                        var key = e;
                        listeners[key] = listeners[key] || [];
                        listeners[key].push(handler);
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return this;
            },
            once: function (event, handler) {
                var _this = this;
                var wrapper = function (payload) {
                    handler(payload);
                    _this.off(event, wrapper);
                };
                return this.on(event, wrapper);
            },
            off: function (event, handler) {
                var key = event;
                if (!handler) {
                    delete listeners[key];
                }
                else if (listeners[key]) {
                    listeners[key] = listeners[key].filter(function (h) { return h !== handler; });
                }
                return this;
            },
            emit: function (event, payload) {
                var e_2, _a;
                var key = event;
                if (listeners[key]) {
                    try {
                        for (var _b = __values(listeners[key]), _c = _b.next(); !_c.done; _c = _b.next()) {
                            var handler = _c.value;
                            handler(payload);
                        }
                    }
                    catch (e_2_1) { e_2 = { error: e_2_1 }; }
                    finally {
                        try {
                            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                        }
                        finally { if (e_2) throw e_2.error; }
                    }
                }
                return this;
            },
            removeAllListeners: function () {
                for (var key in listeners)
                    delete listeners[key];
            },
            getListeners: function () {
                return listeners;
            }
        };
    }
    // Global emitter for framework internals (mounter, theme, db-ready)
    var emitter$1 = createEmitter();

    function Base(name) {
        if (name === void 0) { name = 'div'; }
        var id = nextId();
        var el = document.createElement(name);
        el.setAttribute('data-base-id', id);
        var component = { id: id, el: el, isMounted: false, parent: undefined };
        Object.assign(component, createEmitter(), createAppender(component), createStyler(component));
        return component;
    }

    var Div = function (content) {
        if (content === void 0) { content = ''; }
        var base = Base('div');
        if (content)
            base.el.innerHTML = content;
        return Object.assign(base, {
            text: function (t) { base.el.textContent = t; },
            html: function (h) { base.el.innerHTML = h; }
        });
    };

    var waitFor = function (time) {
        return new Promise(function (resolve) { return setTimeout(resolve, time, true); });
    };

    var styles$5 = {"page":"page-module_page__jw-YJ","enterUp":"page-module_enterUp__-0uL0","enterDown":"page-module_enterDown__ENEUz","exitUp":"page-module_exitUp__Qvpyx","exitDown":"page-module_exitDown__FYwC8","hiddenBelow":"page-module_hiddenBelow__OeVmA","hiddenAbove":"page-module_hiddenAbove__EdqEi"};

    // Page component with directional enter/exit transitions
    var TRANSITION_DURATION = 160;
    var Page = function () {
        var base = Div();
        base.addClass(styles$5.page); // Initial state is hidden below (in CSS)
        // Enter: direction based on isBack flag
        base.on('enter', function (_a) {
            var isBack = _a.isBack;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            // Pre-position correctly before entering to ensure correct transition direction
                            if (isBack) {
                                base.addClass(styles$5.hiddenAbove);
                                base.removeClass(styles$5.hiddenBelow);
                            }
                            else {
                                base.addClass(styles$5.hiddenBelow);
                                base.removeClass(styles$5.hiddenAbove);
                            }
                            return [4 /*yield*/, waitFor(200)
                                // Clear all state classes
                            ];
                        case 1:
                            _b.sent();
                            // Clear all state classes
                            base.removeClass(styles$5.exitUp, styles$5.exitDown, styles$5.hiddenBelow, styles$5.hiddenAbove);
                            // Add enter class (same visual result, but positioned correctly before)
                            base.addClass(isBack ? styles$5.enterDown : styles$5.enterUp);
                            return [2 /*return*/];
                    }
                });
            });
        });
        // Exit: direction based on isBack flag
        base.on('exit', function (_a) {
            var isBack = _a.isBack;
            return __awaiter(void 0, void 0, void 0, function () {
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            base.removeClass(styles$5.enterUp, styles$5.enterDown);
                            if (isBack) {
                                // Back: current page goes DOWN
                                base.addClass(styles$5.exitDown);
                            }
                            else {
                                // Forward: current page goes UP
                                base.addClass(styles$5.exitUp);
                            }
                            return [4 /*yield*/, waitFor(TRANSITION_DURATION)
                                // Position for next enter
                            ];
                        case 1:
                            _b.sent();
                            // Position for next enter
                            if (isBack) {
                                // After exiting down, position below for next forward enter
                                base.addClass(styles$5.hiddenBelow);
                            }
                            else {
                                // After exiting up, position above for next back enter
                                base.addClass(styles$5.hiddenAbove);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        });
        return base;
    };

    // Router - SPA navigation with page lifecycle (Hide/Show pattern)
    // All pages stay in DOM, only visibility toggles for smooth transitions
    var emitter = createEmitter();
    var currentPath = '';
    var currentPage = null;
    var viewContainer = null;
    var pageCache = {};
    var routeConfigs = {};
    var initialized = false;
    var isBackNavigation = false;
    // Extract params from path like /users/:id
    var extractParams = function (pattern, path) {
        var patternParts = pattern.split('/');
        var pathParts = path.split('/');
        if (patternParts.length !== pathParts.length)
            return null;
        var params = {};
        for (var i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
                params[patternParts[i].slice(1)] = pathParts[i];
            }
            else if (patternParts[i] !== pathParts[i]) {
                return null;
            }
        }
        return params;
    };
    // Find matching route
    var matchRoute = function (path) {
        var e_1, _a;
        if (routeConfigs[path])
            return { pattern: path, params: {} };
        try {
            for (var _b = __values(Object.keys(routeConfigs)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var pattern = _c.value;
                var params = extractParams(pattern, path);
                if (params)
                    return { pattern: pattern, params: params };
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
    };
    // Get query params
    var getQuery = function (key) {
        var params = new URLSearchParams(window.location.search);
        return key ? params.get(key) : Object.fromEntries(params);
    };
    // Handle navigation
    var navigate = function (to, data) { return __awaiter(void 0, void 0, void 0, function () {
        var url, path, from, isBack, match, page, config, pageFactory;
        return __generator(this, function (_a) {
            url = new URL(to, window.location.origin);
            path = url.pathname;
            from = currentPath;
            isBack = isBackNavigation;
            if (path === currentPath)
                return [2 /*return*/];
            match = matchRoute(path);
            if (!match) {
                console.warn("No route found for: ".concat(path));
                return [2 /*return*/];
            }
            // Exit current page with direction
            if (currentPage) {
                currentPage.emit('exit', {
                    params: {},
                    query: getQuery(),
                    from: currentPath,
                    data: data,
                    isBack: isBack
                });
            }
            // Update state
            currentPath = path;
            if (!isBack) {
                history.pushState(data, '', to);
            }
            page = pageCache[path];
            if (!page) {
                config = routeConfigs[match.pattern];
                pageFactory = typeof config === 'function' ? config : config.page;
                page = pageFactory();
                pageCache[path] = page;
                if (viewContainer) {
                    viewContainer.append(page);
                }
            }
            currentPage = page;
            // Enter the new page with direction
            page.emit('enter', {
                params: match.params,
                query: getQuery(),
                from: from,
                data: data,
                isBack: isBack
            });
            emitter.emit('change', {
                path: path,
                params: match.params,
                query: getQuery(),
                from: from,
                data: data,
                isBack: isBack
            });
            // Reset back flag
            isBackNavigation = false;
            return [2 /*return*/];
        });
    }); };
    // Initialize router
    var init$1 = function () {
        if (initialized)
            return;
        initialized = true;
        window.addEventListener('popstate', function (e) {
            isBackNavigation = true; // Mark as back navigation
            var path = window.location.pathname;
            if (path !== currentPath) {
                navigate(path, e.state);
            }
        });
        if (currentPath === '' && viewContainer) {
            navigate(window.location.pathname + window.location.search);
        }
    };
    // Configure routes
    var routes = function (config, view) {
        routeConfigs = config;
        viewContainer = view;
        init$1();
    };
    // Manually destroy a cached page
    var destroyPage = function (path) {
        var page = pageCache[path];
        if (page) {
            page.remove();
            delete pageCache[path];
        }
    };
    var router = {
        routes: routes,
        init: init$1,
        goto: function (path, data) { return navigate(path, data); },
        back: function () { return history.back(); },
        forward: function () { return history.forward(); },
        getPath: function () { return currentPath; },
        getQuery: getQuery,
        getParams: function () { var _a; return ((_a = matchRoute(currentPath)) === null || _a === void 0 ? void 0 : _a.params) || {}; },
        destroyPage: destroyPage,
        on: emitter.on.bind(emitter),
        off: emitter.off.bind(emitter),
        once: emitter.once.bind(emitter),
    };

    function save() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length > 1) {
            var _a = __read(args, 2), key = _a[0], value_1 = _a[1];
            if (typeof value_1 === 'object')
                value_1 = JSON.stringify(value_1);
            localStorage.setItem(key, value_1);
            return;
        }
        var _b = __read(args, 1), value = _b[0];
        if (typeof value === 'object')
            value = JSON.stringify(value);
        return {
            as: function (key) {
                localStorage.setItem(key, value);
            }
        };
    }
    function get(key) {
        var raw = String(localStorage.getItem(key) || '');
        try {
            return JSON.parse(raw);
        }
        catch (err) {
            return raw;
        }
    }
    function remove(key) {
        localStorage.removeItem(key);
    }
    function clear() {
        localStorage.clear();
    }
    var ldb = {
        get: get,
        set: save,
        save: save,
        remove: remove,
        clear: clear
    };

    // Simplified IndexedDB wrapper
    var openDB = function (name, version) {
        return new Promise(function (resolve, reject) {
            var req = indexedDB.open(name, version);
            req.onsuccess = function () { return resolve(req.result); };
            req.onerror = function () { return reject(req.error); };
        });
    };
    var withStore = function (dbName, storeName, mode, fn) { return __awaiter(void 0, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, openDB(dbName)];
                case 1:
                    db = _a.sent();
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            if (!db.objectStoreNames.contains(storeName)) {
                                db.close();
                                return resolve([]);
                            }
                            var tx = db.transaction(storeName, mode);
                            var store = tx.objectStore(storeName);
                            var req = fn(store, db);
                            tx.oncomplete = function () {
                                db.close();
                                resolve(req ? req.result : undefined);
                            };
                            tx.onerror = function () {
                                db.close();
                                reject(tx.error);
                            };
                        })];
            }
        });
    }); };
    var idb = (function (dbName) { return ({
        // Get database info
        info: function () {
            return __awaiter(this, void 0, void 0, function () {
                var db, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, openDB(dbName)];
                        case 1:
                            db = _a.sent();
                            result = { version: db.version, objectStoreNames: db.objectStoreNames };
                            db.close();
                            return [2 /*return*/, result];
                    }
                });
            });
        },
        // Create or upgrade store
        createStore: function (name, version, options) {
            if (options === void 0) { options = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var opts;
                return __generator(this, function (_a) {
                    opts = __assign({ keyPath: 'id', autoIncrement: true, indices: [] }, options);
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var req = indexedDB.open(dbName, version);
                            req.onupgradeneeded = function (e) {
                                var db = e.target.result;
                                if (!db.objectStoreNames.contains(name)) {
                                    var store_1 = db.createObjectStore(name, { keyPath: opts.keyPath, autoIncrement: opts.autoIncrement });
                                    opts.indices.forEach(function (idx) { return store_1.createIndex(idx, idx); });
                                }
                            };
                            req.onsuccess = function () { req.result.close(); resolve(); };
                            req.onerror = function () { return reject(req.error); };
                        })];
                });
            });
        },
        // CRUD operations
        save: function (store, data) {
            return __awaiter(this, void 0, void 0, function () {
                var items;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            items = Array.isArray(data) ? data : [data];
                            return [4 /*yield*/, withStore(dbName, store, 'readwrite', function (s) {
                                    items.forEach(function (item) { return s.add(item); });
                                })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, data];
                    }
                });
            });
        },
        get: function (store, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, withStore(dbName, store, 'readonly', function (s) { return s.get(id); })];
                });
            });
        },
        all: function (store) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, withStore(dbName, store, 'readonly', function (s) { return s.getAll(); })];
                });
            });
        },
        update: function (store, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, withStore(dbName, store, 'readwrite', function (s) { return s.put(data); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, data];
                    }
                });
            });
        },
        delete: function (store, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, withStore(dbName, store, 'readwrite', function (s) { return s.delete(id); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        clear: function (store) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, withStore(dbName, store, 'readwrite', function (s) { return s.clear(); })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        },
        count: function (store) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, withStore(dbName, store, 'readonly', function (s) { return s.count(); })];
                });
            });
        },
        // Query with options
        find: function (store, options) {
            if (options === void 0) { options = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var index, value, _a, limit, _b, reverse, db;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            index = options.index, value = options.value, _a = options.limit, limit = _a === void 0 ? 1000 : _a, _b = options.reverse, reverse = _b === void 0 ? false : _b;
                            return [4 /*yield*/, openDB(dbName)];
                        case 1:
                            db = _c.sent();
                            return [2 /*return*/, new Promise(function (resolve, reject) {
                                    if (!db.objectStoreNames.contains(store)) {
                                        db.close();
                                        return resolve([]);
                                    }
                                    var tx = db.transaction(store, 'readonly');
                                    var s = tx.objectStore(store);
                                    var source = index ? s.index(index) : s;
                                    var range = value !== undefined ? IDBKeyRange.only(value) : undefined;
                                    var req = source.openCursor(range, reverse ? 'prev' : 'next');
                                    var results = [];
                                    req.onsuccess = function () {
                                        var cursor = req.result;
                                        if (cursor && results.length < limit) {
                                            results.push(cursor.value);
                                            cursor.continue();
                                        }
                                        else {
                                            db.close();
                                            resolve(results);
                                        }
                                    };
                                    tx.onerror = function () { db.close(); reject(tx.error); };
                                })];
                    }
                });
            });
        }
    }); });

    // Ripple effect - Material Design style touch feedback
    var RIPPLE_CSS = "\n[data-ripple] .ripple {\n    position: absolute;\n    border-radius: 50%;\n    background: currentColor;\n    opacity: 0.1;\n    transform: scale(0);\n    pointer-events: none;\n}\n[data-ripple] .ripple.animate {\n    animation: ripple 1s ease-out;\n}\n@keyframes ripple {\n    to { transform: scale(4); opacity: 0; }\n}\n";
    var withRipple = function (component) {
        injectCSS('base-ripple', RIPPLE_CSS);
        component.el.setAttribute('data-ripple', '');
        var createRipple = function (x, y) {
            var ripple = Base('span');
            ripple.el.className = 'ripple';
            var rect = component.el.getBoundingClientRect();
            var size = Math.max(rect.width, rect.height) * 2;
            ripple.style({
                width: size + 'px',
                height: size + 'px',
                left: (x - rect.left - size / 2) + 'px',
                top: (y - rect.top - size / 2) + 'px'
            });
            component.el.appendChild(ripple.el);
            ripple.el.classList.add('animate');
            setTimeout(function () { return ripple.el.remove(); }, 600);
        };
        component.el.addEventListener('touchstart', function (e) {
            createRipple(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });
        component.el.addEventListener('mousedown', function (e) {
            createRipple(e.clientX, e.clientY);
        });
        return component;
    };

    var styles$4 = {"base":"index-module_base__rXtGy"};

    var Card = function () {
        var base = Div();
        // Static styles from CSS class
        base.addClass(styles$4.base);
        base.text('Card');
        // Example: hover effect with JS (if needed dynamically)
        base.el.onmouseenter = function () { return base.style({ transform: 'translateY(-4px)' }); };
        base.el.onmouseleave = function () { return base.style({ transform: 'translateY(0)' }); };
        return base;
    };

    var HomePage = function () {
        var page = Page();
        var card = Card();
        page.append(card);
        return page;
    };

    var PageHeader = function (title) {
        if (title === void 0) { title = ''; }
        var base = Div(title);
        base.style({
            zIndex: '2',
            height: '60px',
            backgroundColor: '#fff',
            // boxShadow: '0 0 6px #00000020',
            fontSize: '22px',
            fontWeight: 'bold',
            padding: '18px 60px 17px 0px',
            transition: 'all .24s',
        });
        return Object.assign(base, {
            toggleShadow: function (v) {
                base.style({ boxShadow: v > 10 ? '#00000012 0px 5px 8px' : '#00000000 0px 5px 8px' });
            },
        });
    };

    var AboutPage = function () {
        var page = Page();
        var title = PageHeader('About');
        page.append(title);
        return page;
    };

    var styles$3 = {"base":"index-module_base__kNkLX"};

    var MenuItem = function (title, target) {
        var base = Div(title);
        base.el.onclick = function () { return setTimeout(function () { return router.goto(target); }, 100); };
        withRipple(base);
        base.on('mounted', function () {
            console.log('mounted');
        });
        base.on('unmounted', function () {
            console.log('unmounted');
        });
        base.addClass(styles$3.base);
        return base;
    };

    var MenuPage = function () {
        var page = Page();
        var title = PageHeader('Menu');
        var about = MenuItem('About', '/about');
        var login = MenuItem('Login', '/login');
        page.append(title, about, login);
        page.on('exit', function () {
            console.log('exit');
            setTimeout(function () {
                console.log('removed');
                page.remove();
            }, 1000);
        });
        return page;
    };

    var styles$2 = {"base":"index-module_base__MiEBX","visible":"index-module_visible__tHN6J","hidden":"index-module_hidden__YjPAz","bar":"index-module_bar__g6CkR","barTop":"index-module_barTop__JozRQ","barBottom":"index-module_barBottom__ZBrU-"};

    var BackIcon = function () {
        var base = Base();
        var top = Base('div');
        var bottom = Base('div');
        top.addClass(styles$2.bar, styles$2.barTop);
        bottom.addClass(styles$2.bar, styles$2.barBottom);
        base.addClass(styles$2.base);
        base.append(top, bottom);
        base.el.onclick = function () { return router.back(); };
        router.on('change', function (_a) {
            var path = _a.path;
            path === '/' ? hide() : show();
        });
        function show() {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, waitFor(200)];
                        case 1:
                            _a.sent();
                            base.addClass(styles$2.visible);
                            base.removeClass(styles$2.hidden);
                            return [2 /*return*/];
                    }
                });
            });
        }
        function hide() {
            base.removeClass(styles$2.visible);
            base.addClass(styles$2.hidden);
        }
        return base;
    };

    var styles$1 = {"bar":"bar-module_bar__KHOpe"};

    var Bar = function (height) {
        var base = Base('div');
        base.addClass(styles$1.bar);
        base.style({ height: "".concat(height, "px") });
        return base;
    };

    var styles = {"base":"index-module_base__Lot4e","hidden":"index-module_hidden__6LNbu"};

    var MenuIcon = function () {
        var base = Base();
        var top = Bar(4);
        var middle = Bar(4);
        var bottom = Bar(4);
        base.addClass(styles.base);
        base.append(top, middle, bottom);
        top.style({ width: '50%' });
        bottom.style({ width: '80%' });
        base.el.onclick = function () { return router.goto('/menu'); };
        router.on('change', function (_a) {
            var path = _a.path;
            path.split('?')[0] === '/' ? show() : hide();
        });
        function show() {
            base.removeClass(styles.hidden);
        }
        function hide() {
            base.addClass(styles.hidden);
        }
        return base;
    };

    var view = Div();
    var app = Div();
    var menuIcon = MenuIcon();
    var backIcon = BackIcon();
    app.style({
        position: 'fixed',
        right: '0',
        top: '0',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
    });
    app.append(menuIcon, backIcon, view);
    // Configure routes - all pages stay in DOM, visibility toggles
    router.routes({
        '/': HomePage,
        '/menu': MenuPage,
        '/about': AboutPage,
    }, view);

    var db = idb('db');
    var init = function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a, version, objectStoreNames;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!ldb.get('init'))
                        ldb.save('init', true);
                    return [4 /*yield*/, db.info()];
                case 1:
                    _a = _b.sent(), version = _a.version, objectStoreNames = _a.objectStoreNames;
                    if (!!objectStoreNames.contains('clients')) return [3 /*break*/, 3];
                    return [4 /*yield*/, db.createStore('clients', version + 1, {
                            keyPath: 'temp_id', indices: [
                                'id',
                                'user_id',
                                'created_at',
                                'updated_at',
                                'name',
                                'contact',
                                'synced',
                                'deleted',
                                'notifications_enabled'
                            ]
                        })];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    if (!!objectStoreNames.contains('appointments')) return [3 /*break*/, 5];
                    return [4 /*yield*/, db.createStore('appointments', version + 2, {
                            keyPath: 'temp_id', indices: [
                                'id',
                                'user_id',
                                'created_at',
                                'updated_at',
                                'date',
                                'client_id',
                                'synced',
                                'deleted',
                            ]
                        })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    if (!!objectStoreNames.contains('businesses')) return [3 /*break*/, 7];
                    return [4 /*yield*/, db.createStore('businesses', version + 3, {
                            keyPath: 'temp_id', indices: [
                                'id',
                                'user_id',
                                'name',
                                'created_at',
                                'updated_at',
                                'synced',
                                'deleted',
                            ]
                        })];
                case 6:
                    _b.sent();
                    _b.label = 7;
                case 7:
                    if (!!objectStoreNames.contains('transactions')) return [3 /*break*/, 9];
                    return [4 /*yield*/, db.createStore('transactions', version + 4, {
                            keyPath: 'temp_id',
                            indices: [
                                'id',
                                'user_id',
                                'business_id',
                                'created_at',
                                'updated_at',
                                'type',
                                'category',
                                'amount',
                                'date',
                                'client_id',
                                'reference_id',
                                'synced',
                                'deleted',
                            ]
                        })];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9:
                    emitter$1.emit('db-ready');
                    return [2 /*return*/, true];
            }
        });
    }); };
    var db$1 = __assign(__assign({}, db), { init: init });

    (function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db$1.init()];
                case 1:
                    _a.sent();
                    document.body.appendChild(app.el);
                    if (!ldb.get('app-id'))
                        ldb.set('app-id', crypto.randomUUID());
                    return [2 /*return*/];
            }
        });
    }); })();

})();
//# sourceMappingURL=bundle.js.map
