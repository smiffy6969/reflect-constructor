Proxy OO Polyfill
=======================

Used for ployfilling Proxy AND!!! allowing fallback to Object.observe when Proxy is not available via Proxy.oo.

This library came about purely due to using Proxy for observing object changes. After attempting to use the Proxy polyfill and suffering from immutable arrays (not a fault of proxy polyfill, just how it is, you need direct engine support to monitor arrays for push, splice etc.).

So scratching my head, I created a combined Proxy and OO polyfill. Yes I know OO is no longer in the roadmap and is obsolete, but I am not offering a OO as a polyfill as such, that is why I have appended to Proxy,to try and stop usage of OO in it's native form as it is hungry! Plus should Proxy be natively available (which supports mutating arrays anyway), then when Proxy is ready in your browser, OO will not be bindled anyway.

This is not so much a solution to the issues with Proxy polyfill, but more a solution to observing objects to apply a callback, and what we do should native proxy not be available.

All this aside, the benefits here are we still get the 90% working Proxy, to allow you to continue using proxy, or fall back to Proxy.oo should you need to observe property array and keep mutatable... Otherwise Proxy Polyfill works fine if you replace the whole property with a new array.

This is a Hybrid of [GoogleChrome/proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill) and [MaxArt2501/object-observe](https://github.com/MaxArt2501/object-observe) Giving Proxy support with OO via Proxy.oo if Proxy is not native.

## Installation

This polyfill adds a Proxy global is Proxy is not native to the envronment (remove '.min' for full fat!)


```bash
$ npm install proxy-oo-polyfill
```

Add in your HTML head section


```html
<script src="/node_modules/proxy-oo-polyfill/proxy-oo-polyfill.min.js"></script>
```

## Limitations and caveats


Proxy DOES NOT ALLOW CHANGING OF PROPERTY ARRAYS!!!


If you need to monitor an array whilst keeping it mutatable, you should fall back to Proxy.oo..... apart form this you can use Proxy as is, this is only if you need to observe changes.


## Usage


To use this for Proxy purposes, use as is.... if you want to observe object changes and keep things mutatable on array objects, you will need to add a switch in for Proxy.oo, for instance if you wish to observe a full object tree for changes. I us ethis as follows, through an ES6 class to abstract it.


```javascript
export default class Observer {
	/**
	 * object()
	 * Observe an object, applying a callback if changed
	 * This method uses native Proxy available for clean observing, returning proxied object
     *
	 * NOTE:
	 * If native proxy not available, proxy will be polyfilled and fallback to object observe polyfill for observing
	 * and proxy polyfill for those who  want to use it (caveat, proxy polyfill does not allow mutating of arrays) To change a polyfilled proxy
	 * you will have to replace whole array. This is why we fall back to OO polyfill for observing but allow you to still use Proxy polyfill
	 * if you want to for your app with this caveat.
	 *
	 * DEPS:
	 * This class relies on the smiffy6969/proxy-oo-polyfill (npm install proxy-oo-polyfill) for hybrid proxy with oo observing.
	 *
	 * @param obj Object The model to proxy
	 * @param fn Function The calback function to run on change
	 * @param deep Boolean Should we go deep or just proxy/observe root level
	 * @param prefix String Used to set prefix of path in object (should be blank when called)
	 * @return Object The proxied object
	 */
	static object(obj, fn, deep, prefix) {
		if (!Proxy.oo) return Observer.proxy(obj, fn, deep, prefix);
		Observer.oo(obj, fn, deep, prefix);
		return obj;
	}

	/**
	 * proxy()
	 *
	 * Use native proxy to extend object model, allowing us to observe changes and instigate callback on changes
	 * @param obj Object The model to proxy
	 * @param fn Function The calback function to run on change
	 * @param deep Boolean Should we go deep or just proxy/observe root level
	 * @param prefix String Used to set prefix of path in object (should be blank when called)
	 * @return Object The proxied object
	 */
	static proxy(obj, fn, deep, prefix) {
		prefix = typeof prefix === 'undefined' ? '' : prefix;
		if (typeof this.object === 'undefined') this.object = obj;
		return new Proxy(obj, {
			set: function(target, prop, value) {
				let old = target[prop];
				target[prop] = value;
				fn(prefix + prop, old, value);
				return true;
			},
			get: function(target, prop) {
				let val = target[prop];
				if (!!deep && val instanceof Object && typeof prop === 'string') return Observer.object(val, fn, deep, prefix + prop + '.');
				return val;
			}
		});
	}

	/**
	 * oo()
	 *
	 * Fallback observing method to allow us to watch changes on object without native proxy
	 * @param obj Object The model to proxy
	 * @param fn Function The calback function to run on change
	 * @param deep Boolean Should we go deep or just proxy/observe root level
	 * @param prefix String Used to set prefix of path in object (should be blank when called)
	 */
	static oo(obj, fn, deep, prefix) {
		prefix = typeof prefix === 'undefined' ? '' : prefix;
		Proxy.oo.observe(obj, function(changes) {
			for (let i = 0; i < changes.length; i++)
			{
				fn(prefix + changes[i].name, obj[changes[i].name], changes[i].oldValue, changes[i].type);
				if (changes[i].type == 'add' && !!deep && obj[changes[i].name] && typeof obj[changes[i].name] === 'object') Observer.oo(obj[changes[i].name], fn, deep, prefix + changes[i].name + '.');
			}
		});
		for (var name in obj) if (!!deep && obj[name] && typeof obj[name] === 'object') Observer.oo(obj[name], fn, deep, prefix + name + '.');
	}
}
```


I can now do the following without the need to worry about what is available...


```javascript
import Observer from './observer.js'

/**
 * RaziloBind Binding Library
 * Offers View-Model binding between js object and html view
 */
export default class Whatever {
    constructor() {
		this.model = {
			test: 'something',
			list: [
				{title: 'fdsfds'},
				{title: 'fdsfds'}
			]
		};

		run();
	}

	run() {
		this.model = Observer.object(object, this.update.bind(this), true); // use bind(this) on callback to ensure scope!
    }

    update(path, oldV, newV) {
		// do something when object changes...
	}
}
```

## Browser support

Not overly sure.... I would say IE9 and above, hopefully ;) oh, and proper browsers should be fine, most implement Proxy natively now anyway which is good.

## License

Licences are bound to Proxy and OO seperately, so please go read theme to see what applies, I apply no licence to this at all as it is just a compilation!
