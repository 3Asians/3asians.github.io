
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function claim_element(nodes, name, attributes, svg) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeName === name) {
                let j = 0;
                const remove = [];
                while (j < node.attributes.length) {
                    const attribute = node.attributes[j++];
                    if (!attributes[attribute.name]) {
                        remove.push(attribute.name);
                    }
                }
                for (let k = 0; k < remove.length; k++) {
                    node.removeAttribute(remove[k]);
                }
                return nodes.splice(i, 1)[0];
            }
        }
        return svg ? svg_element(name) : element(name);
    }
    function claim_text(nodes, data) {
        for (let i = 0; i < nodes.length; i += 1) {
            const node = nodes[i];
            if (node.nodeType === 3) {
                node.data = '' + data;
                return nodes.splice(i, 1)[0];
            }
        }
        return text(data);
    }
    function claim_space(nodes) {
        return claim_text(nodes, ' ');
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function claim_component(block, parent_nodes) {
        block && block.l(parent_nodes);
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.29.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    /* node_modules\svelte-routing\src\Router.svelte generated by Svelte v3.29.0 */

    function create_fragment(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[5], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $base;
    	let $location;
    	let $routes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, "routes");
    	component_subscribe($$self, routes, value => $$invalidate(10, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(9, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(8, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ["basepath", "url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$base,
    		$location,
    		$routes
    	});

    	$$self.$inject_state = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 256) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			 {
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 1536) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			 {
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [routes, location, base, basepath, url, $$scope, slots];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Route.svelte generated by Svelte v3.29.0 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 2,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[1],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			if (default_slot) default_slot.l(nodes);
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, routeParams, $location*/ 530) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[1],
    		/*routeProps*/ ctx[2]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 22)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 2 && get_spread_object(/*routeParams*/ ctx[1]),
    					dirty & /*routeProps*/ 4 && get_spread_object(/*routeProps*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[3] !== null && /*$activeRoute*/ ctx[3].route === /*route*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			if (if_block) if_block.l(nodes);
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[3] !== null && /*$activeRoute*/ ctx[3].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Route", slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(3, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("path" in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("routeParams" in $$props) $$invalidate(1, routeParams = $$new_props.routeParams);
    		if ("routeProps" in $$props) $$invalidate(2, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 8) {
    			 if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(1, routeParams = $activeRoute.params);
    			}
    		}

    		 {
    			const { path, component, ...rest } = $$props;
    			$$invalidate(2, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelte-routing\src\Link.svelte generated by Svelte v3.29.0 */
    const file = "node_modules\\svelte-routing\\src\\Link.svelte";

    function create_fragment$2(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			this.h();
    		},
    		l: function claim(nodes) {
    			a = claim_element(nodes, "A", { href: true, "aria-current": true });
    			var a_nodes = children(a);
    			if (default_slot) default_slot.l(a_nodes);
    			a_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			set_attributes(a, a_data);
    			add_location(a, file, 40, 0, 1249);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 1024) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[10], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $base;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Link", slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(14, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	const writable_props = ["to", "replace", "state", "getProps"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("to" in $$props) $$invalidate(6, to = $$props.to);
    		if ("replace" in $$props) $$invalidate(7, replace = $$props.replace);
    		if ("state" in $$props) $$invalidate(8, state = $$props.state);
    		if ("getProps" in $$props) $$invalidate(9, getProps = $$props.getProps);
    		if ("$$scope" in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		$base,
    		$location,
    		ariaCurrent
    	});

    	$$self.$inject_state = $$props => {
    		if ("to" in $$props) $$invalidate(6, to = $$props.to);
    		if ("replace" in $$props) $$invalidate(7, replace = $$props.replace);
    		if ("state" in $$props) $$invalidate(8, state = $$props.state);
    		if ("getProps" in $$props) $$invalidate(9, getProps = $$props.getProps);
    		if ("href" in $$props) $$invalidate(0, href = $$props.href);
    		if ("isPartiallyCurrent" in $$props) $$invalidate(12, isPartiallyCurrent = $$props.isPartiallyCurrent);
    		if ("isCurrent" in $$props) $$invalidate(13, isCurrent = $$props.isCurrent);
    		if ("props" in $$props) $$invalidate(1, props = $$props.props);
    		if ("ariaCurrent" in $$props) $$invalidate(2, ariaCurrent = $$props.ariaCurrent);
    	};

    	let ariaCurrent;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 16448) {
    			 $$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 32769) {
    			 $$invalidate(12, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 32769) {
    			 $$invalidate(13, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 8192) {
    			 $$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 45569) {
    			 $$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { to: 6, replace: 7, state: 8, getProps: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\pages\Home.svelte generated by Svelte v3.29.0 */
    const file$1 = "src\\pages\\Home.svelte";

    function create_fragment$3(ctx) {
    	let main;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let article;
    	let p0;
    	let t2;
    	let t3;
    	let input;
    	let t4;
    	let footer;
    	let p1;
    	let t5;
    	let t6;
    	let t7;

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*appName*/ ctx[0]);
    			t1 = space();
    			article = element("article");
    			p0 = element("p");
    			t2 = text("Click the button to find lists of food");
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			footer = element("footer");
    			p1 = element("p");
    			t5 = text("© ");
    			t6 = text(/*appName*/ ctx[0]);
    			t7 = text(" 2020");
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", {});
    			var main_nodes = children(main);
    			header = claim_element(main_nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			h1 = claim_element(header_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, /*appName*/ ctx[0]);
    			h1_nodes.forEach(detach_dev);
    			header_nodes.forEach(detach_dev);
    			t1 = claim_space(main_nodes);
    			article = claim_element(main_nodes, "ARTICLE", { class: true });
    			var article_nodes = children(article);
    			p0 = claim_element(article_nodes, "P", {});
    			var p0_nodes = children(p0);
    			t2 = claim_text(p0_nodes, "Click the button to find lists of food");
    			p0_nodes.forEach(detach_dev);
    			t3 = claim_space(article_nodes);

    			input = claim_element(article_nodes, "INPUT", {
    				type: true,
    				value: true,
    				onclick: true,
    				class: true
    			});

    			article_nodes.forEach(detach_dev);
    			t4 = claim_space(main_nodes);
    			footer = claim_element(main_nodes, "FOOTER", { class: true });
    			var footer_nodes = children(footer);
    			p1 = claim_element(footer_nodes, "P", { class: true });
    			var p1_nodes = children(p1);
    			t5 = claim_text(p1_nodes, "© ");
    			t6 = claim_text(p1_nodes, /*appName*/ ctx[0]);
    			t7 = claim_text(p1_nodes, " 2020");
    			p1_nodes.forEach(detach_dev);
    			footer_nodes.forEach(detach_dev);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "font-bold text-4xl");
    			add_location(h1, file$1, 8, 8, 144);
    			attr_dev(header, "class", "text-center");
    			add_location(header, file$1, 7, 4, 106);
    			add_location(p0, file$1, 11, 4, 245);
    			attr_dev(input, "type", "button");
    			input.value = "Find food";
    			attr_dev(input, "onclick", "location.href='/list'");
    			attr_dev(input, "class", "bg-white m-4 py-20 px-8 hover:bg-gray-200 text-red-600 font-semibold border-4 border-red-500 shadow items shadow-2xl");
    			add_location(input, file$1, 12, 8, 300);
    			attr_dev(article, "class", "text-center");
    			add_location(article, file$1, 10, 4, 210);
    			attr_dev(p1, "class", "copy");
    			add_location(p1, file$1, 15, 8, 565);
    			attr_dev(footer, "class", "text-center py-8 px-8");
    			add_location(footer, file$1, 14, 4, 517);
    			add_location(main, file$1, 6, 0, 94);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(main, t1);
    			append_dev(main, article);
    			append_dev(article, p0);
    			append_dev(p0, t2);
    			append_dev(article, t3);
    			append_dev(article, input);
    			append_dev(main, t4);
    			append_dev(main, footer);
    			append_dev(footer, p1);
    			append_dev(p1, t5);
    			append_dev(p1, t6);
    			append_dev(p1, t7);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	let appName = "FoodApp";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ appName, onMount });

    	$$self.$inject_state = $$props => {
    		if ("appName" in $$props) $$invalidate(0, appName = $$props.appName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [appName];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\pages\Signin.svelte generated by Svelte v3.29.0 */
    const file$2 = "src\\pages\\Signin.svelte";

    // (24:28) <Link to="forgotPass">
    function create_default_slot_1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Forgot password?");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Forgot password?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(24:28) <Link to=\\\"forgotPass\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:28) <Link to="signup">
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Don't have account?");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Don't have account?");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(25:28) <Link to=\\\"signup\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let main;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let article;
    	let form;
    	let label1;
    	let t2;
    	let input0;
    	let t3;
    	let label0;
    	let t4;
    	let input1;
    	let br;
    	let t5;
    	let button;
    	let t6;
    	let t7;
    	let p0;
    	let link0;
    	let t8;
    	let p1;
    	let link1;
    	let current;
    	let mounted;
    	let dispose;

    	link0 = new Link({
    			props: {
    				to: "forgotPass",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "signup",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*pageName*/ ctx[2]);
    			t1 = space();
    			article = element("article");
    			form = element("form");
    			label1 = element("label");
    			t2 = text("Username:\r\n            ");
    			input0 = element("input");
    			t3 = space();
    			label0 = element("label");
    			t4 = text("Password:\r\n            ");
    			input1 = element("input");
    			br = element("br");
    			t5 = space();
    			button = element("button");
    			t6 = text("Sign in");
    			t7 = space();
    			p0 = element("p");
    			create_component(link0.$$.fragment);
    			t8 = space();
    			p1 = element("p");
    			create_component(link1.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", {});
    			var main_nodes = children(main);
    			header = claim_element(main_nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			h1 = claim_element(header_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, /*pageName*/ ctx[2]);
    			h1_nodes.forEach(detach_dev);
    			header_nodes.forEach(detach_dev);
    			t1 = claim_space(main_nodes);
    			article = claim_element(main_nodes, "ARTICLE", {});
    			var article_nodes = children(article);
    			form = claim_element(article_nodes, "FORM", {});
    			var form_nodes = children(form);
    			label1 = claim_element(form_nodes, "LABEL", {});
    			var label1_nodes = children(label1);
    			t2 = claim_text(label1_nodes, "Username:\r\n            ");
    			input0 = claim_element(label1_nodes, "INPUT", { class: true, name: true, required: true });
    			t3 = claim_space(label1_nodes);
    			label0 = claim_element(label1_nodes, "LABEL", {});
    			var label0_nodes = children(label0);
    			t4 = claim_text(label0_nodes, "Password:\r\n            ");

    			input1 = claim_element(label0_nodes, "INPUT", {
    				class: true,
    				name: true,
    				required: true,
    				type: true
    			});

    			br = claim_element(label0_nodes, "BR", {});
    			t5 = claim_space(label0_nodes);
    			button = claim_element(label0_nodes, "BUTTON", { class: true, type: true });
    			var button_nodes = children(button);
    			t6 = claim_text(button_nodes, "Sign in");
    			button_nodes.forEach(detach_dev);
    			t7 = claim_space(label0_nodes);
    			p0 = claim_element(label0_nodes, "P", { class: true });
    			var p0_nodes = children(p0);
    			claim_component(link0.$$.fragment, p0_nodes);
    			p0_nodes.forEach(detach_dev);
    			t8 = claim_space(label0_nodes);
    			p1 = claim_element(label0_nodes, "P", { class: true });
    			var p1_nodes = children(p1);
    			claim_component(link1.$$.fragment, p1_nodes);
    			p1_nodes.forEach(detach_dev);
    			label0_nodes.forEach(detach_dev);
    			label1_nodes.forEach(detach_dev);
    			form_nodes.forEach(detach_dev);
    			article_nodes.forEach(detach_dev);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "font-bold text-4xl");
    			add_location(h1, file$2, 11, 8, 253);
    			attr_dev(header, "class", "header");
    			add_location(header, file$2, 10, 4, 220);
    			attr_dev(input0, "class", "my-2 p-1");
    			attr_dev(input0, "name", "user");
    			input0.required = true;
    			add_location(input0, file$2, 16, 12, 431);
    			attr_dev(input1, "class", "my-2 p-1");
    			attr_dev(input1, "name", "password");
    			input1.required = true;
    			attr_dev(input1, "type", "password");
    			add_location(input1, file$2, 19, 12, 550);
    			add_location(br, file$2, 19, 101, 639);
    			attr_dev(button, "class", "bg-gray-200 my-3 hover:bg-gray-300 text-gray-800 py-2 px-2 border border-gray-400 shadow");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$2, 21, 12, 659);
    			attr_dev(p0, "class", "my-3");
    			add_location(p0, file$2, 23, 12, 810);
    			attr_dev(p1, "class", "my-3");
    			add_location(p1, file$2, 24, 12, 889);
    			add_location(label0, file$2, 18, 12, 520);
    			add_location(label1, file$2, 15, 12, 401);
    			add_location(form, file$2, 14, 8, 341);
    			add_location(article, file$2, 13, 4, 322);
    			add_location(main, file$2, 9, 0, 206);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(main, t1);
    			append_dev(main, article);
    			append_dev(article, form);
    			append_dev(form, label1);
    			append_dev(label1, t2);
    			append_dev(label1, input0);
    			set_input_value(input0, /*user*/ ctx[0]);
    			append_dev(label1, t3);
    			append_dev(label1, label0);
    			append_dev(label0, t4);
    			append_dev(label0, input1);
    			set_input_value(input1, /*password*/ ctx[1]);
    			append_dev(label0, br);
    			append_dev(label0, t5);
    			append_dev(label0, button);
    			append_dev(button, t6);
    			append_dev(label0, t7);
    			append_dev(label0, p0);
    			mount_component(link0, p0, null);
    			append_dev(label0, t8);
    			append_dev(label0, p1);
    			mount_component(link1, p1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[4]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[5]),
    					listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[3]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*user*/ 1 && input0.value !== /*user*/ ctx[0]) {
    				set_input_value(input0, /*user*/ ctx[0]);
    			}

    			if (dirty & /*password*/ 2 && input1.value !== /*password*/ ctx[1]) {
    				set_input_value(input1, /*password*/ ctx[1]);
    			}

    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 128) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(link0);
    			destroy_component(link1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Signin", slots, []);
    	let pageName = "Sign in";
    	let user = "";
    	let password = "";
    	let isSuccess = false;

    	const handleSubmit = () => {
    		
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Signin> was created with unknown prop '${key}'`);
    	});

    	function input0_input_handler() {
    		user = this.value;
    		$$invalidate(0, user);
    	}

    	function input1_input_handler() {
    		password = this.value;
    		$$invalidate(1, password);
    	}

    	$$self.$capture_state = () => ({
    		pageName,
    		Link,
    		user,
    		password,
    		isSuccess,
    		handleSubmit
    	});

    	$$self.$inject_state = $$props => {
    		if ("pageName" in $$props) $$invalidate(2, pageName = $$props.pageName);
    		if ("user" in $$props) $$invalidate(0, user = $$props.user);
    		if ("password" in $$props) $$invalidate(1, password = $$props.password);
    		if ("isSuccess" in $$props) isSuccess = $$props.isSuccess;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		user,
    		password,
    		pageName,
    		handleSubmit,
    		input0_input_handler,
    		input1_input_handler
    	];
    }

    class Signin extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signin",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\pages\Signout.svelte generated by Svelte v3.29.0 */
    const file$3 = "src\\pages\\Signout.svelte";

    function create_fragment$5(ctx) {
    	let main;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let article;
    	let button;
    	let t2;

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*pageName*/ ctx[0]);
    			t1 = space();
    			article = element("article");
    			button = element("button");
    			t2 = text("Sign out");
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", {});
    			var main_nodes = children(main);
    			header = claim_element(main_nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			h1 = claim_element(header_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, /*pageName*/ ctx[0]);
    			h1_nodes.forEach(detach_dev);
    			header_nodes.forEach(detach_dev);
    			t1 = claim_space(main_nodes);
    			article = claim_element(main_nodes, "ARTICLE", {});
    			var article_nodes = children(article);
    			button = claim_element(article_nodes, "BUTTON", { class: true, onclick: true });
    			var button_nodes = children(button);
    			t2 = claim_text(button_nodes, "Sign out");
    			button_nodes.forEach(detach_dev);
    			article_nodes.forEach(detach_dev);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "font-bold text-4xl");
    			add_location(h1, file$3, 6, 8, 140);
    			attr_dev(header, "class", "header");
    			add_location(header, file$3, 5, 4, 107);
    			attr_dev(button, "class", "bg-blue-400 hover:bg-blue-500 text-white font-semibold py-3 px-3 border border-black rounded shadow items");
    			attr_dev(button, "onclick", "signOut");
    			add_location(button, file$3, 9, 8, 227);
    			add_location(article, file$3, 8, 4, 208);
    			add_location(main, file$3, 4, 0, 93);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(main, t1);
    			append_dev(main, article);
    			append_dev(article, button);
    			append_dev(button, t2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Signout", slots, []);
    	let pageName = "Sign out";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Signout> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ pageName, Link });

    	$$self.$inject_state = $$props => {
    		if ("pageName" in $$props) $$invalidate(0, pageName = $$props.pageName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pageName];
    }

    class Signout extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signout",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\pages\Signup.svelte generated by Svelte v3.29.0 */
    const file$4 = "src\\pages\\Signup.svelte";

    function create_fragment$6(ctx) {
    	let main;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let article;
    	let form;
    	let label0;
    	let t2;
    	let input0;
    	let t3;
    	let label1;
    	let t4;
    	let input1;
    	let t5;
    	let label2;
    	let t6;
    	let input2;
    	let t7;
    	let button;
    	let t8;

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*pageName*/ ctx[0]);
    			t1 = space();
    			article = element("article");
    			form = element("form");
    			label0 = element("label");
    			t2 = text("Email:\r\n                ");
    			input0 = element("input");
    			t3 = space();
    			label1 = element("label");
    			t4 = text("Username:\r\n                ");
    			input1 = element("input");
    			t5 = space();
    			label2 = element("label");
    			t6 = text("Password:\r\n                ");
    			input2 = element("input");
    			t7 = space();
    			button = element("button");
    			t8 = text("Sign up");
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", {});
    			var main_nodes = children(main);
    			header = claim_element(main_nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			h1 = claim_element(header_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, /*pageName*/ ctx[0]);
    			h1_nodes.forEach(detach_dev);
    			header_nodes.forEach(detach_dev);
    			t1 = claim_space(main_nodes);
    			article = claim_element(main_nodes, "ARTICLE", { class: true });
    			var article_nodes = children(article);
    			form = claim_element(article_nodes, "FORM", {});
    			var form_nodes = children(form);
    			label0 = claim_element(form_nodes, "LABEL", {});
    			var label0_nodes = children(label0);
    			t2 = claim_text(label0_nodes, "Email:\r\n                ");

    			input0 = claim_element(label0_nodes, "INPUT", {
    				class: true,
    				name: true,
    				required: true,
    				type: true,
    				placeholder: true
    			});

    			label0_nodes.forEach(detach_dev);
    			t3 = claim_space(form_nodes);
    			label1 = claim_element(form_nodes, "LABEL", {});
    			var label1_nodes = children(label1);
    			t4 = claim_text(label1_nodes, "Username:\r\n                ");
    			input1 = claim_element(label1_nodes, "INPUT", { class: true, name: true, required: true });
    			label1_nodes.forEach(detach_dev);
    			t5 = claim_space(form_nodes);
    			label2 = claim_element(form_nodes, "LABEL", {});
    			var label2_nodes = children(label2);
    			t6 = claim_text(label2_nodes, "Password:\r\n                ");
    			input2 = claim_element(label2_nodes, "INPUT", { class: true, required: true, type: true });
    			label2_nodes.forEach(detach_dev);
    			t7 = claim_space(form_nodes);
    			button = claim_element(form_nodes, "BUTTON", { class: true, type: true });
    			var button_nodes = children(button);
    			t8 = claim_text(button_nodes, "Sign up");
    			button_nodes.forEach(detach_dev);
    			form_nodes.forEach(detach_dev);
    			article_nodes.forEach(detach_dev);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "font-bold text-5xl");
    			add_location(h1, file$4, 6, 8, 139);
    			attr_dev(header, "class", "header");
    			add_location(header, file$4, 5, 4, 106);
    			attr_dev(input0, "class", "my-2 p-1 text-left ");
    			attr_dev(input0, "name", "email");
    			input0.required = true;
    			attr_dev(input0, "type", "email");
    			attr_dev(input0, "placeholder", "food@email.com");
    			add_location(input0, file$4, 11, 16, 290);
    			add_location(label0, file$4, 10, 12, 259);
    			attr_dev(input1, "class", "my-2 p-1");
    			attr_dev(input1, "name", "user");
    			input1.required = true;
    			add_location(input1, file$4, 14, 16, 460);
    			add_location(label1, file$4, 13, 12, 426);
    			attr_dev(input2, "class", "my-2 p-1");
    			input2.required = true;
    			attr_dev(input2, "type", "password");
    			add_location(input2, file$4, 17, 16, 576);
    			add_location(label2, file$4, 16, 12, 542);
    			attr_dev(button, "class", "bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-2 border border-gray-400 shadow");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$4, 20, 12, 676);
    			add_location(form, file$4, 9, 8, 239);
    			attr_dev(article, "class", "my-3");
    			add_location(article, file$4, 8, 4, 207);
    			add_location(main, file$4, 4, 0, 92);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(main, t1);
    			append_dev(main, article);
    			append_dev(article, form);
    			append_dev(form, label0);
    			append_dev(label0, t2);
    			append_dev(label0, input0);
    			append_dev(form, t3);
    			append_dev(form, label1);
    			append_dev(label1, t4);
    			append_dev(label1, input1);
    			append_dev(form, t5);
    			append_dev(form, label2);
    			append_dev(label2, t6);
    			append_dev(label2, input2);
    			append_dev(form, t7);
    			append_dev(form, button);
    			append_dev(button, t8);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Signup", slots, []);
    	let pageName = "Sign up";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Signup> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ pageName, Link });

    	$$self.$inject_state = $$props => {
    		if ("pageName" in $$props) $$invalidate(0, pageName = $$props.pageName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pageName];
    }

    class Signup extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Signup",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\pages\About.svelte generated by Svelte v3.29.0 */

    const file$5 = "src\\pages\\About.svelte";

    function create_fragment$7(ctx) {
    	let main;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let article;
    	let h20;
    	let t2;
    	let t3;
    	let p0;
    	let t4;
    	let t5;
    	let h21;
    	let t6;
    	let t7;
    	let p1;
    	let t8;
    	let aside;
    	let h40;
    	let t9;
    	let t10;
    	let h41;
    	let t11;
    	let t12;
    	let h42;
    	let t13;
    	let t14;
    	let footer;
    	let p2;
    	let t15;
    	let t16;
    	let t17;

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*pageName*/ ctx[1]);
    			t1 = space();
    			article = element("article");
    			h20 = element("h2");
    			t2 = text("Our story");
    			t3 = space();
    			p0 = element("p");
    			t4 = text("We are students from Technical College");
    			t5 = space();
    			h21 = element("h2");
    			t6 = text("About web");
    			t7 = space();
    			p1 = element("p");
    			t8 = space();
    			aside = element("aside");
    			h40 = element("h4");
    			t9 = text("Phone");
    			t10 = space();
    			h41 = element("h4");
    			t11 = text("Email");
    			t12 = space();
    			h42 = element("h4");
    			t13 = text("Github");
    			t14 = space();
    			footer = element("footer");
    			p2 = element("p");
    			t15 = text("© ");
    			t16 = text(/*appName*/ ctx[0]);
    			t17 = text(" 2020");
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", {});
    			var main_nodes = children(main);
    			header = claim_element(main_nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			h1 = claim_element(header_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, /*pageName*/ ctx[1]);
    			h1_nodes.forEach(detach_dev);
    			header_nodes.forEach(detach_dev);
    			t1 = claim_space(main_nodes);
    			article = claim_element(main_nodes, "ARTICLE", {});
    			var article_nodes = children(article);
    			h20 = claim_element(article_nodes, "H2", { class: true });
    			var h20_nodes = children(h20);
    			t2 = claim_text(h20_nodes, "Our story");
    			h20_nodes.forEach(detach_dev);
    			t3 = claim_space(article_nodes);
    			p0 = claim_element(article_nodes, "P", {});
    			var p0_nodes = children(p0);
    			t4 = claim_text(p0_nodes, "We are students from Technical College");
    			p0_nodes.forEach(detach_dev);
    			t5 = claim_space(article_nodes);
    			h21 = claim_element(article_nodes, "H2", { class: true });
    			var h21_nodes = children(h21);
    			t6 = claim_text(h21_nodes, "About web");
    			h21_nodes.forEach(detach_dev);
    			t7 = claim_space(article_nodes);
    			p1 = claim_element(article_nodes, "P", {});
    			children(p1).forEach(detach_dev);
    			article_nodes.forEach(detach_dev);
    			t8 = claim_space(main_nodes);
    			aside = claim_element(main_nodes, "ASIDE", {});
    			var aside_nodes = children(aside);
    			h40 = claim_element(aside_nodes, "H4", { class: true });
    			var h40_nodes = children(h40);
    			t9 = claim_text(h40_nodes, "Phone");
    			h40_nodes.forEach(detach_dev);
    			t10 = claim_space(aside_nodes);
    			h41 = claim_element(aside_nodes, "H4", { class: true });
    			var h41_nodes = children(h41);
    			t11 = claim_text(h41_nodes, "Email");
    			h41_nodes.forEach(detach_dev);
    			t12 = claim_space(aside_nodes);
    			h42 = claim_element(aside_nodes, "H4", { class: true });
    			var h42_nodes = children(h42);
    			t13 = claim_text(h42_nodes, "Github");
    			h42_nodes.forEach(detach_dev);
    			aside_nodes.forEach(detach_dev);
    			t14 = claim_space(main_nodes);
    			footer = claim_element(main_nodes, "FOOTER", { class: true });
    			var footer_nodes = children(footer);
    			p2 = claim_element(footer_nodes, "P", { class: true });
    			var p2_nodes = children(p2);
    			t15 = claim_text(p2_nodes, "© ");
    			t16 = claim_text(p2_nodes, /*appName*/ ctx[0]);
    			t17 = claim_text(p2_nodes, " 2020");
    			p2_nodes.forEach(detach_dev);
    			footer_nodes.forEach(detach_dev);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "font-bold text-4xl");
    			add_location(h1, file$5, 7, 8, 125);
    			attr_dev(header, "class", "header");
    			add_location(header, file$5, 6, 4, 92);
    			attr_dev(h20, "class", "font-bold text-2xl my-4");
    			add_location(h20, file$5, 10, 8, 213);
    			add_location(p0, file$5, 11, 8, 273);
    			attr_dev(h21, "class", "font-bold text-2xl my-4");
    			add_location(h21, file$5, 12, 8, 328);
    			add_location(p1, file$5, 13, 8, 388);
    			add_location(article, file$5, 9, 4, 194);
    			attr_dev(h40, "class", "font-bold text-lg my-4");
    			add_location(h40, file$5, 16, 8, 434);
    			attr_dev(h41, "class", "font-bold text-lg my-4");
    			add_location(h41, file$5, 17, 8, 489);
    			attr_dev(h42, "class", "font-bold text-lg my-4");
    			add_location(h42, file$5, 18, 8, 544);
    			add_location(aside, file$5, 15, 4, 417);
    			attr_dev(p2, "class", "copy");
    			add_location(p2, file$5, 21, 8, 643);
    			attr_dev(footer, "class", "footer");
    			add_location(footer, file$5, 20, 4, 610);
    			add_location(main, file$5, 5, 0, 80);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(main, t1);
    			append_dev(main, article);
    			append_dev(article, h20);
    			append_dev(h20, t2);
    			append_dev(article, t3);
    			append_dev(article, p0);
    			append_dev(p0, t4);
    			append_dev(article, t5);
    			append_dev(article, h21);
    			append_dev(h21, t6);
    			append_dev(article, t7);
    			append_dev(article, p1);
    			append_dev(main, t8);
    			append_dev(main, aside);
    			append_dev(aside, h40);
    			append_dev(h40, t9);
    			append_dev(aside, t10);
    			append_dev(aside, h41);
    			append_dev(h41, t11);
    			append_dev(aside, t12);
    			append_dev(aside, h42);
    			append_dev(h42, t13);
    			append_dev(main, t14);
    			append_dev(main, footer);
    			append_dev(footer, p2);
    			append_dev(p2, t15);
    			append_dev(p2, t16);
    			append_dev(p2, t17);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("About", slots, []);
    	let appName = "FoodApp";
    	let pageName = "About";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<About> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ appName, pageName });

    	$$self.$inject_state = $$props => {
    		if ("appName" in $$props) $$invalidate(0, appName = $$props.appName);
    		if ("pageName" in $$props) $$invalidate(1, pageName = $$props.pageName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [appName, pageName];
    }

    class About extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "About",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\pages\Map.svelte generated by Svelte v3.29.0 */
    const file$6 = "src\\pages\\Map.svelte";

    function create_fragment$8(ctx) {
    	let main;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let div;

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*pageName*/ ctx[0]);
    			t1 = space();
    			div = element("div");
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", {});
    			var main_nodes = children(main);
    			header = claim_element(main_nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			h1 = claim_element(header_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, /*pageName*/ ctx[0]);
    			h1_nodes.forEach(detach_dev);
    			header_nodes.forEach(detach_dev);
    			t1 = claim_space(main_nodes);
    			div = claim_element(main_nodes, "DIV", { id: true });
    			children(div).forEach(detach_dev);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "font-bold text-4xl");
    			add_location(h1, file$6, 23, 8, 584);
    			attr_dev(header, "class", "header");
    			add_location(header, file$6, 22, 4, 551);
    			attr_dev(div, "id", "map");
    			add_location(div, file$6, 25, 4, 652);
    			add_location(main, file$6, 21, 0, 537);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(main, t1);
    			append_dev(main, div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function initMap() {
    	// The location of Uluru
    	const uluru = { lat: -25.344, lng: 131.036 };

    	// The map, centered at Uluru
    	const map = new google.maps.Map(document.getElementById("map"), { zoom: 4, center: uluru });

    	// The marker, positioned at Uluru
    	const marker = new google.maps.Marker({ position: uluru, map });
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Map", slots, []);
    	let pageName = "Map";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Map> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ pageName, Link, initMap });

    	$$self.$inject_state = $$props => {
    		if ("pageName" in $$props) $$invalidate(0, pageName = $$props.pageName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pageName];
    }

    class Map$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Map",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\pages\List.svelte generated by Svelte v3.29.0 */
    const file$7 = "src\\pages\\List.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (13:8) {:else}
    function create_else_block$1(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text("loading...");
    			this.h();
    		},
    		l: function claim(nodes) {
    			p = claim_element(nodes, "P", {});
    			var p_nodes = children(p);
    			t = claim_text(p_nodes, "loading...");
    			p_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(p, file$7, 13, 8, 503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(13:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (6:8) {#each restaurants as restaurant}
    function create_each_block(ctx) {
    	let ul;
    	let li0;
    	let b;
    	let t0_value = /*restaurant*/ ctx[2].RestaurantName + "";
    	let t0;
    	let t1;
    	let li1;
    	let t2;
    	let t3_value = /*restaurant*/ ctx[2].RestaurantCategory + "";
    	let t3;
    	let t4;
    	let li2;
    	let t5;
    	let t6_value = /*restaurant*/ ctx[2].RestaurantDistance + "";
    	let t6;
    	let t7;
    	let t8;
    	let li3;
    	let img;
    	let img_src_value;
    	let t9;

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			b = element("b");
    			t0 = text(t0_value);
    			t1 = space();
    			li1 = element("li");
    			t2 = text("Category: ");
    			t3 = text(t3_value);
    			t4 = space();
    			li2 = element("li");
    			t5 = text("Distance: ");
    			t6 = text(t6_value);
    			t7 = text("km");
    			t8 = space();
    			li3 = element("li");
    			img = element("img");
    			t9 = space();
    			this.h();
    		},
    		l: function claim(nodes) {
    			ul = claim_element(nodes, "UL", {});
    			var ul_nodes = children(ul);
    			li0 = claim_element(ul_nodes, "LI", {});
    			var li0_nodes = children(li0);
    			b = claim_element(li0_nodes, "B", {});
    			var b_nodes = children(b);
    			t0 = claim_text(b_nodes, t0_value);
    			b_nodes.forEach(detach_dev);
    			li0_nodes.forEach(detach_dev);
    			t1 = claim_space(ul_nodes);
    			li1 = claim_element(ul_nodes, "LI", {});
    			var li1_nodes = children(li1);
    			t2 = claim_text(li1_nodes, "Category: ");
    			t3 = claim_text(li1_nodes, t3_value);
    			li1_nodes.forEach(detach_dev);
    			t4 = claim_space(ul_nodes);
    			li2 = claim_element(ul_nodes, "LI", {});
    			var li2_nodes = children(li2);
    			t5 = claim_text(li2_nodes, "Distance: ");
    			t6 = claim_text(li2_nodes, t6_value);
    			t7 = claim_text(li2_nodes, "km");
    			li2_nodes.forEach(detach_dev);
    			t8 = claim_space(ul_nodes);
    			li3 = claim_element(ul_nodes, "LI", {});
    			var li3_nodes = children(li3);
    			img = claim_element(li3_nodes, "IMG", { src: true, alt: true, width: true });
    			li3_nodes.forEach(detach_dev);
    			t9 = claim_space(ul_nodes);
    			ul_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			add_location(b, file$7, 7, 16, 208);
    			add_location(li0, file$7, 7, 12, 204);
    			add_location(li1, file$7, 8, 12, 261);
    			add_location(li2, file$7, 9, 12, 325);
    			if (img.src !== (img_src_value = /*restaurant*/ ctx[2].RestaurantImage)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "img");
    			attr_dev(img, "width", "500");
    			add_location(img, file$7, 10, 16, 395);
    			add_location(li3, file$7, 10, 12, 391);
    			add_location(ul, file$7, 6, 8, 186);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, b);
    			append_dev(b, t0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, t2);
    			append_dev(li1, t3);
    			append_dev(ul, t4);
    			append_dev(ul, li2);
    			append_dev(li2, t5);
    			append_dev(li2, t6);
    			append_dev(li2, t7);
    			append_dev(ul, t8);
    			append_dev(ul, li3);
    			append_dev(li3, img);
    			append_dev(ul, t9);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*restaurants*/ 1 && t0_value !== (t0_value = /*restaurant*/ ctx[2].RestaurantName + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*restaurants*/ 1 && t3_value !== (t3_value = /*restaurant*/ ctx[2].RestaurantCategory + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*restaurants*/ 1 && t6_value !== (t6_value = /*restaurant*/ ctx[2].RestaurantDistance + "")) set_data_dev(t6, t6_value);

    			if (dirty & /*restaurants*/ 1 && img.src !== (img_src_value = /*restaurant*/ ctx[2].RestaurantImage)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(6:8) {#each restaurants as restaurant}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let main;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let div;
    	let each_value = /*restaurants*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	let each_1_else = null;

    	if (!each_value.length) {
    		each_1_else = create_else_block$1(ctx);
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*pageName*/ ctx[1]);
    			t1 = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			if (each_1_else) {
    				each_1_else.c();
    			}

    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", {});
    			var main_nodes = children(main);
    			header = claim_element(main_nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			h1 = claim_element(header_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, /*pageName*/ ctx[1]);
    			h1_nodes.forEach(detach_dev);
    			header_nodes.forEach(detach_dev);
    			t1 = claim_space(main_nodes);
    			div = claim_element(main_nodes, "DIV", { class: true });
    			var div_nodes = children(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].l(div_nodes);
    			}

    			if (each_1_else) {
    				each_1_else.l(div_nodes);
    			}

    			div_nodes.forEach(detach_dev);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "font-bold text-4xl");
    			add_location(h1, file$7, 2, 8, 46);
    			attr_dev(header, "class", "header");
    			add_location(header, file$7, 1, 4, 13);
    			attr_dev(div, "class", "foods");
    			add_location(div, file$7, 4, 4, 114);
    			add_location(main, file$7, 0, 0, 0);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(main, t1);
    			append_dev(main, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			if (each_1_else) {
    				each_1_else.m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*restaurants*/ 1) {
    				each_value = /*restaurants*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;

    				if (each_value.length) {
    					if (each_1_else) {
    						each_1_else.d(1);
    						each_1_else = null;
    					}
    				} else if (!each_1_else) {
    					each_1_else = create_else_block$1(ctx);
    					each_1_else.c();
    					each_1_else.m(div, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if (each_1_else) each_1_else.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("List", slots, []);
    	let pageName = "List";
    	let restaurants = [];

    	onMount(async () => {
    		const res = await fetch(`https://gist.githubusercontent.com/anhthuvu/310a146b9bfa2697cb71b8402d89c87e/raw/be025a19e9f70587a18c5bc44c00c8cf1506502d/data.json`);
    		$$invalidate(0, restaurants = await res.json());
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<List> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ pageName, onMount, restaurants });

    	$$self.$inject_state = $$props => {
    		if ("pageName" in $$props) $$invalidate(1, pageName = $$props.pageName);
    		if ("restaurants" in $$props) $$invalidate(0, restaurants = $$props.restaurants);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [restaurants, pageName];
    }

    class List extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "List",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\pages\Profile.svelte generated by Svelte v3.29.0 */
    const file$8 = "src\\pages\\Profile.svelte";

    function create_fragment$a(ctx) {
    	let main;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let article;
    	let h20;
    	let t2;
    	let t3;
    	let h21;
    	let t4;
    	let t5;
    	let blockquote;
    	let t6;
    	let h22;
    	let t7;

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*pageName*/ ctx[0]);
    			t1 = space();
    			article = element("article");
    			h20 = element("h2");
    			t2 = text("Username");
    			t3 = space();
    			h21 = element("h2");
    			t4 = text("Info");
    			t5 = space();
    			blockquote = element("blockquote");
    			t6 = space();
    			h22 = element("h2");
    			t7 = text("Favorite places");
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", {});
    			var main_nodes = children(main);
    			header = claim_element(main_nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			h1 = claim_element(header_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, /*pageName*/ ctx[0]);
    			h1_nodes.forEach(detach_dev);
    			header_nodes.forEach(detach_dev);
    			t1 = claim_space(main_nodes);
    			article = claim_element(main_nodes, "ARTICLE", {});
    			var article_nodes = children(article);
    			h20 = claim_element(article_nodes, "H2", { class: true });
    			var h20_nodes = children(h20);
    			t2 = claim_text(h20_nodes, "Username");
    			h20_nodes.forEach(detach_dev);
    			t3 = claim_space(article_nodes);
    			h21 = claim_element(article_nodes, "H2", { class: true });
    			var h21_nodes = children(h21);
    			t4 = claim_text(h21_nodes, "Info");
    			h21_nodes.forEach(detach_dev);
    			t5 = claim_space(article_nodes);
    			blockquote = claim_element(article_nodes, "BLOCKQUOTE", {});
    			children(blockquote).forEach(detach_dev);
    			t6 = claim_space(article_nodes);
    			h22 = claim_element(article_nodes, "H2", { class: true });
    			var h22_nodes = children(h22);
    			t7 = claim_text(h22_nodes, "Favorite places");
    			h22_nodes.forEach(detach_dev);
    			article_nodes.forEach(detach_dev);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "font-bold text-4xl");
    			add_location(h1, file$8, 7, 8, 141);
    			attr_dev(header, "class", "header");
    			add_location(header, file$8, 6, 4, 108);
    			attr_dev(h20, "class", "font-bold text-2xl m-3");
    			add_location(h20, file$8, 10, 8, 228);
    			attr_dev(h21, "class", "font-bold text-2xl m-3");
    			add_location(h21, file$8, 11, 8, 286);
    			add_location(blockquote, file$8, 12, 8, 340);
    			attr_dev(h22, "class", "font-bold text-2xl m-3");
    			add_location(h22, file$8, 13, 8, 375);
    			add_location(article, file$8, 9, 4, 209);
    			add_location(main, file$8, 5, 0, 94);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(main, t1);
    			append_dev(main, article);
    			append_dev(article, h20);
    			append_dev(h20, t2);
    			append_dev(article, t3);
    			append_dev(article, h21);
    			append_dev(h21, t4);
    			append_dev(article, t5);
    			append_dev(article, blockquote);
    			append_dev(article, t6);
    			append_dev(article, h22);
    			append_dev(h22, t7);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Profile", slots, []);
    	let pageName = "Profile";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ pageName, Link });

    	$$self.$inject_state = $$props => {
    		if ("pageName" in $$props) $$invalidate(0, pageName = $$props.pageName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pageName];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\pages\Restaurant.svelte generated by Svelte v3.29.0 */

    function create_fragment$b(ctx) {
    	const block = {
    		c: noop,
    		l: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Restaurant", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Restaurant> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Restaurant extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Restaurant",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\pages\Menu.svelte generated by Svelte v3.29.0 */

    function create_fragment$c(ctx) {
    	const block = {
    		c: noop,
    		l: noop,
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Menu", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\pages\ForgotPass.svelte generated by Svelte v3.29.0 */
    const file$9 = "src\\pages\\ForgotPass.svelte";

    // (17:8) <Link to="signin">
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Back to sign in");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Back to sign in");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(17:8) <Link to=\\\"signin\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let main;
    	let header;
    	let h1;
    	let t0;
    	let t1;
    	let article;
    	let form;
    	let label;
    	let t2;
    	let input;
    	let t3;
    	let button;
    	let t4;
    	let t5;
    	let p;
    	let t6;
    	let t7;
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: "signin",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			header = element("header");
    			h1 = element("h1");
    			t0 = text(/*pageName*/ ctx[0]);
    			t1 = space();
    			article = element("article");
    			form = element("form");
    			label = element("label");
    			t2 = text("Enter your email\r\n                ");
    			input = element("input");
    			t3 = space();
    			button = element("button");
    			t4 = text("Enter");
    			t5 = space();
    			p = element("p");
    			t6 = text("You will get an email with your username and password");
    			t7 = space();
    			create_component(link.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			main = claim_element(nodes, "MAIN", {});
    			var main_nodes = children(main);
    			header = claim_element(main_nodes, "HEADER", { class: true });
    			var header_nodes = children(header);
    			h1 = claim_element(header_nodes, "H1", { class: true });
    			var h1_nodes = children(h1);
    			t0 = claim_text(h1_nodes, /*pageName*/ ctx[0]);
    			h1_nodes.forEach(detach_dev);
    			header_nodes.forEach(detach_dev);
    			t1 = claim_space(main_nodes);
    			article = claim_element(main_nodes, "ARTICLE", {});
    			var article_nodes = children(article);
    			form = claim_element(article_nodes, "FORM", {});
    			var form_nodes = children(form);
    			label = claim_element(form_nodes, "LABEL", {});
    			var label_nodes = children(label);
    			t2 = claim_text(label_nodes, "Enter your email\r\n                ");

    			input = claim_element(label_nodes, "INPUT", {
    				class: true,
    				name: true,
    				required: true,
    				type: true,
    				placeholder: true
    			});

    			label_nodes.forEach(detach_dev);
    			t3 = claim_space(form_nodes);
    			button = claim_element(form_nodes, "BUTTON", { class: true, type: true });
    			var button_nodes = children(button);
    			t4 = claim_text(button_nodes, "Enter");
    			button_nodes.forEach(detach_dev);
    			t5 = claim_space(form_nodes);
    			p = claim_element(form_nodes, "P", { class: true });
    			var p_nodes = children(p);
    			t6 = claim_text(p_nodes, "You will get an email with your username and password");
    			p_nodes.forEach(detach_dev);
    			form_nodes.forEach(detach_dev);
    			t7 = claim_space(article_nodes);
    			claim_component(link.$$.fragment, article_nodes);
    			article_nodes.forEach(detach_dev);
    			main_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(h1, "class", "font-bold text-4xl my-2");
    			add_location(h1, file$9, 6, 8, 147);
    			attr_dev(header, "class", "header");
    			add_location(header, file$9, 5, 4, 114);
    			attr_dev(input, "class", "my-2 p-1");
    			attr_dev(input, "name", "email");
    			input.required = true;
    			attr_dev(input, "type", "email");
    			attr_dev(input, "placeholder", "food@email.com");
    			add_location(input, file$9, 11, 16, 300);
    			add_location(label, file$9, 10, 12, 259);
    			attr_dev(button, "class", "bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-2 border border-gray-400 shadow");
    			attr_dev(button, "type", "submit");
    			add_location(button, file$9, 13, 12, 425);
    			attr_dev(p, "class", "my-2");
    			add_location(p, file$9, 14, 12, 568);
    			add_location(form, file$9, 9, 8, 239);
    			add_location(article, file$9, 8, 4, 220);
    			add_location(main, file$9, 4, 0, 100);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, header);
    			append_dev(header, h1);
    			append_dev(h1, t0);
    			append_dev(main, t1);
    			append_dev(main, article);
    			append_dev(article, form);
    			append_dev(form, label);
    			append_dev(label, t2);
    			append_dev(label, input);
    			append_dev(form, t3);
    			append_dev(form, button);
    			append_dev(button, t4);
    			append_dev(form, t5);
    			append_dev(form, p);
    			append_dev(p, t6);
    			append_dev(article, t7);
    			mount_component(link, article, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ForgotPass", slots, []);
    	let pageName = "Forgot password";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ForgotPass> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ pageName, Link });

    	$$self.$inject_state = $$props => {
    		if ("pageName" in $$props) $$invalidate(0, pageName = $$props.pageName);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [pageName];
    }

    class ForgotPass extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ForgotPass",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\pages\Component.svelte generated by Svelte v3.29.0 */

    const file$a = "src\\pages\\Component.svelte";

    function create_fragment$e(ctx) {
    	let h1;
    	let span;
    	let t0;
    	let t1;
    	let t2_value = /*item*/ ctx[0].RestaurantName + "";
    	let t2;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			span = element("span");
    			t0 = text(/*distance*/ ctx[1]);
    			t1 = space();
    			t2 = text(t2_value);
    			this.h();
    		},
    		l: function claim(nodes) {
    			h1 = claim_element(nodes, "H1", {});
    			var h1_nodes = children(h1);
    			span = claim_element(h1_nodes, "SPAN", { class: true });
    			var span_nodes = children(span);
    			t0 = claim_text(span_nodes, /*distance*/ ctx[1]);
    			span_nodes.forEach(detach_dev);
    			t1 = claim_space(h1_nodes);
    			t2 = claim_text(h1_nodes, t2_value);
    			h1_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(span, "class", "svelte-1d7kmmf");
    			add_location(span, file$a, 15, 1, 194);
    			add_location(h1, file$a, 14, 0, 187);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, span);
    			append_dev(span, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*distance*/ 2) set_data_dev(t0, /*distance*/ ctx[1]);
    			if (dirty & /*item*/ 1 && t2_value !== (t2_value = /*item*/ ctx[0].RestaurantName + "")) set_data_dev(t2, t2_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Component", slots, []);
    	let { item } = $$props;
    	let { distance } = $$props;
    	const writable_props = ["item", "distance"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Component> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("item" in $$props) $$invalidate(0, item = $$props.item);
    		if ("distance" in $$props) $$invalidate(1, distance = $$props.distance);
    	};

    	$$self.$capture_state = () => ({ item, distance });

    	$$self.$inject_state = $$props => {
    		if ("item" in $$props) $$invalidate(0, item = $$props.item);
    		if ("distance" in $$props) $$invalidate(1, distance = $$props.distance);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [item, distance];
    }

    class Component extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { item: 0, distance: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Component",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !("item" in props)) {
    			console.warn("<Component> was created without expected prop 'item'");
    		}

    		if (/*distance*/ ctx[1] === undefined && !("distance" in props)) {
    			console.warn("<Component> was created without expected prop 'distance'");
    		}
    	}

    	get item() {
    		throw new Error("<Component>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<Component>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get distance() {
    		throw new Error("<Component>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set distance(value) {
    		throw new Error("<Component>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.29.0 */
    const file$b = "src\\App.svelte";

    // (27:8) <Link to="/">
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(27:8) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:8) <Link to="signin">
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Signin");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Signin");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(28:8) <Link to=\\\"signin\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:8) <Link to="about">
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("About");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "About");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(29:8) <Link to=\\\"about\\\">",
    		ctx
    	});

    	return block;
    }

    // (30:8) <Link to="map">
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Map");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Map");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(30:8) <Link to=\\\"map\\\">",
    		ctx
    	});

    	return block;
    }

    // (31:8) <Link to="list">
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("List");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "List");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(31:8) <Link to=\\\"list\\\">",
    		ctx
    	});

    	return block;
    }

    // (32:8) <Link to="profile">
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Profile");
    		},
    		l: function claim(nodes) {
    			t = claim_text(nodes, "Profile");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(32:8) <Link to=\\\"profile\\\">",
    		ctx
    	});

    	return block;
    }

    // (37:2) <Route path="/">
    function create_default_slot_1$1(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(home.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(37:2) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (20:0) <Router url="{url}">
    function create_default_slot$2(ctx) {
    	let div0;
    	let nav;
    	let button;
    	let svg;
    	let path;
    	let t0;
    	let ul;
    	let li0;
    	let link0;
    	let t1;
    	let li1;
    	let link1;
    	let t2;
    	let li2;
    	let link2;
    	let t3;
    	let li3;
    	let link3;
    	let t4;
    	let li4;
    	let link4;
    	let t5;
    	let li5;
    	let link5;
    	let t6;
    	let div1;
    	let route0;
    	let t7;
    	let route1;
    	let t8;
    	let route2;
    	let t9;
    	let route3;
    	let t10;
    	let route4;
    	let t11;
    	let route5;
    	let t12;
    	let route6;
    	let t13;
    	let route7;
    	let t14;
    	let route8;
    	let t15;
    	let route9;
    	let t16;
    	let route10;
    	let t17;
    	let route11;
    	let current;

    	link0 = new Link({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				to: "signin",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				to: "about",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link({
    			props: {
    				to: "map",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link({
    			props: {
    				to: "list",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link5 = new Link({
    			props: {
    				to: "profile",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: { path: "signin", component: Signin },
    			$$inline: true
    		});

    	route2 = new Route({
    			props: { path: "signout", component: Signout },
    			$$inline: true
    		});

    	route3 = new Route({
    			props: { path: "signup", component: Signup },
    			$$inline: true
    		});

    	route4 = new Route({
    			props: { path: "about", component: About },
    			$$inline: true
    		});

    	route5 = new Route({
    			props: { path: "map", component: Map$1 },
    			$$inline: true
    		});

    	route6 = new Route({
    			props: { path: "list", component: List },
    			$$inline: true
    		});

    	route7 = new Route({
    			props: { path: "profile", component: Profile },
    			$$inline: true
    		});

    	route8 = new Route({
    			props: {
    				path: "restaurant",
    				component: Restaurant
    			},
    			$$inline: true
    		});

    	route9 = new Route({
    			props: { path: "menu", component: Menu },
    			$$inline: true
    		});

    	route10 = new Route({
    			props: {
    				path: "forgotPass",
    				component: ForgotPass
    			},
    			$$inline: true
    		});

    	route11 = new Route({
    			props: { path: "component", component: Component },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			nav = element("nav");
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t0 = space();
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t1 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t2 = space();
    			li2 = element("li");
    			create_component(link2.$$.fragment);
    			t3 = space();
    			li3 = element("li");
    			create_component(link3.$$.fragment);
    			t4 = space();
    			li4 = element("li");
    			create_component(link4.$$.fragment);
    			t5 = space();
    			li5 = element("li");
    			create_component(link5.$$.fragment);
    			t6 = space();
    			div1 = element("div");
    			create_component(route0.$$.fragment);
    			t7 = space();
    			create_component(route1.$$.fragment);
    			t8 = space();
    			create_component(route2.$$.fragment);
    			t9 = space();
    			create_component(route3.$$.fragment);
    			t10 = space();
    			create_component(route4.$$.fragment);
    			t11 = space();
    			create_component(route5.$$.fragment);
    			t12 = space();
    			create_component(route6.$$.fragment);
    			t13 = space();
    			create_component(route7.$$.fragment);
    			t14 = space();
    			create_component(route8.$$.fragment);
    			t15 = space();
    			create_component(route9.$$.fragment);
    			t16 = space();
    			create_component(route10.$$.fragment);
    			t17 = space();
    			create_component(route11.$$.fragment);
    			this.h();
    		},
    		l: function claim(nodes) {
    			div0 = claim_element(nodes, "DIV", { class: true });
    			var div0_nodes = children(div0);
    			nav = claim_element(div0_nodes, "NAV", { class: true });
    			var nav_nodes = children(nav);
    			button = claim_element(nav_nodes, "BUTTON", { class: true });
    			var button_nodes = children(button);
    			svg = claim_element(button_nodes, "svg", { class: true, xmlns: true, viewBox: true }, 1);
    			var svg_nodes = children(svg);
    			path = claim_element(svg_nodes, "path", { d: true }, 1);
    			children(path).forEach(detach_dev);
    			svg_nodes.forEach(detach_dev);
    			button_nodes.forEach(detach_dev);
    			t0 = claim_space(nav_nodes);
    			ul = claim_element(nav_nodes, "UL", { class: true });
    			var ul_nodes = children(ul);
    			li0 = claim_element(ul_nodes, "LI", {});
    			var li0_nodes = children(li0);
    			claim_component(link0.$$.fragment, li0_nodes);
    			li0_nodes.forEach(detach_dev);
    			t1 = claim_space(ul_nodes);
    			li1 = claim_element(ul_nodes, "LI", {});
    			var li1_nodes = children(li1);
    			claim_component(link1.$$.fragment, li1_nodes);
    			li1_nodes.forEach(detach_dev);
    			t2 = claim_space(ul_nodes);
    			li2 = claim_element(ul_nodes, "LI", {});
    			var li2_nodes = children(li2);
    			claim_component(link2.$$.fragment, li2_nodes);
    			li2_nodes.forEach(detach_dev);
    			t3 = claim_space(ul_nodes);
    			li3 = claim_element(ul_nodes, "LI", {});
    			var li3_nodes = children(li3);
    			claim_component(link3.$$.fragment, li3_nodes);
    			li3_nodes.forEach(detach_dev);
    			t4 = claim_space(ul_nodes);
    			li4 = claim_element(ul_nodes, "LI", {});
    			var li4_nodes = children(li4);
    			claim_component(link4.$$.fragment, li4_nodes);
    			li4_nodes.forEach(detach_dev);
    			t5 = claim_space(ul_nodes);
    			li5 = claim_element(ul_nodes, "LI", {});
    			var li5_nodes = children(li5);
    			claim_component(link5.$$.fragment, li5_nodes);
    			li5_nodes.forEach(detach_dev);
    			ul_nodes.forEach(detach_dev);
    			nav_nodes.forEach(detach_dev);
    			div0_nodes.forEach(detach_dev);
    			t6 = claim_space(nodes);
    			div1 = claim_element(nodes, "DIV", {});
    			var div1_nodes = children(div1);
    			claim_component(route0.$$.fragment, div1_nodes);
    			t7 = claim_space(div1_nodes);
    			claim_component(route1.$$.fragment, div1_nodes);
    			t8 = claim_space(div1_nodes);
    			claim_component(route2.$$.fragment, div1_nodes);
    			t9 = claim_space(div1_nodes);
    			claim_component(route3.$$.fragment, div1_nodes);
    			t10 = claim_space(div1_nodes);
    			claim_component(route4.$$.fragment, div1_nodes);
    			t11 = claim_space(div1_nodes);
    			claim_component(route5.$$.fragment, div1_nodes);
    			t12 = claim_space(div1_nodes);
    			claim_component(route6.$$.fragment, div1_nodes);
    			t13 = claim_space(div1_nodes);
    			claim_component(route7.$$.fragment, div1_nodes);
    			t14 = claim_space(div1_nodes);
    			claim_component(route8.$$.fragment, div1_nodes);
    			t15 = claim_space(div1_nodes);
    			claim_component(route9.$$.fragment, div1_nodes);
    			t16 = claim_space(div1_nodes);
    			claim_component(route10.$$.fragment, div1_nodes);
    			t17 = claim_space(div1_nodes);
    			claim_component(route11.$$.fragment, div1_nodes);
    			div1_nodes.forEach(detach_dev);
    			this.h();
    		},
    		h: function hydrate() {
    			attr_dev(path, "d", "M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z");
    			add_location(path, file$b, 23, 93, 857);
    			attr_dev(svg, "class", "fill-current h-4 w-4");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			add_location(svg, file$b, 23, 4, 768);
    			attr_dev(button, "class", "dropbtn");
    			add_location(button, file$b, 22, 3, 738);
    			add_location(li0, file$b, 26, 4, 1004);
    			add_location(li1, file$b, 27, 4, 1043);
    			add_location(li2, file$b, 28, 4, 1089);
    			add_location(li3, file$b, 29, 4, 1133);
    			add_location(li4, file$b, 30, 4, 1173);
    			add_location(li5, file$b, 31, 4, 1215);
    			attr_dev(ul, "class", "dropdown-content");
    			add_location(ul, file$b, 25, 3, 969);
    			attr_dev(nav, "class", "dropdown");
    			add_location(nav, file$b, 21, 2, 711);
    			attr_dev(div0, "class", "links");
    			add_location(div0, file$b, 20, 1, 688);
    			add_location(div1, file$b, 35, 1, 1289);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, nav);
    			append_dev(nav, button);
    			append_dev(button, svg);
    			append_dev(svg, path);
    			append_dev(nav, t0);
    			append_dev(nav, ul);
    			append_dev(ul, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			mount_component(link1, li1, null);
    			append_dev(ul, t2);
    			append_dev(ul, li2);
    			mount_component(link2, li2, null);
    			append_dev(ul, t3);
    			append_dev(ul, li3);
    			mount_component(link3, li3, null);
    			append_dev(ul, t4);
    			append_dev(ul, li4);
    			mount_component(link4, li4, null);
    			append_dev(ul, t5);
    			append_dev(ul, li5);
    			mount_component(link5, li5, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(route0, div1, null);
    			append_dev(div1, t7);
    			mount_component(route1, div1, null);
    			append_dev(div1, t8);
    			mount_component(route2, div1, null);
    			append_dev(div1, t9);
    			mount_component(route3, div1, null);
    			append_dev(div1, t10);
    			mount_component(route4, div1, null);
    			append_dev(div1, t11);
    			mount_component(route5, div1, null);
    			append_dev(div1, t12);
    			mount_component(route6, div1, null);
    			append_dev(div1, t13);
    			mount_component(route7, div1, null);
    			append_dev(div1, t14);
    			mount_component(route8, div1, null);
    			append_dev(div1, t15);
    			mount_component(route9, div1, null);
    			append_dev(div1, t16);
    			mount_component(route10, div1, null);
    			append_dev(div1, t17);
    			mount_component(route11, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    			const link3_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link3_changes.$$scope = { dirty, ctx };
    			}

    			link3.$set(link3_changes);
    			const link4_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link4_changes.$$scope = { dirty, ctx };
    			}

    			link4.$set(link4_changes);
    			const link5_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				link5_changes.$$scope = { dirty, ctx };
    			}

    			link5.$set(link5_changes);
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(link5.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			transition_in(route7.$$.fragment, local);
    			transition_in(route8.$$.fragment, local);
    			transition_in(route9.$$.fragment, local);
    			transition_in(route10.$$.fragment, local);
    			transition_in(route11.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(link5.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			transition_out(route7.$$.fragment, local);
    			transition_out(route8.$$.fragment, local);
    			transition_out(route9.$$.fragment, local);
    			transition_out(route10.$$.fragment, local);
    			transition_out(route11.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(link3);
    			destroy_component(link4);
    			destroy_component(link5);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div1);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    			destroy_component(route5);
    			destroy_component(route6);
    			destroy_component(route7);
    			destroy_component(route8);
    			destroy_component(route9);
    			destroy_component(route10);
    			destroy_component(route11);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(20:0) <Router url=\\\"{url}\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			claim_component(router.$$.fragment, nodes);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope*/ 2) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	let { url = "" } = $$props;
    	const writable_props = ["url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		Router,
    		Route,
    		Link,
    		Home,
    		Signin,
    		Signout,
    		Signup,
    		About,
    		Map: Map$1,
    		List,
    		Profile,
    		Restaurant,
    		Menu,
    		ForgotPass,
    		Component,
    		url
    	});

    	$$self.$inject_state = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	hydrate: true
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
