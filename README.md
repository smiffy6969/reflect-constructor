Reflect Constructor
=======================

Want to build really standard web components, cut yourself free from frameworks, if you require support for IE11 then you may need to polyfill Reflect when compiling with babel

On using 

```
    "transform-custom-element-classes",
    "transform-es2015-classes"
```

To compile with support for custome element classes, it was noted that IE11 failed due to a lack of Reflect. All we need is the object constructor, so I ported this to a small self loading pollyfill

## Installation

This polyfill adds a Proxy global is Proxy is not native to the envronment (remove '.min' for full fat!)


```bash
$ npm install reflect-constructor
```

Add in your HTML head section


```html
<script src="/node_modules/reflect-constructor/reflect-constructor.js"></script>
```

OR

```js
import './node_modules/reflect-constructor/reflect-constructor.js';
```

## Limitations and caveats

This is only a replacement for the missing Reflect and its constructor, to allow us to build and run on IE11

## Browser support

Ermmm IE11, or any browser missing Reflect!

## License

MIT ;)
