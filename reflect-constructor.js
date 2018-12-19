// Reflect.constructor polyfill for IE11 support of standard web components
(function () {
    'use strict';

    if (!!window.Reflect) return;

    window.Reflect = {
        construct: function (target, args, newTarget) {
            var handler = (new WeakMap()).get(target);
            if (handler !== undefined) return handler.construct(handler.target, args, newTarget);

            if (typeof target !== "function") throw new TypeError("target must be a function: " + target);

            if (newTarget === undefined || newTarget === target) return new (Function.prototype.bind.apply(target, [null].concat(args)));
            else {
                if (typeof newTarget !== "function") throw new TypeError("new target must be a function: " + target);

                var proto = newTarget.prototype;
                var instance = (Object(proto) === proto) ? Object.create(proto) : {};
                var result = Function.prototype.apply.call(target, instance, args);

                return Object(result) === result ? result : instance;
            }
        }
    };
})();