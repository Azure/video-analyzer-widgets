/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 303:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "bw": () => /* binding */ booleanConverter,
/* harmony export */   "Id": () => /* binding */ nullableNumberConverter,
/* harmony export */   "so": () => /* binding */ AttributeDefinition,
/* harmony export */   "Lj": () => /* binding */ attr
/* harmony export */ });
/* harmony import */ var _observation_observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(202);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(676);


/**
 * A {@link ValueConverter} that converts to and from `boolean` values.
 * @remarks
 * Used automatically when the `boolean` {@link AttributeMode} is selected.
 * @public
 */
const booleanConverter = {
    toView(value) {
        return value ? "true" : "false";
    },
    fromView(value) {
        if (value === null ||
            value === void 0 ||
            value === "false" ||
            value === false ||
            value === 0) {
            return false;
        }
        return true;
    },
};
/**
 * A {@link ValueConverter} that converts to and from `number` values.
 * @remarks
 * This converter allows for nullable numbers, returning `null` if the
 * input was `null`, `undefined`, or `NaN`.
 * @public
 */
const nullableNumberConverter = {
    toView(value) {
        if (value === null || value === undefined) {
            return null;
        }
        const number = value * 1;
        return isNaN(number) ? null : number.toString();
    },
    fromView(value) {
        if (value === null || value === undefined) {
            return null;
        }
        const number = value * 1;
        return isNaN(number) ? null : number;
    },
};
/**
 * An implementation of {@link Accessor} that supports reactivity,
 * change callbacks, attribute reflection, and type conversion for
 * custom elements.
 * @public
 */
class AttributeDefinition {
    /**
     * Creates an instance of AttributeDefinition.
     * @param Owner - The class constructor that owns this attribute.
     * @param name - The name of the property associated with the attribute.
     * @param attribute - The name of the attribute in HTML.
     * @param mode - The {@link AttributeMode} that describes the behavior of this attribute.
     * @param converter - A {@link ValueConverter} that integrates with the property getter/setter
     * to convert values to and from a DOM string.
     */
    constructor(Owner, name, attribute = name.toLowerCase(), mode = "reflect", converter) {
        this.guards = new Set();
        this.Owner = Owner;
        this.name = name;
        this.attribute = attribute;
        this.mode = mode;
        this.converter = converter;
        this.fieldName = `_${name}`;
        this.callbackName = `${name}Changed`;
        this.hasCallback = this.callbackName in Owner.prototype;
        if (mode === "boolean" && converter === void 0) {
            this.converter = booleanConverter;
        }
    }
    /**
     * Sets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     * @param value - The value to set the attribute/property to.
     */
    setValue(source, newValue) {
        const oldValue = source[this.fieldName];
        const converter = this.converter;
        if (converter !== void 0) {
            newValue = converter.fromView(newValue);
        }
        if (oldValue !== newValue) {
            source[this.fieldName] = newValue;
            this.tryReflectToAttribute(source);
            if (this.hasCallback) {
                source[this.callbackName](oldValue, newValue);
            }
            source.$fastController.notify(this.name);
        }
    }
    /**
     * Gets the value of the attribute/property on the source element.
     * @param source - The source element to access.
     */
    getValue(source) {
        _observation_observable__WEBPACK_IMPORTED_MODULE_0__/* .Observable.track */ .y$.track(source, this.name);
        return source[this.fieldName];
    }
    /** @internal */
    onAttributeChangedCallback(element, value) {
        if (this.guards.has(element)) {
            return;
        }
        this.guards.add(element);
        this.setValue(element, value);
        this.guards.delete(element);
    }
    tryReflectToAttribute(element) {
        const mode = this.mode;
        const guards = this.guards;
        if (guards.has(element) || mode === "fromView") {
            return;
        }
        _dom__WEBPACK_IMPORTED_MODULE_1__/* .DOM.queueUpdate */ .SO.queueUpdate(() => {
            guards.add(element);
            const latestValue = element[this.fieldName];
            switch (mode) {
                case "reflect":
                    const converter = this.converter;
                    _dom__WEBPACK_IMPORTED_MODULE_1__/* .DOM.setAttribute */ .SO.setAttribute(element, this.attribute, converter !== void 0 ? converter.toView(latestValue) : latestValue);
                    break;
                case "boolean":
                    _dom__WEBPACK_IMPORTED_MODULE_1__/* .DOM.setBooleanAttribute */ .SO.setBooleanAttribute(element, this.attribute, latestValue);
                    break;
            }
            guards.delete(element);
        });
    }
    /**
     * Collects all attribute definitions associated with the owner.
     * @param Owner - The class constructor to collect attribute for.
     * @param attributeLists - Any existing attributes to collect and merge with those associated with the owner.
     * @internal
     */
    static collect(Owner, ...attributeLists) {
        const attributes = [];
        attributeLists.push(Owner.attributes);
        for (let i = 0, ii = attributeLists.length; i < ii; ++i) {
            const list = attributeLists[i];
            if (list === void 0) {
                continue;
            }
            for (let j = 0, jj = list.length; j < jj; ++j) {
                const config = list[j];
                if (typeof config === "string") {
                    attributes.push(new AttributeDefinition(Owner, config));
                }
                else {
                    attributes.push(new AttributeDefinition(Owner, config.property, config.attribute, config.mode, config.converter));
                }
            }
        }
        return attributes;
    }
}
function attr(configOrTarget, prop) {
    let config;
    function decorator($target, $prop) {
        if (arguments.length > 1) {
            // Non invocation:
            // - @attr
            // Invocation with or w/o opts:
            // - @attr()
            // - @attr({...opts})
            config.property = $prop;
        }
        const attributes = $target.constructor.attributes ||
            ($target.constructor.attributes = []);
        attributes.push(config);
    }
    if (arguments.length > 1) {
        // Non invocation:
        // - @attr
        config = {};
        decorator(configOrTarget, prop);
        return;
    }
    // Invocation with or w/o opts:
    // - @attr()
    // - @attr({...opts})
    config = configOrTarget === void 0 ? {} : configOrTarget;
    return decorator;
}


/***/ }),

/***/ 154:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Q": () => /* binding */ Controller
/* harmony export */ });
/* harmony import */ var _fast_definitions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(940);
/* harmony import */ var _observation_notifier__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(868);
/* harmony import */ var _observation_observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(202);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(676);
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




const shadowRoots = new WeakMap();
const defaultEventOptions = {
    bubbles: true,
    composed: true,
};
function getShadowRoot(element) {
    return element.shadowRoot || shadowRoots.get(element) || null;
}
/**
 * Controls the lifecycle and rendering of a `FASTElement`.
 * @public
 */
class Controller extends _observation_notifier__WEBPACK_IMPORTED_MODULE_0__/* .PropertyChangeNotifier */ .A {
    /**
     * Creates a Controller to control the specified element.
     * @param element - The element to be controlled by this controller.
     * @param definition - The element definition metadata that instructs this
     * controller in how to handle rendering and other platform integrations.
     * @internal
     */
    constructor(element, definition) {
        super(element);
        this.boundObservables = null;
        this.behaviors = null;
        this.needsInitialization = true;
        this._template = null;
        this._styles = null;
        /**
         * The view associated with the custom element.
         * @remarks
         * If `null` then the element is managing its own rendering.
         */
        this.view = null;
        /**
         * Indicates whether or not the custom element has been
         * connected to the document.
         */
        this.isConnected = false;
        this.element = element;
        this.definition = definition;
        const shadowOptions = definition.shadowOptions;
        if (shadowOptions !== void 0) {
            const shadowRoot = element.attachShadow(shadowOptions);
            if (shadowOptions.mode === "closed") {
                shadowRoots.set(element, shadowRoot);
            }
        }
        // Capture any observable values that were set by the binding engine before
        // the browser upgraded the element. Then delete the property since it will
        // shadow the getter/setter that is required to make the observable operate.
        // Later, in the connect callback, we'll re-apply the values.
        const accessors = _observation_observable__WEBPACK_IMPORTED_MODULE_1__/* .Observable.getAccessors */ .y$.getAccessors(element);
        if (accessors.length > 0) {
            const boundObservables = (this.boundObservables = Object.create(null));
            for (let i = 0, ii = accessors.length; i < ii; ++i) {
                const propertyName = accessors[i].name;
                const value = element[propertyName];
                if (value !== void 0) {
                    delete element[propertyName];
                    boundObservables[propertyName] = value;
                }
            }
        }
    }
    /**
     * Gets/sets the template used to render the component.
     * @remarks
     * This value can only be accurately read after connect but can be set at any time.
     */
    get template() {
        return this._template;
    }
    set template(value) {
        if (this._template === value) {
            return;
        }
        this._template = value;
        if (!this.needsInitialization) {
            this.renderTemplate(value);
        }
    }
    /**
     * Gets/sets the primary styles used for the component.
     * @remarks
     * This value can only be accurately read after connect but can be set at any time.
     */
    get styles() {
        return this._styles;
    }
    set styles(value) {
        if (this._styles === value) {
            return;
        }
        if (this._styles !== null) {
            this.removeStyles(this._styles);
        }
        this._styles = value;
        if (!this.needsInitialization && value !== null) {
            this.addStyles(value);
        }
    }
    /**
     * Adds styles to this element. Providing an HTMLStyleElement will attach the element instance to the shadowRoot.
     * @param styles - The styles to add.
     */
    addStyles(styles) {
        const target = getShadowRoot(this.element) ||
            this.element.getRootNode();
        if (styles instanceof HTMLStyleElement) {
            target.prepend(styles);
        }
        else {
            const sourceBehaviors = styles.behaviors;
            styles.addStylesTo(target);
            if (sourceBehaviors !== null) {
                this.addBehaviors(sourceBehaviors);
            }
        }
    }
    /**
     * Removes styles from this element. Providing an HTMLStyleElement will detach the element instance from the shadowRoot.
     * @param styles - the styles to remove.
     */
    removeStyles(styles) {
        const target = getShadowRoot(this.element) ||
            this.element.getRootNode();
        if (styles instanceof HTMLStyleElement) {
            target.removeChild(styles);
        }
        else {
            const sourceBehaviors = styles.behaviors;
            styles.removeStylesFrom(target);
            if (sourceBehaviors !== null) {
                this.removeBehaviors(sourceBehaviors);
            }
        }
    }
    /**
     * Adds behaviors to this element.
     * @param behaviors - The behaviors to add.
     */
    addBehaviors(behaviors) {
        const targetBehaviors = this.behaviors || (this.behaviors = []);
        const length = behaviors.length;
        for (let i = 0; i < length; ++i) {
            targetBehaviors.push(behaviors[i]);
        }
        if (this.isConnected) {
            const element = this.element;
            for (let i = 0; i < length; ++i) {
                behaviors[i].bind(element, _observation_observable__WEBPACK_IMPORTED_MODULE_1__/* .defaultExecutionContext */ .Wp);
            }
        }
    }
    /**
     * Removes behaviors from this element.
     * @param behaviors - The behaviors to remove.
     */
    removeBehaviors(behaviors) {
        const targetBehaviors = this.behaviors;
        if (targetBehaviors === null) {
            return;
        }
        const length = behaviors.length;
        for (let i = 0; i < length; ++i) {
            const index = targetBehaviors.indexOf(behaviors[i]);
            if (index !== -1) {
                targetBehaviors.splice(index, 1);
            }
        }
        if (this.isConnected) {
            const element = this.element;
            for (let i = 0; i < length; ++i) {
                behaviors[i].unbind(element);
            }
        }
    }
    /**
     * Runs connected lifecycle behavior on the associated element.
     */
    onConnectedCallback() {
        if (this.isConnected) {
            return;
        }
        const element = this.element;
        if (this.needsInitialization) {
            this.finishInitialization();
        }
        else if (this.view !== null) {
            this.view.bind(element, _observation_observable__WEBPACK_IMPORTED_MODULE_1__/* .defaultExecutionContext */ .Wp);
        }
        const behaviors = this.behaviors;
        if (behaviors !== null) {
            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(element, _observation_observable__WEBPACK_IMPORTED_MODULE_1__/* .defaultExecutionContext */ .Wp);
            }
        }
        this.isConnected = true;
    }
    /**
     * Runs disconnected lifecycle behavior on the associated element.
     */
    onDisconnectedCallback() {
        if (this.isConnected === false) {
            return;
        }
        this.isConnected = false;
        const view = this.view;
        if (view !== null) {
            view.unbind();
        }
        const behaviors = this.behaviors;
        if (behaviors !== null) {
            const element = this.element;
            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].unbind(element);
            }
        }
    }
    /**
     * Runs the attribute changed callback for the associated element.
     * @param name - The name of the attribute that changed.
     * @param oldValue - The previous value of the attribute.
     * @param newValue - The new value of the attribute.
     */
    onAttributeChangedCallback(name, oldValue, newValue) {
        const attrDef = this.definition.attributeLookup[name];
        if (attrDef !== void 0) {
            attrDef.onAttributeChangedCallback(this.element, newValue);
        }
    }
    /**
     * Emits a custom HTML event.
     * @param type - The type name of the event.
     * @param detail - The event detail object to send with the event.
     * @param options - The event options. By default bubbles and composed.
     * @remarks
     * Only emits events if connected.
     */
    emit(type, detail, options) {
        if (this.isConnected) {
            return this.element.dispatchEvent(new CustomEvent(type, Object.assign(Object.assign({ detail }, defaultEventOptions), options)));
        }
        return false;
    }
    finishInitialization() {
        const element = this.element;
        const boundObservables = this.boundObservables;
        // If we have any observables that were bound, re-apply their values.
        if (boundObservables !== null) {
            const propertyNames = Object.keys(boundObservables);
            for (let i = 0, ii = propertyNames.length; i < ii; ++i) {
                const propertyName = propertyNames[i];
                element[propertyName] = boundObservables[propertyName];
            }
            this.boundObservables = null;
        }
        const definition = this.definition;
        // 1. Template overrides take top precedence.
        if (this._template === null) {
            if (this.element.resolveTemplate) {
                // 2. Allow for element instance overrides next.
                this._template = this.element.resolveTemplate();
            }
            else if (definition.template) {
                // 3. Default to the static definition.
                this._template = definition.template || null;
            }
        }
        // If we have a template after the above process, render it.
        // If there's no template, then the element author has opted into
        // custom rendering and they will managed the shadow root's content themselves.
        if (this._template !== null) {
            this.renderTemplate(this._template);
        }
        // 1. Styles overrides take top precedence.
        if (this._styles === null) {
            if (this.element.resolveStyles) {
                // 2. Allow for element instance overrides next.
                this._styles = this.element.resolveStyles();
            }
            else if (definition.styles) {
                // 3. Default to the static definition.
                this._styles = definition.styles || null;
            }
        }
        // If we have styles after the above process, add them.
        if (this._styles !== null) {
            this.addStyles(this._styles);
        }
        this.needsInitialization = false;
    }
    renderTemplate(template) {
        const element = this.element;
        // When getting the host to render to, we start by looking
        // up the shadow root. If there isn't one, then that means
        // we're doing a Light DOM render to the element's direct children.
        const host = getShadowRoot(element) || element;
        if (this.view !== null) {
            // If there's already a view, we need to unbind and remove through dispose.
            this.view.dispose();
            this.view = null;
        }
        else if (!this.needsInitialization) {
            // If there was previous custom rendering, we need to clear out the host.
            _dom__WEBPACK_IMPORTED_MODULE_2__/* .DOM.removeChildNodes */ .SO.removeChildNodes(host);
        }
        if (template) {
            // If a new template was provided, render it.
            this.view = template.render(element, host, element);
        }
    }
    /**
     * Locates or creates a controller for the specified element.
     * @param element - The element to return the controller for.
     * @remarks
     * The specified element must have a {@link FASTElementDefinition}
     * registered either through the use of the {@link customElement}
     * decorator or a call to `FASTElement.define`.
     */
    static forCustomElement(element) {
        const controller = element.$fastController;
        if (controller !== void 0) {
            return controller;
        }
        const definition = _fast_definitions__WEBPACK_IMPORTED_MODULE_3__/* .FASTElementDefinition.forType */ .W.forType(element.constructor);
        if (definition === void 0) {
            throw new Error("Missing FASTElement definition.");
        }
        return (element.$fastController = new Controller(element, definition));
    }
}
__decorate([
    _observation_observable__WEBPACK_IMPORTED_MODULE_1__/* .observable */ .LO
], Controller.prototype, "isConnected", void 0);


/***/ }),

/***/ 436:
/***/ (() => {



/***/ }),

/***/ 472:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": () => /* binding */ BindingDirective,
/* harmony export */   "S": () => /* binding */ BindingBehavior
/* harmony export */ });
/* harmony import */ var _observation_observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(202);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(676);
/* harmony import */ var _directive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(373);




function normalBind(source, context) {
    this.source = source;
    this.context = context;
    if (this.bindingObserver === null) {
        this.bindingObserver = _observation_observable__WEBPACK_IMPORTED_MODULE_0__/* .Observable.binding */ .y$.binding(this.binding, this, this.isBindingVolatile);
    }
    this.updateTarget(this.bindingObserver.observe(source, context));
}
function triggerBind(source, context) {
    this.source = source;
    this.context = context;
    this.target.addEventListener(this.targetName, this);
}
function normalUnbind() {
    this.bindingObserver.disconnect();
    this.source = null;
    this.context = null;
}
function contentUnbind() {
    this.bindingObserver.disconnect();
    this.source = null;
    this.context = null;
    const view = this.target.$fastView;
    if (view !== void 0 && view.isComposed) {
        view.unbind();
        view.needsBindOnly = true;
    }
}
function triggerUnbind() {
    this.target.removeEventListener(this.targetName, this);
    this.source = null;
    this.context = null;
}
function updateAttributeTarget(value) {
    _dom__WEBPACK_IMPORTED_MODULE_1__/* .DOM.setAttribute */ .SO.setAttribute(this.target, this.targetName, value);
}
function updateBooleanAttributeTarget(value) {
    _dom__WEBPACK_IMPORTED_MODULE_1__/* .DOM.setBooleanAttribute */ .SO.setBooleanAttribute(this.target, this.targetName, value);
}
function updateContentTarget(value) {
    // If there's no actual value, then this equates to the
    // empty string for the purposes of content bindings.
    if (value === null || value === undefined) {
        value = "";
    }
    // If the value has a "create" method, then it's a template-like.
    if (value.create) {
        this.target.textContent = "";
        let view = this.target.$fastView;
        // If there's no previous view that we might be able to
        // reuse then create a new view from the template.
        if (view === void 0) {
            view = value.create();
        }
        else {
            // If there is a previous view, but it wasn't created
            // from the same template as the new value, then we
            // need to remove the old view if it's still in the DOM
            // and create a new view from the template.
            if (this.target.$fastTemplate !== value) {
                if (view.isComposed) {
                    view.remove();
                    view.unbind();
                }
                view = value.create();
            }
        }
        // It's possible that the value is the same as the previous template
        // and that there's actually no need to compose it.
        if (!view.isComposed) {
            view.isComposed = true;
            view.bind(this.source, this.context);
            view.insertBefore(this.target);
            this.target.$fastView = view;
            this.target.$fastTemplate = value;
        }
        else if (view.needsBindOnly) {
            view.needsBindOnly = false;
            view.bind(this.source, this.context);
        }
    }
    else {
        const view = this.target.$fastView;
        // If there is a view and it's currently composed into
        // the DOM, then we need to remove it.
        if (view !== void 0 && view.isComposed) {
            view.isComposed = false;
            view.remove();
            if (view.needsBindOnly) {
                view.needsBindOnly = false;
            }
            else {
                view.unbind();
            }
        }
        this.target.textContent = value;
    }
}
function updatePropertyTarget(value) {
    this.target[this.targetName] = value;
}
function updateClassTarget(value) {
    const classVersions = this.classVersions || Object.create(null);
    const target = this.target;
    let version = this.version || 0;
    // Add the classes, tracking the version at which they were added.
    if (value !== null && value !== undefined && value.length) {
        const names = value.split(/\s+/);
        for (let i = 0, ii = names.length; i < ii; ++i) {
            const currentName = names[i];
            if (currentName === "") {
                continue;
            }
            classVersions[currentName] = version;
            target.classList.add(currentName);
        }
    }
    this.classVersions = classVersions;
    this.version = version + 1;
    // If this is the first call to add classes, there's no need to remove old ones.
    if (version === 0) {
        return;
    }
    // Remove classes from the previous version.
    version -= 1;
    for (const name in classVersions) {
        if (classVersions[name] === version) {
            target.classList.remove(name);
        }
    }
}
/**
 * A directive that configures data binding to element content and attributes.
 * @public
 */
class BindingDirective extends _directive__WEBPACK_IMPORTED_MODULE_2__/* .NamedTargetDirective */ .jS {
    /**
     * Creates an instance of BindingDirective.
     * @param binding - A binding that returns the data used to update the DOM.
     */
    constructor(binding) {
        super();
        this.binding = binding;
        this.bind = normalBind;
        this.unbind = normalUnbind;
        this.updateTarget = updateAttributeTarget;
        this.isBindingVolatile = _observation_observable__WEBPACK_IMPORTED_MODULE_0__/* .Observable.isVolatileBinding */ .y$.isVolatileBinding(this.binding);
    }
    /**
     * Gets/sets the name of the attribute or property that this
     * binding is targeting.
     */
    get targetName() {
        return this.originalTargetName;
    }
    set targetName(value) {
        this.originalTargetName = value;
        if (value === void 0) {
            return;
        }
        switch (value[0]) {
            case ":":
                this.cleanedTargetName = value.substr(1);
                this.updateTarget = updatePropertyTarget;
                if (this.cleanedTargetName === "innerHTML") {
                    const binding = this.binding;
                    /* eslint-disable-next-line */
                    this.binding = (s, c) => _dom__WEBPACK_IMPORTED_MODULE_1__/* .DOM.createHTML */ .SO.createHTML(binding(s, c));
                }
                break;
            case "?":
                this.cleanedTargetName = value.substr(1);
                this.updateTarget = updateBooleanAttributeTarget;
                break;
            case "@":
                this.cleanedTargetName = value.substr(1);
                this.bind = triggerBind;
                this.unbind = triggerUnbind;
                break;
            default:
                this.cleanedTargetName = value;
                if (value === "class") {
                    this.updateTarget = updateClassTarget;
                }
                break;
        }
    }
    /**
     * Makes this binding target the content of an element rather than
     * a particular attribute or property.
     */
    targetAtContent() {
        this.updateTarget = updateContentTarget;
        this.unbind = contentUnbind;
    }
    /**
     * Creates the runtime BindingBehavior instance based on the configuration
     * information stored in the BindingDirective.
     * @param target - The target node that the binding behavior should attach to.
     */
    createBehavior(target) {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        return new BindingBehavior(target, this.binding, this.isBindingVolatile, this.bind, this.unbind, this.updateTarget, this.cleanedTargetName);
    }
}
/**
 * A behavior that updates content and attributes based on a configured
 * BindingDirective.
 * @public
 */
class BindingBehavior {
    /**
     * Creates an instance of BindingBehavior.
     * @param target - The target of the data updates.
     * @param binding - The binding that returns the latest value for an update.
     * @param isBindingVolatile - Indicates whether the binding has volatile dependencies.
     * @param bind - The operation to perform during binding.
     * @param unbind - The operation to perform during unbinding.
     * @param updateTarget - The operation to perform when updating.
     * @param targetName - The name of the target attribute or property to update.
     */
    constructor(target, binding, isBindingVolatile, bind, unbind, updateTarget, targetName) {
        /** @internal */
        this.source = null;
        /** @internal */
        this.context = null;
        /** @internal */
        this.bindingObserver = null;
        this.target = target;
        this.binding = binding;
        this.isBindingVolatile = isBindingVolatile;
        this.bind = bind;
        this.unbind = unbind;
        this.updateTarget = updateTarget;
        this.targetName = targetName;
    }
    /** @internal */
    handleChange() {
        this.updateTarget(this.bindingObserver.observe(this.source, this.context));
    }
    /** @internal */
    handleEvent(event) {
        (0,_observation_observable__WEBPACK_IMPORTED_MODULE_0__/* .setCurrentEvent */ .z8)(event);
        const result = this.binding(this.source, this.context);
        (0,_observation_observable__WEBPACK_IMPORTED_MODULE_0__/* .setCurrentEvent */ .z8)(null);
        if (result !== true) {
            event.preventDefault();
        }
    }
}


/***/ }),

/***/ 248:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "o": () => /* binding */ ChildrenBehavior,
/* harmony export */   "p": () => /* binding */ children
/* harmony export */ });
/* harmony import */ var _directive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(373);
/* harmony import */ var _node_observation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(300);


/**
 * The runtime behavior for child node observation.
 * @public
 */
class ChildrenBehavior extends _node_observation__WEBPACK_IMPORTED_MODULE_0__/* .NodeObservationBehavior */ .x {
    /**
     * Creates an instance of ChildrenBehavior.
     * @param target - The element target to observe children on.
     * @param options - The options to use when observing the element children.
     */
    constructor(target, options) {
        super(target, options);
        this.observer = null;
        options.childList = true;
    }
    /**
     * Begins observation of the nodes.
     */
    observe() {
        if (this.observer === null) {
            this.observer = new MutationObserver(this.handleEvent.bind(this));
        }
        this.observer.observe(this.target, this.options);
    }
    /**
     * Disconnects observation of the nodes.
     */
    disconnect() {
        this.observer.disconnect();
    }
    /**
     * Retrieves the nodes that should be assigned to the target.
     */
    getNodes() {
        if ("subtree" in this.options) {
            return Array.from(this.target.querySelectorAll(this.options.selector));
        }
        return Array.from(this.target.childNodes);
    }
}
/**
 * A directive that observes the `childNodes` of an element and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure child node observation.
 * @public
 */
function children(propertyOrOptions) {
    if (typeof propertyOrOptions === "string") {
        propertyOrOptions = {
            property: propertyOrOptions,
        };
    }
    return new _directive__WEBPACK_IMPORTED_MODULE_1__/* .AttachedBehaviorDirective */ .Cq("fast-children", ChildrenBehavior, propertyOrOptions);
}


/***/ }),

/***/ 373:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Xe": () => /* binding */ Directive,
/* harmony export */   "jS": () => /* binding */ NamedTargetDirective,
/* harmony export */   "Cq": () => /* binding */ AttachedBehaviorDirective
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(676);

/**
 * Instructs the template engine to apply behavior to a node.
 * @public
 */
class Directive {
    constructor() {
        /**
         * The index of the DOM node to which the created behavior will apply.
         */
        this.targetIndex = 0;
    }
}
/**
 * A {@link Directive} that targets a named attribute or property on a node or object.
 * @public
 */
class NamedTargetDirective extends Directive {
    constructor() {
        super(...arguments);
        /**
         * Creates a placeholder string based on the directive's index within the template.
         * @param index - The index of the directive within the template.
         */
        this.createPlaceholder = _dom__WEBPACK_IMPORTED_MODULE_0__/* .DOM.createInterpolationPlaceholder */ .SO.createInterpolationPlaceholder;
    }
}
/**
 * A directive that attaches special behavior to an element via a custom attribute.
 * @public
 */
class AttachedBehaviorDirective extends Directive {
    /**
     *
     * @param name - The name of the behavior; used as a custom attribute on the element.
     * @param behavior - The behavior to instantiate and attach to the element.
     * @param options - Options to pass to the behavior during creation.
     */
    constructor(name, behavior, options) {
        super();
        this.name = name;
        this.behavior = behavior;
        this.options = options;
    }
    /**
     * Creates a placeholder string based on the directive's index within the template.
     * @param index - The index of the directive within the template.
     * @remarks
     * Creates a custom attribute placeholder.
     */
    createPlaceholder(index) {
        return _dom__WEBPACK_IMPORTED_MODULE_0__/* .DOM.createCustomAttributePlaceholder */ .SO.createCustomAttributePlaceholder(this.name, index);
    }
    /**
     * Creates a behavior for the provided target node.
     * @param target - The node instance to create the behavior for.
     * @remarks
     * Creates an instance of the `behavior` type this directive was constructed with
     * and passes the target and options to that `behavior`'s constructor.
     */
    createBehavior(target) {
        return new this.behavior(target, this.options);
    }
}


/***/ }),

/***/ 300:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "R": () => /* binding */ elements,
/* harmony export */   "x": () => /* binding */ NodeObservationBehavior
/* harmony export */ });
/* harmony import */ var _observation_observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(202);
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(204);


/**
 * Creates a function that can be used to filter a Node array, selecting only elements.
 * @param selector - An optional selector to restrict the filter to.
 * @public
 */
function elements(selector) {
    if (selector) {
        return function (value, index, array) {
            return value.nodeType === 1 && value.matches(selector);
        };
    }
    return function (value, index, array) {
        return value.nodeType === 1;
    };
}
/**
 * A base class for node observation.
 * @internal
 */
class NodeObservationBehavior {
    /**
     * Creates an instance of NodeObservationBehavior.
     * @param target - The target to assign the nodes property on.
     * @param options - The options to use in configuring node observation.
     */
    constructor(target, options) {
        this.target = target;
        this.options = options;
        this.source = null;
    }
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source) {
        const name = this.options.property;
        this.shouldUpdate = _observation_observable__WEBPACK_IMPORTED_MODULE_0__/* .Observable.getAccessors */ .y$.getAccessors(source).some((x) => x.name === name);
        this.source = source;
        this.updateTarget(this.computeNodes());
        if (this.shouldUpdate) {
            this.observe();
        }
    }
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    unbind() {
        this.updateTarget(_interfaces__WEBPACK_IMPORTED_MODULE_1__/* .emptyArray */ .o);
        this.source = null;
        if (this.shouldUpdate) {
            this.disconnect();
        }
    }
    /** @internal */
    handleEvent() {
        this.updateTarget(this.computeNodes());
    }
    computeNodes() {
        let nodes = this.getNodes();
        if (this.options.filter !== void 0) {
            nodes = nodes.filter(this.options.filter);
        }
        return nodes;
    }
    updateTarget(value) {
        this.source[this.options.property] = value;
    }
}


/***/ }),

/***/ 900:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "L": () => /* binding */ RefBehavior,
/* harmony export */   "i": () => /* binding */ ref
/* harmony export */ });
/* harmony import */ var _directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(373);

/**
 * The runtime behavior for template references.
 * @public
 */
class RefBehavior {
    /**
     * Creates an instance of RefBehavior.
     * @param target - The element to reference.
     * @param propertyName - The name of the property to assign the reference to.
     */
    constructor(target, propertyName) {
        this.target = target;
        this.propertyName = propertyName;
    }
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source) {
        source[this.propertyName] = this.target;
    }
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    unbind() { }
}
/**
 * A directive that observes the updates a property with a reference to the element.
 * @param propertyName - The name of the property to assign the reference to.
 * @public
 */
function ref(propertyName) {
    return new _directive__WEBPACK_IMPORTED_MODULE_0__/* .AttachedBehaviorDirective */ .Cq("fast-ref", RefBehavior, propertyName);
}


/***/ }),

/***/ 622:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "eN": () => /* binding */ RepeatBehavior,
/* harmony export */   "Gx": () => /* binding */ RepeatDirective,
/* harmony export */   "rx": () => /* binding */ repeat
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(676);
/* harmony import */ var _observation_observable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(202);
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(331);
/* harmony import */ var _observation_array_observer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(751);
/* harmony import */ var _directive__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(373);





const defaultRepeatOptions = Object.freeze({
    positioning: false,
});
function bindWithoutPositioning(view, items, index, context) {
    view.bind(items[index], context);
}
function bindWithPositioning(view, items, index, context) {
    const childContext = Object.create(context);
    childContext.index = index;
    childContext.length = items.length;
    view.bind(items[index], childContext);
}
/**
 * A behavior that renders a template for each item in an array.
 * @public
 */
class RepeatBehavior {
    /**
     * Creates an instance of RepeatBehavior.
     * @param location - The location in the DOM to render the repeat.
     * @param itemsBinding - The array to render.
     * @param isItemsBindingVolatile - Indicates whether the items binding has volatile dependencies.
     * @param templateBinding - The template to render for each item.
     * @param isTemplateBindingVolatile - Indicates whether the template binding has volatile dependencies.
     * @param options - Options used to turn on special repeat features.
     */
    constructor(location, itemsBinding, isItemsBindingVolatile, templateBinding, isTemplateBindingVolatile, options) {
        this.location = location;
        this.itemsBinding = itemsBinding;
        this.templateBinding = templateBinding;
        this.options = options;
        this.source = null;
        this.views = [];
        this.items = null;
        this.itemsObserver = null;
        this.originalContext = void 0;
        this.childContext = void 0;
        this.bindView = bindWithoutPositioning;
        this.itemsBindingObserver = _observation_observable__WEBPACK_IMPORTED_MODULE_0__/* .Observable.binding */ .y$.binding(itemsBinding, this, isItemsBindingVolatile);
        this.templateBindingObserver = _observation_observable__WEBPACK_IMPORTED_MODULE_0__/* .Observable.binding */ .y$.binding(templateBinding, this, isTemplateBindingVolatile);
        if (options.positioning) {
            this.bindView = bindWithPositioning;
        }
    }
    /**
     * Bind this behavior to the source.
     * @param source - The source to bind to.
     * @param context - The execution context that the binding is operating within.
     */
    bind(source, context) {
        this.source = source;
        this.originalContext = context;
        this.childContext = Object.create(context);
        this.childContext.parent = source;
        this.childContext.parentContext = this.originalContext;
        this.items = this.itemsBindingObserver.observe(source, this.originalContext);
        this.template = this.templateBindingObserver.observe(source, this.originalContext);
        this.observeItems();
        this.refreshAllViews();
    }
    /**
     * Unbinds this behavior from the source.
     * @param source - The source to unbind from.
     */
    unbind() {
        this.source = null;
        this.items = null;
        if (this.itemsObserver !== null) {
            this.itemsObserver.unsubscribe(this);
        }
        this.unbindAllViews();
        this.itemsBindingObserver.disconnect();
        this.templateBindingObserver.disconnect();
    }
    /** @internal */
    handleChange(source, args) {
        if (source === this.itemsBinding) {
            this.items = this.itemsBindingObserver.observe(this.source, this.originalContext);
            this.observeItems();
            this.refreshAllViews();
        }
        else if (source === this.templateBinding) {
            this.template = this.templateBindingObserver.observe(this.source, this.originalContext);
            this.refreshAllViews(true);
        }
        else {
            this.updateViews(args);
        }
    }
    observeItems() {
        if (!this.items) {
            this.items = [];
        }
        const oldObserver = this.itemsObserver;
        const newObserver = (this.itemsObserver = _observation_observable__WEBPACK_IMPORTED_MODULE_0__/* .Observable.getNotifier */ .y$.getNotifier(this.items));
        if (oldObserver !== newObserver) {
            if (oldObserver !== null) {
                oldObserver.unsubscribe(this);
            }
            newObserver.subscribe(this);
        }
    }
    updateViews(splices) {
        const childContext = this.childContext;
        const views = this.views;
        const totalRemoved = [];
        const bindView = this.bindView;
        let removeDelta = 0;
        for (let i = 0, ii = splices.length; i < ii; ++i) {
            const splice = splices[i];
            const removed = splice.removed;
            totalRemoved.push(...views.splice(splice.index + removeDelta, removed.length));
            removeDelta -= splice.addedCount;
        }
        const items = this.items;
        const template = this.template;
        for (let i = 0, ii = splices.length; i < ii; ++i) {
            const splice = splices[i];
            let addIndex = splice.index;
            const end = addIndex + splice.addedCount;
            for (; addIndex < end; ++addIndex) {
                const neighbor = views[addIndex];
                const location = neighbor ? neighbor.firstChild : this.location;
                const view = totalRemoved.length > 0 ? totalRemoved.shift() : template.create();
                views.splice(addIndex, 0, view);
                bindView(view, items, addIndex, childContext);
                view.insertBefore(location);
            }
        }
        for (let i = 0, ii = totalRemoved.length; i < ii; ++i) {
            totalRemoved[i].dispose();
        }
        if (this.options.positioning) {
            for (let i = 0, ii = views.length; i < ii; ++i) {
                const currentContext = views[i].context;
                currentContext.length = ii;
                currentContext.index = i;
            }
        }
    }
    refreshAllViews(templateChanged = false) {
        const items = this.items;
        const childContext = this.childContext;
        const template = this.template;
        const location = this.location;
        const bindView = this.bindView;
        let itemsLength = items.length;
        let views = this.views;
        let viewsLength = views.length;
        if (itemsLength === 0 || templateChanged) {
            // all views need to be removed
            _view__WEBPACK_IMPORTED_MODULE_1__/* .HTMLView.disposeContiguousBatch */ .b.disposeContiguousBatch(views);
            viewsLength = 0;
        }
        if (viewsLength === 0) {
            // all views need to be created
            this.views = views = new Array(itemsLength);
            for (let i = 0; i < itemsLength; ++i) {
                const view = template.create();
                bindView(view, items, i, childContext);
                views[i] = view;
                view.insertBefore(location);
            }
        }
        else {
            // attempt to reuse existing views with new data
            let i = 0;
            for (; i < itemsLength; ++i) {
                if (i < viewsLength) {
                    const view = views[i];
                    bindView(view, items, i, childContext);
                }
                else {
                    const view = template.create();
                    bindView(view, items, i, childContext);
                    views.push(view);
                    view.insertBefore(location);
                }
            }
            const removed = views.splice(i, viewsLength - i);
            for (i = 0, itemsLength = removed.length; i < itemsLength; ++i) {
                removed[i].dispose();
            }
        }
    }
    unbindAllViews() {
        const views = this.views;
        for (let i = 0, ii = views.length; i < ii; ++i) {
            views[i].unbind();
        }
    }
}
/**
 * A directive that configures list rendering.
 * @public
 */
class RepeatDirective extends _directive__WEBPACK_IMPORTED_MODULE_2__/* .Directive */ .Xe {
    /**
     * Creates an instance of RepeatDirective.
     * @param itemsBinding - The binding that provides the array to render.
     * @param templateBinding - The template binding used to obtain a template to render for each item in the array.
     * @param options - Options used to turn on special repeat features.
     */
    constructor(itemsBinding, templateBinding, options) {
        super();
        this.itemsBinding = itemsBinding;
        this.templateBinding = templateBinding;
        this.options = options;
        /**
         * Creates a placeholder string based on the directive's index within the template.
         * @param index - The index of the directive within the template.
         */
        this.createPlaceholder = _dom__WEBPACK_IMPORTED_MODULE_3__/* .DOM.createBlockPlaceholder */ .SO.createBlockPlaceholder;
        (0,_observation_array_observer__WEBPACK_IMPORTED_MODULE_4__/* .enableArrayObservation */ .F)();
        this.isItemsBindingVolatile = _observation_observable__WEBPACK_IMPORTED_MODULE_0__/* .Observable.isVolatileBinding */ .y$.isVolatileBinding(itemsBinding);
        this.isTemplateBindingVolatile = _observation_observable__WEBPACK_IMPORTED_MODULE_0__/* .Observable.isVolatileBinding */ .y$.isVolatileBinding(templateBinding);
    }
    /**
     * Creates a behavior for the provided target node.
     * @param target - The node instance to create the behavior for.
     */
    createBehavior(target) {
        return new RepeatBehavior(target, this.itemsBinding, this.isItemsBindingVolatile, this.templateBinding, this.isTemplateBindingVolatile, this.options);
    }
}
/**
 * A directive that enables list rendering.
 * @param itemsBinding - The array to render.
 * @param templateOrTemplateBinding - The template or a template binding used obtain a template
 * to render for each item in the array.
 * @param options - Options used to turn on special repeat features.
 * @public
 */
function repeat(itemsBinding, templateOrTemplateBinding, options = defaultRepeatOptions) {
    const templateBinding = typeof templateOrTemplateBinding === "function"
        ? templateOrTemplateBinding
        : () => templateOrTemplateBinding;
    return new RepeatDirective(itemsBinding, templateBinding, options);
}


/***/ }),

/***/ 392:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "y": () => /* binding */ SlottedBehavior,
/* harmony export */   "Q": () => /* binding */ slotted
/* harmony export */ });
/* harmony import */ var _directive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(373);
/* harmony import */ var _node_observation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(300);


/**
 * The runtime behavior for slotted node observation.
 * @public
 */
class SlottedBehavior extends _node_observation__WEBPACK_IMPORTED_MODULE_0__/* .NodeObservationBehavior */ .x {
    /**
     * Creates an instance of SlottedBehavior.
     * @param target - The slot element target to observe.
     * @param options - The options to use when observing the slot.
     */
    constructor(target, options) {
        super(target, options);
    }
    /**
     * Begins observation of the nodes.
     */
    observe() {
        this.target.addEventListener("slotchange", this);
    }
    /**
     * Disconnects observation of the nodes.
     */
    disconnect() {
        this.target.removeEventListener("slotchange", this);
    }
    /**
     * Retrieves the nodes that should be assigned to the target.
     */
    getNodes() {
        return this.target.assignedNodes(this.options);
    }
}
/**
 * A directive that observes the `assignedNodes()` of a slot and updates a property
 * whenever they change.
 * @param propertyOrOptions - The options used to configure slotted node observation.
 * @public
 */
function slotted(propertyOrOptions) {
    if (typeof propertyOrOptions === "string") {
        propertyOrOptions = { property: propertyOrOptions };
    }
    return new _directive__WEBPACK_IMPORTED_MODULE_1__/* .AttachedBehaviorDirective */ .Cq("fast-slotted", SlottedBehavior, propertyOrOptions);
}


/***/ }),

/***/ 865:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "g": () => /* binding */ when
/* harmony export */ });
/**
 * A directive that enables basic conditional rendering in a template.
 * @param binding - The condition to test for rendering.
 * @param templateOrTemplateBinding - The template or a binding that gets
 * the template to render when the condition is true.
 * @public
 */
function when(binding, templateOrTemplateBinding) {
    const getTemplate = typeof templateOrTemplateBinding === "function"
        ? templateOrTemplateBinding
        : () => templateOrTemplateBinding;
    return (source, context) => binding(source, context) ? getTemplate(source, context) : null;
}


/***/ }),

/***/ 676:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pc": () => /* binding */ _interpolationStart,
/* harmony export */   "Yl": () => /* binding */ _interpolationEnd,
/* harmony export */   "SO": () => /* binding */ DOM
/* harmony export */ });
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(906);

const updateQueue = [];
/* eslint-disable */
const fastHTMLPolicy = _platform__WEBPACK_IMPORTED_MODULE_0__/* .$global.trustedTypes.createPolicy */ .P.trustedTypes.createPolicy("fast-html", {
    createHTML: html => html,
});
/* eslint-enable */
let htmlPolicy = fastHTMLPolicy;
function processQueue() {
    const capacity = 1024;
    let index = 0;
    while (index < updateQueue.length) {
        const task = updateQueue[index];
        task.call();
        index++;
        // Prevent leaking memory for long chains of recursive calls to `queueMicroTask`.
        // If we call `queueMicroTask` within a MicroTask scheduled by `queueMicroTask`, the queue will
        // grow, but to avoid an O(n) walk for every MicroTask we execute, we don't
        // shift MicroTasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 MicroTasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (let scan = 0, newLength = updateQueue.length - index; scan < newLength; scan++) {
                updateQueue[scan] = updateQueue[scan + index];
            }
            updateQueue.length -= index;
            index = 0;
        }
    }
    updateQueue.length = 0;
}
const marker = `fast-${Math.random().toString(36).substring(2, 8)}`;
/** @internal */
const _interpolationStart = `${marker}{`;
/** @internal */
const _interpolationEnd = `}${marker}`;
/**
 * Common DOM APIs.
 * @public
 */
const DOM = Object.freeze({
    /**
     * Indicates whether the DOM supports the adoptedStyleSheets feature.
     */
    supportsAdoptedStyleSheets: Array.isArray(document.adoptedStyleSheets) &&
        "replace" in CSSStyleSheet.prototype,
    /**
     * Sets the HTML trusted types policy used by the templating engine.
     * @param policy - The policy to set for HTML.
     * @remarks
     * This API can only be called once, for security reasons. It should be
     * called by the application developer at the start of their program.
     */
    setHTMLPolicy(policy) {
        if (htmlPolicy !== fastHTMLPolicy) {
            throw new Error("The HTML policy can only be set once.");
        }
        htmlPolicy = policy;
    },
    /**
     * Turns a string into trusted HTML using the configured trusted types policy.
     * @param html - The string to turn into trusted HTML.
     * @remarks
     * Used internally by the template engine when creating templates
     * and setting innerHTML.
     */
    createHTML(html) {
        return htmlPolicy.createHTML(html);
    },
    /**
     * Determines if the provided node is a template marker used by the runtime.
     * @param node - The node to test.
     */
    isMarker(node) {
        return node && node.nodeType === 8 && node.data.startsWith(marker);
    },
    /**
     * Given a marker node, extract the {@link Directive} index from the placeholder.
     * @param node - The marker node to extract the index from.
     */
    extractDirectiveIndexFromMarker(node) {
        return parseInt(node.data.replace(`${marker}:`, ""));
    },
    /**
     * Creates a placeholder string suitable for marking out a location *within*
     * an attribute value or HTML content.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by binding directives.
     */
    createInterpolationPlaceholder(index) {
        return `${_interpolationStart}${index}${_interpolationEnd}`;
    },
    /**
     * Creates a placeholder that manifests itself as an attribute on an
     * element.
     * @param attributeName - The name of the custom attribute.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by attribute directives such as `ref`, `slotted`, and `children`.
     */
    createCustomAttributePlaceholder(attributeName, index) {
        return `${attributeName}="${this.createInterpolationPlaceholder(index)}"`;
    },
    /**
     * Creates a placeholder that manifests itself as a marker within the DOM structure.
     * @param index - The directive index to create the placeholder for.
     * @remarks
     * Used internally by structural directives such as `repeat`.
     */
    createBlockPlaceholder(index) {
        return `<!--${marker}:${index}-->`;
    },
    /**
     * Schedules DOM update work in the next async batch.
     * @param callable - The callable function or object to queue.
     */
    queueUpdate(callable) {
        if (updateQueue.length < 1) {
            window.requestAnimationFrame(processQueue);
        }
        updateQueue.push(callable);
    },
    /**
     * Resolves with the next DOM update.
     */
    nextUpdate() {
        return new Promise((resolve) => {
            DOM.queueUpdate(resolve);
        });
    },
    /**
     * Sets an attribute value on an element.
     * @param element - The element to set the attribute value on.
     * @param attributeName - The attribute name to set.
     * @param value - The value of the attribute to set.
     * @remarks
     * If the value is `null` or `undefined`, the attribute is removed, otherwise
     * it is set to the provided value using the standard `setAttribute` API.
     */
    setAttribute(element, attributeName, value) {
        if (value === null || value === undefined) {
            element.removeAttribute(attributeName);
        }
        else {
            element.setAttribute(attributeName, value);
        }
    },
    /**
     * Sets a boolean attribute value.
     * @param element - The element to set the boolean attribute value on.
     * @param attributeName - The attribute name to set.
     * @param value - The value of the attribute to set.
     * @remarks
     * If the value is true, the attribute is added; otherwise it is removed.
     */
    setBooleanAttribute(element, attributeName, value) {
        value
            ? element.setAttribute(attributeName, "")
            : element.removeAttribute(attributeName);
    },
    /**
     * Removes all the child nodes of the provided parent node.
     * @param parent - The node to remove the children from.
     */
    removeChildNodes(parent) {
        for (let child = parent.firstChild; child !== null; child = parent.firstChild) {
            parent.removeChild(child);
        }
    },
    /**
     * Creates a TreeWalker configured to walk a template fragment.
     * @param fragment - The fragment to walk.
     */
    createTemplateWalker(fragment) {
        return document.createTreeWalker(fragment, 133, // element, text, comment
        null, false);
    },
});


/***/ }),

/***/ 940:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "W": () => /* binding */ FASTElementDefinition
/* harmony export */ });
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(774);
/* harmony import */ var _attributes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(303);
/* harmony import */ var _observation_observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(202);



const defaultShadowOptions = { mode: "open" };
const defaultElementOptions = {};
const fastDefinitions = new Map();
/**
 * Defines metadata for a FASTElement.
 * @public
 */
class FASTElementDefinition {
    /**
     * Creates an instance of FASTElementDefinition.
     * @param type - The type this definition is being created for.
     * @param nameOrConfig - The name of the element to define or a config object
     * that describes the element to define.
     */
    constructor(type, nameOrConfig = type.definition) {
        if (typeof nameOrConfig === "string") {
            nameOrConfig = { name: nameOrConfig };
        }
        this.type = type;
        this.name = nameOrConfig.name;
        this.template = nameOrConfig.template;
        const attributes = _attributes__WEBPACK_IMPORTED_MODULE_0__/* .AttributeDefinition.collect */ .so.collect(type, nameOrConfig.attributes);
        const observedAttributes = new Array(attributes.length);
        const propertyLookup = {};
        const attributeLookup = {};
        for (let i = 0, ii = attributes.length; i < ii; ++i) {
            const current = attributes[i];
            observedAttributes[i] = current.attribute;
            propertyLookup[current.name] = current;
            attributeLookup[current.attribute] = current;
        }
        this.attributes = attributes;
        this.observedAttributes = observedAttributes;
        this.propertyLookup = propertyLookup;
        this.attributeLookup = attributeLookup;
        this.shadowOptions =
            nameOrConfig.shadowOptions === void 0
                ? defaultShadowOptions
                : nameOrConfig.shadowOptions === null
                    ? void 0
                    : Object.assign(Object.assign({}, defaultShadowOptions), nameOrConfig.shadowOptions);
        this.elementOptions =
            nameOrConfig.elementOptions === void 0
                ? defaultElementOptions
                : Object.assign(Object.assign({}, defaultElementOptions), nameOrConfig.elementOptions);
        this.styles =
            nameOrConfig.styles === void 0
                ? void 0
                : Array.isArray(nameOrConfig.styles)
                    ? _styles__WEBPACK_IMPORTED_MODULE_1__/* .ElementStyles.create */ .XL.create(nameOrConfig.styles)
                    : nameOrConfig.styles instanceof _styles__WEBPACK_IMPORTED_MODULE_1__/* .ElementStyles */ .XL
                        ? nameOrConfig.styles
                        : _styles__WEBPACK_IMPORTED_MODULE_1__/* .ElementStyles.create */ .XL.create([nameOrConfig.styles]);
    }
    /**
     * Defines a custom element based on this definition.
     * @param registry - The element registry to define the element in.
     */
    define(registry = customElements) {
        const type = this.type;
        if (!this.isDefined) {
            const attributes = this.attributes;
            const proto = type.prototype;
            for (let i = 0, ii = attributes.length; i < ii; ++i) {
                _observation_observable__WEBPACK_IMPORTED_MODULE_2__/* .Observable.defineProperty */ .y$.defineProperty(proto, attributes[i]);
            }
            Reflect.defineProperty(type, "observedAttributes", {
                value: this.observedAttributes,
                enumerable: true,
            });
            fastDefinitions.set(type, this);
            this.isDefined = true;
        }
        if (!registry.get(this.name)) {
            registry.define(this.name, type, this.elementOptions);
        }
        return this;
    }
    /**
     * Gets the element definition associated with the specified type.
     * @param type - The custom element type to retrieve the definition for.
     */
    static forType(type) {
        return fastDefinitions.get(type);
    }
}


/***/ }),

/***/ 753:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "H": () => /* binding */ FASTElement,
/* harmony export */   "M": () => /* binding */ customElement
/* harmony export */ });
/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(154);
/* harmony import */ var _fast_definitions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(940);


/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
function createFASTElement(BaseType) {
    return class extends BaseType {
        constructor() {
            /* eslint-disable-next-line */
            super();
            _controller__WEBPACK_IMPORTED_MODULE_0__/* .Controller.forCustomElement */ .Q.forCustomElement(this);
        }
        $emit(type, detail, options) {
            return this.$fastController.emit(type, detail, options);
        }
        connectedCallback() {
            this.$fastController.onConnectedCallback();
        }
        disconnectedCallback() {
            this.$fastController.onDisconnectedCallback();
        }
        attributeChangedCallback(name, oldValue, newValue) {
            this.$fastController.onAttributeChangedCallback(name, oldValue, newValue);
        }
    };
}
/**
 * A minimal base class for FASTElements that also provides
 * static helpers for working with FASTElements.
 * @public
 */
const FASTElement = Object.assign(createFASTElement(HTMLElement), {
    /**
     * Creates a new FASTElement base class inherited from the
     * provided base type.
     * @param BaseType - The base element type to inherit from.
     */
    from(BaseType) {
        return createFASTElement(BaseType);
    },
    /**
     * Defines a platform custom element based on the provided type and definition.
     * @param type - The custom element type to define.
     * @param nameOrDef - The name of the element to define or a definition object
     * that describes the element to define.
     */
    define(type, nameOrDef) {
        return new _fast_definitions__WEBPACK_IMPORTED_MODULE_1__/* .FASTElementDefinition */ .W(type, nameOrDef).define().type;
    },
});
/**
 * Decorator: Defines a platform custom element based on `FASTElement`.
 * @param nameOrDef - The name of the element to define or a definition object
 * that describes the element to define.
 * @public
 */
function customElement(nameOrDef) {
    /* eslint-disable-next-line @typescript-eslint/explicit-function-return-type */
    return function (type) {
        new _fast_definitions__WEBPACK_IMPORTED_MODULE_1__/* .FASTElementDefinition */ .W(type, nameOrDef).define();
    };
}


/***/ }),

/***/ 80:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$global": () => /* reexport safe */ _platform__WEBPACK_IMPORTED_MODULE_0__.P,
/* harmony export */   "ViewTemplate": () => /* reexport safe */ _template__WEBPACK_IMPORTED_MODULE_1__._,
/* harmony export */   "html": () => /* reexport safe */ _template__WEBPACK_IMPORTED_MODULE_1__.d,
/* harmony export */   "FASTElement": () => /* reexport safe */ _fast_element__WEBPACK_IMPORTED_MODULE_2__.H,
/* harmony export */   "customElement": () => /* reexport safe */ _fast_element__WEBPACK_IMPORTED_MODULE_2__.M,
/* harmony export */   "FASTElementDefinition": () => /* reexport safe */ _fast_definitions__WEBPACK_IMPORTED_MODULE_3__.W,
/* harmony export */   "AttributeDefinition": () => /* reexport safe */ _attributes__WEBPACK_IMPORTED_MODULE_4__.so,
/* harmony export */   "attr": () => /* reexport safe */ _attributes__WEBPACK_IMPORTED_MODULE_4__.Lj,
/* harmony export */   "booleanConverter": () => /* reexport safe */ _attributes__WEBPACK_IMPORTED_MODULE_4__.bw,
/* harmony export */   "nullableNumberConverter": () => /* reexport safe */ _attributes__WEBPACK_IMPORTED_MODULE_4__.Id,
/* harmony export */   "Controller": () => /* reexport safe */ _controller__WEBPACK_IMPORTED_MODULE_5__.Q,
/* harmony export */   "emptyArray": () => /* reexport safe */ _interfaces__WEBPACK_IMPORTED_MODULE_6__.o,
/* harmony export */   "compileTemplate": () => /* reexport safe */ _template_compiler__WEBPACK_IMPORTED_MODULE_7__._,
/* harmony export */   "css": () => /* reexport safe */ _styles__WEBPACK_IMPORTED_MODULE_8__.iv,
/* harmony export */   "ElementStyles": () => /* reexport safe */ _styles__WEBPACK_IMPORTED_MODULE_8__.XL,
/* harmony export */   "HTMLView": () => /* reexport safe */ _view__WEBPACK_IMPORTED_MODULE_9__.b,
/* harmony export */   "ExecutionContext": () => /* reexport safe */ _observation_observable__WEBPACK_IMPORTED_MODULE_10__.rd,
/* harmony export */   "Observable": () => /* reexport safe */ _observation_observable__WEBPACK_IMPORTED_MODULE_10__.y$,
/* harmony export */   "defaultExecutionContext": () => /* reexport safe */ _observation_observable__WEBPACK_IMPORTED_MODULE_10__.Wp,
/* harmony export */   "observable": () => /* reexport safe */ _observation_observable__WEBPACK_IMPORTED_MODULE_10__.LO,
/* harmony export */   "setCurrentEvent": () => /* reexport safe */ _observation_observable__WEBPACK_IMPORTED_MODULE_10__.z8,
/* harmony export */   "volatile": () => /* reexport safe */ _observation_observable__WEBPACK_IMPORTED_MODULE_10__.lk,
/* harmony export */   "PropertyChangeNotifier": () => /* reexport safe */ _observation_notifier__WEBPACK_IMPORTED_MODULE_11__.A,
/* harmony export */   "SubscriberSet": () => /* reexport safe */ _observation_notifier__WEBPACK_IMPORTED_MODULE_11__.q,
/* harmony export */   "enableArrayObservation": () => /* reexport safe */ _observation_array_observer__WEBPACK_IMPORTED_MODULE_12__.F,
/* harmony export */   "DOM": () => /* reexport safe */ _dom__WEBPACK_IMPORTED_MODULE_13__.SO,
/* harmony export */   "BindingBehavior": () => /* reexport safe */ _directives_binding__WEBPACK_IMPORTED_MODULE_15__.S,
/* harmony export */   "BindingDirective": () => /* reexport safe */ _directives_binding__WEBPACK_IMPORTED_MODULE_15__.D,
/* harmony export */   "AttachedBehaviorDirective": () => /* reexport safe */ _directives_directive__WEBPACK_IMPORTED_MODULE_16__.Cq,
/* harmony export */   "Directive": () => /* reexport safe */ _directives_directive__WEBPACK_IMPORTED_MODULE_16__.Xe,
/* harmony export */   "NamedTargetDirective": () => /* reexport safe */ _directives_directive__WEBPACK_IMPORTED_MODULE_16__.jS,
/* harmony export */   "RefBehavior": () => /* reexport safe */ _directives_ref__WEBPACK_IMPORTED_MODULE_17__.L,
/* harmony export */   "ref": () => /* reexport safe */ _directives_ref__WEBPACK_IMPORTED_MODULE_17__.i,
/* harmony export */   "when": () => /* reexport safe */ _directives_when__WEBPACK_IMPORTED_MODULE_18__.g,
/* harmony export */   "RepeatBehavior": () => /* reexport safe */ _directives_repeat__WEBPACK_IMPORTED_MODULE_19__.eN,
/* harmony export */   "RepeatDirective": () => /* reexport safe */ _directives_repeat__WEBPACK_IMPORTED_MODULE_19__.Gx,
/* harmony export */   "repeat": () => /* reexport safe */ _directives_repeat__WEBPACK_IMPORTED_MODULE_19__.rx,
/* harmony export */   "SlottedBehavior": () => /* reexport safe */ _directives_slotted__WEBPACK_IMPORTED_MODULE_20__.y,
/* harmony export */   "slotted": () => /* reexport safe */ _directives_slotted__WEBPACK_IMPORTED_MODULE_20__.Q,
/* harmony export */   "ChildrenBehavior": () => /* reexport safe */ _directives_children__WEBPACK_IMPORTED_MODULE_21__.o,
/* harmony export */   "children": () => /* reexport safe */ _directives_children__WEBPACK_IMPORTED_MODULE_21__.p,
/* harmony export */   "elements": () => /* reexport safe */ _directives_node_observation__WEBPACK_IMPORTED_MODULE_22__.R
/* harmony export */ });
/* harmony import */ var _platform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(906);
/* harmony import */ var _template__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(873);
/* harmony import */ var _fast_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(753);
/* harmony import */ var _fast_definitions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(940);
/* harmony import */ var _attributes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(303);
/* harmony import */ var _controller__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(154);
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(204);
/* harmony import */ var _template_compiler__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1);
/* harmony import */ var _styles__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(774);
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(331);
/* harmony import */ var _observation_observable__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(202);
/* harmony import */ var _observation_notifier__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(868);
/* harmony import */ var _observation_array_observer__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(751);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(676);
/* harmony import */ var _directives_behavior__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(436);
/* harmony import */ var _directives_behavior__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(_directives_behavior__WEBPACK_IMPORTED_MODULE_14__);
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _directives_behavior__WEBPACK_IMPORTED_MODULE_14__) if(["default","FASTElementDefinition","css","ElementStyles","enableArrayObservation","DOM","elements","$global","ViewTemplate","html","FASTElement","customElement","AttributeDefinition","attr","booleanConverter","nullableNumberConverter","Controller","emptyArray","compileTemplate","HTMLView","ExecutionContext","Observable","defaultExecutionContext","observable","setCurrentEvent","volatile","PropertyChangeNotifier","SubscriberSet"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _directives_behavior__WEBPACK_IMPORTED_MODULE_14__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);
/* harmony import */ var _directives_binding__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(472);
/* harmony import */ var _directives_directive__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(373);
/* harmony import */ var _directives_ref__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(900);
/* harmony import */ var _directives_when__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(865);
/* harmony import */ var _directives_repeat__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(622);
/* harmony import */ var _directives_slotted__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(392);
/* harmony import */ var _directives_children__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(248);
/* harmony import */ var _directives_node_observation__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(300);

























/***/ }),

/***/ 204:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "o": () => /* binding */ emptyArray
/* harmony export */ });
/**
 * A readonly, empty array.
 * @remarks
 * Typically returned by APIs that return arrays when there are
 * no actual items to return.
 * @internal
 */
const emptyArray = Object.freeze([]);


/***/ }),

/***/ 751:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "F": () => /* binding */ enableArrayObservation
});

// EXTERNAL MODULE: ./node_modules/@microsoft/fast-element/dist/esm/dom.js
var dom = __webpack_require__(676);
// EXTERNAL MODULE: ./node_modules/@microsoft/fast-element/dist/esm/observation/observable.js
var observable = __webpack_require__(202);
// EXTERNAL MODULE: ./node_modules/@microsoft/fast-element/dist/esm/observation/notifier.js
var notifier = __webpack_require__(868);
// EXTERNAL MODULE: ./node_modules/@microsoft/fast-element/dist/esm/interfaces.js
var interfaces = __webpack_require__(204);
;// CONCATENATED MODULE: ./node_modules/@microsoft/fast-element/dist/esm/observation/array-change-records.js

/** @internal */
function newSplice(index, removed, addedCount) {
    return {
        index: index,
        removed: removed,
        addedCount: addedCount,
    };
}
const EDIT_LEAVE = 0;
const EDIT_UPDATE = 1;
const EDIT_ADD = 2;
const EDIT_DELETE = 3;
// Note: This function is *based* on the computation of the Levenshtein
// "edit" distance. The one change is that "updates" are treated as two
// edits - not one. With Array splices, an update is really a delete
// followed by an add. By retaining this, we optimize for "keeping" the
// maximum array items in the original array. For example:
//
//   'xxxx123' -> '123yyyy'
//
// With 1-edit updates, the shortest path would be just to update all seven
// characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
// leaves the substring '123' intact.
function calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd) {
    // "Deletion" columns
    const rowCount = oldEnd - oldStart + 1;
    const columnCount = currentEnd - currentStart + 1;
    const distances = new Array(rowCount);
    let north;
    let west;
    // "Addition" rows. Initialize null column.
    for (let i = 0; i < rowCount; ++i) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
    }
    // Initialize null row
    for (let j = 0; j < columnCount; ++j) {
        distances[0][j] = j;
    }
    for (let i = 1; i < rowCount; ++i) {
        for (let j = 1; j < columnCount; ++j) {
            if (current[currentStart + j - 1] === old[oldStart + i - 1]) {
                distances[i][j] = distances[i - 1][j - 1];
            }
            else {
                north = distances[i - 1][j] + 1;
                west = distances[i][j - 1] + 1;
                distances[i][j] = north < west ? north : west;
            }
        }
    }
    return distances;
}
// This starts at the final weight, and walks "backward" by finding
// the minimum previous weight recursively until the origin of the weight
// matrix.
function spliceOperationsFromEditDistances(distances) {
    let i = distances.length - 1;
    let j = distances[0].length - 1;
    let current = distances[i][j];
    const edits = [];
    while (i > 0 || j > 0) {
        if (i === 0) {
            edits.push(EDIT_ADD);
            j--;
            continue;
        }
        if (j === 0) {
            edits.push(EDIT_DELETE);
            i--;
            continue;
        }
        const northWest = distances[i - 1][j - 1];
        const west = distances[i - 1][j];
        const north = distances[i][j - 1];
        let min;
        if (west < north) {
            min = west < northWest ? west : northWest;
        }
        else {
            min = north < northWest ? north : northWest;
        }
        if (min === northWest) {
            if (northWest === current) {
                edits.push(EDIT_LEAVE);
            }
            else {
                edits.push(EDIT_UPDATE);
                current = northWest;
            }
            i--;
            j--;
        }
        else if (min === west) {
            edits.push(EDIT_DELETE);
            i--;
            current = west;
        }
        else {
            edits.push(EDIT_ADD);
            j--;
            current = north;
        }
    }
    edits.reverse();
    return edits;
}
function sharedPrefix(current, old, searchLength) {
    for (let i = 0; i < searchLength; ++i) {
        if (current[i] !== old[i]) {
            return i;
        }
    }
    return searchLength;
}
function sharedSuffix(current, old, searchLength) {
    let index1 = current.length;
    let index2 = old.length;
    let count = 0;
    while (count < searchLength && current[--index1] === old[--index2]) {
        count++;
    }
    return count;
}
function intersect(start1, end1, start2, end2) {
    // Disjoint
    if (end1 < start2 || end2 < start1) {
        return -1;
    }
    // Adjacent
    if (end1 === start2 || end2 === start1) {
        return 0;
    }
    // Non-zero intersect, span1 first
    if (start1 < start2) {
        if (end1 < end2) {
            return end1 - start2; // Overlap
        }
        return end2 - start2; // Contained
    }
    // Non-zero intersect, span2 first
    if (end2 < end1) {
        return end2 - start1; // Overlap
    }
    return end1 - start1; // Contained
}
/**
 * Splice Projection functions:
 *
 * A splice map is a representation of how a previous array of items
 * was transformed into a new array of items. Conceptually it is a list of
 * tuples of
 *
 *   <index, removed, addedCount>
 *
 * which are kept in ascending index order of. The tuple represents that at
 * the |index|, |removed| sequence of items were removed, and counting forward
 * from |index|, |addedCount| items were added.
 */
/**
 * @internal
 * @remarks
 * Lacking individual splice mutation information, the minimal set of
 * splices can be synthesized given the previous state and final state of an
 * array. The basic approach is to calculate the edit distance matrix and
 * choose the shortest path through it.
 *
 * Complexity: O(l * p)
 *   l: The length of the current array
 *   p: The length of the old array
 */
function calcSplices(current, currentStart, currentEnd, old, oldStart, oldEnd) {
    let prefixCount = 0;
    let suffixCount = 0;
    const minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
    if (currentStart === 0 && oldStart === 0) {
        prefixCount = sharedPrefix(current, old, minLength);
    }
    if (currentEnd === current.length && oldEnd === old.length) {
        suffixCount = sharedSuffix(current, old, minLength - prefixCount);
    }
    currentStart += prefixCount;
    oldStart += prefixCount;
    currentEnd -= suffixCount;
    oldEnd -= suffixCount;
    if (currentEnd - currentStart === 0 && oldEnd - oldStart === 0) {
        return interfaces/* emptyArray */.o;
    }
    if (currentStart === currentEnd) {
        const splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd) {
            splice.removed.push(old[oldStart++]);
        }
        return [splice];
    }
    else if (oldStart === oldEnd) {
        return [newSplice(currentStart, [], currentEnd - currentStart)];
    }
    const ops = spliceOperationsFromEditDistances(calcEditDistances(current, currentStart, currentEnd, old, oldStart, oldEnd));
    const splices = [];
    let splice = void 0;
    let index = currentStart;
    let oldIndex = oldStart;
    for (let i = 0; i < ops.length; ++i) {
        switch (ops[i]) {
            case EDIT_LEAVE:
                if (splice !== void 0) {
                    splices.push(splice);
                    splice = void 0;
                }
                index++;
                oldIndex++;
                break;
            case EDIT_UPDATE:
                if (splice === void 0) {
                    splice = newSplice(index, [], 0);
                }
                splice.addedCount++;
                index++;
                splice.removed.push(old[oldIndex]);
                oldIndex++;
                break;
            case EDIT_ADD:
                if (splice === void 0) {
                    splice = newSplice(index, [], 0);
                }
                splice.addedCount++;
                index++;
                break;
            case EDIT_DELETE:
                if (splice === void 0) {
                    splice = newSplice(index, [], 0);
                }
                splice.removed.push(old[oldIndex]);
                oldIndex++;
                break;
            // no default
        }
    }
    if (splice !== void 0) {
        splices.push(splice);
    }
    return splices;
}
const $push = Array.prototype.push;
function mergeSplice(splices, index, removed, addedCount) {
    const splice = newSplice(index, removed, addedCount);
    let inserted = false;
    let insertionOffset = 0;
    for (let i = 0; i < splices.length; i++) {
        const current = splices[i];
        current.index += insertionOffset;
        if (inserted) {
            continue;
        }
        const intersectCount = intersect(splice.index, splice.index + splice.removed.length, current.index, current.index + current.addedCount);
        if (intersectCount >= 0) {
            // Merge the two splices
            splices.splice(i, 1);
            i--;
            insertionOffset -= current.addedCount - current.removed.length;
            splice.addedCount += current.addedCount - intersectCount;
            const deleteCount = splice.removed.length + current.removed.length - intersectCount;
            if (!splice.addedCount && !deleteCount) {
                // merged splice is a noop. discard.
                inserted = true;
            }
            else {
                let currentRemoved = current.removed;
                if (splice.index < current.index) {
                    // some prefix of splice.removed is prepended to current.removed.
                    const prepend = splice.removed.slice(0, current.index - splice.index);
                    $push.apply(prepend, currentRemoved);
                    currentRemoved = prepend;
                }
                if (splice.index + splice.removed.length >
                    current.index + current.addedCount) {
                    // some suffix of splice.removed is appended to current.removed.
                    const append = splice.removed.slice(current.index + current.addedCount - splice.index);
                    $push.apply(currentRemoved, append);
                }
                splice.removed = currentRemoved;
                if (current.index < splice.index) {
                    splice.index = current.index;
                }
            }
        }
        else if (splice.index < current.index) {
            // Insert splice here.
            inserted = true;
            splices.splice(i, 0, splice);
            i++;
            const offset = splice.addedCount - splice.removed.length;
            current.index += offset;
            insertionOffset += offset;
        }
    }
    if (!inserted) {
        splices.push(splice);
    }
}
function createInitialSplices(changeRecords) {
    const splices = [];
    for (let i = 0, ii = changeRecords.length; i < ii; i++) {
        const record = changeRecords[i];
        mergeSplice(splices, record.index, record.removed, record.addedCount);
    }
    return splices;
}
/** @internal */
function projectArraySplices(array, changeRecords) {
    let splices = [];
    const initialSplices = createInitialSplices(changeRecords);
    for (let i = 0, ii = initialSplices.length; i < ii; ++i) {
        const splice = initialSplices[i];
        if (splice.addedCount === 1 && splice.removed.length === 1) {
            if (splice.removed[0] !== array[splice.index]) {
                splices.push(splice);
            }
            continue;
        }
        splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount, splice.removed, 0, splice.removed.length));
    }
    return splices;
}

;// CONCATENATED MODULE: ./node_modules/@microsoft/fast-element/dist/esm/observation/array-observer.js




let arrayObservationEnabled = false;
function adjustIndex(changeRecord, array) {
    let index = changeRecord.index;
    const arrayLength = array.length;
    if (index > arrayLength) {
        index = arrayLength - changeRecord.addedCount;
    }
    else if (index < 0) {
        index =
            arrayLength + changeRecord.removed.length + index - changeRecord.addedCount;
    }
    if (index < 0) {
        index = 0;
    }
    changeRecord.index = index;
    return changeRecord;
}
class ArrayObserver extends notifier/* SubscriberSet */.q {
    constructor(source) {
        super(source);
        this.oldCollection = void 0;
        this.splices = void 0;
        this.needsQueue = true;
        this.call = this.flush;
        source.$fastController = this;
    }
    addSplice(splice) {
        if (this.splices === void 0) {
            this.splices = [splice];
        }
        else {
            this.splices.push(splice);
        }
        if (this.needsQueue) {
            this.needsQueue = false;
            dom/* DOM.queueUpdate */.SO.queueUpdate(this);
        }
    }
    reset(oldCollection) {
        this.oldCollection = oldCollection;
        if (this.needsQueue) {
            this.needsQueue = false;
            dom/* DOM.queueUpdate */.SO.queueUpdate(this);
        }
    }
    flush() {
        const splices = this.splices;
        const oldCollection = this.oldCollection;
        if (splices === void 0 && oldCollection === void 0) {
            return;
        }
        this.needsQueue = true;
        this.splices = void 0;
        this.oldCollection = void 0;
        const finalSplices = oldCollection === void 0
            ? projectArraySplices(this.source, splices)
            : calcSplices(this.source, 0, this.source.length, oldCollection, 0, oldCollection.length);
        this.notify(finalSplices);
    }
}
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Enables the array observation mechanism.
 * @remarks
 * Array observation is enabled automatically when using the
 * {@link RepeatDirective}, so calling this API manually is
 * not typically necessary.
 * @public
 */
function enableArrayObservation() {
    if (arrayObservationEnabled) {
        return;
    }
    arrayObservationEnabled = true;
    observable/* Observable.setArrayObserverFactory */.y$.setArrayObserverFactory((collection) => {
        return new ArrayObserver(collection);
    });
    const arrayProto = Array.prototype;
    const pop = arrayProto.pop;
    const push = arrayProto.push;
    const reverse = arrayProto.reverse;
    const shift = arrayProto.shift;
    const sort = arrayProto.sort;
    const splice = arrayProto.splice;
    const unshift = arrayProto.unshift;
    arrayProto.pop = function () {
        const notEmpty = this.length > 0;
        const methodCallResult = pop.apply(this, arguments);
        const o = this.$fastController;
        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(this.length, [methodCallResult], 0));
        }
        return methodCallResult;
    };
    arrayProto.push = function () {
        const methodCallResult = push.apply(this, arguments);
        const o = this.$fastController;
        if (o !== void 0) {
            o.addSplice(adjustIndex(newSplice(this.length - arguments.length, [], arguments.length), this));
        }
        return methodCallResult;
    };
    arrayProto.reverse = function () {
        let oldArray;
        const o = this.$fastController;
        if (o !== void 0) {
            o.flush();
            oldArray = this.slice();
        }
        const methodCallResult = reverse.apply(this, arguments);
        if (o !== void 0) {
            o.reset(oldArray);
        }
        return methodCallResult;
    };
    arrayProto.shift = function () {
        const notEmpty = this.length > 0;
        const methodCallResult = shift.apply(this, arguments);
        const o = this.$fastController;
        if (o !== void 0 && notEmpty) {
            o.addSplice(newSplice(0, [methodCallResult], 0));
        }
        return methodCallResult;
    };
    arrayProto.sort = function () {
        let oldArray;
        const o = this.$fastController;
        if (o !== void 0) {
            o.flush();
            oldArray = this.slice();
        }
        const methodCallResult = sort.apply(this, arguments);
        if (o !== void 0) {
            o.reset(oldArray);
        }
        return methodCallResult;
    };
    arrayProto.splice = function () {
        const methodCallResult = splice.apply(this, arguments);
        const o = this.$fastController;
        if (o !== void 0) {
            o.addSplice(adjustIndex(newSplice(+arguments[0], methodCallResult, arguments.length > 2 ? arguments.length - 2 : 0), this));
        }
        return methodCallResult;
    };
    arrayProto.unshift = function () {
        const methodCallResult = unshift.apply(this, arguments);
        const o = this.$fastController;
        if (o !== void 0) {
            o.addSplice(adjustIndex(newSplice(0, [], arguments.length), this));
        }
        return methodCallResult;
    };
}
/* eslint-enable prefer-rest-params */
/* eslint-enable @typescript-eslint/explicit-function-return-type */


/***/ }),

/***/ 868:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "q": () => /* binding */ SubscriberSet,
/* harmony export */   "A": () => /* binding */ PropertyChangeNotifier
/* harmony export */ });
function spilloverSubscribe(subscriber) {
    const spillover = this.spillover;
    const index = spillover.indexOf(subscriber);
    if (index === -1) {
        spillover.push(subscriber);
    }
}
function spilloverUnsubscribe(subscriber) {
    const spillover = this.spillover;
    const index = spillover.indexOf(subscriber);
    if (index !== -1) {
        spillover.splice(index, 1);
    }
}
function spilloverNotifySubscribers(args) {
    const spillover = this.spillover;
    const source = this.source;
    for (let i = 0, ii = spillover.length; i < ii; ++i) {
        spillover[i].handleChange(source, args);
    }
}
function spilloverHas(subscriber) {
    return this.spillover.indexOf(subscriber) !== -1;
}
/**
 * An implementation of {@link Notifier} that efficiently keeps track of
 * subscribers interested in a specific change notification on an
 * observable source.
 *
 * @remarks
 * This set is optimized for the most common scenario of 1 or 2 subscribers.
 * With this in mind, it can store a subscriber in an internal field, allowing it to avoid Array#push operations.
 * If the set ever exceeds two subscribers, it upgrades to an array automatically.
 * @public
 */
class SubscriberSet {
    /**
     * Creates an instance of SubscriberSet for the specified source.
     * @param source - The object source that subscribers will receive notifications from.
     * @param initialSubscriber - An initial subscriber to changes.
     */
    constructor(source, initialSubscriber) {
        this.sub1 = void 0;
        this.sub2 = void 0;
        this.spillover = void 0;
        this.source = source;
        this.sub1 = initialSubscriber;
    }
    /**
     * Checks whether the provided subscriber has been added to this set.
     * @param subscriber - The subscriber to test for inclusion in this set.
     */
    has(subscriber) {
        return this.sub1 === subscriber || this.sub2 === subscriber;
    }
    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     */
    subscribe(subscriber) {
        if (this.has(subscriber)) {
            return;
        }
        if (this.sub1 === void 0) {
            this.sub1 = subscriber;
            return;
        }
        if (this.sub2 === void 0) {
            this.sub2 = subscriber;
            return;
        }
        this.spillover = [this.sub1, this.sub2, subscriber];
        this.subscribe = spilloverSubscribe;
        this.unsubscribe = spilloverUnsubscribe;
        this.notify = spilloverNotifySubscribers;
        this.has = spilloverHas;
        this.sub1 = void 0;
        this.sub2 = void 0;
    }
    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber - The object that is unsubscribing from change notification.
     */
    unsubscribe(subscriber) {
        if (this.sub1 === subscriber) {
            this.sub1 = void 0;
        }
        else if (this.sub2 === subscriber) {
            this.sub2 = void 0;
        }
    }
    /**
     * Notifies all subscribers.
     * @param args - Data passed along to subscribers during notification.
     */
    notify(args) {
        const sub1 = this.sub1;
        const sub2 = this.sub2;
        const source = this.source;
        if (sub1 !== void 0) {
            sub1.handleChange(source, args);
        }
        if (sub2 !== void 0) {
            sub2.handleChange(source, args);
        }
    }
}
/**
 * An implementation of Notifier that allows subscribers to be notified
 * of individual property changes on an object.
 * @public
 */
class PropertyChangeNotifier {
    /**
     * Creates an instance of PropertyChangeNotifier for the specified source.
     * @param source - The object source that subscribers will receive notifications from.
     */
    constructor(source) {
        this.subscribers = {};
        this.source = source;
    }
    /**
     * Notifies all subscribers, based on the specified property.
     * @param propertyName - The property name, passed along to subscribers during notification.
     */
    notify(propertyName) {
        const subscribers = this.subscribers[propertyName];
        if (subscribers !== void 0) {
            subscribers.notify(propertyName);
        }
    }
    /**
     * Subscribes to notification of changes in an object's state.
     * @param subscriber - The object that is subscribing for change notification.
     * @param propertyToWatch - The name of the property that the subscriber is interested in watching for changes.
     */
    subscribe(subscriber, propertyToWatch) {
        let subscribers = this.subscribers[propertyToWatch];
        if (subscribers === void 0) {
            this.subscribers[propertyToWatch] = subscribers = new SubscriberSet(this.source);
        }
        subscribers.subscribe(subscriber);
    }
    /**
     * Unsubscribes from notification of changes in an object's state.
     * @param subscriber - The object that is unsubscribing from change notification.
     * @param propertyToUnwatch - The name of the property that the subscriber is no longer interested in watching.
     */
    unsubscribe(subscriber, propertyToUnwatch) {
        const subscribers = this.subscribers[propertyToUnwatch];
        if (subscribers === void 0) {
            return;
        }
        subscribers.unsubscribe(subscriber);
    }
}


/***/ }),

/***/ 202:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "y$": () => /* binding */ Observable,
/* harmony export */   "LO": () => /* binding */ observable,
/* harmony export */   "lk": () => /* binding */ volatile,
/* harmony export */   "z8": () => /* binding */ setCurrentEvent,
/* harmony export */   "rd": () => /* binding */ ExecutionContext,
/* harmony export */   "Wp": () => /* binding */ defaultExecutionContext
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(676);
/* harmony import */ var _notifier__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(868);


const volatileRegex = /(\:|\&\&|\|\||if)/;
const notifierLookup = new WeakMap();
const accessorLookup = new WeakMap();
let watcher = void 0;
let createArrayObserver = (array) => {
    throw new Error("Must call enableArrayObservation before observing arrays.");
};
class DefaultObservableAccessor {
    constructor(name) {
        this.name = name;
        this.field = `_${name}`;
        this.callback = `${name}Changed`;
    }
    getValue(source) {
        if (watcher !== void 0) {
            watcher.watch(source, this.name);
        }
        return source[this.field];
    }
    setValue(source, newValue) {
        const field = this.field;
        const oldValue = source[field];
        if (oldValue !== newValue) {
            source[field] = newValue;
            const callback = source[this.callback];
            if (typeof callback === "function") {
                callback.call(source, oldValue, newValue);
            }
            /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
            getNotifier(source).notify(this.name);
        }
    }
}
/**
 * Common Observable APIs.
 * @public
 */
const Observable = Object.freeze({
    /**
     * @internal
     * @param factory - The factory used to create array observers.
     */
    setArrayObserverFactory(factory) {
        createArrayObserver = factory;
    },
    /**
     * Gets a notifier for an object or Array.
     * @param source - The object or Array to get the notifier for.
     */
    getNotifier(source) {
        let found = source.$fastController || notifierLookup.get(source);
        if (found === void 0) {
            if (Array.isArray(source)) {
                found = createArrayObserver(source);
            }
            else {
                notifierLookup.set(source, (found = new _notifier__WEBPACK_IMPORTED_MODULE_0__/* .PropertyChangeNotifier */ .A(source)));
            }
        }
        return found;
    },
    /**
     * Records a property change for a source object.
     * @param source - The object to record the change against.
     * @param propertyName - The property to track as changed.
     */
    track(source, propertyName) {
        if (watcher !== void 0) {
            watcher.watch(source, propertyName);
        }
    },
    /**
     * Notifies watchers that the currently executing property getter or function is volatile
     * with respect to its observable dependencies.
     */
    trackVolatile() {
        if (watcher !== void 0) {
            watcher.needsRefresh = true;
        }
    },
    /**
     * Notifies subscribers of a source object of changes.
     * @param source - the object to notify of changes.
     * @param args - The change args to pass to subscribers.
     */
    notify(source, args) {
        /* eslint-disable-next-line @typescript-eslint/no-use-before-define */
        getNotifier(source).notify(args);
    },
    /**
     * Defines an observable property on an object or prototype.
     * @param target - The target object to define the observable on.
     * @param nameOrAccessor - The name of the property to define as observable;
     * or a custom accessor that specifies the property name and accessor implementation.
     */
    defineProperty(target, nameOrAccessor) {
        if (typeof nameOrAccessor === "string") {
            nameOrAccessor = new DefaultObservableAccessor(nameOrAccessor);
        }
        this.getAccessors(target).push(nameOrAccessor);
        Reflect.defineProperty(target, nameOrAccessor.name, {
            enumerable: true,
            get: function () {
                return nameOrAccessor.getValue(this);
            },
            set: function (newValue) {
                nameOrAccessor.setValue(this, newValue);
            },
        });
    },
    /**
     * Finds all the observable accessors defined on the target,
     * including its prototype chain.
     * @param target - The target object to search for accessor on.
     */
    getAccessors(target) {
        let accessors = accessorLookup.get(target);
        if (accessors === void 0) {
            let currentTarget = Reflect.getPrototypeOf(target);
            while (accessors === void 0 && currentTarget !== null) {
                accessors = accessorLookup.get(currentTarget);
                currentTarget = Reflect.getPrototypeOf(currentTarget);
            }
            if (accessors === void 0) {
                accessors = [];
            }
            else {
                accessors = accessors.slice(0);
            }
            accessorLookup.set(target, accessors);
        }
        return accessors;
    },
    /**
     * Creates a {@link BindingObserver} that can watch the
     * provided {@link Binding} for changes.
     * @param binding - The binding to observe.
     * @param initialSubscriber - An initial subscriber to changes in the binding value.
     * @param isVolatileBinding - Indicates whether the binding's dependency list must be re-evaluated on every value evaluation.
     */
    binding(binding, initialSubscriber, isVolatileBinding = this.isVolatileBinding(binding)) {
        return new BindingObserverImplementation(binding, initialSubscriber, isVolatileBinding);
    },
    /**
     * Determines whether a binding expression is volatile and needs to have its dependency list re-evaluated
     * on every evaluation of the value.
     * @param binding - The binding to inspect.
     */
    isVolatileBinding(binding) {
        return volatileRegex.test(binding.toString());
    },
});
const getNotifier = Observable.getNotifier;
const trackVolatile = Observable.trackVolatile;
const queueUpdate = _dom__WEBPACK_IMPORTED_MODULE_1__/* .DOM.queueUpdate */ .SO.queueUpdate;
/**
 * Decorator: Defines an observable property on the target.
 * @param target - The target to define the observable on.
 * @param nameOrAccessor - The property name or accessor to define the observable as.
 * @public
 */
function observable(target, nameOrAccessor) {
    Observable.defineProperty(target, nameOrAccessor);
}
/**
 * Decorator: Marks a property getter as having volatile observable dependencies.
 * @param target - The target that the property is defined on.
 * @param name - The property name.
 * @param name - The existing descriptor.
 * @public
 */
function volatile(target, name, descriptor) {
    return Object.assign({}, descriptor, {
        get: function () {
            trackVolatile();
            return descriptor.get.apply(this);
        },
    });
}
let currentEvent = null;
/**
 * @param event - The event to set as current for the context.
 * @internal
 */
function setCurrentEvent(event) {
    currentEvent = event;
}
/**
 * Provides additional contextual information available to behaviors and expressions.
 * @public
 */
class ExecutionContext {
    constructor() {
        /**
         * The index of the current item within a repeat context.
         */
        this.index = 0;
        /**
         * The length of the current collection within a repeat context.
         */
        this.length = 0;
        /**
         * The parent data object within a repeat context.
         */
        this.parent = null;
        /**
         * The parent execution context when in nested context scenarios.
         */
        this.parentContext = null;
    }
    /**
     * The current event within an event handler.
     */
    get event() {
        return currentEvent;
    }
    /**
     * Indicates whether the current item within a repeat context
     * has an even index.
     */
    get isEven() {
        return this.index % 2 === 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * has an odd index.
     */
    get isOdd() {
        return this.index % 2 !== 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is the first item in the collection.
     */
    get isFirst() {
        return this.index === 0;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is somewhere in the middle of the collection.
     */
    get isInMiddle() {
        return !this.isFirst && !this.isLast;
    }
    /**
     * Indicates whether the current item within a repeat context
     * is the last item in the collection.
     */
    get isLast() {
        return this.index === this.length - 1;
    }
}
Observable.defineProperty(ExecutionContext.prototype, "index");
Observable.defineProperty(ExecutionContext.prototype, "length");
/**
 * The default execution context used in binding expressions.
 * @public
 */
const defaultExecutionContext = Object.seal(new ExecutionContext());
class BindingObserverImplementation extends _notifier__WEBPACK_IMPORTED_MODULE_0__/* .SubscriberSet */ .q {
    constructor(binding, initialSubscriber, isVolatileBinding = false) {
        super(binding, initialSubscriber);
        this.binding = binding;
        this.isVolatileBinding = isVolatileBinding;
        this.needsRefresh = true;
        this.needsQueue = true;
        this.first = this;
        this.last = null;
        this.propertySource = void 0;
        this.propertyName = void 0;
        this.notifier = void 0;
        this.next = void 0;
    }
    observe(source, context) {
        if (this.needsRefresh && this.last !== null) {
            this.disconnect();
        }
        const previousWatcher = watcher;
        watcher = this.needsRefresh ? this : void 0;
        this.needsRefresh = this.isVolatileBinding;
        const result = this.binding(source, context);
        watcher = previousWatcher;
        return result;
    }
    disconnect() {
        if (this.last !== null) {
            let current = this.first;
            while (current !== void 0) {
                current.notifier.unsubscribe(this, current.propertyName);
                current = current.next;
            }
            this.last = null;
            this.needsRefresh = true;
        }
    }
    /** @internal */
    watch(propertySource, propertyName) {
        const prev = this.last;
        const notifier = getNotifier(propertySource);
        const current = prev === null ? this.first : {};
        current.propertySource = propertySource;
        current.propertyName = propertyName;
        current.notifier = notifier;
        notifier.subscribe(this, propertyName);
        if (prev !== null) {
            if (!this.needsRefresh) {
                watcher = void 0;
                const prevValue = prev.propertySource[prev.propertyName];
                watcher = this;
                if (propertySource === prevValue) {
                    this.needsRefresh = true;
                }
            }
            prev.next = current;
        }
        this.last = current;
    }
    /** @internal */
    handleChange() {
        if (this.needsQueue) {
            this.needsQueue = false;
            queueUpdate(this);
        }
    }
    /** @internal */
    call() {
        if (this.last !== null) {
            this.needsQueue = true;
            this.notify(this);
        }
    }
}


/***/ }),

/***/ 906:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "P": () => /* binding */ $global
/* harmony export */ });
/**
 * A reference to globalThis, with support
 * for browsers that don't yet support the spec.
 * @public
 */
const $global = (function () {
    if (typeof globalThis !== "undefined") {
        // We're running in a modern environment.
        return globalThis;
    }
    if (typeof __webpack_require__.g !== "undefined") {
        // We're running in NodeJS
        return __webpack_require__.g;
    }
    if (typeof self !== "undefined") {
        // We're running in a worker.
        return self;
    }
    if (typeof window !== "undefined") {
        // We're running in the browser's main thread.
        return window;
    }
    try {
        // Hopefully we never get here...
        // Not all environments allow eval and Function. Use only as a last resort:
        // eslint-disable-next-line no-new-func
        return new Function("return this")();
    }
    catch (_a) {
        // If all fails, give up and create an object.
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return {};
    }
})();
// API-only Polyfill for trustedTypes
if ($global.trustedTypes === void 0) {
    $global.trustedTypes = { createPolicy: (n, r) => r };
}


/***/ }),

/***/ 774:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "XL": () => /* binding */ ElementStyles,
/* harmony export */   "iv": () => /* binding */ css
/* harmony export */ });
/* unused harmony exports AdoptedStyleSheetsStyles, StyleElementStyles */
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(676);

const styleLookup = new Map();
/**
 * Represents styles that can be applied to a custom element.
 * @public
 */
class ElementStyles {
    constructor() {
        /** @internal */
        this.behaviors = null;
        /* eslint-enable @typescript-eslint/explicit-function-return-type */
    }
    /**
     * Associates behaviors with this set of styles.
     * @param behaviors - The behaviors to associate.
     */
    withBehaviors(...behaviors) {
        this.behaviors =
            this.behaviors === null ? behaviors : this.behaviors.concat(behaviors);
        return this;
    }
    /**
     * Adds these styles to a global cache for easy lookup by a known key.
     * @param key - The key to use for lookup and retrieval in the cache.
     */
    withKey(key) {
        styleLookup.set(key, this);
        return this;
    }
    /**
     * Attempts to find cached styles by a known key.
     * @param key - The key to search the style cache for.
     */
    static find(key) {
        return styleLookup.get(key) || null;
    }
}
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Create ElementStyles from ComposableStyles.
 */
ElementStyles.create = (() => {
    if (_dom__WEBPACK_IMPORTED_MODULE_0__/* .DOM.supportsAdoptedStyleSheets */ .SO.supportsAdoptedStyleSheets) {
        const styleSheetCache = new Map();
        return (styles) => new AdoptedStyleSheetsStyles(styles, styleSheetCache);
    }
    return (styles) => new StyleElementStyles(styles);
})();
function reduceStyles(styles) {
    return styles
        .map((x) => x instanceof ElementStyles ? reduceStyles(x.styles) : [x])
        .reduce((prev, curr) => prev.concat(curr), []);
}
function reduceBehaviors(styles) {
    return styles
        .map((x) => (x instanceof ElementStyles ? x.behaviors : null))
        .reduce((prev, curr) => {
        if (curr === null) {
            return prev;
        }
        if (prev === null) {
            prev = [];
        }
        return prev.concat(curr);
    }, null);
}
/**
 * https://wicg.github.io/construct-stylesheets/
 * https://developers.google.com/web/updates/2019/02/constructable-stylesheets
 *
 * @internal
 */
class AdoptedStyleSheetsStyles extends ElementStyles {
    constructor(styles, styleSheetCache) {
        super();
        this.styles = styles;
        this.behaviors = null;
        this.behaviors = reduceBehaviors(styles);
        this.styleSheets = reduceStyles(styles).map((x) => {
            if (x instanceof CSSStyleSheet) {
                return x;
            }
            let sheet = styleSheetCache.get(x);
            if (sheet === void 0) {
                sheet = new CSSStyleSheet();
                sheet.replaceSync(x);
                styleSheetCache.set(x, sheet);
            }
            return sheet;
        });
    }
    addStylesTo(target) {
        target.adoptedStyleSheets = [...target.adoptedStyleSheets, ...this.styleSheets];
    }
    removeStylesFrom(target) {
        const sourceSheets = this.styleSheets;
        target.adoptedStyleSheets = target.adoptedStyleSheets.filter((x) => sourceSheets.indexOf(x) === -1);
    }
}
let styleClassId = 0;
function getNextStyleClass() {
    return `fast-style-class-${++styleClassId}`;
}
/**
 * @internal
 */
class StyleElementStyles extends ElementStyles {
    constructor(styles) {
        super();
        this.styles = styles;
        this.behaviors = null;
        this.behaviors = reduceBehaviors(styles);
        this.styleSheets = reduceStyles(styles);
        this.styleClass = getNextStyleClass();
    }
    addStylesTo(target) {
        const styleSheets = this.styleSheets;
        const styleClass = this.styleClass;
        if (target === document) {
            target = document.body;
        }
        for (let i = styleSheets.length - 1; i > -1; --i) {
            const element = document.createElement("style");
            element.innerHTML = styleSheets[i];
            element.className = styleClass;
            target.prepend(element);
        }
    }
    removeStylesFrom(target) {
        if (target === document) {
            target = document.body;
        }
        const styles = target.querySelectorAll(`.${this.styleClass}`);
        for (let i = 0, ii = styles.length; i < ii; ++i) {
            target.removeChild(styles[i]);
        }
    }
}
/**
 * Transforms a template literal string into styles.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The css helper supports interpolation of strings and ElementStyle instances.
 * @public
 */
function css(strings, ...values) {
    const styles = [];
    let cssString = "";
    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        cssString += strings[i];
        const value = values[i];
        if (value instanceof ElementStyles || value instanceof CSSStyleSheet) {
            if (cssString.trim() !== "") {
                styles.push(cssString);
                cssString = "";
            }
            styles.push(value);
        }
        else {
            cssString += value;
        }
    }
    cssString += strings[strings.length - 1];
    if (cssString.trim() !== "") {
        styles.push(cssString);
    }
    return ElementStyles.create(styles);
}


/***/ }),

/***/ 1:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": () => /* binding */ compileTemplate
/* harmony export */ });
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(676);
/* harmony import */ var _directives_binding__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(472);


class CompilationContext {
    addFactory(factory) {
        factory.targetIndex = this.targetIndex;
        this.behaviorFactories.push(factory);
    }
    captureContentBinding(directive) {
        directive.targetAtContent();
        this.addFactory(directive);
    }
    reset() {
        this.behaviorFactories = [];
        this.targetIndex = -1;
    }
    release() {
        sharedContext = this;
    }
    static borrow(directives) {
        const shareable = sharedContext || new CompilationContext();
        shareable.directives = directives;
        shareable.reset();
        sharedContext = null;
        return shareable;
    }
}
let sharedContext = null;
function createAggregateBinding(parts) {
    if (parts.length === 1) {
        return parts[0];
    }
    let targetName;
    const partCount = parts.length;
    const finalParts = parts.map((x) => {
        if (typeof x === "string") {
            return () => x;
        }
        targetName = x.targetName || targetName;
        return x.binding;
    });
    const binding = (scope, context) => {
        let output = "";
        for (let i = 0; i < partCount; ++i) {
            output += finalParts[i](scope, context);
        }
        return output;
    };
    const directive = new _directives_binding__WEBPACK_IMPORTED_MODULE_0__/* .BindingDirective */ .D(binding);
    directive.targetName = targetName;
    return directive;
}
const interpolationEndLength = _dom__WEBPACK_IMPORTED_MODULE_1__/* ._interpolationEnd.length */ .Yl.length;
function parseContent(context, value) {
    const valueParts = value.split(_dom__WEBPACK_IMPORTED_MODULE_1__/* ._interpolationStart */ .pc);
    if (valueParts.length === 1) {
        return null;
    }
    const bindingParts = [];
    for (let i = 0, ii = valueParts.length; i < ii; ++i) {
        const current = valueParts[i];
        const index = current.indexOf(_dom__WEBPACK_IMPORTED_MODULE_1__/* ._interpolationEnd */ .Yl);
        let literal;
        if (index === -1) {
            literal = current;
        }
        else {
            const directiveIndex = parseInt(current.substring(0, index));
            bindingParts.push(context.directives[directiveIndex]);
            literal = current.substring(index + interpolationEndLength);
        }
        if (literal !== "") {
            bindingParts.push(literal);
        }
    }
    return bindingParts;
}
function compileAttributes(context, node, includeBasicValues = false) {
    const attributes = node.attributes;
    for (let i = 0, ii = attributes.length; i < ii; ++i) {
        const attr = attributes[i];
        const attrValue = attr.value;
        const parseResult = parseContent(context, attrValue);
        let result = null;
        if (parseResult === null) {
            if (includeBasicValues) {
                result = new _directives_binding__WEBPACK_IMPORTED_MODULE_0__/* .BindingDirective */ .D(() => attrValue);
                result.targetName = attr.name;
            }
        }
        else {
            result = createAggregateBinding(parseResult);
        }
        if (result !== null) {
            node.removeAttributeNode(attr);
            i--;
            ii--;
            context.addFactory(result);
        }
    }
}
function compileContent(context, node, walker) {
    const parseResult = parseContent(context, node.textContent);
    if (parseResult !== null) {
        let lastNode = node;
        for (let i = 0, ii = parseResult.length; i < ii; ++i) {
            const currentPart = parseResult[i];
            const currentNode = i === 0
                ? node
                : lastNode.parentNode.insertBefore(document.createTextNode(""), lastNode.nextSibling);
            if (typeof currentPart === "string") {
                currentNode.textContent = currentPart;
            }
            else {
                currentNode.textContent = " ";
                context.captureContentBinding(currentPart);
            }
            lastNode = currentNode;
            context.targetIndex++;
            if (currentNode !== node) {
                walker.nextNode();
            }
        }
        context.targetIndex--;
    }
}
/**
 * Compiles a template and associated directives into a raw compilation
 * result which include a cloneable DocumentFragment and factories capable
 * of attaching runtime behavior to nodes within the fragment.
 * @param template - The template to compile.
 * @param directives - The directives referenced by the template.
 * @remarks
 * The template that is provided for compilation is altered in-place
 * and cannot be compiled again. If the original template must be preserved,
 * it is recommended that you clone the original and pass the clone to this API.
 * @public
 */
function compileTemplate(template, directives) {
    const fragment = template.content;
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1111864
    document.adoptNode(fragment);
    const context = CompilationContext.borrow(directives);
    compileAttributes(context, template, true);
    const hostBehaviorFactories = context.behaviorFactories;
    context.reset();
    const walker = _dom__WEBPACK_IMPORTED_MODULE_1__/* .DOM.createTemplateWalker */ .SO.createTemplateWalker(fragment);
    let node;
    while ((node = walker.nextNode())) {
        context.targetIndex++;
        switch (node.nodeType) {
            case 1: // element node
                compileAttributes(context, node);
                break;
            case 3: // text node
                compileContent(context, node, walker);
                break;
            case 8: // comment
                if (_dom__WEBPACK_IMPORTED_MODULE_1__/* .DOM.isMarker */ .SO.isMarker(node)) {
                    context.addFactory(directives[_dom__WEBPACK_IMPORTED_MODULE_1__/* .DOM.extractDirectiveIndexFromMarker */ .SO.extractDirectiveIndexFromMarker(node)]);
                }
        }
    }
    let targetOffset = 0;
    if (_dom__WEBPACK_IMPORTED_MODULE_1__/* .DOM.isMarker */ .SO.isMarker(fragment.firstChild)) {
        // If the first node in a fragment is a marker, that means it's an unstable first node,
        // because something like a when, repeat, etc. could add nodes before the marker.
        // To mitigate this, we insert a stable first node. However, if we insert a node,
        // that will alter the result of the TreeWalker. So, we also need to offset the target index.
        fragment.insertBefore(document.createComment(""), fragment.firstChild);
        targetOffset = -1;
    }
    const viewBehaviorFactories = context.behaviorFactories;
    context.release();
    return {
        fragment,
        viewBehaviorFactories,
        hostBehaviorFactories,
        targetOffset,
    };
}


/***/ }),

/***/ 873:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_": () => /* binding */ ViewTemplate,
/* harmony export */   "d": () => /* binding */ html
/* harmony export */ });
/* harmony import */ var _template_compiler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);
/* harmony import */ var _view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(331);
/* harmony import */ var _dom__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(676);
/* harmony import */ var _directives_directive__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(373);
/* harmony import */ var _directives_binding__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(472);
/* harmony import */ var _observation_observable__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(202);






/**
 * A template capable of creating HTMLView instances or rendering directly to DOM.
 * @public
 */
class ViewTemplate {
    /**
     * Creates an instance of ViewTemplate.
     * @param html - The html representing what this template will instantiate, including placeholders for directives.
     * @param directives - The directives that will be connected to placeholders in the html.
     */
    constructor(html, directives) {
        this.behaviorCount = 0;
        this.hasHostBehaviors = false;
        this.fragment = null;
        this.targetOffset = 0;
        this.viewBehaviorFactories = null;
        this.hostBehaviorFactories = null;
        this.html = html;
        this.directives = directives;
    }
    /**
     * Creates an HTMLView instance based on this template definition.
     * @param hostBindingTarget - The element that host behaviors will be bound to.
     */
    create(hostBindingTarget) {
        if (this.fragment === null) {
            let template;
            const html = this.html;
            if (typeof html === "string") {
                template = document.createElement("template");
                template.innerHTML = _dom__WEBPACK_IMPORTED_MODULE_0__/* .DOM.createHTML */ .SO.createHTML(html);
                const fec = template.content.firstElementChild;
                if (fec !== null && fec.tagName === "TEMPLATE") {
                    template = fec;
                }
            }
            else {
                template = html;
            }
            const result = (0,_template_compiler__WEBPACK_IMPORTED_MODULE_1__/* .compileTemplate */ ._)(template, this.directives);
            this.fragment = result.fragment;
            this.viewBehaviorFactories = result.viewBehaviorFactories;
            this.hostBehaviorFactories = result.hostBehaviorFactories;
            this.targetOffset = result.targetOffset;
            this.behaviorCount =
                this.viewBehaviorFactories.length + this.hostBehaviorFactories.length;
            this.hasHostBehaviors = this.hostBehaviorFactories.length > 0;
        }
        const fragment = this.fragment.cloneNode(true);
        const viewFactories = this.viewBehaviorFactories;
        const behaviors = new Array(this.behaviorCount);
        const walker = _dom__WEBPACK_IMPORTED_MODULE_0__/* .DOM.createTemplateWalker */ .SO.createTemplateWalker(fragment);
        let behaviorIndex = 0;
        let targetIndex = this.targetOffset;
        let node = walker.nextNode();
        for (let ii = viewFactories.length; behaviorIndex < ii; ++behaviorIndex) {
            const factory = viewFactories[behaviorIndex];
            const factoryIndex = factory.targetIndex;
            while (node !== null) {
                if (targetIndex === factoryIndex) {
                    behaviors[behaviorIndex] = factory.createBehavior(node);
                    break;
                }
                else {
                    node = walker.nextNode();
                    targetIndex++;
                }
            }
        }
        if (this.hasHostBehaviors) {
            const hostFactories = this.hostBehaviorFactories;
            for (let i = 0, ii = hostFactories.length; i < ii; ++i, ++behaviorIndex) {
                behaviors[behaviorIndex] = hostFactories[i].createBehavior(hostBindingTarget);
            }
        }
        return new _view__WEBPACK_IMPORTED_MODULE_2__/* .HTMLView */ .b(fragment, behaviors);
    }
    /**
     * Creates an HTMLView from this template, binds it to the source, and then appends it to the host.
     * @param source - The data source to bind the template to.
     * @param host - The Element where the template will be rendered.
     * @param hostBindingTarget - An HTML element to target the host bindings at if different from the
     * host that the template is being attached to.
     */
    render(source, host, hostBindingTarget) {
        if (typeof host === "string") {
            host = document.getElementById(host);
        }
        if (hostBindingTarget === void 0) {
            hostBindingTarget = host;
        }
        const view = this.create(hostBindingTarget);
        view.bind(source, _observation_observable__WEBPACK_IMPORTED_MODULE_3__/* .defaultExecutionContext */ .Wp);
        view.appendTo(host);
        return view;
    }
}
// Much thanks to LitHTML for working this out!
const lastAttributeNameRegex = 
// eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;
/**
 * Transforms a template literal string into a renderable ViewTemplate.
 * @param strings - The string fragments that are interpolated with the values.
 * @param values - The values that are interpolated with the string fragments.
 * @remarks
 * The html helper supports interpolation of strings, numbers, binding expressions,
 * other template instances, and Directive instances.
 * @public
 */
function html(strings, ...values) {
    const directives = [];
    let html = "";
    for (let i = 0, ii = strings.length - 1; i < ii; ++i) {
        const currentString = strings[i];
        let value = values[i];
        html += currentString;
        if (value instanceof ViewTemplate) {
            const template = value;
            value = () => template;
        }
        if (typeof value === "function") {
            value = new _directives_binding__WEBPACK_IMPORTED_MODULE_4__/* .BindingDirective */ .D(value);
        }
        if (value instanceof _directives_directive__WEBPACK_IMPORTED_MODULE_5__/* .NamedTargetDirective */ .jS) {
            const match = lastAttributeNameRegex.exec(currentString);
            if (match !== null) {
                value.targetName = match[2];
            }
        }
        if (value instanceof _directives_directive__WEBPACK_IMPORTED_MODULE_5__/* .Directive */ .Xe) {
            // Since not all values are directives, we can't use i
            // as the index for the placeholder. Instead, we need to
            // use directives.length to get the next index.
            html += value.createPlaceholder(directives.length);
            directives.push(value);
        }
        else {
            html += value;
        }
    }
    html += strings[strings.length - 1];
    return new ViewTemplate(html, directives);
}


/***/ }),

/***/ 331:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "b": () => /* binding */ HTMLView
/* harmony export */ });
// A singleton Range instance used to efficiently remove ranges of DOM nodes.
// See the implementation of HTMLView below for further details.
const range = document.createRange();
/**
 * The standard View implementation, which also implements ElementView and SyntheticView.
 * @public
 */
class HTMLView {
    /**
     * Constructs an instance of HTMLView.
     * @param fragment - The html fragment that contains the nodes for this view.
     * @param behaviors - The behaviors to be applied to this view.
     */
    constructor(fragment, behaviors) {
        this.fragment = fragment;
        this.behaviors = behaviors;
        /**
         * The data that the view is bound to.
         */
        this.source = null;
        /**
         * The execution context the view is running within.
         */
        this.context = null;
        this.firstChild = fragment.firstChild;
        this.lastChild = fragment.lastChild;
    }
    /**
     * Appends the view's DOM nodes to the referenced node.
     * @param node - The parent node to append the view's DOM nodes to.
     */
    appendTo(node) {
        node.appendChild(this.fragment);
    }
    /**
     * Inserts the view's DOM nodes before the referenced node.
     * @param node - The node to insert the view's DOM before.
     */
    insertBefore(node) {
        if (this.fragment.hasChildNodes()) {
            node.parentNode.insertBefore(this.fragment, node);
        }
        else {
            const parentNode = node.parentNode;
            const end = this.lastChild;
            let current = this.firstChild;
            let next;
            while (current !== end) {
                next = current.nextSibling;
                parentNode.insertBefore(current, node);
                current = next;
            }
            parentNode.insertBefore(end, node);
        }
    }
    /**
     * Removes the view's DOM nodes.
     * The nodes are not disposed and the view can later be re-inserted.
     */
    remove() {
        const fragment = this.fragment;
        const end = this.lastChild;
        let current = this.firstChild;
        let next;
        while (current !== end) {
            next = current.nextSibling;
            fragment.appendChild(current);
            current = next;
        }
        fragment.appendChild(end);
    }
    /**
     * Removes the view and unbinds its behaviors, disposing of DOM nodes afterward.
     * Once a view has been disposed, it cannot be inserted or bound again.
     */
    dispose() {
        const parent = this.firstChild.parentNode;
        const end = this.lastChild;
        let current = this.firstChild;
        let next;
        while (current !== end) {
            next = current.nextSibling;
            parent.removeChild(current);
            current = next;
        }
        parent.removeChild(end);
        const behaviors = this.behaviors;
        const oldSource = this.source;
        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind(oldSource);
        }
    }
    /**
     * Binds a view's behaviors to its binding source.
     * @param source - The binding source for the view's binding behaviors.
     * @param context - The execution context to run the behaviors within.
     */
    bind(source, context) {
        const behaviors = this.behaviors;
        if (this.source === source) {
            return;
        }
        else if (this.source !== null) {
            const oldSource = this.source;
            this.source = source;
            this.context = context;
            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                const current = behaviors[i];
                current.unbind(oldSource);
                current.bind(source, context);
            }
        }
        else {
            this.source = source;
            this.context = context;
            for (let i = 0, ii = behaviors.length; i < ii; ++i) {
                behaviors[i].bind(source, context);
            }
        }
    }
    /**
     * Unbinds a view's behaviors from its binding source.
     */
    unbind() {
        if (this.source === null) {
            return;
        }
        const behaviors = this.behaviors;
        const oldSource = this.source;
        for (let i = 0, ii = behaviors.length; i < ii; ++i) {
            behaviors[i].unbind(oldSource);
        }
        this.source = null;
    }
    /**
     * Efficiently disposes of a contiguous range of synthetic view instances.
     * @param views - A contiguous range of views to be disposed.
     */
    static disposeContiguousBatch(views) {
        if (views.length === 0) {
            return;
        }
        range.setStartBefore(views[0].firstChild);
        range.setEndAfter(views[views.length - 1].lastChild);
        range.deleteContents();
        for (let i = 0, ii = views.length; i < ii; ++i) {
            const view = views[i];
            const behaviors = view.behaviors;
            const oldSource = view.source;
            for (let j = 0, jj = behaviors.length; j < jj; ++j) {
                behaviors[j].unbind(oldSource);
            }
        }
    }
}


/***/ }),

/***/ 668:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const widgets_1 = __webpack_require__(769);
window.AVA = window.AVA || {};
window.AVA.widgets = window.AVA.widgets || {};
window.AVA.widgets.RVX = widgets_1.RVXWidget;


/***/ }),

/***/ 150:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(668), exports);
__exportStar(__webpack_require__(470), exports);


/***/ }),

/***/ 470:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(769), exports);


/***/ }),

/***/ 529:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(235), exports);


/***/ }),

/***/ 235:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 129:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RVXWidget = void 0;
var rvx_widget_1 = __webpack_require__(145);
Object.defineProperty(exports, "RVXWidget", ({ enumerable: true, get: function () { return rvx_widget_1.RVXWidget; } }));
__exportStar(__webpack_require__(529), exports);


/***/ }),

/***/ 145:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RVXWidget = void 0;
const base_1 = __webpack_require__(252);
const fast_element_1 = __webpack_require__(80);
let RVXWidget = class RVXWidget extends base_1.BaseWidget {
    constructor() {
        super(...arguments);
        this.greeting = 'Hello RVX widget';
    }
    greetingChanged() {
        this.shadowRoot.innerHTML = this.greeting;
    }
};
__decorate([
    fast_element_1.attr
], RVXWidget.prototype, "greeting", void 0);
RVXWidget = __decorate([
    fast_element_1.customElement('rvx-widget')
], RVXWidget);
exports.RVXWidget = RVXWidget;


/***/ }),

/***/ 974:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 951:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseWidget = void 0;
const fast_element_1 = __webpack_require__(80);
class BaseWidget extends fast_element_1.FASTElement {
}
exports.BaseWidget = BaseWidget;


/***/ }),

/***/ 252:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(951), exports);


/***/ }),

/***/ 230:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WidgetGeneralError = void 0;
class WidgetGeneralError extends Error {
    constructor(message) {
        super(`${WidgetGeneralError.errorName}: message`);
        this.message = message;
        this.name = WidgetGeneralError.errorName;
    }
}
exports.WidgetGeneralError = WidgetGeneralError;
WidgetGeneralError.errorName = 'WidgetGeneralError';


/***/ }),

/***/ 515:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(230), exports);
__exportStar(__webpack_require__(733), exports);


/***/ }),

/***/ 733:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),

/***/ 769:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(515), exports);
__exportStar(__webpack_require__(129), exports);
__exportStar(__webpack_require__(974), exports);
__exportStar(__webpack_require__(264), exports);


/***/ }),

/***/ 264:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	__webpack_require__(150);
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9mYXN0LWVsZW1lbnQvZGlzdC9lc20vYXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9mYXN0LWVsZW1lbnQvZGlzdC9lc20vY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9mYXN0LWVsZW1lbnQvZGlzdC9lc20vZGlyZWN0aXZlcy9iaW5kaW5nLmpzIiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L2Zhc3QtZWxlbWVudC9kaXN0L2VzbS9kaXJlY3RpdmVzL2NoaWxkcmVuLmpzIiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L2Zhc3QtZWxlbWVudC9kaXN0L2VzbS9kaXJlY3RpdmVzL2RpcmVjdGl2ZS5qcyIsIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9mYXN0LWVsZW1lbnQvZGlzdC9lc20vZGlyZWN0aXZlcy9ub2RlLW9ic2VydmF0aW9uLmpzIiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L2Zhc3QtZWxlbWVudC9kaXN0L2VzbS9kaXJlY3RpdmVzL3JlZi5qcyIsIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9mYXN0LWVsZW1lbnQvZGlzdC9lc20vZGlyZWN0aXZlcy9yZXBlYXQuanMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvZmFzdC1lbGVtZW50L2Rpc3QvZXNtL2RpcmVjdGl2ZXMvc2xvdHRlZC5qcyIsIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9mYXN0LWVsZW1lbnQvZGlzdC9lc20vZGlyZWN0aXZlcy93aGVuLmpzIiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L2Zhc3QtZWxlbWVudC9kaXN0L2VzbS9kb20uanMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvZmFzdC1lbGVtZW50L2Rpc3QvZXNtL2Zhc3QtZGVmaW5pdGlvbnMuanMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvZmFzdC1lbGVtZW50L2Rpc3QvZXNtL2Zhc3QtZWxlbWVudC5qcyIsIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9mYXN0LWVsZW1lbnQvZGlzdC9lc20vaW5kZXguanMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvZmFzdC1lbGVtZW50L2Rpc3QvZXNtL2ludGVyZmFjZXMuanMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvZmFzdC1lbGVtZW50L2Rpc3QvZXNtL29ic2VydmF0aW9uL2FycmF5LWNoYW5nZS1yZWNvcmRzLmpzIiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L2Zhc3QtZWxlbWVudC9kaXN0L2VzbS9vYnNlcnZhdGlvbi9hcnJheS1vYnNlcnZlci5qcyIsIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9mYXN0LWVsZW1lbnQvZGlzdC9lc20vb2JzZXJ2YXRpb24vbm90aWZpZXIuanMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvZmFzdC1lbGVtZW50L2Rpc3QvZXNtL29ic2VydmF0aW9uL29ic2VydmFibGUuanMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvZmFzdC1lbGVtZW50L2Rpc3QvZXNtL3BsYXRmb3JtLmpzIiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L2Zhc3QtZWxlbWVudC9kaXN0L2VzbS9zdHlsZXMuanMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrLy4vbm9kZV9tb2R1bGVzL0BtaWNyb3NvZnQvZmFzdC1lbGVtZW50L2Rpc3QvZXNtL3RlbXBsYXRlLWNvbXBpbGVyLmpzIiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay8uL25vZGVfbW9kdWxlcy9AbWljcm9zb2Z0L2Zhc3QtZWxlbWVudC9kaXN0L2VzbS90ZW1wbGF0ZS5qcyIsIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvLi9ub2RlX21vZHVsZXMvQG1pY3Jvc29mdC9mYXN0LWVsZW1lbnQvZGlzdC9lc20vdmlldy5qcyIsIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvLi9nbG9iYWwuZGVmaW5pdGlvbnMudHMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrLy4vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrLy4vbnBtLmRlZmluaXRpb25zLnRzIiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay8uL3NyYy93aWRnZXRzL1JWWC9kZWZpbml0aW9ucy9pbmRleC50cyIsIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvLi9zcmMvd2lkZ2V0cy9SVlgvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrLy4vc3JjL3dpZGdldHMvUlZYL3J2eC13aWRnZXQudHMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrLy4vc3JjL3dpZGdldHMvYmFzZS9iYXNlLXdpZGdldC50cyIsIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvLi9zcmMvd2lkZ2V0cy9iYXNlL2luZGV4LnRzIiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay8uL3NyYy93aWRnZXRzL2NvbW1vbi9lcnJvci50cyIsIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvLi9zcmMvd2lkZ2V0cy9jb21tb24vaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrLy4vc3JjL3dpZGdldHMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vYXZhLXdpZGdldHMtc2RrL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9hdmEtd2lkZ2V0cy1zZGsvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2F2YS13aWRnZXRzLXNkay93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNEO0FBQzFCO0FBQzVCO0FBQ0EsTUFBTSxxQkFBcUI7QUFDM0I7QUFDQSwwQ0FBMEMsb0JBQW9CO0FBQzlEO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxNQUFNLHFCQUFxQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixTQUFTO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsU0FBUztBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxTQUFTO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQ2hLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLFFBQVE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsZUFBZTtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ087QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDN1VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxQkFBTTtBQUNyQjtBQUNBLGVBQWUscUJBQU07QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCOzs7Ozs7Ozs7Ozs7Ozs7QUNyQzRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRLHFHQUE4QjtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLFFBQVE7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxRQUFRO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsUUFBUTtBQUMxRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxRQUFRO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDMUpBLDJDQUEwQztBQUcxQyxNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLElBQUksRUFBRSxDQUFDO0FBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztBQUM5QyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsbUJBQVMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSm5DLGdEQUFxQztBQUlyQyxnREFBa0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0xsQyxnREFBOEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0E5QixnREFBeUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQXpDLDRDQUF5QztBQUFoQyxpSEFBUztBQUNsQixnREFBOEI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0Q5Qix3Q0FBcUM7QUFDckMsK0NBQThEO0FBRzlELElBQWEsU0FBUyxHQUF0QixNQUFhLFNBQVUsU0FBUSxpQkFBVTtJQUF6Qzs7UUFDUSxhQUFRLEdBQVcsa0JBQWtCLENBQUM7SUFLOUMsQ0FBQztJQUhDLGVBQWU7UUFDYixJQUFJLENBQUMsVUFBVyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQzdDLENBQUM7Q0FDRjtBQUxPO0lBQUwsbUJBQUk7MkNBQXVDO0FBRGpDLFNBQVM7SUFEckIsNEJBQWEsQ0FBQyxZQUFZLENBQUM7R0FDZixTQUFTLENBTXJCO0FBTlksOEJBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNKdEIsK0NBQXNEO0FBRXRELE1BQXNCLFVBQVcsU0FBUSwwQkFBVztDQUNuRDtBQURELGdDQUNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNGRCxnREFBOEI7Ozs7Ozs7Ozs7OztBQ0Q5QixNQUFhLGtCQUFtQixTQUFRLEtBQUs7SUFHekMsWUFBbUIsT0FBZTtRQUM5QixLQUFLLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLFdBQVcsQ0FBQyxDQUFDO1FBRG5DLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFFOUIsSUFBSSxDQUFDLElBQUksR0FBRyxrQkFBa0IsQ0FBQyxTQUFTLENBQUM7SUFDN0MsQ0FBQzs7QUFOTCxnREFPQztBQU5VLDRCQUFTLEdBQUcsb0JBQW9CLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0Q1QyxnREFBd0I7QUFDeEIsZ0RBQTBCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQTFCLGdEQUF5QjtBQUd6QixnREFBc0I7QUFHdEIsZ0RBQWlEO0FBQ2pELGdEQUFxQzs7Ozs7Ozs7Ozs7Ozs7Ozs7VUNSckM7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDckJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxnQ0FBZ0MsWUFBWTtXQUM1QztXQUNBLEU7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsRUFBRTtXQUNGO1dBQ0E7V0FDQSxDQUFDLEk7Ozs7O1dDUEQsc0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7VUNOQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJBVkFfU0RLLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gXCIuL29ic2VydmF0aW9uL29ic2VydmFibGVcIjtcbmltcG9ydCB7IERPTSB9IGZyb20gXCIuL2RvbVwiO1xuLyoqXG4gKiBBIHtAbGluayBWYWx1ZUNvbnZlcnRlcn0gdGhhdCBjb252ZXJ0cyB0byBhbmQgZnJvbSBgYm9vbGVhbmAgdmFsdWVzLlxuICogQHJlbWFya3NcbiAqIFVzZWQgYXV0b21hdGljYWxseSB3aGVuIHRoZSBgYm9vbGVhbmAge0BsaW5rIEF0dHJpYnV0ZU1vZGV9IGlzIHNlbGVjdGVkLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgYm9vbGVhbkNvbnZlcnRlciA9IHtcbiAgICB0b1ZpZXcodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlID8gXCJ0cnVlXCIgOiBcImZhbHNlXCI7XG4gICAgfSxcbiAgICBmcm9tVmlldyh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwgfHxcbiAgICAgICAgICAgIHZhbHVlID09PSB2b2lkIDAgfHxcbiAgICAgICAgICAgIHZhbHVlID09PSBcImZhbHNlXCIgfHxcbiAgICAgICAgICAgIHZhbHVlID09PSBmYWxzZSB8fFxuICAgICAgICAgICAgdmFsdWUgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxufTtcbi8qKlxuICogQSB7QGxpbmsgVmFsdWVDb252ZXJ0ZXJ9IHRoYXQgY29udmVydHMgdG8gYW5kIGZyb20gYG51bWJlcmAgdmFsdWVzLlxuICogQHJlbWFya3NcbiAqIFRoaXMgY29udmVydGVyIGFsbG93cyBmb3IgbnVsbGFibGUgbnVtYmVycywgcmV0dXJuaW5nIGBudWxsYCBpZiB0aGVcbiAqIGlucHV0IHdhcyBgbnVsbGAsIGB1bmRlZmluZWRgLCBvciBgTmFOYC5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IG51bGxhYmxlTnVtYmVyQ29udmVydGVyID0ge1xuICAgIHRvVmlldyh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbnVtYmVyID0gdmFsdWUgKiAxO1xuICAgICAgICByZXR1cm4gaXNOYU4obnVtYmVyKSA/IG51bGwgOiBudW1iZXIudG9TdHJpbmcoKTtcbiAgICB9LFxuICAgIGZyb21WaWV3KHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBudW1iZXIgPSB2YWx1ZSAqIDE7XG4gICAgICAgIHJldHVybiBpc05hTihudW1iZXIpID8gbnVsbCA6IG51bWJlcjtcbiAgICB9LFxufTtcbi8qKlxuICogQW4gaW1wbGVtZW50YXRpb24gb2Yge0BsaW5rIEFjY2Vzc29yfSB0aGF0IHN1cHBvcnRzIHJlYWN0aXZpdHksXG4gKiBjaGFuZ2UgY2FsbGJhY2tzLCBhdHRyaWJ1dGUgcmVmbGVjdGlvbiwgYW5kIHR5cGUgY29udmVyc2lvbiBmb3JcbiAqIGN1c3RvbSBlbGVtZW50cy5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIEF0dHJpYnV0ZURlZmluaXRpb24ge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgQXR0cmlidXRlRGVmaW5pdGlvbi5cbiAgICAgKiBAcGFyYW0gT3duZXIgLSBUaGUgY2xhc3MgY29uc3RydWN0b3IgdGhhdCBvd25zIHRoaXMgYXR0cmlidXRlLlxuICAgICAqIEBwYXJhbSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IGFzc29jaWF0ZWQgd2l0aCB0aGUgYXR0cmlidXRlLlxuICAgICAqIEBwYXJhbSBhdHRyaWJ1dGUgLSBUaGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlIGluIEhUTUwuXG4gICAgICogQHBhcmFtIG1vZGUgLSBUaGUge0BsaW5rIEF0dHJpYnV0ZU1vZGV9IHRoYXQgZGVzY3JpYmVzIHRoZSBiZWhhdmlvciBvZiB0aGlzIGF0dHJpYnV0ZS5cbiAgICAgKiBAcGFyYW0gY29udmVydGVyIC0gQSB7QGxpbmsgVmFsdWVDb252ZXJ0ZXJ9IHRoYXQgaW50ZWdyYXRlcyB3aXRoIHRoZSBwcm9wZXJ0eSBnZXR0ZXIvc2V0dGVyXG4gICAgICogdG8gY29udmVydCB2YWx1ZXMgdG8gYW5kIGZyb20gYSBET00gc3RyaW5nLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKE93bmVyLCBuYW1lLCBhdHRyaWJ1dGUgPSBuYW1lLnRvTG93ZXJDYXNlKCksIG1vZGUgPSBcInJlZmxlY3RcIiwgY29udmVydGVyKSB7XG4gICAgICAgIHRoaXMuZ3VhcmRzID0gbmV3IFNldCgpO1xuICAgICAgICB0aGlzLk93bmVyID0gT3duZXI7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuYXR0cmlidXRlID0gYXR0cmlidXRlO1xuICAgICAgICB0aGlzLm1vZGUgPSBtb2RlO1xuICAgICAgICB0aGlzLmNvbnZlcnRlciA9IGNvbnZlcnRlcjtcbiAgICAgICAgdGhpcy5maWVsZE5hbWUgPSBgXyR7bmFtZX1gO1xuICAgICAgICB0aGlzLmNhbGxiYWNrTmFtZSA9IGAke25hbWV9Q2hhbmdlZGA7XG4gICAgICAgIHRoaXMuaGFzQ2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrTmFtZSBpbiBPd25lci5wcm90b3R5cGU7XG4gICAgICAgIGlmIChtb2RlID09PSBcImJvb2xlYW5cIiAmJiBjb252ZXJ0ZXIgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgdGhpcy5jb252ZXJ0ZXIgPSBib29sZWFuQ29udmVydGVyO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFNldHMgdGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUvcHJvcGVydHkgb24gdGhlIHNvdXJjZSBlbGVtZW50LlxuICAgICAqIEBwYXJhbSBzb3VyY2UgLSBUaGUgc291cmNlIGVsZW1lbnQgdG8gYWNjZXNzLlxuICAgICAqIEBwYXJhbSB2YWx1ZSAtIFRoZSB2YWx1ZSB0byBzZXQgdGhlIGF0dHJpYnV0ZS9wcm9wZXJ0eSB0by5cbiAgICAgKi9cbiAgICBzZXRWYWx1ZShzb3VyY2UsIG5ld1ZhbHVlKSB7XG4gICAgICAgIGNvbnN0IG9sZFZhbHVlID0gc291cmNlW3RoaXMuZmllbGROYW1lXTtcbiAgICAgICAgY29uc3QgY29udmVydGVyID0gdGhpcy5jb252ZXJ0ZXI7XG4gICAgICAgIGlmIChjb252ZXJ0ZXIgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgbmV3VmFsdWUgPSBjb252ZXJ0ZXIuZnJvbVZpZXcobmV3VmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHNvdXJjZVt0aGlzLmZpZWxkTmFtZV0gPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgIHRoaXMudHJ5UmVmbGVjdFRvQXR0cmlidXRlKHNvdXJjZSk7XG4gICAgICAgICAgICBpZiAodGhpcy5oYXNDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHNvdXJjZVt0aGlzLmNhbGxiYWNrTmFtZV0ob2xkVmFsdWUsIG5ld1ZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNvdXJjZS4kZmFzdENvbnRyb2xsZXIubm90aWZ5KHRoaXMubmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0cyB0aGUgdmFsdWUgb2YgdGhlIGF0dHJpYnV0ZS9wcm9wZXJ0eSBvbiB0aGUgc291cmNlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIHNvdXJjZSAtIFRoZSBzb3VyY2UgZWxlbWVudCB0byBhY2Nlc3MuXG4gICAgICovXG4gICAgZ2V0VmFsdWUoc291cmNlKSB7XG4gICAgICAgIE9ic2VydmFibGUudHJhY2soc291cmNlLCB0aGlzLm5hbWUpO1xuICAgICAgICByZXR1cm4gc291cmNlW3RoaXMuZmllbGROYW1lXTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIG9uQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKGVsZW1lbnQsIHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmd1YXJkcy5oYXMoZWxlbWVudCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmd1YXJkcy5hZGQoZWxlbWVudCk7XG4gICAgICAgIHRoaXMuc2V0VmFsdWUoZWxlbWVudCwgdmFsdWUpO1xuICAgICAgICB0aGlzLmd1YXJkcy5kZWxldGUoZWxlbWVudCk7XG4gICAgfVxuICAgIHRyeVJlZmxlY3RUb0F0dHJpYnV0ZShlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IG1vZGUgPSB0aGlzLm1vZGU7XG4gICAgICAgIGNvbnN0IGd1YXJkcyA9IHRoaXMuZ3VhcmRzO1xuICAgICAgICBpZiAoZ3VhcmRzLmhhcyhlbGVtZW50KSB8fCBtb2RlID09PSBcImZyb21WaWV3XCIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBET00ucXVldWVVcGRhdGUoKCkgPT4ge1xuICAgICAgICAgICAgZ3VhcmRzLmFkZChlbGVtZW50KTtcbiAgICAgICAgICAgIGNvbnN0IGxhdGVzdFZhbHVlID0gZWxlbWVudFt0aGlzLmZpZWxkTmFtZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG1vZGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFwicmVmbGVjdFwiOlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjb252ZXJ0ZXIgPSB0aGlzLmNvbnZlcnRlcjtcbiAgICAgICAgICAgICAgICAgICAgRE9NLnNldEF0dHJpYnV0ZShlbGVtZW50LCB0aGlzLmF0dHJpYnV0ZSwgY29udmVydGVyICE9PSB2b2lkIDAgPyBjb252ZXJ0ZXIudG9WaWV3KGxhdGVzdFZhbHVlKSA6IGxhdGVzdFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgICAgICAgICAgRE9NLnNldEJvb2xlYW5BdHRyaWJ1dGUoZWxlbWVudCwgdGhpcy5hdHRyaWJ1dGUsIGxhdGVzdFZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBndWFyZHMuZGVsZXRlKGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29sbGVjdHMgYWxsIGF0dHJpYnV0ZSBkZWZpbml0aW9ucyBhc3NvY2lhdGVkIHdpdGggdGhlIG93bmVyLlxuICAgICAqIEBwYXJhbSBPd25lciAtIFRoZSBjbGFzcyBjb25zdHJ1Y3RvciB0byBjb2xsZWN0IGF0dHJpYnV0ZSBmb3IuXG4gICAgICogQHBhcmFtIGF0dHJpYnV0ZUxpc3RzIC0gQW55IGV4aXN0aW5nIGF0dHJpYnV0ZXMgdG8gY29sbGVjdCBhbmQgbWVyZ2Ugd2l0aCB0aG9zZSBhc3NvY2lhdGVkIHdpdGggdGhlIG93bmVyLlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIHN0YXRpYyBjb2xsZWN0KE93bmVyLCAuLi5hdHRyaWJ1dGVMaXN0cykge1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gW107XG4gICAgICAgIGF0dHJpYnV0ZUxpc3RzLnB1c2goT3duZXIuYXR0cmlidXRlcyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGF0dHJpYnV0ZUxpc3RzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IGxpc3QgPSBhdHRyaWJ1dGVMaXN0c1tpXTtcbiAgICAgICAgICAgIGlmIChsaXN0ID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwLCBqaiA9IGxpc3QubGVuZ3RoOyBqIDwgamo7ICsraikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IGxpc3Rbal07XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25maWcgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlcy5wdXNoKG5ldyBBdHRyaWJ1dGVEZWZpbml0aW9uKE93bmVyLCBjb25maWcpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChuZXcgQXR0cmlidXRlRGVmaW5pdGlvbihPd25lciwgY29uZmlnLnByb3BlcnR5LCBjb25maWcuYXR0cmlidXRlLCBjb25maWcubW9kZSwgY29uZmlnLmNvbnZlcnRlcikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXR0cmlidXRlcztcbiAgICB9XG59XG5leHBvcnQgZnVuY3Rpb24gYXR0cihjb25maWdPclRhcmdldCwgcHJvcCkge1xuICAgIGxldCBjb25maWc7XG4gICAgZnVuY3Rpb24gZGVjb3JhdG9yKCR0YXJnZXQsICRwcm9wKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgLy8gTm9uIGludm9jYXRpb246XG4gICAgICAgICAgICAvLyAtIEBhdHRyXG4gICAgICAgICAgICAvLyBJbnZvY2F0aW9uIHdpdGggb3Igdy9vIG9wdHM6XG4gICAgICAgICAgICAvLyAtIEBhdHRyKClcbiAgICAgICAgICAgIC8vIC0gQGF0dHIoey4uLm9wdHN9KVxuICAgICAgICAgICAgY29uZmlnLnByb3BlcnR5ID0gJHByb3A7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9ICR0YXJnZXQuY29uc3RydWN0b3IuYXR0cmlidXRlcyB8fFxuICAgICAgICAgICAgKCR0YXJnZXQuY29uc3RydWN0b3IuYXR0cmlidXRlcyA9IFtdKTtcbiAgICAgICAgYXR0cmlidXRlcy5wdXNoKGNvbmZpZyk7XG4gICAgfVxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAvLyBOb24gaW52b2NhdGlvbjpcbiAgICAgICAgLy8gLSBAYXR0clxuICAgICAgICBjb25maWcgPSB7fTtcbiAgICAgICAgZGVjb3JhdG9yKGNvbmZpZ09yVGFyZ2V0LCBwcm9wKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBJbnZvY2F0aW9uIHdpdGggb3Igdy9vIG9wdHM6XG4gICAgLy8gLSBAYXR0cigpXG4gICAgLy8gLSBAYXR0cih7Li4ub3B0c30pXG4gICAgY29uZmlnID0gY29uZmlnT3JUYXJnZXQgPT09IHZvaWQgMCA/IHt9IDogY29uZmlnT3JUYXJnZXQ7XG4gICAgcmV0dXJuIGRlY29yYXRvcjtcbn1cbiIsInZhciBfX2RlY29yYXRlID0gKHRoaXMgJiYgdGhpcy5fX2RlY29yYXRlKSB8fCBmdW5jdGlvbiAoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xuICAgIGlmICh0eXBlb2YgUmVmbGVjdCA9PT0gXCJvYmplY3RcIiAmJiB0eXBlb2YgUmVmbGVjdC5kZWNvcmF0ZSA9PT0gXCJmdW5jdGlvblwiKSByID0gUmVmbGVjdC5kZWNvcmF0ZShkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYyk7XG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xufTtcbmltcG9ydCB7IEZBU1RFbGVtZW50RGVmaW5pdGlvbiB9IGZyb20gXCIuL2Zhc3QtZGVmaW5pdGlvbnNcIjtcbmltcG9ydCB7IFByb3BlcnR5Q2hhbmdlTm90aWZpZXIgfSBmcm9tIFwiLi9vYnNlcnZhdGlvbi9ub3RpZmllclwiO1xuaW1wb3J0IHsgZGVmYXVsdEV4ZWN1dGlvbkNvbnRleHQsIE9ic2VydmFibGUsIG9ic2VydmFibGUsIH0gZnJvbSBcIi4vb2JzZXJ2YXRpb24vb2JzZXJ2YWJsZVwiO1xuaW1wb3J0IHsgRE9NIH0gZnJvbSBcIi4vZG9tXCI7XG5jb25zdCBzaGFkb3dSb290cyA9IG5ldyBXZWFrTWFwKCk7XG5jb25zdCBkZWZhdWx0RXZlbnRPcHRpb25zID0ge1xuICAgIGJ1YmJsZXM6IHRydWUsXG4gICAgY29tcG9zZWQ6IHRydWUsXG59O1xuZnVuY3Rpb24gZ2V0U2hhZG93Um9vdChlbGVtZW50KSB7XG4gICAgcmV0dXJuIGVsZW1lbnQuc2hhZG93Um9vdCB8fCBzaGFkb3dSb290cy5nZXQoZWxlbWVudCkgfHwgbnVsbDtcbn1cbi8qKlxuICogQ29udHJvbHMgdGhlIGxpZmVjeWNsZSBhbmQgcmVuZGVyaW5nIG9mIGEgYEZBU1RFbGVtZW50YC5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIENvbnRyb2xsZXIgZXh0ZW5kcyBQcm9wZXJ0eUNoYW5nZU5vdGlmaWVyIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgQ29udHJvbGxlciB0byBjb250cm9sIHRoZSBzcGVjaWZpZWQgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0gZWxlbWVudCAtIFRoZSBlbGVtZW50IHRvIGJlIGNvbnRyb2xsZWQgYnkgdGhpcyBjb250cm9sbGVyLlxuICAgICAqIEBwYXJhbSBkZWZpbml0aW9uIC0gVGhlIGVsZW1lbnQgZGVmaW5pdGlvbiBtZXRhZGF0YSB0aGF0IGluc3RydWN0cyB0aGlzXG4gICAgICogY29udHJvbGxlciBpbiBob3cgdG8gaGFuZGxlIHJlbmRlcmluZyBhbmQgb3RoZXIgcGxhdGZvcm0gaW50ZWdyYXRpb25zLlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGVsZW1lbnQsIGRlZmluaXRpb24pIHtcbiAgICAgICAgc3VwZXIoZWxlbWVudCk7XG4gICAgICAgIHRoaXMuYm91bmRPYnNlcnZhYmxlcyA9IG51bGw7XG4gICAgICAgIHRoaXMuYmVoYXZpb3JzID0gbnVsbDtcbiAgICAgICAgdGhpcy5uZWVkc0luaXRpYWxpemF0aW9uID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fdGVtcGxhdGUgPSBudWxsO1xuICAgICAgICB0aGlzLl9zdHlsZXMgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHZpZXcgYXNzb2NpYXRlZCB3aXRoIHRoZSBjdXN0b20gZWxlbWVudC5cbiAgICAgICAgICogQHJlbWFya3NcbiAgICAgICAgICogSWYgYG51bGxgIHRoZW4gdGhlIGVsZW1lbnQgaXMgbWFuYWdpbmcgaXRzIG93biByZW5kZXJpbmcuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnZpZXcgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogSW5kaWNhdGVzIHdoZXRoZXIgb3Igbm90IHRoZSBjdXN0b20gZWxlbWVudCBoYXMgYmVlblxuICAgICAgICAgKiBjb25uZWN0ZWQgdG8gdGhlIGRvY3VtZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5pc0Nvbm5lY3RlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLmRlZmluaXRpb24gPSBkZWZpbml0aW9uO1xuICAgICAgICBjb25zdCBzaGFkb3dPcHRpb25zID0gZGVmaW5pdGlvbi5zaGFkb3dPcHRpb25zO1xuICAgICAgICBpZiAoc2hhZG93T3B0aW9ucyAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBjb25zdCBzaGFkb3dSb290ID0gZWxlbWVudC5hdHRhY2hTaGFkb3coc2hhZG93T3B0aW9ucyk7XG4gICAgICAgICAgICBpZiAoc2hhZG93T3B0aW9ucy5tb2RlID09PSBcImNsb3NlZFwiKSB7XG4gICAgICAgICAgICAgICAgc2hhZG93Um9vdHMuc2V0KGVsZW1lbnQsIHNoYWRvd1Jvb3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIENhcHR1cmUgYW55IG9ic2VydmFibGUgdmFsdWVzIHRoYXQgd2VyZSBzZXQgYnkgdGhlIGJpbmRpbmcgZW5naW5lIGJlZm9yZVxuICAgICAgICAvLyB0aGUgYnJvd3NlciB1cGdyYWRlZCB0aGUgZWxlbWVudC4gVGhlbiBkZWxldGUgdGhlIHByb3BlcnR5IHNpbmNlIGl0IHdpbGxcbiAgICAgICAgLy8gc2hhZG93IHRoZSBnZXR0ZXIvc2V0dGVyIHRoYXQgaXMgcmVxdWlyZWQgdG8gbWFrZSB0aGUgb2JzZXJ2YWJsZSBvcGVyYXRlLlxuICAgICAgICAvLyBMYXRlciwgaW4gdGhlIGNvbm5lY3QgY2FsbGJhY2ssIHdlJ2xsIHJlLWFwcGx5IHRoZSB2YWx1ZXMuXG4gICAgICAgIGNvbnN0IGFjY2Vzc29ycyA9IE9ic2VydmFibGUuZ2V0QWNjZXNzb3JzKGVsZW1lbnQpO1xuICAgICAgICBpZiAoYWNjZXNzb3JzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IGJvdW5kT2JzZXJ2YWJsZXMgPSAodGhpcy5ib3VuZE9ic2VydmFibGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBhY2Nlc3NvcnMubGVuZ3RoOyBpIDwgaWk7ICsraSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGFjY2Vzc29yc1tpXS5uYW1lO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gZWxlbWVudFtwcm9wZXJ0eU5hbWVdO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBlbGVtZW50W3Byb3BlcnR5TmFtZV07XG4gICAgICAgICAgICAgICAgICAgIGJvdW5kT2JzZXJ2YWJsZXNbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzL3NldHMgdGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHRoZSBjb21wb25lbnQuXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBUaGlzIHZhbHVlIGNhbiBvbmx5IGJlIGFjY3VyYXRlbHkgcmVhZCBhZnRlciBjb25uZWN0IGJ1dCBjYW4gYmUgc2V0IGF0IGFueSB0aW1lLlxuICAgICAqL1xuICAgIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3RlbXBsYXRlO1xuICAgIH1cbiAgICBzZXQgdGVtcGxhdGUodmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3RlbXBsYXRlID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RlbXBsYXRlID0gdmFsdWU7XG4gICAgICAgIGlmICghdGhpcy5uZWVkc0luaXRpYWxpemF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLnJlbmRlclRlbXBsYXRlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzL3NldHMgdGhlIHByaW1hcnkgc3R5bGVzIHVzZWQgZm9yIHRoZSBjb21wb25lbnQuXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBUaGlzIHZhbHVlIGNhbiBvbmx5IGJlIGFjY3VyYXRlbHkgcmVhZCBhZnRlciBjb25uZWN0IGJ1dCBjYW4gYmUgc2V0IGF0IGFueSB0aW1lLlxuICAgICAqL1xuICAgIGdldCBzdHlsZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdHlsZXM7XG4gICAgfVxuICAgIHNldCBzdHlsZXModmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMuX3N0eWxlcyA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fc3R5bGVzICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVN0eWxlcyh0aGlzLl9zdHlsZXMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N0eWxlcyA9IHZhbHVlO1xuICAgICAgICBpZiAoIXRoaXMubmVlZHNJbml0aWFsaXphdGlvbiAmJiB2YWx1ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5hZGRTdHlsZXModmFsdWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgc3R5bGVzIHRvIHRoaXMgZWxlbWVudC4gUHJvdmlkaW5nIGFuIEhUTUxTdHlsZUVsZW1lbnQgd2lsbCBhdHRhY2ggdGhlIGVsZW1lbnQgaW5zdGFuY2UgdG8gdGhlIHNoYWRvd1Jvb3QuXG4gICAgICogQHBhcmFtIHN0eWxlcyAtIFRoZSBzdHlsZXMgdG8gYWRkLlxuICAgICAqL1xuICAgIGFkZFN0eWxlcyhzdHlsZXMpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gZ2V0U2hhZG93Um9vdCh0aGlzLmVsZW1lbnQpIHx8XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuZ2V0Um9vdE5vZGUoKTtcbiAgICAgICAgaWYgKHN0eWxlcyBpbnN0YW5jZW9mIEhUTUxTdHlsZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRhcmdldC5wcmVwZW5kKHN0eWxlcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VCZWhhdmlvcnMgPSBzdHlsZXMuYmVoYXZpb3JzO1xuICAgICAgICAgICAgc3R5bGVzLmFkZFN0eWxlc1RvKHRhcmdldCk7XG4gICAgICAgICAgICBpZiAoc291cmNlQmVoYXZpb3JzICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hZGRCZWhhdmlvcnMoc291cmNlQmVoYXZpb3JzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHN0eWxlcyBmcm9tIHRoaXMgZWxlbWVudC4gUHJvdmlkaW5nIGFuIEhUTUxTdHlsZUVsZW1lbnQgd2lsbCBkZXRhY2ggdGhlIGVsZW1lbnQgaW5zdGFuY2UgZnJvbSB0aGUgc2hhZG93Um9vdC5cbiAgICAgKiBAcGFyYW0gc3R5bGVzIC0gdGhlIHN0eWxlcyB0byByZW1vdmUuXG4gICAgICovXG4gICAgcmVtb3ZlU3R5bGVzKHN0eWxlcykge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSBnZXRTaGFkb3dSb290KHRoaXMuZWxlbWVudCkgfHxcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5nZXRSb290Tm9kZSgpO1xuICAgICAgICBpZiAoc3R5bGVzIGluc3RhbmNlb2YgSFRNTFN0eWxlRWxlbWVudCkge1xuICAgICAgICAgICAgdGFyZ2V0LnJlbW92ZUNoaWxkKHN0eWxlcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VCZWhhdmlvcnMgPSBzdHlsZXMuYmVoYXZpb3JzO1xuICAgICAgICAgICAgc3R5bGVzLnJlbW92ZVN0eWxlc0Zyb20odGFyZ2V0KTtcbiAgICAgICAgICAgIGlmIChzb3VyY2VCZWhhdmlvcnMgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUJlaGF2aW9ycyhzb3VyY2VCZWhhdmlvcnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkZHMgYmVoYXZpb3JzIHRvIHRoaXMgZWxlbWVudC5cbiAgICAgKiBAcGFyYW0gYmVoYXZpb3JzIC0gVGhlIGJlaGF2aW9ycyB0byBhZGQuXG4gICAgICovXG4gICAgYWRkQmVoYXZpb3JzKGJlaGF2aW9ycykge1xuICAgICAgICBjb25zdCB0YXJnZXRCZWhhdmlvcnMgPSB0aGlzLmJlaGF2aW9ycyB8fCAodGhpcy5iZWhhdmlvcnMgPSBbXSk7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IGJlaGF2aW9ycy5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHRhcmdldEJlaGF2aW9ycy5wdXNoKGJlaGF2aW9yc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgYmVoYXZpb3JzW2ldLmJpbmQoZWxlbWVudCwgZGVmYXVsdEV4ZWN1dGlvbkNvbnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYmVoYXZpb3JzIGZyb20gdGhpcyBlbGVtZW50LlxuICAgICAqIEBwYXJhbSBiZWhhdmlvcnMgLSBUaGUgYmVoYXZpb3JzIHRvIHJlbW92ZS5cbiAgICAgKi9cbiAgICByZW1vdmVCZWhhdmlvcnMoYmVoYXZpb3JzKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldEJlaGF2aW9ycyA9IHRoaXMuYmVoYXZpb3JzO1xuICAgICAgICBpZiAodGFyZ2V0QmVoYXZpb3JzID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgbGVuZ3RoID0gYmVoYXZpb3JzLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0YXJnZXRCZWhhdmlvcnMuaW5kZXhPZihiZWhhdmlvcnNbaV0pO1xuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgIHRhcmdldEJlaGF2aW9ycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGJlaGF2aW9yc1tpXS51bmJpbmQoZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogUnVucyBjb25uZWN0ZWQgbGlmZWN5Y2xlIGJlaGF2aW9yIG9uIHRoZSBhc3NvY2lhdGVkIGVsZW1lbnQuXG4gICAgICovXG4gICAgb25Db25uZWN0ZWRDYWxsYmFjaygpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNDb25uZWN0ZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xuICAgICAgICBpZiAodGhpcy5uZWVkc0luaXRpYWxpemF0aW9uKSB7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaEluaXRpYWxpemF0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy52aWV3ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLnZpZXcuYmluZChlbGVtZW50LCBkZWZhdWx0RXhlY3V0aW9uQ29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgYmVoYXZpb3JzID0gdGhpcy5iZWhhdmlvcnM7XG4gICAgICAgIGlmIChiZWhhdmlvcnMgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGJlaGF2aW9ycy5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgICAgICAgICAgICAgYmVoYXZpb3JzW2ldLmJpbmQoZWxlbWVudCwgZGVmYXVsdEV4ZWN1dGlvbkNvbnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuaXNDb25uZWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSdW5zIGRpc2Nvbm5lY3RlZCBsaWZlY3ljbGUgYmVoYXZpb3Igb24gdGhlIGFzc29jaWF0ZWQgZWxlbWVudC5cbiAgICAgKi9cbiAgICBvbkRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmlzQ29ubmVjdGVkID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLnZpZXc7XG4gICAgICAgIGlmICh2aWV3ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB2aWV3LnVuYmluZCgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGJlaGF2aW9ycyA9IHRoaXMuYmVoYXZpb3JzO1xuICAgICAgICBpZiAoYmVoYXZpb3JzICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYmVoYXZpb3JzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgICAgICAgICBiZWhhdmlvcnNbaV0udW5iaW5kKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJ1bnMgdGhlIGF0dHJpYnV0ZSBjaGFuZ2VkIGNhbGxiYWNrIGZvciB0aGUgYXNzb2NpYXRlZCBlbGVtZW50LlxuICAgICAqIEBwYXJhbSBuYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGF0dHJpYnV0ZSB0aGF0IGNoYW5nZWQuXG4gICAgICogQHBhcmFtIG9sZFZhbHVlIC0gVGhlIHByZXZpb3VzIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUuXG4gICAgICogQHBhcmFtIG5ld1ZhbHVlIC0gVGhlIG5ldyB2YWx1ZSBvZiB0aGUgYXR0cmlidXRlLlxuICAgICAqL1xuICAgIG9uQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSkge1xuICAgICAgICBjb25zdCBhdHRyRGVmID0gdGhpcy5kZWZpbml0aW9uLmF0dHJpYnV0ZUxvb2t1cFtuYW1lXTtcbiAgICAgICAgaWYgKGF0dHJEZWYgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgYXR0ckRlZi5vbkF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayh0aGlzLmVsZW1lbnQsIG5ld1ZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBFbWl0cyBhIGN1c3RvbSBIVE1MIGV2ZW50LlxuICAgICAqIEBwYXJhbSB0eXBlIC0gVGhlIHR5cGUgbmFtZSBvZiB0aGUgZXZlbnQuXG4gICAgICogQHBhcmFtIGRldGFpbCAtIFRoZSBldmVudCBkZXRhaWwgb2JqZWN0IHRvIHNlbmQgd2l0aCB0aGUgZXZlbnQuXG4gICAgICogQHBhcmFtIG9wdGlvbnMgLSBUaGUgZXZlbnQgb3B0aW9ucy4gQnkgZGVmYXVsdCBidWJibGVzIGFuZCBjb21wb3NlZC5cbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIE9ubHkgZW1pdHMgZXZlbnRzIGlmIGNvbm5lY3RlZC5cbiAgICAgKi9cbiAgICBlbWl0KHR5cGUsIGRldGFpbCwgb3B0aW9ucykge1xuICAgICAgICBpZiAodGhpcy5pc0Nvbm5lY3RlZCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCh0eXBlLCBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oeyBkZXRhaWwgfSwgZGVmYXVsdEV2ZW50T3B0aW9ucyksIG9wdGlvbnMpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmaW5pc2hJbml0aWFsaXphdGlvbigpIHtcbiAgICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcbiAgICAgICAgY29uc3QgYm91bmRPYnNlcnZhYmxlcyA9IHRoaXMuYm91bmRPYnNlcnZhYmxlcztcbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBhbnkgb2JzZXJ2YWJsZXMgdGhhdCB3ZXJlIGJvdW5kLCByZS1hcHBseSB0aGVpciB2YWx1ZXMuXG4gICAgICAgIGlmIChib3VuZE9ic2VydmFibGVzICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWVzID0gT2JqZWN0LmtleXMoYm91bmRPYnNlcnZhYmxlcyk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBwcm9wZXJ0eU5hbWVzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWVzW2ldO1xuICAgICAgICAgICAgICAgIGVsZW1lbnRbcHJvcGVydHlOYW1lXSA9IGJvdW5kT2JzZXJ2YWJsZXNbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYm91bmRPYnNlcnZhYmxlcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZGVmaW5pdGlvbiA9IHRoaXMuZGVmaW5pdGlvbjtcbiAgICAgICAgLy8gMS4gVGVtcGxhdGUgb3ZlcnJpZGVzIHRha2UgdG9wIHByZWNlZGVuY2UuXG4gICAgICAgIGlmICh0aGlzLl90ZW1wbGF0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5yZXNvbHZlVGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICAvLyAyLiBBbGxvdyBmb3IgZWxlbWVudCBpbnN0YW5jZSBvdmVycmlkZXMgbmV4dC5cbiAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IHRoaXMuZWxlbWVudC5yZXNvbHZlVGVtcGxhdGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGRlZmluaXRpb24udGVtcGxhdGUpIHtcbiAgICAgICAgICAgICAgICAvLyAzLiBEZWZhdWx0IHRvIHRoZSBzdGF0aWMgZGVmaW5pdGlvbi5cbiAgICAgICAgICAgICAgICB0aGlzLl90ZW1wbGF0ZSA9IGRlZmluaXRpb24udGVtcGxhdGUgfHwgbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB3ZSBoYXZlIGEgdGVtcGxhdGUgYWZ0ZXIgdGhlIGFib3ZlIHByb2Nlc3MsIHJlbmRlciBpdC5cbiAgICAgICAgLy8gSWYgdGhlcmUncyBubyB0ZW1wbGF0ZSwgdGhlbiB0aGUgZWxlbWVudCBhdXRob3IgaGFzIG9wdGVkIGludG9cbiAgICAgICAgLy8gY3VzdG9tIHJlbmRlcmluZyBhbmQgdGhleSB3aWxsIG1hbmFnZWQgdGhlIHNoYWRvdyByb290J3MgY29udGVudCB0aGVtc2VsdmVzLlxuICAgICAgICBpZiAodGhpcy5fdGVtcGxhdGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyVGVtcGxhdGUodGhpcy5fdGVtcGxhdGUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIDEuIFN0eWxlcyBvdmVycmlkZXMgdGFrZSB0b3AgcHJlY2VkZW5jZS5cbiAgICAgICAgaWYgKHRoaXMuX3N0eWxlcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZWxlbWVudC5yZXNvbHZlU3R5bGVzKSB7XG4gICAgICAgICAgICAgICAgLy8gMi4gQWxsb3cgZm9yIGVsZW1lbnQgaW5zdGFuY2Ugb3ZlcnJpZGVzIG5leHQuXG4gICAgICAgICAgICAgICAgdGhpcy5fc3R5bGVzID0gdGhpcy5lbGVtZW50LnJlc29sdmVTdHlsZXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGRlZmluaXRpb24uc3R5bGVzKSB7XG4gICAgICAgICAgICAgICAgLy8gMy4gRGVmYXVsdCB0byB0aGUgc3RhdGljIGRlZmluaXRpb24uXG4gICAgICAgICAgICAgICAgdGhpcy5fc3R5bGVzID0gZGVmaW5pdGlvbi5zdHlsZXMgfHwgbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiB3ZSBoYXZlIHN0eWxlcyBhZnRlciB0aGUgYWJvdmUgcHJvY2VzcywgYWRkIHRoZW0uXG4gICAgICAgIGlmICh0aGlzLl9zdHlsZXMgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkU3R5bGVzKHRoaXMuX3N0eWxlcyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5uZWVkc0luaXRpYWxpemF0aW9uID0gZmFsc2U7XG4gICAgfVxuICAgIHJlbmRlclRlbXBsYXRlKHRlbXBsYXRlKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIC8vIFdoZW4gZ2V0dGluZyB0aGUgaG9zdCB0byByZW5kZXIgdG8sIHdlIHN0YXJ0IGJ5IGxvb2tpbmdcbiAgICAgICAgLy8gdXAgdGhlIHNoYWRvdyByb290LiBJZiB0aGVyZSBpc24ndCBvbmUsIHRoZW4gdGhhdCBtZWFuc1xuICAgICAgICAvLyB3ZSdyZSBkb2luZyBhIExpZ2h0IERPTSByZW5kZXIgdG8gdGhlIGVsZW1lbnQncyBkaXJlY3QgY2hpbGRyZW4uXG4gICAgICAgIGNvbnN0IGhvc3QgPSBnZXRTaGFkb3dSb290KGVsZW1lbnQpIHx8IGVsZW1lbnQ7XG4gICAgICAgIGlmICh0aGlzLnZpZXcgIT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlJ3MgYWxyZWFkeSBhIHZpZXcsIHdlIG5lZWQgdG8gdW5iaW5kIGFuZCByZW1vdmUgdGhyb3VnaCBkaXNwb3NlLlxuICAgICAgICAgICAgdGhpcy52aWV3LmRpc3Bvc2UoKTtcbiAgICAgICAgICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoIXRoaXMubmVlZHNJbml0aWFsaXphdGlvbikge1xuICAgICAgICAgICAgLy8gSWYgdGhlcmUgd2FzIHByZXZpb3VzIGN1c3RvbSByZW5kZXJpbmcsIHdlIG5lZWQgdG8gY2xlYXIgb3V0IHRoZSBob3N0LlxuICAgICAgICAgICAgRE9NLnJlbW92ZUNoaWxkTm9kZXMoaG9zdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgICAgICAvLyBJZiBhIG5ldyB0ZW1wbGF0ZSB3YXMgcHJvdmlkZWQsIHJlbmRlciBpdC5cbiAgICAgICAgICAgIHRoaXMudmlldyA9IHRlbXBsYXRlLnJlbmRlcihlbGVtZW50LCBob3N0LCBlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBMb2NhdGVzIG9yIGNyZWF0ZXMgYSBjb250cm9sbGVyIGZvciB0aGUgc3BlY2lmaWVkIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIGVsZW1lbnQgLSBUaGUgZWxlbWVudCB0byByZXR1cm4gdGhlIGNvbnRyb2xsZXIgZm9yLlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVGhlIHNwZWNpZmllZCBlbGVtZW50IG11c3QgaGF2ZSBhIHtAbGluayBGQVNURWxlbWVudERlZmluaXRpb259XG4gICAgICogcmVnaXN0ZXJlZCBlaXRoZXIgdGhyb3VnaCB0aGUgdXNlIG9mIHRoZSB7QGxpbmsgY3VzdG9tRWxlbWVudH1cbiAgICAgKiBkZWNvcmF0b3Igb3IgYSBjYWxsIHRvIGBGQVNURWxlbWVudC5kZWZpbmVgLlxuICAgICAqL1xuICAgIHN0YXRpYyBmb3JDdXN0b21FbGVtZW50KGVsZW1lbnQpIHtcbiAgICAgICAgY29uc3QgY29udHJvbGxlciA9IGVsZW1lbnQuJGZhc3RDb250cm9sbGVyO1xuICAgICAgICBpZiAoY29udHJvbGxlciAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm4gY29udHJvbGxlcjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBkZWZpbml0aW9uID0gRkFTVEVsZW1lbnREZWZpbml0aW9uLmZvclR5cGUoZWxlbWVudC5jb25zdHJ1Y3Rvcik7XG4gICAgICAgIGlmIChkZWZpbml0aW9uID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgRkFTVEVsZW1lbnQgZGVmaW5pdGlvbi5cIik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChlbGVtZW50LiRmYXN0Q29udHJvbGxlciA9IG5ldyBDb250cm9sbGVyKGVsZW1lbnQsIGRlZmluaXRpb24pKTtcbiAgICB9XG59XG5fX2RlY29yYXRlKFtcbiAgICBvYnNlcnZhYmxlXG5dLCBDb250cm9sbGVyLnByb3RvdHlwZSwgXCJpc0Nvbm5lY3RlZFwiLCB2b2lkIDApO1xuIiwiaW1wb3J0IHsgc2V0Q3VycmVudEV2ZW50LCB9IGZyb20gXCIuLi9vYnNlcnZhdGlvbi9vYnNlcnZhYmxlXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcIi4uL29ic2VydmF0aW9uL29ic2VydmFibGVcIjtcbmltcG9ydCB7IERPTSB9IGZyb20gXCIuLi9kb21cIjtcbmltcG9ydCB7IE5hbWVkVGFyZ2V0RGlyZWN0aXZlIH0gZnJvbSBcIi4vZGlyZWN0aXZlXCI7XG5mdW5jdGlvbiBub3JtYWxCaW5kKHNvdXJjZSwgY29udGV4dCkge1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgaWYgKHRoaXMuYmluZGluZ09ic2VydmVyID09PSBudWxsKSB7XG4gICAgICAgIHRoaXMuYmluZGluZ09ic2VydmVyID0gT2JzZXJ2YWJsZS5iaW5kaW5nKHRoaXMuYmluZGluZywgdGhpcywgdGhpcy5pc0JpbmRpbmdWb2xhdGlsZSk7XG4gICAgfVxuICAgIHRoaXMudXBkYXRlVGFyZ2V0KHRoaXMuYmluZGluZ09ic2VydmVyLm9ic2VydmUoc291cmNlLCBjb250ZXh0KSk7XG59XG5mdW5jdGlvbiB0cmlnZ2VyQmluZChzb3VyY2UsIGNvbnRleHQpIHtcbiAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIodGhpcy50YXJnZXROYW1lLCB0aGlzKTtcbn1cbmZ1bmN0aW9uIG5vcm1hbFVuYmluZCgpIHtcbiAgICB0aGlzLmJpbmRpbmdPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgdGhpcy5zb3VyY2UgPSBudWxsO1xuICAgIHRoaXMuY29udGV4dCA9IG51bGw7XG59XG5mdW5jdGlvbiBjb250ZW50VW5iaW5kKCkge1xuICAgIHRoaXMuYmluZGluZ09ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICB0aGlzLnNvdXJjZSA9IG51bGw7XG4gICAgdGhpcy5jb250ZXh0ID0gbnVsbDtcbiAgICBjb25zdCB2aWV3ID0gdGhpcy50YXJnZXQuJGZhc3RWaWV3O1xuICAgIGlmICh2aWV3ICE9PSB2b2lkIDAgJiYgdmlldy5pc0NvbXBvc2VkKSB7XG4gICAgICAgIHZpZXcudW5iaW5kKCk7XG4gICAgICAgIHZpZXcubmVlZHNCaW5kT25seSA9IHRydWU7XG4gICAgfVxufVxuZnVuY3Rpb24gdHJpZ2dlclVuYmluZCgpIHtcbiAgICB0aGlzLnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMudGFyZ2V0TmFtZSwgdGhpcyk7XG4gICAgdGhpcy5zb3VyY2UgPSBudWxsO1xuICAgIHRoaXMuY29udGV4dCA9IG51bGw7XG59XG5mdW5jdGlvbiB1cGRhdGVBdHRyaWJ1dGVUYXJnZXQodmFsdWUpIHtcbiAgICBET00uc2V0QXR0cmlidXRlKHRoaXMudGFyZ2V0LCB0aGlzLnRhcmdldE5hbWUsIHZhbHVlKTtcbn1cbmZ1bmN0aW9uIHVwZGF0ZUJvb2xlYW5BdHRyaWJ1dGVUYXJnZXQodmFsdWUpIHtcbiAgICBET00uc2V0Qm9vbGVhbkF0dHJpYnV0ZSh0aGlzLnRhcmdldCwgdGhpcy50YXJnZXROYW1lLCB2YWx1ZSk7XG59XG5mdW5jdGlvbiB1cGRhdGVDb250ZW50VGFyZ2V0KHZhbHVlKSB7XG4gICAgLy8gSWYgdGhlcmUncyBubyBhY3R1YWwgdmFsdWUsIHRoZW4gdGhpcyBlcXVhdGVzIHRvIHRoZVxuICAgIC8vIGVtcHR5IHN0cmluZyBmb3IgdGhlIHB1cnBvc2VzIG9mIGNvbnRlbnQgYmluZGluZ3MuXG4gICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgIH1cbiAgICAvLyBJZiB0aGUgdmFsdWUgaGFzIGEgXCJjcmVhdGVcIiBtZXRob2QsIHRoZW4gaXQncyBhIHRlbXBsYXRlLWxpa2UuXG4gICAgaWYgKHZhbHVlLmNyZWF0ZSkge1xuICAgICAgICB0aGlzLnRhcmdldC50ZXh0Q29udGVudCA9IFwiXCI7XG4gICAgICAgIGxldCB2aWV3ID0gdGhpcy50YXJnZXQuJGZhc3RWaWV3O1xuICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIHByZXZpb3VzIHZpZXcgdGhhdCB3ZSBtaWdodCBiZSBhYmxlIHRvXG4gICAgICAgIC8vIHJldXNlIHRoZW4gY3JlYXRlIGEgbmV3IHZpZXcgZnJvbSB0aGUgdGVtcGxhdGUuXG4gICAgICAgIGlmICh2aWV3ID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIHZpZXcgPSB2YWx1ZS5jcmVhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGEgcHJldmlvdXMgdmlldywgYnV0IGl0IHdhc24ndCBjcmVhdGVkXG4gICAgICAgICAgICAvLyBmcm9tIHRoZSBzYW1lIHRlbXBsYXRlIGFzIHRoZSBuZXcgdmFsdWUsIHRoZW4gd2VcbiAgICAgICAgICAgIC8vIG5lZWQgdG8gcmVtb3ZlIHRoZSBvbGQgdmlldyBpZiBpdCdzIHN0aWxsIGluIHRoZSBET01cbiAgICAgICAgICAgIC8vIGFuZCBjcmVhdGUgYSBuZXcgdmlldyBmcm9tIHRoZSB0ZW1wbGF0ZS5cbiAgICAgICAgICAgIGlmICh0aGlzLnRhcmdldC4kZmFzdFRlbXBsYXRlICE9PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh2aWV3LmlzQ29tcG9zZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmlldy5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdmlldy51bmJpbmQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmlldyA9IHZhbHVlLmNyZWF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIEl0J3MgcG9zc2libGUgdGhhdCB0aGUgdmFsdWUgaXMgdGhlIHNhbWUgYXMgdGhlIHByZXZpb3VzIHRlbXBsYXRlXG4gICAgICAgIC8vIGFuZCB0aGF0IHRoZXJlJ3MgYWN0dWFsbHkgbm8gbmVlZCB0byBjb21wb3NlIGl0LlxuICAgICAgICBpZiAoIXZpZXcuaXNDb21wb3NlZCkge1xuICAgICAgICAgICAgdmlldy5pc0NvbXBvc2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHZpZXcuYmluZCh0aGlzLnNvdXJjZSwgdGhpcy5jb250ZXh0KTtcbiAgICAgICAgICAgIHZpZXcuaW5zZXJ0QmVmb3JlKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0LiRmYXN0VmlldyA9IHZpZXc7XG4gICAgICAgICAgICB0aGlzLnRhcmdldC4kZmFzdFRlbXBsYXRlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodmlldy5uZWVkc0JpbmRPbmx5KSB7XG4gICAgICAgICAgICB2aWV3Lm5lZWRzQmluZE9ubHkgPSBmYWxzZTtcbiAgICAgICAgICAgIHZpZXcuYmluZCh0aGlzLnNvdXJjZSwgdGhpcy5jb250ZXh0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMudGFyZ2V0LiRmYXN0VmlldztcbiAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSB2aWV3IGFuZCBpdCdzIGN1cnJlbnRseSBjb21wb3NlZCBpbnRvXG4gICAgICAgIC8vIHRoZSBET00sIHRoZW4gd2UgbmVlZCB0byByZW1vdmUgaXQuXG4gICAgICAgIGlmICh2aWV3ICE9PSB2b2lkIDAgJiYgdmlldy5pc0NvbXBvc2VkKSB7XG4gICAgICAgICAgICB2aWV3LmlzQ29tcG9zZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHZpZXcucmVtb3ZlKCk7XG4gICAgICAgICAgICBpZiAodmlldy5uZWVkc0JpbmRPbmx5KSB7XG4gICAgICAgICAgICAgICAgdmlldy5uZWVkc0JpbmRPbmx5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2aWV3LnVuYmluZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudGFyZ2V0LnRleHRDb250ZW50ID0gdmFsdWU7XG4gICAgfVxufVxuZnVuY3Rpb24gdXBkYXRlUHJvcGVydHlUYXJnZXQodmFsdWUpIHtcbiAgICB0aGlzLnRhcmdldFt0aGlzLnRhcmdldE5hbWVdID0gdmFsdWU7XG59XG5mdW5jdGlvbiB1cGRhdGVDbGFzc1RhcmdldCh2YWx1ZSkge1xuICAgIGNvbnN0IGNsYXNzVmVyc2lvbnMgPSB0aGlzLmNsYXNzVmVyc2lvbnMgfHwgT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICBjb25zdCB0YXJnZXQgPSB0aGlzLnRhcmdldDtcbiAgICBsZXQgdmVyc2lvbiA9IHRoaXMudmVyc2lvbiB8fCAwO1xuICAgIC8vIEFkZCB0aGUgY2xhc3NlcywgdHJhY2tpbmcgdGhlIHZlcnNpb24gYXQgd2hpY2ggdGhleSB3ZXJlIGFkZGVkLlxuICAgIGlmICh2YWx1ZSAhPT0gbnVsbCAmJiB2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlLmxlbmd0aCkge1xuICAgICAgICBjb25zdCBuYW1lcyA9IHZhbHVlLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IG5hbWVzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnROYW1lID0gbmFtZXNbaV07XG4gICAgICAgICAgICBpZiAoY3VycmVudE5hbWUgPT09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsYXNzVmVyc2lvbnNbY3VycmVudE5hbWVdID0gdmVyc2lvbjtcbiAgICAgICAgICAgIHRhcmdldC5jbGFzc0xpc3QuYWRkKGN1cnJlbnROYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmNsYXNzVmVyc2lvbnMgPSBjbGFzc1ZlcnNpb25zO1xuICAgIHRoaXMudmVyc2lvbiA9IHZlcnNpb24gKyAxO1xuICAgIC8vIElmIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwgdG8gYWRkIGNsYXNzZXMsIHRoZXJlJ3Mgbm8gbmVlZCB0byByZW1vdmUgb2xkIG9uZXMuXG4gICAgaWYgKHZlcnNpb24gPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBSZW1vdmUgY2xhc3NlcyBmcm9tIHRoZSBwcmV2aW91cyB2ZXJzaW9uLlxuICAgIHZlcnNpb24gLT0gMTtcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gY2xhc3NWZXJzaW9ucykge1xuICAgICAgICBpZiAoY2xhc3NWZXJzaW9uc1tuYW1lXSA9PT0gdmVyc2lvbikge1xuICAgICAgICAgICAgdGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUobmFtZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgY29uZmlndXJlcyBkYXRhIGJpbmRpbmcgdG8gZWxlbWVudCBjb250ZW50IGFuZCBhdHRyaWJ1dGVzLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgQmluZGluZ0RpcmVjdGl2ZSBleHRlbmRzIE5hbWVkVGFyZ2V0RGlyZWN0aXZlIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIEJpbmRpbmdEaXJlY3RpdmUuXG4gICAgICogQHBhcmFtIGJpbmRpbmcgLSBBIGJpbmRpbmcgdGhhdCByZXR1cm5zIHRoZSBkYXRhIHVzZWQgdG8gdXBkYXRlIHRoZSBET00uXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoYmluZGluZykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmJpbmRpbmcgPSBiaW5kaW5nO1xuICAgICAgICB0aGlzLmJpbmQgPSBub3JtYWxCaW5kO1xuICAgICAgICB0aGlzLnVuYmluZCA9IG5vcm1hbFVuYmluZDtcbiAgICAgICAgdGhpcy51cGRhdGVUYXJnZXQgPSB1cGRhdGVBdHRyaWJ1dGVUYXJnZXQ7XG4gICAgICAgIHRoaXMuaXNCaW5kaW5nVm9sYXRpbGUgPSBPYnNlcnZhYmxlLmlzVm9sYXRpbGVCaW5kaW5nKHRoaXMuYmluZGluZyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldHMvc2V0cyB0aGUgbmFtZSBvZiB0aGUgYXR0cmlidXRlIG9yIHByb3BlcnR5IHRoYXQgdGhpc1xuICAgICAqIGJpbmRpbmcgaXMgdGFyZ2V0aW5nLlxuICAgICAqL1xuICAgIGdldCB0YXJnZXROYW1lKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcmlnaW5hbFRhcmdldE5hbWU7XG4gICAgfVxuICAgIHNldCB0YXJnZXROYW1lKHZhbHVlKSB7XG4gICAgICAgIHRoaXMub3JpZ2luYWxUYXJnZXROYW1lID0gdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoICh2YWx1ZVswXSkge1xuICAgICAgICAgICAgY2FzZSBcIjpcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFuZWRUYXJnZXROYW1lID0gdmFsdWUuc3Vic3RyKDEpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGFyZ2V0ID0gdXBkYXRlUHJvcGVydHlUYXJnZXQ7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2xlYW5lZFRhcmdldE5hbWUgPT09IFwiaW5uZXJIVE1MXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYmluZGluZyA9IHRoaXMuYmluZGluZztcbiAgICAgICAgICAgICAgICAgICAgLyogZXNsaW50LWRpc2FibGUtbmV4dC1saW5lICovXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYmluZGluZyA9IChzLCBjKSA9PiBET00uY3JlYXRlSFRNTChiaW5kaW5nKHMsIGMpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiP1wiOlxuICAgICAgICAgICAgICAgIHRoaXMuY2xlYW5lZFRhcmdldE5hbWUgPSB2YWx1ZS5zdWJzdHIoMSk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVUYXJnZXQgPSB1cGRhdGVCb29sZWFuQXR0cmlidXRlVGFyZ2V0O1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcIkBcIjpcbiAgICAgICAgICAgICAgICB0aGlzLmNsZWFuZWRUYXJnZXROYW1lID0gdmFsdWUuc3Vic3RyKDEpO1xuICAgICAgICAgICAgICAgIHRoaXMuYmluZCA9IHRyaWdnZXJCaW5kO1xuICAgICAgICAgICAgICAgIHRoaXMudW5iaW5kID0gdHJpZ2dlclVuYmluZDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhpcy5jbGVhbmVkVGFyZ2V0TmFtZSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCJjbGFzc1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGFyZ2V0ID0gdXBkYXRlQ2xhc3NUYXJnZXQ7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1ha2VzIHRoaXMgYmluZGluZyB0YXJnZXQgdGhlIGNvbnRlbnQgb2YgYW4gZWxlbWVudCByYXRoZXIgdGhhblxuICAgICAqIGEgcGFydGljdWxhciBhdHRyaWJ1dGUgb3IgcHJvcGVydHkuXG4gICAgICovXG4gICAgdGFyZ2V0QXRDb250ZW50KCkge1xuICAgICAgICB0aGlzLnVwZGF0ZVRhcmdldCA9IHVwZGF0ZUNvbnRlbnRUYXJnZXQ7XG4gICAgICAgIHRoaXMudW5iaW5kID0gY29udGVudFVuYmluZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyB0aGUgcnVudGltZSBCaW5kaW5nQmVoYXZpb3IgaW5zdGFuY2UgYmFzZWQgb24gdGhlIGNvbmZpZ3VyYXRpb25cbiAgICAgKiBpbmZvcm1hdGlvbiBzdG9yZWQgaW4gdGhlIEJpbmRpbmdEaXJlY3RpdmUuXG4gICAgICogQHBhcmFtIHRhcmdldCAtIFRoZSB0YXJnZXQgbm9kZSB0aGF0IHRoZSBiaW5kaW5nIGJlaGF2aW9yIHNob3VsZCBhdHRhY2ggdG8uXG4gICAgICovXG4gICAgY3JlYXRlQmVoYXZpb3IodGFyZ2V0KSB7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdXNlLWJlZm9yZS1kZWZpbmUgKi9cbiAgICAgICAgcmV0dXJuIG5ldyBCaW5kaW5nQmVoYXZpb3IodGFyZ2V0LCB0aGlzLmJpbmRpbmcsIHRoaXMuaXNCaW5kaW5nVm9sYXRpbGUsIHRoaXMuYmluZCwgdGhpcy51bmJpbmQsIHRoaXMudXBkYXRlVGFyZ2V0LCB0aGlzLmNsZWFuZWRUYXJnZXROYW1lKTtcbiAgICB9XG59XG4vKipcbiAqIEEgYmVoYXZpb3IgdGhhdCB1cGRhdGVzIGNvbnRlbnQgYW5kIGF0dHJpYnV0ZXMgYmFzZWQgb24gYSBjb25maWd1cmVkXG4gKiBCaW5kaW5nRGlyZWN0aXZlLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgQmluZGluZ0JlaGF2aW9yIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIEJpbmRpbmdCZWhhdmlvci5cbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0gVGhlIHRhcmdldCBvZiB0aGUgZGF0YSB1cGRhdGVzLlxuICAgICAqIEBwYXJhbSBiaW5kaW5nIC0gVGhlIGJpbmRpbmcgdGhhdCByZXR1cm5zIHRoZSBsYXRlc3QgdmFsdWUgZm9yIGFuIHVwZGF0ZS5cbiAgICAgKiBAcGFyYW0gaXNCaW5kaW5nVm9sYXRpbGUgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgYmluZGluZyBoYXMgdm9sYXRpbGUgZGVwZW5kZW5jaWVzLlxuICAgICAqIEBwYXJhbSBiaW5kIC0gVGhlIG9wZXJhdGlvbiB0byBwZXJmb3JtIGR1cmluZyBiaW5kaW5nLlxuICAgICAqIEBwYXJhbSB1bmJpbmQgLSBUaGUgb3BlcmF0aW9uIHRvIHBlcmZvcm0gZHVyaW5nIHVuYmluZGluZy5cbiAgICAgKiBAcGFyYW0gdXBkYXRlVGFyZ2V0IC0gVGhlIG9wZXJhdGlvbiB0byBwZXJmb3JtIHdoZW4gdXBkYXRpbmcuXG4gICAgICogQHBhcmFtIHRhcmdldE5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgdGFyZ2V0IGF0dHJpYnV0ZSBvciBwcm9wZXJ0eSB0byB1cGRhdGUuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IodGFyZ2V0LCBiaW5kaW5nLCBpc0JpbmRpbmdWb2xhdGlsZSwgYmluZCwgdW5iaW5kLCB1cGRhdGVUYXJnZXQsIHRhcmdldE5hbWUpIHtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLnNvdXJjZSA9IG51bGw7XG4gICAgICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICAgICAgdGhpcy5jb250ZXh0ID0gbnVsbDtcbiAgICAgICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgICAgICB0aGlzLmJpbmRpbmdPYnNlcnZlciA9IG51bGw7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB0aGlzLmJpbmRpbmcgPSBiaW5kaW5nO1xuICAgICAgICB0aGlzLmlzQmluZGluZ1ZvbGF0aWxlID0gaXNCaW5kaW5nVm9sYXRpbGU7XG4gICAgICAgIHRoaXMuYmluZCA9IGJpbmQ7XG4gICAgICAgIHRoaXMudW5iaW5kID0gdW5iaW5kO1xuICAgICAgICB0aGlzLnVwZGF0ZVRhcmdldCA9IHVwZGF0ZVRhcmdldDtcbiAgICAgICAgdGhpcy50YXJnZXROYW1lID0gdGFyZ2V0TmFtZTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIGhhbmRsZUNoYW5nZSgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVUYXJnZXQodGhpcy5iaW5kaW5nT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLnNvdXJjZSwgdGhpcy5jb250ZXh0KSk7XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBoYW5kbGVFdmVudChldmVudCkge1xuICAgICAgICBzZXRDdXJyZW50RXZlbnQoZXZlbnQpO1xuICAgICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmJpbmRpbmcodGhpcy5zb3VyY2UsIHRoaXMuY29udGV4dCk7XG4gICAgICAgIHNldEN1cnJlbnRFdmVudChudWxsKTtcbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IEF0dGFjaGVkQmVoYXZpb3JEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVcIjtcbmltcG9ydCB7IE5vZGVPYnNlcnZhdGlvbkJlaGF2aW9yIH0gZnJvbSBcIi4vbm9kZS1vYnNlcnZhdGlvblwiO1xuLyoqXG4gKiBUaGUgcnVudGltZSBiZWhhdmlvciBmb3IgY2hpbGQgbm9kZSBvYnNlcnZhdGlvbi5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIENoaWxkcmVuQmVoYXZpb3IgZXh0ZW5kcyBOb2RlT2JzZXJ2YXRpb25CZWhhdmlvciB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBDaGlsZHJlbkJlaGF2aW9yLlxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBUaGUgZWxlbWVudCB0YXJnZXQgdG8gb2JzZXJ2ZSBjaGlsZHJlbiBvbi5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIHVzZSB3aGVuIG9ic2VydmluZyB0aGUgZWxlbWVudCBjaGlsZHJlbi5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQsIG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIodGFyZ2V0LCBvcHRpb25zKTtcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IG51bGw7XG4gICAgICAgIG9wdGlvbnMuY2hpbGRMaXN0ID0gdHJ1ZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQmVnaW5zIG9ic2VydmF0aW9uIG9mIHRoZSBub2Rlcy5cbiAgICAgKi9cbiAgICBvYnNlcnZlKCkge1xuICAgICAgICBpZiAodGhpcy5vYnNlcnZlciA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKHRoaXMuaGFuZGxlRXZlbnQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vYnNlcnZlci5vYnNlcnZlKHRoaXMudGFyZ2V0LCB0aGlzLm9wdGlvbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEaXNjb25uZWN0cyBvYnNlcnZhdGlvbiBvZiB0aGUgbm9kZXMuXG4gICAgICovXG4gICAgZGlzY29ubmVjdCgpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgbm9kZXMgdGhhdCBzaG91bGQgYmUgYXNzaWduZWQgdG8gdGhlIHRhcmdldC5cbiAgICAgKi9cbiAgICBnZXROb2RlcygpIHtcbiAgICAgICAgaWYgKFwic3VidHJlZVwiIGluIHRoaXMub3B0aW9ucykge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy50YXJnZXQucXVlcnlTZWxlY3RvckFsbCh0aGlzLm9wdGlvbnMuc2VsZWN0b3IpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLnRhcmdldC5jaGlsZE5vZGVzKTtcbiAgICB9XG59XG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgb2JzZXJ2ZXMgdGhlIGBjaGlsZE5vZGVzYCBvZiBhbiBlbGVtZW50IGFuZCB1cGRhdGVzIGEgcHJvcGVydHlcbiAqIHdoZW5ldmVyIHRoZXkgY2hhbmdlLlxuICogQHBhcmFtIHByb3BlcnR5T3JPcHRpb25zIC0gVGhlIG9wdGlvbnMgdXNlZCB0byBjb25maWd1cmUgY2hpbGQgbm9kZSBvYnNlcnZhdGlvbi5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNoaWxkcmVuKHByb3BlcnR5T3JPcHRpb25zKSB7XG4gICAgaWYgKHR5cGVvZiBwcm9wZXJ0eU9yT3B0aW9ucyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICBwcm9wZXJ0eU9yT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHByb3BlcnR5OiBwcm9wZXJ0eU9yT3B0aW9ucyxcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBBdHRhY2hlZEJlaGF2aW9yRGlyZWN0aXZlKFwiZmFzdC1jaGlsZHJlblwiLCBDaGlsZHJlbkJlaGF2aW9yLCBwcm9wZXJ0eU9yT3B0aW9ucyk7XG59XG4iLCJpbXBvcnQgeyBET00gfSBmcm9tIFwiLi4vZG9tXCI7XG4vKipcbiAqIEluc3RydWN0cyB0aGUgdGVtcGxhdGUgZW5naW5lIHRvIGFwcGx5IGJlaGF2aW9yIHRvIGEgbm9kZS5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIERpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgaW5kZXggb2YgdGhlIERPTSBub2RlIHRvIHdoaWNoIHRoZSBjcmVhdGVkIGJlaGF2aW9yIHdpbGwgYXBwbHkuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnRhcmdldEluZGV4ID0gMDtcbiAgICB9XG59XG4vKipcbiAqIEEge0BsaW5rIERpcmVjdGl2ZX0gdGhhdCB0YXJnZXRzIGEgbmFtZWQgYXR0cmlidXRlIG9yIHByb3BlcnR5IG9uIGEgbm9kZSBvciBvYmplY3QuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBOYW1lZFRhcmdldERpcmVjdGl2ZSBleHRlbmRzIERpcmVjdGl2ZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKC4uLmFyZ3VtZW50cyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBDcmVhdGVzIGEgcGxhY2Vob2xkZXIgc3RyaW5nIGJhc2VkIG9uIHRoZSBkaXJlY3RpdmUncyBpbmRleCB3aXRoaW4gdGhlIHRlbXBsYXRlLlxuICAgICAgICAgKiBAcGFyYW0gaW5kZXggLSBUaGUgaW5kZXggb2YgdGhlIGRpcmVjdGl2ZSB3aXRoaW4gdGhlIHRlbXBsYXRlLlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5jcmVhdGVQbGFjZWhvbGRlciA9IERPTS5jcmVhdGVJbnRlcnBvbGF0aW9uUGxhY2Vob2xkZXI7XG4gICAgfVxufVxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGF0dGFjaGVzIHNwZWNpYWwgYmVoYXZpb3IgdG8gYW4gZWxlbWVudCB2aWEgYSBjdXN0b20gYXR0cmlidXRlLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgQXR0YWNoZWRCZWhhdmlvckRpcmVjdGl2ZSBleHRlbmRzIERpcmVjdGl2ZSB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBiZWhhdmlvcjsgdXNlZCBhcyBhIGN1c3RvbSBhdHRyaWJ1dGUgb24gdGhlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIGJlaGF2aW9yIC0gVGhlIGJlaGF2aW9yIHRvIGluc3RhbnRpYXRlIGFuZCBhdHRhY2ggdG8gdGhlIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIG9wdGlvbnMgLSBPcHRpb25zIHRvIHBhc3MgdG8gdGhlIGJlaGF2aW9yIGR1cmluZyBjcmVhdGlvbi5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihuYW1lLCBiZWhhdmlvciwgb3B0aW9ucykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLmJlaGF2aW9yID0gYmVoYXZpb3I7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBwbGFjZWhvbGRlciBzdHJpbmcgYmFzZWQgb24gdGhlIGRpcmVjdGl2ZSdzIGluZGV4IHdpdGhpbiB0aGUgdGVtcGxhdGUuXG4gICAgICogQHBhcmFtIGluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSBkaXJlY3RpdmUgd2l0aGluIHRoZSB0ZW1wbGF0ZS5cbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIENyZWF0ZXMgYSBjdXN0b20gYXR0cmlidXRlIHBsYWNlaG9sZGVyLlxuICAgICAqL1xuICAgIGNyZWF0ZVBsYWNlaG9sZGVyKGluZGV4KSB7XG4gICAgICAgIHJldHVybiBET00uY3JlYXRlQ3VzdG9tQXR0cmlidXRlUGxhY2Vob2xkZXIodGhpcy5uYW1lLCBpbmRleCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBiZWhhdmlvciBmb3IgdGhlIHByb3ZpZGVkIHRhcmdldCBub2RlLlxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBUaGUgbm9kZSBpbnN0YW5jZSB0byBjcmVhdGUgdGhlIGJlaGF2aW9yIGZvci5cbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgdGhlIGBiZWhhdmlvcmAgdHlwZSB0aGlzIGRpcmVjdGl2ZSB3YXMgY29uc3RydWN0ZWQgd2l0aFxuICAgICAqIGFuZCBwYXNzZXMgdGhlIHRhcmdldCBhbmQgb3B0aW9ucyB0byB0aGF0IGBiZWhhdmlvcmAncyBjb25zdHJ1Y3Rvci5cbiAgICAgKi9cbiAgICBjcmVhdGVCZWhhdmlvcih0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmJlaGF2aW9yKHRhcmdldCwgdGhpcy5vcHRpb25zKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcIi4uL29ic2VydmF0aW9uL29ic2VydmFibGVcIjtcbmltcG9ydCB7IGVtcHR5QXJyYXkgfSBmcm9tIFwiLi4vaW50ZXJmYWNlc1wiO1xuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBjYW4gYmUgdXNlZCB0byBmaWx0ZXIgYSBOb2RlIGFycmF5LCBzZWxlY3Rpbmcgb25seSBlbGVtZW50cy5cbiAqIEBwYXJhbSBzZWxlY3RvciAtIEFuIG9wdGlvbmFsIHNlbGVjdG9yIHRvIHJlc3RyaWN0IHRoZSBmaWx0ZXIgdG8uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbGVtZW50cyhzZWxlY3Rvcikge1xuICAgIGlmIChzZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHZhbHVlLCBpbmRleCwgYXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5ub2RlVHlwZSA9PT0gMSAmJiB2YWx1ZS5tYXRjaGVzKHNlbGVjdG9yKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgsIGFycmF5KSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS5ub2RlVHlwZSA9PT0gMTtcbiAgICB9O1xufVxuLyoqXG4gKiBBIGJhc2UgY2xhc3MgZm9yIG5vZGUgb2JzZXJ2YXRpb24uXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGNsYXNzIE5vZGVPYnNlcnZhdGlvbkJlaGF2aW9yIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIE5vZGVPYnNlcnZhdGlvbkJlaGF2aW9yLlxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBUaGUgdGFyZ2V0IHRvIGFzc2lnbiB0aGUgbm9kZXMgcHJvcGVydHkgb24uXG4gICAgICogQHBhcmFtIG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byB1c2UgaW4gY29uZmlndXJpbmcgbm9kZSBvYnNlcnZhdGlvbi5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0YXJnZXQsIG9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuc291cmNlID0gbnVsbDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQmluZCB0aGlzIGJlaGF2aW9yIHRvIHRoZSBzb3VyY2UuXG4gICAgICogQHBhcmFtIHNvdXJjZSAtIFRoZSBzb3VyY2UgdG8gYmluZCB0by5cbiAgICAgKiBAcGFyYW0gY29udGV4dCAtIFRoZSBleGVjdXRpb24gY29udGV4dCB0aGF0IHRoZSBiaW5kaW5nIGlzIG9wZXJhdGluZyB3aXRoaW4uXG4gICAgICovXG4gICAgYmluZChzb3VyY2UpIHtcbiAgICAgICAgY29uc3QgbmFtZSA9IHRoaXMub3B0aW9ucy5wcm9wZXJ0eTtcbiAgICAgICAgdGhpcy5zaG91bGRVcGRhdGUgPSBPYnNlcnZhYmxlLmdldEFjY2Vzc29ycyhzb3VyY2UpLnNvbWUoKHgpID0+IHgubmFtZSA9PT0gbmFtZSk7XG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICB0aGlzLnVwZGF0ZVRhcmdldCh0aGlzLmNvbXB1dGVOb2RlcygpKTtcbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkVXBkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLm9ic2VydmUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBVbmJpbmRzIHRoaXMgYmVoYXZpb3IgZnJvbSB0aGUgc291cmNlLlxuICAgICAqIEBwYXJhbSBzb3VyY2UgLSBUaGUgc291cmNlIHRvIHVuYmluZCBmcm9tLlxuICAgICAqL1xuICAgIHVuYmluZCgpIHtcbiAgICAgICAgdGhpcy51cGRhdGVUYXJnZXQoZW1wdHlBcnJheSk7XG4gICAgICAgIHRoaXMuc291cmNlID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkVXBkYXRlKSB7XG4gICAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgaGFuZGxlRXZlbnQoKSB7XG4gICAgICAgIHRoaXMudXBkYXRlVGFyZ2V0KHRoaXMuY29tcHV0ZU5vZGVzKCkpO1xuICAgIH1cbiAgICBjb21wdXRlTm9kZXMoKSB7XG4gICAgICAgIGxldCBub2RlcyA9IHRoaXMuZ2V0Tm9kZXMoKTtcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5maWx0ZXIgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgbm9kZXMgPSBub2Rlcy5maWx0ZXIodGhpcy5vcHRpb25zLmZpbHRlcik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGVzO1xuICAgIH1cbiAgICB1cGRhdGVUYXJnZXQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5zb3VyY2VbdGhpcy5vcHRpb25zLnByb3BlcnR5XSA9IHZhbHVlO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IEF0dGFjaGVkQmVoYXZpb3JEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVcIjtcbi8qKlxuICogVGhlIHJ1bnRpbWUgYmVoYXZpb3IgZm9yIHRlbXBsYXRlIHJlZmVyZW5jZXMuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWZCZWhhdmlvciB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBSZWZCZWhhdmlvci5cbiAgICAgKiBAcGFyYW0gdGFyZ2V0IC0gVGhlIGVsZW1lbnQgdG8gcmVmZXJlbmNlLlxuICAgICAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduIHRoZSByZWZlcmVuY2UgdG8uXG4gICAgICovXG4gICAgY29uc3RydWN0b3IodGFyZ2V0LCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRoaXMucHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBCaW5kIHRoaXMgYmVoYXZpb3IgdG8gdGhlIHNvdXJjZS5cbiAgICAgKiBAcGFyYW0gc291cmNlIC0gVGhlIHNvdXJjZSB0byBiaW5kIHRvLlxuICAgICAqIEBwYXJhbSBjb250ZXh0IC0gVGhlIGV4ZWN1dGlvbiBjb250ZXh0IHRoYXQgdGhlIGJpbmRpbmcgaXMgb3BlcmF0aW5nIHdpdGhpbi5cbiAgICAgKi9cbiAgICBiaW5kKHNvdXJjZSkge1xuICAgICAgICBzb3VyY2VbdGhpcy5wcm9wZXJ0eU5hbWVdID0gdGhpcy50YXJnZXQ7XG4gICAgfVxuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb24gKi9cbiAgICAvKipcbiAgICAgKiBVbmJpbmRzIHRoaXMgYmVoYXZpb3IgZnJvbSB0aGUgc291cmNlLlxuICAgICAqIEBwYXJhbSBzb3VyY2UgLSBUaGUgc291cmNlIHRvIHVuYmluZCBmcm9tLlxuICAgICAqL1xuICAgIHVuYmluZCgpIHsgfVxufVxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IG9ic2VydmVzIHRoZSB1cGRhdGVzIGEgcHJvcGVydHkgd2l0aCBhIHJlZmVyZW5jZSB0byB0aGUgZWxlbWVudC5cbiAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgLSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gYXNzaWduIHRoZSByZWZlcmVuY2UgdG8uXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZWYocHJvcGVydHlOYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBBdHRhY2hlZEJlaGF2aW9yRGlyZWN0aXZlKFwiZmFzdC1yZWZcIiwgUmVmQmVoYXZpb3IsIHByb3BlcnR5TmFtZSk7XG59XG4iLCJpbXBvcnQgeyBET00gfSBmcm9tIFwiLi4vZG9tXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCB9IGZyb20gXCIuLi9vYnNlcnZhdGlvbi9vYnNlcnZhYmxlXCI7XG5pbXBvcnQgeyBIVE1MVmlldyB9IGZyb20gXCIuLi92aWV3XCI7XG5pbXBvcnQgeyBlbmFibGVBcnJheU9ic2VydmF0aW9uIH0gZnJvbSBcIi4uL29ic2VydmF0aW9uL2FycmF5LW9ic2VydmVyXCI7XG5pbXBvcnQgeyBEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVcIjtcbmNvbnN0IGRlZmF1bHRSZXBlYXRPcHRpb25zID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgcG9zaXRpb25pbmc6IGZhbHNlLFxufSk7XG5mdW5jdGlvbiBiaW5kV2l0aG91dFBvc2l0aW9uaW5nKHZpZXcsIGl0ZW1zLCBpbmRleCwgY29udGV4dCkge1xuICAgIHZpZXcuYmluZChpdGVtc1tpbmRleF0sIGNvbnRleHQpO1xufVxuZnVuY3Rpb24gYmluZFdpdGhQb3NpdGlvbmluZyh2aWV3LCBpdGVtcywgaW5kZXgsIGNvbnRleHQpIHtcbiAgICBjb25zdCBjaGlsZENvbnRleHQgPSBPYmplY3QuY3JlYXRlKGNvbnRleHQpO1xuICAgIGNoaWxkQ29udGV4dC5pbmRleCA9IGluZGV4O1xuICAgIGNoaWxkQ29udGV4dC5sZW5ndGggPSBpdGVtcy5sZW5ndGg7XG4gICAgdmlldy5iaW5kKGl0ZW1zW2luZGV4XSwgY2hpbGRDb250ZXh0KTtcbn1cbi8qKlxuICogQSBiZWhhdmlvciB0aGF0IHJlbmRlcnMgYSB0ZW1wbGF0ZSBmb3IgZWFjaCBpdGVtIGluIGFuIGFycmF5LlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgUmVwZWF0QmVoYXZpb3Ige1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgUmVwZWF0QmVoYXZpb3IuXG4gICAgICogQHBhcmFtIGxvY2F0aW9uIC0gVGhlIGxvY2F0aW9uIGluIHRoZSBET00gdG8gcmVuZGVyIHRoZSByZXBlYXQuXG4gICAgICogQHBhcmFtIGl0ZW1zQmluZGluZyAtIFRoZSBhcnJheSB0byByZW5kZXIuXG4gICAgICogQHBhcmFtIGlzSXRlbXNCaW5kaW5nVm9sYXRpbGUgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgaXRlbXMgYmluZGluZyBoYXMgdm9sYXRpbGUgZGVwZW5kZW5jaWVzLlxuICAgICAqIEBwYXJhbSB0ZW1wbGF0ZUJpbmRpbmcgLSBUaGUgdGVtcGxhdGUgdG8gcmVuZGVyIGZvciBlYWNoIGl0ZW0uXG4gICAgICogQHBhcmFtIGlzVGVtcGxhdGVCaW5kaW5nVm9sYXRpbGUgLSBJbmRpY2F0ZXMgd2hldGhlciB0aGUgdGVtcGxhdGUgYmluZGluZyBoYXMgdm9sYXRpbGUgZGVwZW5kZW5jaWVzLlxuICAgICAqIEBwYXJhbSBvcHRpb25zIC0gT3B0aW9ucyB1c2VkIHRvIHR1cm4gb24gc3BlY2lhbCByZXBlYXQgZmVhdHVyZXMuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IobG9jYXRpb24sIGl0ZW1zQmluZGluZywgaXNJdGVtc0JpbmRpbmdWb2xhdGlsZSwgdGVtcGxhdGVCaW5kaW5nLCBpc1RlbXBsYXRlQmluZGluZ1ZvbGF0aWxlLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMubG9jYXRpb24gPSBsb2NhdGlvbjtcbiAgICAgICAgdGhpcy5pdGVtc0JpbmRpbmcgPSBpdGVtc0JpbmRpbmc7XG4gICAgICAgIHRoaXMudGVtcGxhdGVCaW5kaW5nID0gdGVtcGxhdGVCaW5kaW5nO1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IG51bGw7XG4gICAgICAgIHRoaXMudmlld3MgPSBbXTtcbiAgICAgICAgdGhpcy5pdGVtcyA9IG51bGw7XG4gICAgICAgIHRoaXMuaXRlbXNPYnNlcnZlciA9IG51bGw7XG4gICAgICAgIHRoaXMub3JpZ2luYWxDb250ZXh0ID0gdm9pZCAwO1xuICAgICAgICB0aGlzLmNoaWxkQ29udGV4dCA9IHZvaWQgMDtcbiAgICAgICAgdGhpcy5iaW5kVmlldyA9IGJpbmRXaXRob3V0UG9zaXRpb25pbmc7XG4gICAgICAgIHRoaXMuaXRlbXNCaW5kaW5nT2JzZXJ2ZXIgPSBPYnNlcnZhYmxlLmJpbmRpbmcoaXRlbXNCaW5kaW5nLCB0aGlzLCBpc0l0ZW1zQmluZGluZ1ZvbGF0aWxlKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZUJpbmRpbmdPYnNlcnZlciA9IE9ic2VydmFibGUuYmluZGluZyh0ZW1wbGF0ZUJpbmRpbmcsIHRoaXMsIGlzVGVtcGxhdGVCaW5kaW5nVm9sYXRpbGUpO1xuICAgICAgICBpZiAob3B0aW9ucy5wb3NpdGlvbmluZykge1xuICAgICAgICAgICAgdGhpcy5iaW5kVmlldyA9IGJpbmRXaXRoUG9zaXRpb25pbmc7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogQmluZCB0aGlzIGJlaGF2aW9yIHRvIHRoZSBzb3VyY2UuXG4gICAgICogQHBhcmFtIHNvdXJjZSAtIFRoZSBzb3VyY2UgdG8gYmluZCB0by5cbiAgICAgKiBAcGFyYW0gY29udGV4dCAtIFRoZSBleGVjdXRpb24gY29udGV4dCB0aGF0IHRoZSBiaW5kaW5nIGlzIG9wZXJhdGluZyB3aXRoaW4uXG4gICAgICovXG4gICAgYmluZChzb3VyY2UsIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgIHRoaXMub3JpZ2luYWxDb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5jaGlsZENvbnRleHQgPSBPYmplY3QuY3JlYXRlKGNvbnRleHQpO1xuICAgICAgICB0aGlzLmNoaWxkQ29udGV4dC5wYXJlbnQgPSBzb3VyY2U7XG4gICAgICAgIHRoaXMuY2hpbGRDb250ZXh0LnBhcmVudENvbnRleHQgPSB0aGlzLm9yaWdpbmFsQ29udGV4dDtcbiAgICAgICAgdGhpcy5pdGVtcyA9IHRoaXMuaXRlbXNCaW5kaW5nT2JzZXJ2ZXIub2JzZXJ2ZShzb3VyY2UsIHRoaXMub3JpZ2luYWxDb250ZXh0KTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRoaXMudGVtcGxhdGVCaW5kaW5nT2JzZXJ2ZXIub2JzZXJ2ZShzb3VyY2UsIHRoaXMub3JpZ2luYWxDb250ZXh0KTtcbiAgICAgICAgdGhpcy5vYnNlcnZlSXRlbXMoKTtcbiAgICAgICAgdGhpcy5yZWZyZXNoQWxsVmlld3MoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVW5iaW5kcyB0aGlzIGJlaGF2aW9yIGZyb20gdGhlIHNvdXJjZS5cbiAgICAgKiBAcGFyYW0gc291cmNlIC0gVGhlIHNvdXJjZSB0byB1bmJpbmQgZnJvbS5cbiAgICAgKi9cbiAgICB1bmJpbmQoKSB7XG4gICAgICAgIHRoaXMuc291cmNlID0gbnVsbDtcbiAgICAgICAgdGhpcy5pdGVtcyA9IG51bGw7XG4gICAgICAgIGlmICh0aGlzLml0ZW1zT2JzZXJ2ZXIgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXNPYnNlcnZlci51bnN1YnNjcmliZSh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVuYmluZEFsbFZpZXdzKCk7XG4gICAgICAgIHRoaXMuaXRlbXNCaW5kaW5nT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlQmluZGluZ09ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICB9XG4gICAgLyoqIEBpbnRlcm5hbCAqL1xuICAgIGhhbmRsZUNoYW5nZShzb3VyY2UsIGFyZ3MpIHtcbiAgICAgICAgaWYgKHNvdXJjZSA9PT0gdGhpcy5pdGVtc0JpbmRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuaXRlbXMgPSB0aGlzLml0ZW1zQmluZGluZ09ic2VydmVyLm9ic2VydmUodGhpcy5zb3VyY2UsIHRoaXMub3JpZ2luYWxDb250ZXh0KTtcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZUl0ZW1zKCk7XG4gICAgICAgICAgICB0aGlzLnJlZnJlc2hBbGxWaWV3cygpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNvdXJjZSA9PT0gdGhpcy50ZW1wbGF0ZUJpbmRpbmcpIHtcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlQmluZGluZ09ic2VydmVyLm9ic2VydmUodGhpcy5zb3VyY2UsIHRoaXMub3JpZ2luYWxDb250ZXh0KTtcbiAgICAgICAgICAgIHRoaXMucmVmcmVzaEFsbFZpZXdzKHRydWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVWaWV3cyhhcmdzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBvYnNlcnZlSXRlbXMoKSB7XG4gICAgICAgIGlmICghdGhpcy5pdGVtcykge1xuICAgICAgICAgICAgdGhpcy5pdGVtcyA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG9sZE9ic2VydmVyID0gdGhpcy5pdGVtc09ic2VydmVyO1xuICAgICAgICBjb25zdCBuZXdPYnNlcnZlciA9ICh0aGlzLml0ZW1zT2JzZXJ2ZXIgPSBPYnNlcnZhYmxlLmdldE5vdGlmaWVyKHRoaXMuaXRlbXMpKTtcbiAgICAgICAgaWYgKG9sZE9ic2VydmVyICE9PSBuZXdPYnNlcnZlcikge1xuICAgICAgICAgICAgaWYgKG9sZE9ic2VydmVyICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgb2xkT2JzZXJ2ZXIudW5zdWJzY3JpYmUodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBuZXdPYnNlcnZlci5zdWJzY3JpYmUodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlVmlld3Moc3BsaWNlcykge1xuICAgICAgICBjb25zdCBjaGlsZENvbnRleHQgPSB0aGlzLmNoaWxkQ29udGV4dDtcbiAgICAgICAgY29uc3Qgdmlld3MgPSB0aGlzLnZpZXdzO1xuICAgICAgICBjb25zdCB0b3RhbFJlbW92ZWQgPSBbXTtcbiAgICAgICAgY29uc3QgYmluZFZpZXcgPSB0aGlzLmJpbmRWaWV3O1xuICAgICAgICBsZXQgcmVtb3ZlRGVsdGEgPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBzcGxpY2VzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHNwbGljZSA9IHNwbGljZXNbaV07XG4gICAgICAgICAgICBjb25zdCByZW1vdmVkID0gc3BsaWNlLnJlbW92ZWQ7XG4gICAgICAgICAgICB0b3RhbFJlbW92ZWQucHVzaCguLi52aWV3cy5zcGxpY2Uoc3BsaWNlLmluZGV4ICsgcmVtb3ZlRGVsdGEsIHJlbW92ZWQubGVuZ3RoKSk7XG4gICAgICAgICAgICByZW1vdmVEZWx0YSAtPSBzcGxpY2UuYWRkZWRDb3VudDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXM7XG4gICAgICAgIGNvbnN0IHRlbXBsYXRlID0gdGhpcy50ZW1wbGF0ZTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gc3BsaWNlcy5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgICAgICAgICBjb25zdCBzcGxpY2UgPSBzcGxpY2VzW2ldO1xuICAgICAgICAgICAgbGV0IGFkZEluZGV4ID0gc3BsaWNlLmluZGV4O1xuICAgICAgICAgICAgY29uc3QgZW5kID0gYWRkSW5kZXggKyBzcGxpY2UuYWRkZWRDb3VudDtcbiAgICAgICAgICAgIGZvciAoOyBhZGRJbmRleCA8IGVuZDsgKythZGRJbmRleCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5laWdoYm9yID0gdmlld3NbYWRkSW5kZXhdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGxvY2F0aW9uID0gbmVpZ2hib3IgPyBuZWlnaGJvci5maXJzdENoaWxkIDogdGhpcy5sb2NhdGlvbjtcbiAgICAgICAgICAgICAgICBjb25zdCB2aWV3ID0gdG90YWxSZW1vdmVkLmxlbmd0aCA+IDAgPyB0b3RhbFJlbW92ZWQuc2hpZnQoKSA6IHRlbXBsYXRlLmNyZWF0ZSgpO1xuICAgICAgICAgICAgICAgIHZpZXdzLnNwbGljZShhZGRJbmRleCwgMCwgdmlldyk7XG4gICAgICAgICAgICAgICAgYmluZFZpZXcodmlldywgaXRlbXMsIGFkZEluZGV4LCBjaGlsZENvbnRleHQpO1xuICAgICAgICAgICAgICAgIHZpZXcuaW5zZXJ0QmVmb3JlKGxvY2F0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB0b3RhbFJlbW92ZWQubGVuZ3RoOyBpIDwgaWk7ICsraSkge1xuICAgICAgICAgICAgdG90YWxSZW1vdmVkW2ldLmRpc3Bvc2UoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnBvc2l0aW9uaW5nKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB2aWV3cy5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudENvbnRleHQgPSB2aWV3c1tpXS5jb250ZXh0O1xuICAgICAgICAgICAgICAgIGN1cnJlbnRDb250ZXh0Lmxlbmd0aCA9IGlpO1xuICAgICAgICAgICAgICAgIGN1cnJlbnRDb250ZXh0LmluZGV4ID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZWZyZXNoQWxsVmlld3ModGVtcGxhdGVDaGFuZ2VkID0gZmFsc2UpIHtcbiAgICAgICAgY29uc3QgaXRlbXMgPSB0aGlzLml0ZW1zO1xuICAgICAgICBjb25zdCBjaGlsZENvbnRleHQgPSB0aGlzLmNoaWxkQ29udGV4dDtcbiAgICAgICAgY29uc3QgdGVtcGxhdGUgPSB0aGlzLnRlbXBsYXRlO1xuICAgICAgICBjb25zdCBsb2NhdGlvbiA9IHRoaXMubG9jYXRpb247XG4gICAgICAgIGNvbnN0IGJpbmRWaWV3ID0gdGhpcy5iaW5kVmlldztcbiAgICAgICAgbGV0IGl0ZW1zTGVuZ3RoID0gaXRlbXMubGVuZ3RoO1xuICAgICAgICBsZXQgdmlld3MgPSB0aGlzLnZpZXdzO1xuICAgICAgICBsZXQgdmlld3NMZW5ndGggPSB2aWV3cy5sZW5ndGg7XG4gICAgICAgIGlmIChpdGVtc0xlbmd0aCA9PT0gMCB8fCB0ZW1wbGF0ZUNoYW5nZWQpIHtcbiAgICAgICAgICAgIC8vIGFsbCB2aWV3cyBuZWVkIHRvIGJlIHJlbW92ZWRcbiAgICAgICAgICAgIEhUTUxWaWV3LmRpc3Bvc2VDb250aWd1b3VzQmF0Y2godmlld3MpO1xuICAgICAgICAgICAgdmlld3NMZW5ndGggPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2aWV3c0xlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgLy8gYWxsIHZpZXdzIG5lZWQgdG8gYmUgY3JlYXRlZFxuICAgICAgICAgICAgdGhpcy52aWV3cyA9IHZpZXdzID0gbmV3IEFycmF5KGl0ZW1zTGVuZ3RoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXNMZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB0ZW1wbGF0ZS5jcmVhdGUoKTtcbiAgICAgICAgICAgICAgICBiaW5kVmlldyh2aWV3LCBpdGVtcywgaSwgY2hpbGRDb250ZXh0KTtcbiAgICAgICAgICAgICAgICB2aWV3c1tpXSA9IHZpZXc7XG4gICAgICAgICAgICAgICAgdmlldy5pbnNlcnRCZWZvcmUobG9jYXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gYXR0ZW1wdCB0byByZXVzZSBleGlzdGluZyB2aWV3cyB3aXRoIG5ldyBkYXRhXG4gICAgICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGl0ZW1zTGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoaSA8IHZpZXdzTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB2aWV3c1tpXTtcbiAgICAgICAgICAgICAgICAgICAgYmluZFZpZXcodmlldywgaXRlbXMsIGksIGNoaWxkQ29udGV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB2aWV3ID0gdGVtcGxhdGUuY3JlYXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIGJpbmRWaWV3KHZpZXcsIGl0ZW1zLCBpLCBjaGlsZENvbnRleHQpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3cy5wdXNoKHZpZXcpO1xuICAgICAgICAgICAgICAgICAgICB2aWV3Lmluc2VydEJlZm9yZShsb2NhdGlvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVtb3ZlZCA9IHZpZXdzLnNwbGljZShpLCB2aWV3c0xlbmd0aCAtIGkpO1xuICAgICAgICAgICAgZm9yIChpID0gMCwgaXRlbXNMZW5ndGggPSByZW1vdmVkLmxlbmd0aDsgaSA8IGl0ZW1zTGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICByZW1vdmVkW2ldLmRpc3Bvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICB1bmJpbmRBbGxWaWV3cygpIHtcbiAgICAgICAgY29uc3Qgdmlld3MgPSB0aGlzLnZpZXdzO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB2aWV3cy5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgICAgICAgICB2aWV3c1tpXS51bmJpbmQoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8qKlxuICogQSBkaXJlY3RpdmUgdGhhdCBjb25maWd1cmVzIGxpc3QgcmVuZGVyaW5nLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgUmVwZWF0RGlyZWN0aXZlIGV4dGVuZHMgRGlyZWN0aXZlIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFJlcGVhdERpcmVjdGl2ZS5cbiAgICAgKiBAcGFyYW0gaXRlbXNCaW5kaW5nIC0gVGhlIGJpbmRpbmcgdGhhdCBwcm92aWRlcyB0aGUgYXJyYXkgdG8gcmVuZGVyLlxuICAgICAqIEBwYXJhbSB0ZW1wbGF0ZUJpbmRpbmcgLSBUaGUgdGVtcGxhdGUgYmluZGluZyB1c2VkIHRvIG9idGFpbiBhIHRlbXBsYXRlIHRvIHJlbmRlciBmb3IgZWFjaCBpdGVtIGluIHRoZSBhcnJheS5cbiAgICAgKiBAcGFyYW0gb3B0aW9ucyAtIE9wdGlvbnMgdXNlZCB0byB0dXJuIG9uIHNwZWNpYWwgcmVwZWF0IGZlYXR1cmVzLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGl0ZW1zQmluZGluZywgdGVtcGxhdGVCaW5kaW5nLCBvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaXRlbXNCaW5kaW5nID0gaXRlbXNCaW5kaW5nO1xuICAgICAgICB0aGlzLnRlbXBsYXRlQmluZGluZyA9IHRlbXBsYXRlQmluZGluZztcbiAgICAgICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIENyZWF0ZXMgYSBwbGFjZWhvbGRlciBzdHJpbmcgYmFzZWQgb24gdGhlIGRpcmVjdGl2ZSdzIGluZGV4IHdpdGhpbiB0aGUgdGVtcGxhdGUuXG4gICAgICAgICAqIEBwYXJhbSBpbmRleCAtIFRoZSBpbmRleCBvZiB0aGUgZGlyZWN0aXZlIHdpdGhpbiB0aGUgdGVtcGxhdGUuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNyZWF0ZVBsYWNlaG9sZGVyID0gRE9NLmNyZWF0ZUJsb2NrUGxhY2Vob2xkZXI7XG4gICAgICAgIGVuYWJsZUFycmF5T2JzZXJ2YXRpb24oKTtcbiAgICAgICAgdGhpcy5pc0l0ZW1zQmluZGluZ1ZvbGF0aWxlID0gT2JzZXJ2YWJsZS5pc1ZvbGF0aWxlQmluZGluZyhpdGVtc0JpbmRpbmcpO1xuICAgICAgICB0aGlzLmlzVGVtcGxhdGVCaW5kaW5nVm9sYXRpbGUgPSBPYnNlcnZhYmxlLmlzVm9sYXRpbGVCaW5kaW5nKHRlbXBsYXRlQmluZGluZyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBiZWhhdmlvciBmb3IgdGhlIHByb3ZpZGVkIHRhcmdldCBub2RlLlxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBUaGUgbm9kZSBpbnN0YW5jZSB0byBjcmVhdGUgdGhlIGJlaGF2aW9yIGZvci5cbiAgICAgKi9cbiAgICBjcmVhdGVCZWhhdmlvcih0YXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBSZXBlYXRCZWhhdmlvcih0YXJnZXQsIHRoaXMuaXRlbXNCaW5kaW5nLCB0aGlzLmlzSXRlbXNCaW5kaW5nVm9sYXRpbGUsIHRoaXMudGVtcGxhdGVCaW5kaW5nLCB0aGlzLmlzVGVtcGxhdGVCaW5kaW5nVm9sYXRpbGUsIHRoaXMub3B0aW9ucyk7XG4gICAgfVxufVxuLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGVuYWJsZXMgbGlzdCByZW5kZXJpbmcuXG4gKiBAcGFyYW0gaXRlbXNCaW5kaW5nIC0gVGhlIGFycmF5IHRvIHJlbmRlci5cbiAqIEBwYXJhbSB0ZW1wbGF0ZU9yVGVtcGxhdGVCaW5kaW5nIC0gVGhlIHRlbXBsYXRlIG9yIGEgdGVtcGxhdGUgYmluZGluZyB1c2VkIG9idGFpbiBhIHRlbXBsYXRlXG4gKiB0byByZW5kZXIgZm9yIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXkuXG4gKiBAcGFyYW0gb3B0aW9ucyAtIE9wdGlvbnMgdXNlZCB0byB0dXJuIG9uIHNwZWNpYWwgcmVwZWF0IGZlYXR1cmVzLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVwZWF0KGl0ZW1zQmluZGluZywgdGVtcGxhdGVPclRlbXBsYXRlQmluZGluZywgb3B0aW9ucyA9IGRlZmF1bHRSZXBlYXRPcHRpb25zKSB7XG4gICAgY29uc3QgdGVtcGxhdGVCaW5kaW5nID0gdHlwZW9mIHRlbXBsYXRlT3JUZW1wbGF0ZUJpbmRpbmcgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICA/IHRlbXBsYXRlT3JUZW1wbGF0ZUJpbmRpbmdcbiAgICAgICAgOiAoKSA9PiB0ZW1wbGF0ZU9yVGVtcGxhdGVCaW5kaW5nO1xuICAgIHJldHVybiBuZXcgUmVwZWF0RGlyZWN0aXZlKGl0ZW1zQmluZGluZywgdGVtcGxhdGVCaW5kaW5nLCBvcHRpb25zKTtcbn1cbiIsImltcG9ydCB7IEF0dGFjaGVkQmVoYXZpb3JEaXJlY3RpdmUgfSBmcm9tIFwiLi9kaXJlY3RpdmVcIjtcbmltcG9ydCB7IE5vZGVPYnNlcnZhdGlvbkJlaGF2aW9yIH0gZnJvbSBcIi4vbm9kZS1vYnNlcnZhdGlvblwiO1xuLyoqXG4gKiBUaGUgcnVudGltZSBiZWhhdmlvciBmb3Igc2xvdHRlZCBub2RlIG9ic2VydmF0aW9uLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgU2xvdHRlZEJlaGF2aW9yIGV4dGVuZHMgTm9kZU9ic2VydmF0aW9uQmVoYXZpb3Ige1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgU2xvdHRlZEJlaGF2aW9yLlxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBUaGUgc2xvdCBlbGVtZW50IHRhcmdldCB0byBvYnNlcnZlLlxuICAgICAqIEBwYXJhbSBvcHRpb25zIC0gVGhlIG9wdGlvbnMgdG8gdXNlIHdoZW4gb2JzZXJ2aW5nIHRoZSBzbG90LlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHRhcmdldCwgb3B0aW9ucykge1xuICAgICAgICBzdXBlcih0YXJnZXQsIG9wdGlvbnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBCZWdpbnMgb2JzZXJ2YXRpb24gb2YgdGhlIG5vZGVzLlxuICAgICAqL1xuICAgIG9ic2VydmUoKSB7XG4gICAgICAgIHRoaXMudGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJzbG90Y2hhbmdlXCIsIHRoaXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEaXNjb25uZWN0cyBvYnNlcnZhdGlvbiBvZiB0aGUgbm9kZXMuXG4gICAgICovXG4gICAgZGlzY29ubmVjdCgpIHtcbiAgICAgICAgdGhpcy50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNsb3RjaGFuZ2VcIiwgdGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHJpZXZlcyB0aGUgbm9kZXMgdGhhdCBzaG91bGQgYmUgYXNzaWduZWQgdG8gdGhlIHRhcmdldC5cbiAgICAgKi9cbiAgICBnZXROb2RlcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudGFyZ2V0LmFzc2lnbmVkTm9kZXModGhpcy5vcHRpb25zKTtcbiAgICB9XG59XG4vKipcbiAqIEEgZGlyZWN0aXZlIHRoYXQgb2JzZXJ2ZXMgdGhlIGBhc3NpZ25lZE5vZGVzKClgIG9mIGEgc2xvdCBhbmQgdXBkYXRlcyBhIHByb3BlcnR5XG4gKiB3aGVuZXZlciB0aGV5IGNoYW5nZS5cbiAqIEBwYXJhbSBwcm9wZXJ0eU9yT3B0aW9ucyAtIFRoZSBvcHRpb25zIHVzZWQgdG8gY29uZmlndXJlIHNsb3R0ZWQgbm9kZSBvYnNlcnZhdGlvbi5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNsb3R0ZWQocHJvcGVydHlPck9wdGlvbnMpIHtcbiAgICBpZiAodHlwZW9mIHByb3BlcnR5T3JPcHRpb25zID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHByb3BlcnR5T3JPcHRpb25zID0geyBwcm9wZXJ0eTogcHJvcGVydHlPck9wdGlvbnMgfTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBBdHRhY2hlZEJlaGF2aW9yRGlyZWN0aXZlKFwiZmFzdC1zbG90dGVkXCIsIFNsb3R0ZWRCZWhhdmlvciwgcHJvcGVydHlPck9wdGlvbnMpO1xufVxuIiwiLyoqXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGVuYWJsZXMgYmFzaWMgY29uZGl0aW9uYWwgcmVuZGVyaW5nIGluIGEgdGVtcGxhdGUuXG4gKiBAcGFyYW0gYmluZGluZyAtIFRoZSBjb25kaXRpb24gdG8gdGVzdCBmb3IgcmVuZGVyaW5nLlxuICogQHBhcmFtIHRlbXBsYXRlT3JUZW1wbGF0ZUJpbmRpbmcgLSBUaGUgdGVtcGxhdGUgb3IgYSBiaW5kaW5nIHRoYXQgZ2V0c1xuICogdGhlIHRlbXBsYXRlIHRvIHJlbmRlciB3aGVuIHRoZSBjb25kaXRpb24gaXMgdHJ1ZS5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdoZW4oYmluZGluZywgdGVtcGxhdGVPclRlbXBsYXRlQmluZGluZykge1xuICAgIGNvbnN0IGdldFRlbXBsYXRlID0gdHlwZW9mIHRlbXBsYXRlT3JUZW1wbGF0ZUJpbmRpbmcgPT09IFwiZnVuY3Rpb25cIlxuICAgICAgICA/IHRlbXBsYXRlT3JUZW1wbGF0ZUJpbmRpbmdcbiAgICAgICAgOiAoKSA9PiB0ZW1wbGF0ZU9yVGVtcGxhdGVCaW5kaW5nO1xuICAgIHJldHVybiAoc291cmNlLCBjb250ZXh0KSA9PiBiaW5kaW5nKHNvdXJjZSwgY29udGV4dCkgPyBnZXRUZW1wbGF0ZShzb3VyY2UsIGNvbnRleHQpIDogbnVsbDtcbn1cbiIsImltcG9ydCB7ICRnbG9iYWwgfSBmcm9tIFwiLi9wbGF0Zm9ybVwiO1xuY29uc3QgdXBkYXRlUXVldWUgPSBbXTtcbi8qIGVzbGludC1kaXNhYmxlICovXG5jb25zdCBmYXN0SFRNTFBvbGljeSA9ICRnbG9iYWwudHJ1c3RlZFR5cGVzLmNyZWF0ZVBvbGljeShcImZhc3QtaHRtbFwiLCB7XG4gICAgY3JlYXRlSFRNTDogaHRtbCA9PiBodG1sLFxufSk7XG4vKiBlc2xpbnQtZW5hYmxlICovXG5sZXQgaHRtbFBvbGljeSA9IGZhc3RIVE1MUG9saWN5O1xuZnVuY3Rpb24gcHJvY2Vzc1F1ZXVlKCkge1xuICAgIGNvbnN0IGNhcGFjaXR5ID0gMTAyNDtcbiAgICBsZXQgaW5kZXggPSAwO1xuICAgIHdoaWxlIChpbmRleCA8IHVwZGF0ZVF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBjb25zdCB0YXNrID0gdXBkYXRlUXVldWVbaW5kZXhdO1xuICAgICAgICB0YXNrLmNhbGwoKTtcbiAgICAgICAgaW5kZXgrKztcbiAgICAgICAgLy8gUHJldmVudCBsZWFraW5nIG1lbW9yeSBmb3IgbG9uZyBjaGFpbnMgb2YgcmVjdXJzaXZlIGNhbGxzIHRvIGBxdWV1ZU1pY3JvVGFza2AuXG4gICAgICAgIC8vIElmIHdlIGNhbGwgYHF1ZXVlTWljcm9UYXNrYCB3aXRoaW4gYSBNaWNyb1Rhc2sgc2NoZWR1bGVkIGJ5IGBxdWV1ZU1pY3JvVGFza2AsIHRoZSBxdWV1ZSB3aWxsXG4gICAgICAgIC8vIGdyb3csIGJ1dCB0byBhdm9pZCBhbiBPKG4pIHdhbGsgZm9yIGV2ZXJ5IE1pY3JvVGFzayB3ZSBleGVjdXRlLCB3ZSBkb24ndFxuICAgICAgICAvLyBzaGlmdCBNaWNyb1Rhc2tzIG9mZiB0aGUgcXVldWUgYWZ0ZXIgdGhleSBoYXZlIGJlZW4gZXhlY3V0ZWQuXG4gICAgICAgIC8vIEluc3RlYWQsIHdlIHBlcmlvZGljYWxseSBzaGlmdCAxMDI0IE1pY3JvVGFza3Mgb2ZmIHRoZSBxdWV1ZS5cbiAgICAgICAgaWYgKGluZGV4ID4gY2FwYWNpdHkpIHtcbiAgICAgICAgICAgIC8vIE1hbnVhbGx5IHNoaWZ0IGFsbCB2YWx1ZXMgc3RhcnRpbmcgYXQgdGhlIGluZGV4IGJhY2sgdG8gdGhlXG4gICAgICAgICAgICAvLyBiZWdpbm5pbmcgb2YgdGhlIHF1ZXVlLlxuICAgICAgICAgICAgZm9yIChsZXQgc2NhbiA9IDAsIG5ld0xlbmd0aCA9IHVwZGF0ZVF1ZXVlLmxlbmd0aCAtIGluZGV4OyBzY2FuIDwgbmV3TGVuZ3RoOyBzY2FuKyspIHtcbiAgICAgICAgICAgICAgICB1cGRhdGVRdWV1ZVtzY2FuXSA9IHVwZGF0ZVF1ZXVlW3NjYW4gKyBpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1cGRhdGVRdWV1ZS5sZW5ndGggLT0gaW5kZXg7XG4gICAgICAgICAgICBpbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlUXVldWUubGVuZ3RoID0gMDtcbn1cbmNvbnN0IG1hcmtlciA9IGBmYXN0LSR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDIsIDgpfWA7XG4vKiogQGludGVybmFsICovXG5leHBvcnQgY29uc3QgX2ludGVycG9sYXRpb25TdGFydCA9IGAke21hcmtlcn17YDtcbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCBjb25zdCBfaW50ZXJwb2xhdGlvbkVuZCA9IGB9JHttYXJrZXJ9YDtcbi8qKlxuICogQ29tbW9uIERPTSBBUElzLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgRE9NID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIERPTSBzdXBwb3J0cyB0aGUgYWRvcHRlZFN0eWxlU2hlZXRzIGZlYXR1cmUuXG4gICAgICovXG4gICAgc3VwcG9ydHNBZG9wdGVkU3R5bGVTaGVldHM6IEFycmF5LmlzQXJyYXkoZG9jdW1lbnQuYWRvcHRlZFN0eWxlU2hlZXRzKSAmJlxuICAgICAgICBcInJlcGxhY2VcIiBpbiBDU1NTdHlsZVNoZWV0LnByb3RvdHlwZSxcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBIVE1MIHRydXN0ZWQgdHlwZXMgcG9saWN5IHVzZWQgYnkgdGhlIHRlbXBsYXRpbmcgZW5naW5lLlxuICAgICAqIEBwYXJhbSBwb2xpY3kgLSBUaGUgcG9saWN5IHRvIHNldCBmb3IgSFRNTC5cbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFRoaXMgQVBJIGNhbiBvbmx5IGJlIGNhbGxlZCBvbmNlLCBmb3Igc2VjdXJpdHkgcmVhc29ucy4gSXQgc2hvdWxkIGJlXG4gICAgICogY2FsbGVkIGJ5IHRoZSBhcHBsaWNhdGlvbiBkZXZlbG9wZXIgYXQgdGhlIHN0YXJ0IG9mIHRoZWlyIHByb2dyYW0uXG4gICAgICovXG4gICAgc2V0SFRNTFBvbGljeShwb2xpY3kpIHtcbiAgICAgICAgaWYgKGh0bWxQb2xpY3kgIT09IGZhc3RIVE1MUG9saWN5KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgSFRNTCBwb2xpY3kgY2FuIG9ubHkgYmUgc2V0IG9uY2UuXCIpO1xuICAgICAgICB9XG4gICAgICAgIGh0bWxQb2xpY3kgPSBwb2xpY3k7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBUdXJucyBhIHN0cmluZyBpbnRvIHRydXN0ZWQgSFRNTCB1c2luZyB0aGUgY29uZmlndXJlZCB0cnVzdGVkIHR5cGVzIHBvbGljeS5cbiAgICAgKiBAcGFyYW0gaHRtbCAtIFRoZSBzdHJpbmcgdG8gdHVybiBpbnRvIHRydXN0ZWQgSFRNTC5cbiAgICAgKiBAcmVtYXJrc1xuICAgICAqIFVzZWQgaW50ZXJuYWxseSBieSB0aGUgdGVtcGxhdGUgZW5naW5lIHdoZW4gY3JlYXRpbmcgdGVtcGxhdGVzXG4gICAgICogYW5kIHNldHRpbmcgaW5uZXJIVE1MLlxuICAgICAqL1xuICAgIGNyZWF0ZUhUTUwoaHRtbCkge1xuICAgICAgICByZXR1cm4gaHRtbFBvbGljeS5jcmVhdGVIVE1MKGh0bWwpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogRGV0ZXJtaW5lcyBpZiB0aGUgcHJvdmlkZWQgbm9kZSBpcyBhIHRlbXBsYXRlIG1hcmtlciB1c2VkIGJ5IHRoZSBydW50aW1lLlxuICAgICAqIEBwYXJhbSBub2RlIC0gVGhlIG5vZGUgdG8gdGVzdC5cbiAgICAgKi9cbiAgICBpc01hcmtlcihub2RlKSB7XG4gICAgICAgIHJldHVybiBub2RlICYmIG5vZGUubm9kZVR5cGUgPT09IDggJiYgbm9kZS5kYXRhLnN0YXJ0c1dpdGgobWFya2VyKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEdpdmVuIGEgbWFya2VyIG5vZGUsIGV4dHJhY3QgdGhlIHtAbGluayBEaXJlY3RpdmV9IGluZGV4IGZyb20gdGhlIHBsYWNlaG9sZGVyLlxuICAgICAqIEBwYXJhbSBub2RlIC0gVGhlIG1hcmtlciBub2RlIHRvIGV4dHJhY3QgdGhlIGluZGV4IGZyb20uXG4gICAgICovXG4gICAgZXh0cmFjdERpcmVjdGl2ZUluZGV4RnJvbU1hcmtlcihub2RlKSB7XG4gICAgICAgIHJldHVybiBwYXJzZUludChub2RlLmRhdGEucmVwbGFjZShgJHttYXJrZXJ9OmAsIFwiXCIpKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBwbGFjZWhvbGRlciBzdHJpbmcgc3VpdGFibGUgZm9yIG1hcmtpbmcgb3V0IGEgbG9jYXRpb24gKndpdGhpbipcbiAgICAgKiBhbiBhdHRyaWJ1dGUgdmFsdWUgb3IgSFRNTCBjb250ZW50LlxuICAgICAqIEBwYXJhbSBpbmRleCAtIFRoZSBkaXJlY3RpdmUgaW5kZXggdG8gY3JlYXRlIHRoZSBwbGFjZWhvbGRlciBmb3IuXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBVc2VkIGludGVybmFsbHkgYnkgYmluZGluZyBkaXJlY3RpdmVzLlxuICAgICAqL1xuICAgIGNyZWF0ZUludGVycG9sYXRpb25QbGFjZWhvbGRlcihpbmRleCkge1xuICAgICAgICByZXR1cm4gYCR7X2ludGVycG9sYXRpb25TdGFydH0ke2luZGV4fSR7X2ludGVycG9sYXRpb25FbmR9YDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBwbGFjZWhvbGRlciB0aGF0IG1hbmlmZXN0cyBpdHNlbGYgYXMgYW4gYXR0cmlidXRlIG9uIGFuXG4gICAgICogZWxlbWVudC5cbiAgICAgKiBAcGFyYW0gYXR0cmlidXRlTmFtZSAtIFRoZSBuYW1lIG9mIHRoZSBjdXN0b20gYXR0cmlidXRlLlxuICAgICAqIEBwYXJhbSBpbmRleCAtIFRoZSBkaXJlY3RpdmUgaW5kZXggdG8gY3JlYXRlIHRoZSBwbGFjZWhvbGRlciBmb3IuXG4gICAgICogQHJlbWFya3NcbiAgICAgKiBVc2VkIGludGVybmFsbHkgYnkgYXR0cmlidXRlIGRpcmVjdGl2ZXMgc3VjaCBhcyBgcmVmYCwgYHNsb3R0ZWRgLCBhbmQgYGNoaWxkcmVuYC5cbiAgICAgKi9cbiAgICBjcmVhdGVDdXN0b21BdHRyaWJ1dGVQbGFjZWhvbGRlcihhdHRyaWJ1dGVOYW1lLCBpbmRleCkge1xuICAgICAgICByZXR1cm4gYCR7YXR0cmlidXRlTmFtZX09XCIke3RoaXMuY3JlYXRlSW50ZXJwb2xhdGlvblBsYWNlaG9sZGVyKGluZGV4KX1cImA7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgcGxhY2Vob2xkZXIgdGhhdCBtYW5pZmVzdHMgaXRzZWxmIGFzIGEgbWFya2VyIHdpdGhpbiB0aGUgRE9NIHN0cnVjdHVyZS5cbiAgICAgKiBAcGFyYW0gaW5kZXggLSBUaGUgZGlyZWN0aXZlIGluZGV4IHRvIGNyZWF0ZSB0aGUgcGxhY2Vob2xkZXIgZm9yLlxuICAgICAqIEByZW1hcmtzXG4gICAgICogVXNlZCBpbnRlcm5hbGx5IGJ5IHN0cnVjdHVyYWwgZGlyZWN0aXZlcyBzdWNoIGFzIGByZXBlYXRgLlxuICAgICAqL1xuICAgIGNyZWF0ZUJsb2NrUGxhY2Vob2xkZXIoaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGA8IS0tJHttYXJrZXJ9OiR7aW5kZXh9LS0+YDtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFNjaGVkdWxlcyBET00gdXBkYXRlIHdvcmsgaW4gdGhlIG5leHQgYXN5bmMgYmF0Y2guXG4gICAgICogQHBhcmFtIGNhbGxhYmxlIC0gVGhlIGNhbGxhYmxlIGZ1bmN0aW9uIG9yIG9iamVjdCB0byBxdWV1ZS5cbiAgICAgKi9cbiAgICBxdWV1ZVVwZGF0ZShjYWxsYWJsZSkge1xuICAgICAgICBpZiAodXBkYXRlUXVldWUubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShwcm9jZXNzUXVldWUpO1xuICAgICAgICB9XG4gICAgICAgIHVwZGF0ZVF1ZXVlLnB1c2goY2FsbGFibGUpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogUmVzb2x2ZXMgd2l0aCB0aGUgbmV4dCBET00gdXBkYXRlLlxuICAgICAqL1xuICAgIG5leHRVcGRhdGUoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgRE9NLnF1ZXVlVXBkYXRlKHJlc29sdmUpO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFNldHMgYW4gYXR0cmlidXRlIHZhbHVlIG9uIGFuIGVsZW1lbnQuXG4gICAgICogQHBhcmFtIGVsZW1lbnQgLSBUaGUgZWxlbWVudCB0byBzZXQgdGhlIGF0dHJpYnV0ZSB2YWx1ZSBvbi5cbiAgICAgKiBAcGFyYW0gYXR0cmlidXRlTmFtZSAtIFRoZSBhdHRyaWJ1dGUgbmFtZSB0byBzZXQuXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUgdG8gc2V0LlxuICAgICAqIEByZW1hcmtzXG4gICAgICogSWYgdGhlIHZhbHVlIGlzIGBudWxsYCBvciBgdW5kZWZpbmVkYCwgdGhlIGF0dHJpYnV0ZSBpcyByZW1vdmVkLCBvdGhlcndpc2VcbiAgICAgKiBpdCBpcyBzZXQgdG8gdGhlIHByb3ZpZGVkIHZhbHVlIHVzaW5nIHRoZSBzdGFuZGFyZCBgc2V0QXR0cmlidXRlYCBBUEkuXG4gICAgICovXG4gICAgc2V0QXR0cmlidXRlKGVsZW1lbnQsIGF0dHJpYnV0ZU5hbWUsIHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgLyoqXG4gICAgICogU2V0cyBhIGJvb2xlYW4gYXR0cmlidXRlIHZhbHVlLlxuICAgICAqIEBwYXJhbSBlbGVtZW50IC0gVGhlIGVsZW1lbnQgdG8gc2V0IHRoZSBib29sZWFuIGF0dHJpYnV0ZSB2YWx1ZSBvbi5cbiAgICAgKiBAcGFyYW0gYXR0cmlidXRlTmFtZSAtIFRoZSBhdHRyaWJ1dGUgbmFtZSB0byBzZXQuXG4gICAgICogQHBhcmFtIHZhbHVlIC0gVGhlIHZhbHVlIG9mIHRoZSBhdHRyaWJ1dGUgdG8gc2V0LlxuICAgICAqIEByZW1hcmtzXG4gICAgICogSWYgdGhlIHZhbHVlIGlzIHRydWUsIHRoZSBhdHRyaWJ1dGUgaXMgYWRkZWQ7IG90aGVyd2lzZSBpdCBpcyByZW1vdmVkLlxuICAgICAqL1xuICAgIHNldEJvb2xlYW5BdHRyaWJ1dGUoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgdmFsdWUpIHtcbiAgICAgICAgdmFsdWVcbiAgICAgICAgICAgID8gZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgXCJcIilcbiAgICAgICAgICAgIDogZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGFsbCB0aGUgY2hpbGQgbm9kZXMgb2YgdGhlIHByb3ZpZGVkIHBhcmVudCBub2RlLlxuICAgICAqIEBwYXJhbSBwYXJlbnQgLSBUaGUgbm9kZSB0byByZW1vdmUgdGhlIGNoaWxkcmVuIGZyb20uXG4gICAgICovXG4gICAgcmVtb3ZlQ2hpbGROb2RlcyhwYXJlbnQpIHtcbiAgICAgICAgZm9yIChsZXQgY2hpbGQgPSBwYXJlbnQuZmlyc3RDaGlsZDsgY2hpbGQgIT09IG51bGw7IGNoaWxkID0gcGFyZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZChjaGlsZCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBUcmVlV2Fsa2VyIGNvbmZpZ3VyZWQgdG8gd2FsayBhIHRlbXBsYXRlIGZyYWdtZW50LlxuICAgICAqIEBwYXJhbSBmcmFnbWVudCAtIFRoZSBmcmFnbWVudCB0byB3YWxrLlxuICAgICAqL1xuICAgIGNyZWF0ZVRlbXBsYXRlV2Fsa2VyKGZyYWdtZW50KSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVUcmVlV2Fsa2VyKGZyYWdtZW50LCAxMzMsIC8vIGVsZW1lbnQsIHRleHQsIGNvbW1lbnRcbiAgICAgICAgbnVsbCwgZmFsc2UpO1xuICAgIH0sXG59KTtcbiIsImltcG9ydCB7IEVsZW1lbnRTdHlsZXMgfSBmcm9tIFwiLi9zdHlsZXNcIjtcbmltcG9ydCB7IEF0dHJpYnV0ZURlZmluaXRpb24gfSBmcm9tIFwiLi9hdHRyaWJ1dGVzXCI7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSBcIi4vb2JzZXJ2YXRpb24vb2JzZXJ2YWJsZVwiO1xuY29uc3QgZGVmYXVsdFNoYWRvd09wdGlvbnMgPSB7IG1vZGU6IFwib3BlblwiIH07XG5jb25zdCBkZWZhdWx0RWxlbWVudE9wdGlvbnMgPSB7fTtcbmNvbnN0IGZhc3REZWZpbml0aW9ucyA9IG5ldyBNYXAoKTtcbi8qKlxuICogRGVmaW5lcyBtZXRhZGF0YSBmb3IgYSBGQVNURWxlbWVudC5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIEZBU1RFbGVtZW50RGVmaW5pdGlvbiB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiBGQVNURWxlbWVudERlZmluaXRpb24uXG4gICAgICogQHBhcmFtIHR5cGUgLSBUaGUgdHlwZSB0aGlzIGRlZmluaXRpb24gaXMgYmVpbmcgY3JlYXRlZCBmb3IuXG4gICAgICogQHBhcmFtIG5hbWVPckNvbmZpZyAtIFRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRvIGRlZmluZSBvciBhIGNvbmZpZyBvYmplY3RcbiAgICAgKiB0aGF0IGRlc2NyaWJlcyB0aGUgZWxlbWVudCB0byBkZWZpbmUuXG4gICAgICovXG4gICAgY29uc3RydWN0b3IodHlwZSwgbmFtZU9yQ29uZmlnID0gdHlwZS5kZWZpbml0aW9uKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZU9yQ29uZmlnID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICBuYW1lT3JDb25maWcgPSB7IG5hbWU6IG5hbWVPckNvbmZpZyB9O1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWVPckNvbmZpZy5uYW1lO1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gbmFtZU9yQ29uZmlnLnRlbXBsYXRlO1xuICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gQXR0cmlidXRlRGVmaW5pdGlvbi5jb2xsZWN0KHR5cGUsIG5hbWVPckNvbmZpZy5hdHRyaWJ1dGVzKTtcbiAgICAgICAgY29uc3Qgb2JzZXJ2ZWRBdHRyaWJ1dGVzID0gbmV3IEFycmF5KGF0dHJpYnV0ZXMubGVuZ3RoKTtcbiAgICAgICAgY29uc3QgcHJvcGVydHlMb29rdXAgPSB7fTtcbiAgICAgICAgY29uc3QgYXR0cmlidXRlTG9va3VwID0ge307XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGF0dHJpYnV0ZXMubGVuZ3RoOyBpIDwgaWk7ICsraSkge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudCA9IGF0dHJpYnV0ZXNbaV07XG4gICAgICAgICAgICBvYnNlcnZlZEF0dHJpYnV0ZXNbaV0gPSBjdXJyZW50LmF0dHJpYnV0ZTtcbiAgICAgICAgICAgIHByb3BlcnR5TG9va3VwW2N1cnJlbnQubmFtZV0gPSBjdXJyZW50O1xuICAgICAgICAgICAgYXR0cmlidXRlTG9va3VwW2N1cnJlbnQuYXR0cmlidXRlXSA9IGN1cnJlbnQ7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcbiAgICAgICAgdGhpcy5vYnNlcnZlZEF0dHJpYnV0ZXMgPSBvYnNlcnZlZEF0dHJpYnV0ZXM7XG4gICAgICAgIHRoaXMucHJvcGVydHlMb29rdXAgPSBwcm9wZXJ0eUxvb2t1cDtcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVMb29rdXAgPSBhdHRyaWJ1dGVMb29rdXA7XG4gICAgICAgIHRoaXMuc2hhZG93T3B0aW9ucyA9XG4gICAgICAgICAgICBuYW1lT3JDb25maWcuc2hhZG93T3B0aW9ucyA9PT0gdm9pZCAwXG4gICAgICAgICAgICAgICAgPyBkZWZhdWx0U2hhZG93T3B0aW9uc1xuICAgICAgICAgICAgICAgIDogbmFtZU9yQ29uZmlnLnNoYWRvd09wdGlvbnMgPT09IG51bGxcbiAgICAgICAgICAgICAgICAgICAgPyB2b2lkIDBcbiAgICAgICAgICAgICAgICAgICAgOiBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGRlZmF1bHRTaGFkb3dPcHRpb25zKSwgbmFtZU9yQ29uZmlnLnNoYWRvd09wdGlvbnMpO1xuICAgICAgICB0aGlzLmVsZW1lbnRPcHRpb25zID1cbiAgICAgICAgICAgIG5hbWVPckNvbmZpZy5lbGVtZW50T3B0aW9ucyA9PT0gdm9pZCAwXG4gICAgICAgICAgICAgICAgPyBkZWZhdWx0RWxlbWVudE9wdGlvbnNcbiAgICAgICAgICAgICAgICA6IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgZGVmYXVsdEVsZW1lbnRPcHRpb25zKSwgbmFtZU9yQ29uZmlnLmVsZW1lbnRPcHRpb25zKTtcbiAgICAgICAgdGhpcy5zdHlsZXMgPVxuICAgICAgICAgICAgbmFtZU9yQ29uZmlnLnN0eWxlcyA9PT0gdm9pZCAwXG4gICAgICAgICAgICAgICAgPyB2b2lkIDBcbiAgICAgICAgICAgICAgICA6IEFycmF5LmlzQXJyYXkobmFtZU9yQ29uZmlnLnN0eWxlcylcbiAgICAgICAgICAgICAgICAgICAgPyBFbGVtZW50U3R5bGVzLmNyZWF0ZShuYW1lT3JDb25maWcuc3R5bGVzKVxuICAgICAgICAgICAgICAgICAgICA6IG5hbWVPckNvbmZpZy5zdHlsZXMgaW5zdGFuY2VvZiBFbGVtZW50U3R5bGVzXG4gICAgICAgICAgICAgICAgICAgICAgICA/IG5hbWVPckNvbmZpZy5zdHlsZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIDogRWxlbWVudFN0eWxlcy5jcmVhdGUoW25hbWVPckNvbmZpZy5zdHlsZXNdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhIGN1c3RvbSBlbGVtZW50IGJhc2VkIG9uIHRoaXMgZGVmaW5pdGlvbi5cbiAgICAgKiBAcGFyYW0gcmVnaXN0cnkgLSBUaGUgZWxlbWVudCByZWdpc3RyeSB0byBkZWZpbmUgdGhlIGVsZW1lbnQgaW4uXG4gICAgICovXG4gICAgZGVmaW5lKHJlZ2lzdHJ5ID0gY3VzdG9tRWxlbWVudHMpIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMudHlwZTtcbiAgICAgICAgaWYgKCF0aGlzLmlzRGVmaW5lZCkge1xuICAgICAgICAgICAgY29uc3QgYXR0cmlidXRlcyA9IHRoaXMuYXR0cmlidXRlcztcbiAgICAgICAgICAgIGNvbnN0IHByb3RvID0gdHlwZS5wcm90b3R5cGU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBhdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgICAgICAgICBPYnNlcnZhYmxlLmRlZmluZVByb3BlcnR5KHByb3RvLCBhdHRyaWJ1dGVzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodHlwZSwgXCJvYnNlcnZlZEF0dHJpYnV0ZXNcIiwge1xuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLm9ic2VydmVkQXR0cmlidXRlcyxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmYXN0RGVmaW5pdGlvbnMuc2V0KHR5cGUsIHRoaXMpO1xuICAgICAgICAgICAgdGhpcy5pc0RlZmluZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcmVnaXN0cnkuZ2V0KHRoaXMubmFtZSkpIHtcbiAgICAgICAgICAgIHJlZ2lzdHJ5LmRlZmluZSh0aGlzLm5hbWUsIHR5cGUsIHRoaXMuZWxlbWVudE9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXRzIHRoZSBlbGVtZW50IGRlZmluaXRpb24gYXNzb2NpYXRlZCB3aXRoIHRoZSBzcGVjaWZpZWQgdHlwZS5cbiAgICAgKiBAcGFyYW0gdHlwZSAtIFRoZSBjdXN0b20gZWxlbWVudCB0eXBlIHRvIHJldHJpZXZlIHRoZSBkZWZpbml0aW9uIGZvci5cbiAgICAgKi9cbiAgICBzdGF0aWMgZm9yVHlwZSh0eXBlKSB7XG4gICAgICAgIHJldHVybiBmYXN0RGVmaW5pdGlvbnMuZ2V0KHR5cGUpO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IENvbnRyb2xsZXIgfSBmcm9tIFwiLi9jb250cm9sbGVyXCI7XG5pbXBvcnQgeyBGQVNURWxlbWVudERlZmluaXRpb24gfSBmcm9tIFwiLi9mYXN0LWRlZmluaXRpb25zXCI7XG4vKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2V4cGxpY2l0LWZ1bmN0aW9uLXJldHVybi10eXBlICovXG5mdW5jdGlvbiBjcmVhdGVGQVNURWxlbWVudChCYXNlVHlwZSkge1xuICAgIHJldHVybiBjbGFzcyBleHRlbmRzIEJhc2VUeXBlIHtcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgKi9cbiAgICAgICAgICAgIHN1cGVyKCk7XG4gICAgICAgICAgICBDb250cm9sbGVyLmZvckN1c3RvbUVsZW1lbnQodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgJGVtaXQodHlwZSwgZGV0YWlsLCBvcHRpb25zKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kZmFzdENvbnRyb2xsZXIuZW1pdCh0eXBlLCBkZXRhaWwsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGNvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICAgICAgdGhpcy4kZmFzdENvbnRyb2xsZXIub25Db25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGRpc2Nvbm5lY3RlZENhbGxiYWNrKCkge1xuICAgICAgICAgICAgdGhpcy4kZmFzdENvbnRyb2xsZXIub25EaXNjb25uZWN0ZWRDYWxsYmFjaygpO1xuICAgICAgICB9XG4gICAgICAgIGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lLCBvbGRWYWx1ZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuJGZhc3RDb250cm9sbGVyLm9uQXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWUsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuLyoqXG4gKiBBIG1pbmltYWwgYmFzZSBjbGFzcyBmb3IgRkFTVEVsZW1lbnRzIHRoYXQgYWxzbyBwcm92aWRlc1xuICogc3RhdGljIGhlbHBlcnMgZm9yIHdvcmtpbmcgd2l0aCBGQVNURWxlbWVudHMuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBGQVNURWxlbWVudCA9IE9iamVjdC5hc3NpZ24oY3JlYXRlRkFTVEVsZW1lbnQoSFRNTEVsZW1lbnQpLCB7XG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIG5ldyBGQVNURWxlbWVudCBiYXNlIGNsYXNzIGluaGVyaXRlZCBmcm9tIHRoZVxuICAgICAqIHByb3ZpZGVkIGJhc2UgdHlwZS5cbiAgICAgKiBAcGFyYW0gQmFzZVR5cGUgLSBUaGUgYmFzZSBlbGVtZW50IHR5cGUgdG8gaW5oZXJpdCBmcm9tLlxuICAgICAqL1xuICAgIGZyb20oQmFzZVR5cGUpIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZUZBU1RFbGVtZW50KEJhc2VUeXBlKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYSBwbGF0Zm9ybSBjdXN0b20gZWxlbWVudCBiYXNlZCBvbiB0aGUgcHJvdmlkZWQgdHlwZSBhbmQgZGVmaW5pdGlvbi5cbiAgICAgKiBAcGFyYW0gdHlwZSAtIFRoZSBjdXN0b20gZWxlbWVudCB0eXBlIHRvIGRlZmluZS5cbiAgICAgKiBAcGFyYW0gbmFtZU9yRGVmIC0gVGhlIG5hbWUgb2YgdGhlIGVsZW1lbnQgdG8gZGVmaW5lIG9yIGEgZGVmaW5pdGlvbiBvYmplY3RcbiAgICAgKiB0aGF0IGRlc2NyaWJlcyB0aGUgZWxlbWVudCB0byBkZWZpbmUuXG4gICAgICovXG4gICAgZGVmaW5lKHR5cGUsIG5hbWVPckRlZikge1xuICAgICAgICByZXR1cm4gbmV3IEZBU1RFbGVtZW50RGVmaW5pdGlvbih0eXBlLCBuYW1lT3JEZWYpLmRlZmluZSgpLnR5cGU7XG4gICAgfSxcbn0pO1xuLyoqXG4gKiBEZWNvcmF0b3I6IERlZmluZXMgYSBwbGF0Zm9ybSBjdXN0b20gZWxlbWVudCBiYXNlZCBvbiBgRkFTVEVsZW1lbnRgLlxuICogQHBhcmFtIG5hbWVPckRlZiAtIFRoZSBuYW1lIG9mIHRoZSBlbGVtZW50IHRvIGRlZmluZSBvciBhIGRlZmluaXRpb24gb2JqZWN0XG4gKiB0aGF0IGRlc2NyaWJlcyB0aGUgZWxlbWVudCB0byBkZWZpbmUuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjdXN0b21FbGVtZW50KG5hbWVPckRlZikge1xuICAgIC8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvZXhwbGljaXQtZnVuY3Rpb24tcmV0dXJuLXR5cGUgKi9cbiAgICByZXR1cm4gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgbmV3IEZBU1RFbGVtZW50RGVmaW5pdGlvbih0eXBlLCBuYW1lT3JEZWYpLmRlZmluZSgpO1xuICAgIH07XG59XG4iLCJleHBvcnQgKiBmcm9tIFwiLi9wbGF0Zm9ybVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vdGVtcGxhdGVcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2Zhc3QtZWxlbWVudFwiO1xuZXhwb3J0IHsgRkFTVEVsZW1lbnREZWZpbml0aW9uIH0gZnJvbSBcIi4vZmFzdC1kZWZpbml0aW9uc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vYXR0cmlidXRlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vY29udHJvbGxlclwiO1xuZXhwb3J0ICogZnJvbSBcIi4vaW50ZXJmYWNlc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vdGVtcGxhdGUtY29tcGlsZXJcIjtcbmV4cG9ydCB7IGNzcywgRWxlbWVudFN0eWxlcywgfSBmcm9tIFwiLi9zdHlsZXNcIjtcbmV4cG9ydCAqIGZyb20gXCIuL3ZpZXdcIjtcbmV4cG9ydCAqIGZyb20gXCIuL29ic2VydmF0aW9uL29ic2VydmFibGVcIjtcbmV4cG9ydCAqIGZyb20gXCIuL29ic2VydmF0aW9uL25vdGlmaWVyXCI7XG5leHBvcnQgeyBlbmFibGVBcnJheU9ic2VydmF0aW9uIH0gZnJvbSBcIi4vb2JzZXJ2YXRpb24vYXJyYXktb2JzZXJ2ZXJcIjtcbmV4cG9ydCB7IERPTSB9IGZyb20gXCIuL2RvbVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vZGlyZWN0aXZlcy9iZWhhdmlvclwiO1xuZXhwb3J0ICogZnJvbSBcIi4vZGlyZWN0aXZlcy9iaW5kaW5nXCI7XG5leHBvcnQgKiBmcm9tIFwiLi9kaXJlY3RpdmVzL2RpcmVjdGl2ZVwiO1xuZXhwb3J0ICogZnJvbSBcIi4vZGlyZWN0aXZlcy9yZWZcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2RpcmVjdGl2ZXMvd2hlblwiO1xuZXhwb3J0ICogZnJvbSBcIi4vZGlyZWN0aXZlcy9yZXBlYXRcIjtcbmV4cG9ydCAqIGZyb20gXCIuL2RpcmVjdGl2ZXMvc2xvdHRlZFwiO1xuZXhwb3J0ICogZnJvbSBcIi4vZGlyZWN0aXZlcy9jaGlsZHJlblwiO1xuZXhwb3J0IHsgZWxlbWVudHMgfSBmcm9tIFwiLi9kaXJlY3RpdmVzL25vZGUtb2JzZXJ2YXRpb25cIjtcbiIsIi8qKlxuICogQSByZWFkb25seSwgZW1wdHkgYXJyYXkuXG4gKiBAcmVtYXJrc1xuICogVHlwaWNhbGx5IHJldHVybmVkIGJ5IEFQSXMgdGhhdCByZXR1cm4gYXJyYXlzIHdoZW4gdGhlcmUgYXJlXG4gKiBubyBhY3R1YWwgaXRlbXMgdG8gcmV0dXJuLlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjb25zdCBlbXB0eUFycmF5ID0gT2JqZWN0LmZyZWV6ZShbXSk7XG4iLCJpbXBvcnQgeyBlbXB0eUFycmF5IH0gZnJvbSBcIi4uL2ludGVyZmFjZXNcIjtcbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXdTcGxpY2UoaW5kZXgsIHJlbW92ZWQsIGFkZGVkQ291bnQpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIHJlbW92ZWQ6IHJlbW92ZWQsXG4gICAgICAgIGFkZGVkQ291bnQ6IGFkZGVkQ291bnQsXG4gICAgfTtcbn1cbmNvbnN0IEVESVRfTEVBVkUgPSAwO1xuY29uc3QgRURJVF9VUERBVEUgPSAxO1xuY29uc3QgRURJVF9BREQgPSAyO1xuY29uc3QgRURJVF9ERUxFVEUgPSAzO1xuLy8gTm90ZTogVGhpcyBmdW5jdGlvbiBpcyAqYmFzZWQqIG9uIHRoZSBjb21wdXRhdGlvbiBvZiB0aGUgTGV2ZW5zaHRlaW5cbi8vIFwiZWRpdFwiIGRpc3RhbmNlLiBUaGUgb25lIGNoYW5nZSBpcyB0aGF0IFwidXBkYXRlc1wiIGFyZSB0cmVhdGVkIGFzIHR3b1xuLy8gZWRpdHMgLSBub3Qgb25lLiBXaXRoIEFycmF5IHNwbGljZXMsIGFuIHVwZGF0ZSBpcyByZWFsbHkgYSBkZWxldGVcbi8vIGZvbGxvd2VkIGJ5IGFuIGFkZC4gQnkgcmV0YWluaW5nIHRoaXMsIHdlIG9wdGltaXplIGZvciBcImtlZXBpbmdcIiB0aGVcbi8vIG1heGltdW0gYXJyYXkgaXRlbXMgaW4gdGhlIG9yaWdpbmFsIGFycmF5LiBGb3IgZXhhbXBsZTpcbi8vXG4vLyAgICd4eHh4MTIzJyAtPiAnMTIzeXl5eSdcbi8vXG4vLyBXaXRoIDEtZWRpdCB1cGRhdGVzLCB0aGUgc2hvcnRlc3QgcGF0aCB3b3VsZCBiZSBqdXN0IHRvIHVwZGF0ZSBhbGwgc2V2ZW5cbi8vIGNoYXJhY3RlcnMuIFdpdGggMi1lZGl0IHVwZGF0ZXMsIHdlIGRlbGV0ZSA0LCBsZWF2ZSAzLCBhbmQgYWRkIDQuIFRoaXNcbi8vIGxlYXZlcyB0aGUgc3Vic3RyaW5nICcxMjMnIGludGFjdC5cbmZ1bmN0aW9uIGNhbGNFZGl0RGlzdGFuY2VzKGN1cnJlbnQsIGN1cnJlbnRTdGFydCwgY3VycmVudEVuZCwgb2xkLCBvbGRTdGFydCwgb2xkRW5kKSB7XG4gICAgLy8gXCJEZWxldGlvblwiIGNvbHVtbnNcbiAgICBjb25zdCByb3dDb3VudCA9IG9sZEVuZCAtIG9sZFN0YXJ0ICsgMTtcbiAgICBjb25zdCBjb2x1bW5Db3VudCA9IGN1cnJlbnRFbmQgLSBjdXJyZW50U3RhcnQgKyAxO1xuICAgIGNvbnN0IGRpc3RhbmNlcyA9IG5ldyBBcnJheShyb3dDb3VudCk7XG4gICAgbGV0IG5vcnRoO1xuICAgIGxldCB3ZXN0O1xuICAgIC8vIFwiQWRkaXRpb25cIiByb3dzLiBJbml0aWFsaXplIG51bGwgY29sdW1uLlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93Q291bnQ7ICsraSkge1xuICAgICAgICBkaXN0YW5jZXNbaV0gPSBuZXcgQXJyYXkoY29sdW1uQ291bnQpO1xuICAgICAgICBkaXN0YW5jZXNbaV1bMF0gPSBpO1xuICAgIH1cbiAgICAvLyBJbml0aWFsaXplIG51bGwgcm93XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2x1bW5Db3VudDsgKytqKSB7XG4gICAgICAgIGRpc3RhbmNlc1swXVtqXSA9IGo7XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAxOyBpIDwgcm93Q291bnQ7ICsraSkge1xuICAgICAgICBmb3IgKGxldCBqID0gMTsgaiA8IGNvbHVtbkNvdW50OyArK2opIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50W2N1cnJlbnRTdGFydCArIGogLSAxXSA9PT0gb2xkW29sZFN0YXJ0ICsgaSAtIDFdKSB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2VzW2ldW2pdID0gZGlzdGFuY2VzW2kgLSAxXVtqIC0gMV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBub3J0aCA9IGRpc3RhbmNlc1tpIC0gMV1bal0gKyAxO1xuICAgICAgICAgICAgICAgIHdlc3QgPSBkaXN0YW5jZXNbaV1baiAtIDFdICsgMTtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZXNbaV1bal0gPSBub3J0aCA8IHdlc3QgPyBub3J0aCA6IHdlc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRpc3RhbmNlcztcbn1cbi8vIFRoaXMgc3RhcnRzIGF0IHRoZSBmaW5hbCB3ZWlnaHQsIGFuZCB3YWxrcyBcImJhY2t3YXJkXCIgYnkgZmluZGluZ1xuLy8gdGhlIG1pbmltdW0gcHJldmlvdXMgd2VpZ2h0IHJlY3Vyc2l2ZWx5IHVudGlsIHRoZSBvcmlnaW4gb2YgdGhlIHdlaWdodFxuLy8gbWF0cml4LlxuZnVuY3Rpb24gc3BsaWNlT3BlcmF0aW9uc0Zyb21FZGl0RGlzdGFuY2VzKGRpc3RhbmNlcykge1xuICAgIGxldCBpID0gZGlzdGFuY2VzLmxlbmd0aCAtIDE7XG4gICAgbGV0IGogPSBkaXN0YW5jZXNbMF0ubGVuZ3RoIC0gMTtcbiAgICBsZXQgY3VycmVudCA9IGRpc3RhbmNlc1tpXVtqXTtcbiAgICBjb25zdCBlZGl0cyA9IFtdO1xuICAgIHdoaWxlIChpID4gMCB8fCBqID4gMCkge1xuICAgICAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgICAgICAgZWRpdHMucHVzaChFRElUX0FERCk7XG4gICAgICAgICAgICBqLS07XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaiA9PT0gMCkge1xuICAgICAgICAgICAgZWRpdHMucHVzaChFRElUX0RFTEVURSk7XG4gICAgICAgICAgICBpLS07XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBub3J0aFdlc3QgPSBkaXN0YW5jZXNbaSAtIDFdW2ogLSAxXTtcbiAgICAgICAgY29uc3Qgd2VzdCA9IGRpc3RhbmNlc1tpIC0gMV1bal07XG4gICAgICAgIGNvbnN0IG5vcnRoID0gZGlzdGFuY2VzW2ldW2ogLSAxXTtcbiAgICAgICAgbGV0IG1pbjtcbiAgICAgICAgaWYgKHdlc3QgPCBub3J0aCkge1xuICAgICAgICAgICAgbWluID0gd2VzdCA8IG5vcnRoV2VzdCA/IHdlc3QgOiBub3J0aFdlc3Q7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtaW4gPSBub3J0aCA8IG5vcnRoV2VzdCA/IG5vcnRoIDogbm9ydGhXZXN0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChtaW4gPT09IG5vcnRoV2VzdCkge1xuICAgICAgICAgICAgaWYgKG5vcnRoV2VzdCA9PT0gY3VycmVudCkge1xuICAgICAgICAgICAgICAgIGVkaXRzLnB1c2goRURJVF9MRUFWRSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBlZGl0cy5wdXNoKEVESVRfVVBEQVRFKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gbm9ydGhXZXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgai0tO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG1pbiA9PT0gd2VzdCkge1xuICAgICAgICAgICAgZWRpdHMucHVzaChFRElUX0RFTEVURSk7XG4gICAgICAgICAgICBpLS07XG4gICAgICAgICAgICBjdXJyZW50ID0gd2VzdDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVkaXRzLnB1c2goRURJVF9BREQpO1xuICAgICAgICAgICAgai0tO1xuICAgICAgICAgICAgY3VycmVudCA9IG5vcnRoO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVkaXRzLnJldmVyc2UoKTtcbiAgICByZXR1cm4gZWRpdHM7XG59XG5mdW5jdGlvbiBzaGFyZWRQcmVmaXgoY3VycmVudCwgb2xkLCBzZWFyY2hMZW5ndGgpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlYXJjaExlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmIChjdXJyZW50W2ldICE9PSBvbGRbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBzZWFyY2hMZW5ndGg7XG59XG5mdW5jdGlvbiBzaGFyZWRTdWZmaXgoY3VycmVudCwgb2xkLCBzZWFyY2hMZW5ndGgpIHtcbiAgICBsZXQgaW5kZXgxID0gY3VycmVudC5sZW5ndGg7XG4gICAgbGV0IGluZGV4MiA9IG9sZC5sZW5ndGg7XG4gICAgbGV0IGNvdW50ID0gMDtcbiAgICB3aGlsZSAoY291bnQgPCBzZWFyY2hMZW5ndGggJiYgY3VycmVudFstLWluZGV4MV0gPT09IG9sZFstLWluZGV4Ml0pIHtcbiAgICAgICAgY291bnQrKztcbiAgICB9XG4gICAgcmV0dXJuIGNvdW50O1xufVxuZnVuY3Rpb24gaW50ZXJzZWN0KHN0YXJ0MSwgZW5kMSwgc3RhcnQyLCBlbmQyKSB7XG4gICAgLy8gRGlzam9pbnRcbiAgICBpZiAoZW5kMSA8IHN0YXJ0MiB8fCBlbmQyIDwgc3RhcnQxKSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gICAgLy8gQWRqYWNlbnRcbiAgICBpZiAoZW5kMSA9PT0gc3RhcnQyIHx8IGVuZDIgPT09IHN0YXJ0MSkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgLy8gTm9uLXplcm8gaW50ZXJzZWN0LCBzcGFuMSBmaXJzdFxuICAgIGlmIChzdGFydDEgPCBzdGFydDIpIHtcbiAgICAgICAgaWYgKGVuZDEgPCBlbmQyKSB7XG4gICAgICAgICAgICByZXR1cm4gZW5kMSAtIHN0YXJ0MjsgLy8gT3ZlcmxhcFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbmQyIC0gc3RhcnQyOyAvLyBDb250YWluZWRcbiAgICB9XG4gICAgLy8gTm9uLXplcm8gaW50ZXJzZWN0LCBzcGFuMiBmaXJzdFxuICAgIGlmIChlbmQyIDwgZW5kMSkge1xuICAgICAgICByZXR1cm4gZW5kMiAtIHN0YXJ0MTsgLy8gT3ZlcmxhcFxuICAgIH1cbiAgICByZXR1cm4gZW5kMSAtIHN0YXJ0MTsgLy8gQ29udGFpbmVkXG59XG4vKipcbiAqIFNwbGljZSBQcm9qZWN0aW9uIGZ1bmN0aW9uczpcbiAqXG4gKiBBIHNwbGljZSBtYXAgaXMgYSByZXByZXNlbnRhdGlvbiBvZiBob3cgYSBwcmV2aW91cyBhcnJheSBvZiBpdGVtc1xuICogd2FzIHRyYW5zZm9ybWVkIGludG8gYSBuZXcgYXJyYXkgb2YgaXRlbXMuIENvbmNlcHR1YWxseSBpdCBpcyBhIGxpc3Qgb2ZcbiAqIHR1cGxlcyBvZlxuICpcbiAqICAgPGluZGV4LCByZW1vdmVkLCBhZGRlZENvdW50PlxuICpcbiAqIHdoaWNoIGFyZSBrZXB0IGluIGFzY2VuZGluZyBpbmRleCBvcmRlciBvZi4gVGhlIHR1cGxlIHJlcHJlc2VudHMgdGhhdCBhdFxuICogdGhlIHxpbmRleHwsIHxyZW1vdmVkfCBzZXF1ZW5jZSBvZiBpdGVtcyB3ZXJlIHJlbW92ZWQsIGFuZCBjb3VudGluZyBmb3J3YXJkXG4gKiBmcm9tIHxpbmRleHwsIHxhZGRlZENvdW50fCBpdGVtcyB3ZXJlIGFkZGVkLlxuICovXG4vKipcbiAqIEBpbnRlcm5hbFxuICogQHJlbWFya3NcbiAqIExhY2tpbmcgaW5kaXZpZHVhbCBzcGxpY2UgbXV0YXRpb24gaW5mb3JtYXRpb24sIHRoZSBtaW5pbWFsIHNldCBvZlxuICogc3BsaWNlcyBjYW4gYmUgc3ludGhlc2l6ZWQgZ2l2ZW4gdGhlIHByZXZpb3VzIHN0YXRlIGFuZCBmaW5hbCBzdGF0ZSBvZiBhblxuICogYXJyYXkuIFRoZSBiYXNpYyBhcHByb2FjaCBpcyB0byBjYWxjdWxhdGUgdGhlIGVkaXQgZGlzdGFuY2UgbWF0cml4IGFuZFxuICogY2hvb3NlIHRoZSBzaG9ydGVzdCBwYXRoIHRocm91Z2ggaXQuXG4gKlxuICogQ29tcGxleGl0eTogTyhsICogcClcbiAqICAgbDogVGhlIGxlbmd0aCBvZiB0aGUgY3VycmVudCBhcnJheVxuICogICBwOiBUaGUgbGVuZ3RoIG9mIHRoZSBvbGQgYXJyYXlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhbGNTcGxpY2VzKGN1cnJlbnQsIGN1cnJlbnRTdGFydCwgY3VycmVudEVuZCwgb2xkLCBvbGRTdGFydCwgb2xkRW5kKSB7XG4gICAgbGV0IHByZWZpeENvdW50ID0gMDtcbiAgICBsZXQgc3VmZml4Q291bnQgPSAwO1xuICAgIGNvbnN0IG1pbkxlbmd0aCA9IE1hdGgubWluKGN1cnJlbnRFbmQgLSBjdXJyZW50U3RhcnQsIG9sZEVuZCAtIG9sZFN0YXJ0KTtcbiAgICBpZiAoY3VycmVudFN0YXJ0ID09PSAwICYmIG9sZFN0YXJ0ID09PSAwKSB7XG4gICAgICAgIHByZWZpeENvdW50ID0gc2hhcmVkUHJlZml4KGN1cnJlbnQsIG9sZCwgbWluTGVuZ3RoKTtcbiAgICB9XG4gICAgaWYgKGN1cnJlbnRFbmQgPT09IGN1cnJlbnQubGVuZ3RoICYmIG9sZEVuZCA9PT0gb2xkLmxlbmd0aCkge1xuICAgICAgICBzdWZmaXhDb3VudCA9IHNoYXJlZFN1ZmZpeChjdXJyZW50LCBvbGQsIG1pbkxlbmd0aCAtIHByZWZpeENvdW50KTtcbiAgICB9XG4gICAgY3VycmVudFN0YXJ0ICs9IHByZWZpeENvdW50O1xuICAgIG9sZFN0YXJ0ICs9IHByZWZpeENvdW50O1xuICAgIGN1cnJlbnRFbmQgLT0gc3VmZml4Q291bnQ7XG4gICAgb2xkRW5kIC09IHN1ZmZpeENvdW50O1xuICAgIGlmIChjdXJyZW50RW5kIC0gY3VycmVudFN0YXJ0ID09PSAwICYmIG9sZEVuZCAtIG9sZFN0YXJ0ID09PSAwKSB7XG4gICAgICAgIHJldHVybiBlbXB0eUFycmF5O1xuICAgIH1cbiAgICBpZiAoY3VycmVudFN0YXJ0ID09PSBjdXJyZW50RW5kKSB7XG4gICAgICAgIGNvbnN0IHNwbGljZSA9IG5ld1NwbGljZShjdXJyZW50U3RhcnQsIFtdLCAwKTtcbiAgICAgICAgd2hpbGUgKG9sZFN0YXJ0IDwgb2xkRW5kKSB7XG4gICAgICAgICAgICBzcGxpY2UucmVtb3ZlZC5wdXNoKG9sZFtvbGRTdGFydCsrXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtzcGxpY2VdO1xuICAgIH1cbiAgICBlbHNlIGlmIChvbGRTdGFydCA9PT0gb2xkRW5kKSB7XG4gICAgICAgIHJldHVybiBbbmV3U3BsaWNlKGN1cnJlbnRTdGFydCwgW10sIGN1cnJlbnRFbmQgLSBjdXJyZW50U3RhcnQpXTtcbiAgICB9XG4gICAgY29uc3Qgb3BzID0gc3BsaWNlT3BlcmF0aW9uc0Zyb21FZGl0RGlzdGFuY2VzKGNhbGNFZGl0RGlzdGFuY2VzKGN1cnJlbnQsIGN1cnJlbnRTdGFydCwgY3VycmVudEVuZCwgb2xkLCBvbGRTdGFydCwgb2xkRW5kKSk7XG4gICAgY29uc3Qgc3BsaWNlcyA9IFtdO1xuICAgIGxldCBzcGxpY2UgPSB2b2lkIDA7XG4gICAgbGV0IGluZGV4ID0gY3VycmVudFN0YXJ0O1xuICAgIGxldCBvbGRJbmRleCA9IG9sZFN0YXJ0O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3BzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN3aXRjaCAob3BzW2ldKSB7XG4gICAgICAgICAgICBjYXNlIEVESVRfTEVBVkU6XG4gICAgICAgICAgICAgICAgaWYgKHNwbGljZSAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNwbGljZXMucHVzaChzcGxpY2UpO1xuICAgICAgICAgICAgICAgICAgICBzcGxpY2UgPSB2b2lkIDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgb2xkSW5kZXgrKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRURJVF9VUERBVEU6XG4gICAgICAgICAgICAgICAgaWYgKHNwbGljZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNwbGljZSA9IG5ld1NwbGljZShpbmRleCwgW10sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzcGxpY2UuYWRkZWRDb3VudCsrO1xuICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgc3BsaWNlLnJlbW92ZWQucHVzaChvbGRbb2xkSW5kZXhdKTtcbiAgICAgICAgICAgICAgICBvbGRJbmRleCsrO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBFRElUX0FERDpcbiAgICAgICAgICAgICAgICBpZiAoc3BsaWNlID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICAgICAgc3BsaWNlID0gbmV3U3BsaWNlKGluZGV4LCBbXSwgMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNwbGljZS5hZGRlZENvdW50Kys7XG4gICAgICAgICAgICAgICAgaW5kZXgrKztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgRURJVF9ERUxFVEU6XG4gICAgICAgICAgICAgICAgaWYgKHNwbGljZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHNwbGljZSA9IG5ld1NwbGljZShpbmRleCwgW10sIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzcGxpY2UucmVtb3ZlZC5wdXNoKG9sZFtvbGRJbmRleF0pO1xuICAgICAgICAgICAgICAgIG9sZEluZGV4Kys7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAvLyBubyBkZWZhdWx0XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNwbGljZSAhPT0gdm9pZCAwKSB7XG4gICAgICAgIHNwbGljZXMucHVzaChzcGxpY2UpO1xuICAgIH1cbiAgICByZXR1cm4gc3BsaWNlcztcbn1cbmNvbnN0ICRwdXNoID0gQXJyYXkucHJvdG90eXBlLnB1c2g7XG5mdW5jdGlvbiBtZXJnZVNwbGljZShzcGxpY2VzLCBpbmRleCwgcmVtb3ZlZCwgYWRkZWRDb3VudCkge1xuICAgIGNvbnN0IHNwbGljZSA9IG5ld1NwbGljZShpbmRleCwgcmVtb3ZlZCwgYWRkZWRDb3VudCk7XG4gICAgbGV0IGluc2VydGVkID0gZmFsc2U7XG4gICAgbGV0IGluc2VydGlvbk9mZnNldCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcGxpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnQgPSBzcGxpY2VzW2ldO1xuICAgICAgICBjdXJyZW50LmluZGV4ICs9IGluc2VydGlvbk9mZnNldDtcbiAgICAgICAgaWYgKGluc2VydGVkKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBpbnRlcnNlY3RDb3VudCA9IGludGVyc2VjdChzcGxpY2UuaW5kZXgsIHNwbGljZS5pbmRleCArIHNwbGljZS5yZW1vdmVkLmxlbmd0aCwgY3VycmVudC5pbmRleCwgY3VycmVudC5pbmRleCArIGN1cnJlbnQuYWRkZWRDb3VudCk7XG4gICAgICAgIGlmIChpbnRlcnNlY3RDb3VudCA+PSAwKSB7XG4gICAgICAgICAgICAvLyBNZXJnZSB0aGUgdHdvIHNwbGljZXNcbiAgICAgICAgICAgIHNwbGljZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgaW5zZXJ0aW9uT2Zmc2V0IC09IGN1cnJlbnQuYWRkZWRDb3VudCAtIGN1cnJlbnQucmVtb3ZlZC5sZW5ndGg7XG4gICAgICAgICAgICBzcGxpY2UuYWRkZWRDb3VudCArPSBjdXJyZW50LmFkZGVkQ291bnQgLSBpbnRlcnNlY3RDb3VudDtcbiAgICAgICAgICAgIGNvbnN0IGRlbGV0ZUNvdW50ID0gc3BsaWNlLnJlbW92ZWQubGVuZ3RoICsgY3VycmVudC5yZW1vdmVkLmxlbmd0aCAtIGludGVyc2VjdENvdW50O1xuICAgICAgICAgICAgaWYgKCFzcGxpY2UuYWRkZWRDb3VudCAmJiAhZGVsZXRlQ291bnQpIHtcbiAgICAgICAgICAgICAgICAvLyBtZXJnZWQgc3BsaWNlIGlzIGEgbm9vcC4gZGlzY2FyZC5cbiAgICAgICAgICAgICAgICBpbnNlcnRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgY3VycmVudFJlbW92ZWQgPSBjdXJyZW50LnJlbW92ZWQ7XG4gICAgICAgICAgICAgICAgaWYgKHNwbGljZS5pbmRleCA8IGN1cnJlbnQuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc29tZSBwcmVmaXggb2Ygc3BsaWNlLnJlbW92ZWQgaXMgcHJlcGVuZGVkIHRvIGN1cnJlbnQucmVtb3ZlZC5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcHJlcGVuZCA9IHNwbGljZS5yZW1vdmVkLnNsaWNlKDAsIGN1cnJlbnQuaW5kZXggLSBzcGxpY2UuaW5kZXgpO1xuICAgICAgICAgICAgICAgICAgICAkcHVzaC5hcHBseShwcmVwZW5kLCBjdXJyZW50UmVtb3ZlZCk7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRSZW1vdmVkID0gcHJlcGVuZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHNwbGljZS5pbmRleCArIHNwbGljZS5yZW1vdmVkLmxlbmd0aCA+XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQuaW5kZXggKyBjdXJyZW50LmFkZGVkQ291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gc29tZSBzdWZmaXggb2Ygc3BsaWNlLnJlbW92ZWQgaXMgYXBwZW5kZWQgdG8gY3VycmVudC5yZW1vdmVkLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBhcHBlbmQgPSBzcGxpY2UucmVtb3ZlZC5zbGljZShjdXJyZW50LmluZGV4ICsgY3VycmVudC5hZGRlZENvdW50IC0gc3BsaWNlLmluZGV4KTtcbiAgICAgICAgICAgICAgICAgICAgJHB1c2guYXBwbHkoY3VycmVudFJlbW92ZWQsIGFwcGVuZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNwbGljZS5yZW1vdmVkID0gY3VycmVudFJlbW92ZWQ7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJlbnQuaW5kZXggPCBzcGxpY2UuaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgc3BsaWNlLmluZGV4ID0gY3VycmVudC5pbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc3BsaWNlLmluZGV4IDwgY3VycmVudC5pbmRleCkge1xuICAgICAgICAgICAgLy8gSW5zZXJ0IHNwbGljZSBoZXJlLlxuICAgICAgICAgICAgaW5zZXJ0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgc3BsaWNlcy5zcGxpY2UoaSwgMCwgc3BsaWNlKTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIGNvbnN0IG9mZnNldCA9IHNwbGljZS5hZGRlZENvdW50IC0gc3BsaWNlLnJlbW92ZWQubGVuZ3RoO1xuICAgICAgICAgICAgY3VycmVudC5pbmRleCArPSBvZmZzZXQ7XG4gICAgICAgICAgICBpbnNlcnRpb25PZmZzZXQgKz0gb2Zmc2V0O1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghaW5zZXJ0ZWQpIHtcbiAgICAgICAgc3BsaWNlcy5wdXNoKHNwbGljZSk7XG4gICAgfVxufVxuZnVuY3Rpb24gY3JlYXRlSW5pdGlhbFNwbGljZXMoY2hhbmdlUmVjb3Jkcykge1xuICAgIGNvbnN0IHNwbGljZXMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBjaGFuZ2VSZWNvcmRzLmxlbmd0aDsgaSA8IGlpOyBpKyspIHtcbiAgICAgICAgY29uc3QgcmVjb3JkID0gY2hhbmdlUmVjb3Jkc1tpXTtcbiAgICAgICAgbWVyZ2VTcGxpY2Uoc3BsaWNlcywgcmVjb3JkLmluZGV4LCByZWNvcmQucmVtb3ZlZCwgcmVjb3JkLmFkZGVkQ291bnQpO1xuICAgIH1cbiAgICByZXR1cm4gc3BsaWNlcztcbn1cbi8qKiBAaW50ZXJuYWwgKi9cbmV4cG9ydCBmdW5jdGlvbiBwcm9qZWN0QXJyYXlTcGxpY2VzKGFycmF5LCBjaGFuZ2VSZWNvcmRzKSB7XG4gICAgbGV0IHNwbGljZXMgPSBbXTtcbiAgICBjb25zdCBpbml0aWFsU3BsaWNlcyA9IGNyZWF0ZUluaXRpYWxTcGxpY2VzKGNoYW5nZVJlY29yZHMpO1xuICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGluaXRpYWxTcGxpY2VzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgY29uc3Qgc3BsaWNlID0gaW5pdGlhbFNwbGljZXNbaV07XG4gICAgICAgIGlmIChzcGxpY2UuYWRkZWRDb3VudCA9PT0gMSAmJiBzcGxpY2UucmVtb3ZlZC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIGlmIChzcGxpY2UucmVtb3ZlZFswXSAhPT0gYXJyYXlbc3BsaWNlLmluZGV4XSkge1xuICAgICAgICAgICAgICAgIHNwbGljZXMucHVzaChzcGxpY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgc3BsaWNlcyA9IHNwbGljZXMuY29uY2F0KGNhbGNTcGxpY2VzKGFycmF5LCBzcGxpY2UuaW5kZXgsIHNwbGljZS5pbmRleCArIHNwbGljZS5hZGRlZENvdW50LCBzcGxpY2UucmVtb3ZlZCwgMCwgc3BsaWNlLnJlbW92ZWQubGVuZ3RoKSk7XG4gICAgfVxuICAgIHJldHVybiBzcGxpY2VzO1xufVxuIiwiaW1wb3J0IHsgRE9NIH0gZnJvbSBcIi4uL2RvbVwiO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gXCIuL29ic2VydmFibGVcIjtcbmltcG9ydCB7IFN1YnNjcmliZXJTZXQgfSBmcm9tIFwiLi9ub3RpZmllclwiO1xuaW1wb3J0IHsgY2FsY1NwbGljZXMsIG5ld1NwbGljZSwgcHJvamVjdEFycmF5U3BsaWNlcywgfSBmcm9tIFwiLi9hcnJheS1jaGFuZ2UtcmVjb3Jkc1wiO1xubGV0IGFycmF5T2JzZXJ2YXRpb25FbmFibGVkID0gZmFsc2U7XG5mdW5jdGlvbiBhZGp1c3RJbmRleChjaGFuZ2VSZWNvcmQsIGFycmF5KSB7XG4gICAgbGV0IGluZGV4ID0gY2hhbmdlUmVjb3JkLmluZGV4O1xuICAgIGNvbnN0IGFycmF5TGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICAgIGlmIChpbmRleCA+IGFycmF5TGVuZ3RoKSB7XG4gICAgICAgIGluZGV4ID0gYXJyYXlMZW5ndGggLSBjaGFuZ2VSZWNvcmQuYWRkZWRDb3VudDtcbiAgICB9XG4gICAgZWxzZSBpZiAoaW5kZXggPCAwKSB7XG4gICAgICAgIGluZGV4ID1cbiAgICAgICAgICAgIGFycmF5TGVuZ3RoICsgY2hhbmdlUmVjb3JkLnJlbW92ZWQubGVuZ3RoICsgaW5kZXggLSBjaGFuZ2VSZWNvcmQuYWRkZWRDb3VudDtcbiAgICB9XG4gICAgaWYgKGluZGV4IDwgMCkge1xuICAgICAgICBpbmRleCA9IDA7XG4gICAgfVxuICAgIGNoYW5nZVJlY29yZC5pbmRleCA9IGluZGV4O1xuICAgIHJldHVybiBjaGFuZ2VSZWNvcmQ7XG59XG5jbGFzcyBBcnJheU9ic2VydmVyIGV4dGVuZHMgU3Vic2NyaWJlclNldCB7XG4gICAgY29uc3RydWN0b3Ioc291cmNlKSB7XG4gICAgICAgIHN1cGVyKHNvdXJjZSk7XG4gICAgICAgIHRoaXMub2xkQ29sbGVjdGlvbiA9IHZvaWQgMDtcbiAgICAgICAgdGhpcy5zcGxpY2VzID0gdm9pZCAwO1xuICAgICAgICB0aGlzLm5lZWRzUXVldWUgPSB0cnVlO1xuICAgICAgICB0aGlzLmNhbGwgPSB0aGlzLmZsdXNoO1xuICAgICAgICBzb3VyY2UuJGZhc3RDb250cm9sbGVyID0gdGhpcztcbiAgICB9XG4gICAgYWRkU3BsaWNlKHNwbGljZSkge1xuICAgICAgICBpZiAodGhpcy5zcGxpY2VzID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIHRoaXMuc3BsaWNlcyA9IFtzcGxpY2VdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zcGxpY2VzLnB1c2goc3BsaWNlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5uZWVkc1F1ZXVlKSB7XG4gICAgICAgICAgICB0aGlzLm5lZWRzUXVldWUgPSBmYWxzZTtcbiAgICAgICAgICAgIERPTS5xdWV1ZVVwZGF0ZSh0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXNldChvbGRDb2xsZWN0aW9uKSB7XG4gICAgICAgIHRoaXMub2xkQ29sbGVjdGlvbiA9IG9sZENvbGxlY3Rpb247XG4gICAgICAgIGlmICh0aGlzLm5lZWRzUXVldWUpIHtcbiAgICAgICAgICAgIHRoaXMubmVlZHNRdWV1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgRE9NLnF1ZXVlVXBkYXRlKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZsdXNoKCkge1xuICAgICAgICBjb25zdCBzcGxpY2VzID0gdGhpcy5zcGxpY2VzO1xuICAgICAgICBjb25zdCBvbGRDb2xsZWN0aW9uID0gdGhpcy5vbGRDb2xsZWN0aW9uO1xuICAgICAgICBpZiAoc3BsaWNlcyA9PT0gdm9pZCAwICYmIG9sZENvbGxlY3Rpb24gPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubmVlZHNRdWV1ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuc3BsaWNlcyA9IHZvaWQgMDtcbiAgICAgICAgdGhpcy5vbGRDb2xsZWN0aW9uID0gdm9pZCAwO1xuICAgICAgICBjb25zdCBmaW5hbFNwbGljZXMgPSBvbGRDb2xsZWN0aW9uID09PSB2b2lkIDBcbiAgICAgICAgICAgID8gcHJvamVjdEFycmF5U3BsaWNlcyh0aGlzLnNvdXJjZSwgc3BsaWNlcylcbiAgICAgICAgICAgIDogY2FsY1NwbGljZXModGhpcy5zb3VyY2UsIDAsIHRoaXMuc291cmNlLmxlbmd0aCwgb2xkQ29sbGVjdGlvbiwgMCwgb2xkQ29sbGVjdGlvbi5sZW5ndGgpO1xuICAgICAgICB0aGlzLm5vdGlmeShmaW5hbFNwbGljZXMpO1xuICAgIH1cbn1cbi8qIGVzbGludC1kaXNhYmxlIHByZWZlci1yZXN0LXBhcmFtcyAqL1xuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L2V4cGxpY2l0LWZ1bmN0aW9uLXJldHVybi10eXBlICovXG4vKipcbiAqIEVuYWJsZXMgdGhlIGFycmF5IG9ic2VydmF0aW9uIG1lY2hhbmlzbS5cbiAqIEByZW1hcmtzXG4gKiBBcnJheSBvYnNlcnZhdGlvbiBpcyBlbmFibGVkIGF1dG9tYXRpY2FsbHkgd2hlbiB1c2luZyB0aGVcbiAqIHtAbGluayBSZXBlYXREaXJlY3RpdmV9LCBzbyBjYWxsaW5nIHRoaXMgQVBJIG1hbnVhbGx5IGlzXG4gKiBub3QgdHlwaWNhbGx5IG5lY2Vzc2FyeS5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuYWJsZUFycmF5T2JzZXJ2YXRpb24oKSB7XG4gICAgaWYgKGFycmF5T2JzZXJ2YXRpb25FbmFibGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYXJyYXlPYnNlcnZhdGlvbkVuYWJsZWQgPSB0cnVlO1xuICAgIE9ic2VydmFibGUuc2V0QXJyYXlPYnNlcnZlckZhY3RvcnkoKGNvbGxlY3Rpb24pID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBBcnJheU9ic2VydmVyKGNvbGxlY3Rpb24pO1xuICAgIH0pO1xuICAgIGNvbnN0IGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG4gICAgY29uc3QgcG9wID0gYXJyYXlQcm90by5wb3A7XG4gICAgY29uc3QgcHVzaCA9IGFycmF5UHJvdG8ucHVzaDtcbiAgICBjb25zdCByZXZlcnNlID0gYXJyYXlQcm90by5yZXZlcnNlO1xuICAgIGNvbnN0IHNoaWZ0ID0gYXJyYXlQcm90by5zaGlmdDtcbiAgICBjb25zdCBzb3J0ID0gYXJyYXlQcm90by5zb3J0O1xuICAgIGNvbnN0IHNwbGljZSA9IGFycmF5UHJvdG8uc3BsaWNlO1xuICAgIGNvbnN0IHVuc2hpZnQgPSBhcnJheVByb3RvLnVuc2hpZnQ7XG4gICAgYXJyYXlQcm90by5wb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IG5vdEVtcHR5ID0gdGhpcy5sZW5ndGggPiAwO1xuICAgICAgICBjb25zdCBtZXRob2RDYWxsUmVzdWx0ID0gcG9wLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnN0IG8gPSB0aGlzLiRmYXN0Q29udHJvbGxlcjtcbiAgICAgICAgaWYgKG8gIT09IHZvaWQgMCAmJiBub3RFbXB0eSkge1xuICAgICAgICAgICAgby5hZGRTcGxpY2UobmV3U3BsaWNlKHRoaXMubGVuZ3RoLCBbbWV0aG9kQ2FsbFJlc3VsdF0sIDApKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0aG9kQ2FsbFJlc3VsdDtcbiAgICB9O1xuICAgIGFycmF5UHJvdG8ucHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgbWV0aG9kQ2FsbFJlc3VsdCA9IHB1c2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc3QgbyA9IHRoaXMuJGZhc3RDb250cm9sbGVyO1xuICAgICAgICBpZiAobyAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBvLmFkZFNwbGljZShhZGp1c3RJbmRleChuZXdTcGxpY2UodGhpcy5sZW5ndGggLSBhcmd1bWVudHMubGVuZ3RoLCBbXSwgYXJndW1lbnRzLmxlbmd0aCksIHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0aG9kQ2FsbFJlc3VsdDtcbiAgICB9O1xuICAgIGFycmF5UHJvdG8ucmV2ZXJzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG9sZEFycmF5O1xuICAgICAgICBjb25zdCBvID0gdGhpcy4kZmFzdENvbnRyb2xsZXI7XG4gICAgICAgIGlmIChvICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIG8uZmx1c2goKTtcbiAgICAgICAgICAgIG9sZEFycmF5ID0gdGhpcy5zbGljZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1ldGhvZENhbGxSZXN1bHQgPSByZXZlcnNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGlmIChvICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIG8ucmVzZXQob2xkQXJyYXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXRob2RDYWxsUmVzdWx0O1xuICAgIH07XG4gICAgYXJyYXlQcm90by5zaGlmdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3Qgbm90RW1wdHkgPSB0aGlzLmxlbmd0aCA+IDA7XG4gICAgICAgIGNvbnN0IG1ldGhvZENhbGxSZXN1bHQgPSBzaGlmdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zdCBvID0gdGhpcy4kZmFzdENvbnRyb2xsZXI7XG4gICAgICAgIGlmIChvICE9PSB2b2lkIDAgJiYgbm90RW1wdHkpIHtcbiAgICAgICAgICAgIG8uYWRkU3BsaWNlKG5ld1NwbGljZSgwLCBbbWV0aG9kQ2FsbFJlc3VsdF0sIDApKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWV0aG9kQ2FsbFJlc3VsdDtcbiAgICB9O1xuICAgIGFycmF5UHJvdG8uc29ydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGV0IG9sZEFycmF5O1xuICAgICAgICBjb25zdCBvID0gdGhpcy4kZmFzdENvbnRyb2xsZXI7XG4gICAgICAgIGlmIChvICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIG8uZmx1c2goKTtcbiAgICAgICAgICAgIG9sZEFycmF5ID0gdGhpcy5zbGljZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG1ldGhvZENhbGxSZXN1bHQgPSBzb3J0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGlmIChvICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIG8ucmVzZXQob2xkQXJyYXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXRob2RDYWxsUmVzdWx0O1xuICAgIH07XG4gICAgYXJyYXlQcm90by5zcGxpY2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZENhbGxSZXN1bHQgPSBzcGxpY2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc3QgbyA9IHRoaXMuJGZhc3RDb250cm9sbGVyO1xuICAgICAgICBpZiAobyAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBvLmFkZFNwbGljZShhZGp1c3RJbmRleChuZXdTcGxpY2UoK2FyZ3VtZW50c1swXSwgbWV0aG9kQ2FsbFJlc3VsdCwgYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHMubGVuZ3RoIC0gMiA6IDApLCB0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1ldGhvZENhbGxSZXN1bHQ7XG4gICAgfTtcbiAgICBhcnJheVByb3RvLnVuc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IG1ldGhvZENhbGxSZXN1bHQgPSB1bnNoaWZ0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnN0IG8gPSB0aGlzLiRmYXN0Q29udHJvbGxlcjtcbiAgICAgICAgaWYgKG8gIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgby5hZGRTcGxpY2UoYWRqdXN0SW5kZXgobmV3U3BsaWNlKDAsIFtdLCBhcmd1bWVudHMubGVuZ3RoKSwgdGhpcykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXRob2RDYWxsUmVzdWx0O1xuICAgIH07XG59XG4vKiBlc2xpbnQtZW5hYmxlIHByZWZlci1yZXN0LXBhcmFtcyAqL1xuLyogZXNsaW50LWVuYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvZXhwbGljaXQtZnVuY3Rpb24tcmV0dXJuLXR5cGUgKi9cbiIsImZ1bmN0aW9uIHNwaWxsb3ZlclN1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgY29uc3Qgc3BpbGxvdmVyID0gdGhpcy5zcGlsbG92ZXI7XG4gICAgY29uc3QgaW5kZXggPSBzcGlsbG92ZXIuaW5kZXhPZihzdWJzY3JpYmVyKTtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgIHNwaWxsb3Zlci5wdXNoKHN1YnNjcmliZXIpO1xuICAgIH1cbn1cbmZ1bmN0aW9uIHNwaWxsb3ZlclVuc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICBjb25zdCBzcGlsbG92ZXIgPSB0aGlzLnNwaWxsb3ZlcjtcbiAgICBjb25zdCBpbmRleCA9IHNwaWxsb3Zlci5pbmRleE9mKHN1YnNjcmliZXIpO1xuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgc3BpbGxvdmVyLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxufVxuZnVuY3Rpb24gc3BpbGxvdmVyTm90aWZ5U3Vic2NyaWJlcnMoYXJncykge1xuICAgIGNvbnN0IHNwaWxsb3ZlciA9IHRoaXMuc3BpbGxvdmVyO1xuICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuc291cmNlO1xuICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHNwaWxsb3Zlci5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgICAgIHNwaWxsb3ZlcltpXS5oYW5kbGVDaGFuZ2Uoc291cmNlLCBhcmdzKTtcbiAgICB9XG59XG5mdW5jdGlvbiBzcGlsbG92ZXJIYXMoc3Vic2NyaWJlcikge1xuICAgIHJldHVybiB0aGlzLnNwaWxsb3Zlci5pbmRleE9mKHN1YnNjcmliZXIpICE9PSAtMTtcbn1cbi8qKlxuICogQW4gaW1wbGVtZW50YXRpb24gb2Yge0BsaW5rIE5vdGlmaWVyfSB0aGF0IGVmZmljaWVudGx5IGtlZXBzIHRyYWNrIG9mXG4gKiBzdWJzY3JpYmVycyBpbnRlcmVzdGVkIGluIGEgc3BlY2lmaWMgY2hhbmdlIG5vdGlmaWNhdGlvbiBvbiBhblxuICogb2JzZXJ2YWJsZSBzb3VyY2UuXG4gKlxuICogQHJlbWFya3NcbiAqIFRoaXMgc2V0IGlzIG9wdGltaXplZCBmb3IgdGhlIG1vc3QgY29tbW9uIHNjZW5hcmlvIG9mIDEgb3IgMiBzdWJzY3JpYmVycy5cbiAqIFdpdGggdGhpcyBpbiBtaW5kLCBpdCBjYW4gc3RvcmUgYSBzdWJzY3JpYmVyIGluIGFuIGludGVybmFsIGZpZWxkLCBhbGxvd2luZyBpdCB0byBhdm9pZCBBcnJheSNwdXNoIG9wZXJhdGlvbnMuXG4gKiBJZiB0aGUgc2V0IGV2ZXIgZXhjZWVkcyB0d28gc3Vic2NyaWJlcnMsIGl0IHVwZ3JhZGVzIHRvIGFuIGFycmF5IGF1dG9tYXRpY2FsbHkuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpYmVyU2V0IHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFN1YnNjcmliZXJTZXQgZm9yIHRoZSBzcGVjaWZpZWQgc291cmNlLlxuICAgICAqIEBwYXJhbSBzb3VyY2UgLSBUaGUgb2JqZWN0IHNvdXJjZSB0aGF0IHN1YnNjcmliZXJzIHdpbGwgcmVjZWl2ZSBub3RpZmljYXRpb25zIGZyb20uXG4gICAgICogQHBhcmFtIGluaXRpYWxTdWJzY3JpYmVyIC0gQW4gaW5pdGlhbCBzdWJzY3JpYmVyIHRvIGNoYW5nZXMuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc291cmNlLCBpbml0aWFsU3Vic2NyaWJlcikge1xuICAgICAgICB0aGlzLnN1YjEgPSB2b2lkIDA7XG4gICAgICAgIHRoaXMuc3ViMiA9IHZvaWQgMDtcbiAgICAgICAgdGhpcy5zcGlsbG92ZXIgPSB2b2lkIDA7XG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICB0aGlzLnN1YjEgPSBpbml0aWFsU3Vic2NyaWJlcjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHdoZXRoZXIgdGhlIHByb3ZpZGVkIHN1YnNjcmliZXIgaGFzIGJlZW4gYWRkZWQgdG8gdGhpcyBzZXQuXG4gICAgICogQHBhcmFtIHN1YnNjcmliZXIgLSBUaGUgc3Vic2NyaWJlciB0byB0ZXN0IGZvciBpbmNsdXNpb24gaW4gdGhpcyBzZXQuXG4gICAgICovXG4gICAgaGFzKHN1YnNjcmliZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3ViMSA9PT0gc3Vic2NyaWJlciB8fCB0aGlzLnN1YjIgPT09IHN1YnNjcmliZXI7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN1YnNjcmliZXMgdG8gbm90aWZpY2F0aW9uIG9mIGNoYW5nZXMgaW4gYW4gb2JqZWN0J3Mgc3RhdGUuXG4gICAgICogQHBhcmFtIHN1YnNjcmliZXIgLSBUaGUgb2JqZWN0IHRoYXQgaXMgc3Vic2NyaWJpbmcgZm9yIGNoYW5nZSBub3RpZmljYXRpb24uXG4gICAgICovXG4gICAgc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzKHN1YnNjcmliZXIpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuc3ViMSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICB0aGlzLnN1YjEgPSBzdWJzY3JpYmVyO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnN1YjIgPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgdGhpcy5zdWIyID0gc3Vic2NyaWJlcjtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNwaWxsb3ZlciA9IFt0aGlzLnN1YjEsIHRoaXMuc3ViMiwgc3Vic2NyaWJlcl07XG4gICAgICAgIHRoaXMuc3Vic2NyaWJlID0gc3BpbGxvdmVyU3Vic2NyaWJlO1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlID0gc3BpbGxvdmVyVW5zdWJzY3JpYmU7XG4gICAgICAgIHRoaXMubm90aWZ5ID0gc3BpbGxvdmVyTm90aWZ5U3Vic2NyaWJlcnM7XG4gICAgICAgIHRoaXMuaGFzID0gc3BpbGxvdmVySGFzO1xuICAgICAgICB0aGlzLnN1YjEgPSB2b2lkIDA7XG4gICAgICAgIHRoaXMuc3ViMiA9IHZvaWQgMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogVW5zdWJzY3JpYmVzIGZyb20gbm90aWZpY2F0aW9uIG9mIGNoYW5nZXMgaW4gYW4gb2JqZWN0J3Mgc3RhdGUuXG4gICAgICogQHBhcmFtIHN1YnNjcmliZXIgLSBUaGUgb2JqZWN0IHRoYXQgaXMgdW5zdWJzY3JpYmluZyBmcm9tIGNoYW5nZSBub3RpZmljYXRpb24uXG4gICAgICovXG4gICAgdW5zdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgICAgICBpZiAodGhpcy5zdWIxID09PSBzdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICB0aGlzLnN1YjEgPSB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zdWIyID09PSBzdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICB0aGlzLnN1YjIgPSB2b2lkIDA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogTm90aWZpZXMgYWxsIHN1YnNjcmliZXJzLlxuICAgICAqIEBwYXJhbSBhcmdzIC0gRGF0YSBwYXNzZWQgYWxvbmcgdG8gc3Vic2NyaWJlcnMgZHVyaW5nIG5vdGlmaWNhdGlvbi5cbiAgICAgKi9cbiAgICBub3RpZnkoYXJncykge1xuICAgICAgICBjb25zdCBzdWIxID0gdGhpcy5zdWIxO1xuICAgICAgICBjb25zdCBzdWIyID0gdGhpcy5zdWIyO1xuICAgICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLnNvdXJjZTtcbiAgICAgICAgaWYgKHN1YjEgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgc3ViMS5oYW5kbGVDaGFuZ2Uoc291cmNlLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3ViMiAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBzdWIyLmhhbmRsZUNoYW5nZShzb3VyY2UsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBBbiBpbXBsZW1lbnRhdGlvbiBvZiBOb3RpZmllciB0aGF0IGFsbG93cyBzdWJzY3JpYmVycyB0byBiZSBub3RpZmllZFxuICogb2YgaW5kaXZpZHVhbCBwcm9wZXJ0eSBjaGFuZ2VzIG9uIGFuIG9iamVjdC5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIFByb3BlcnR5Q2hhbmdlTm90aWZpZXIge1xuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYW4gaW5zdGFuY2Ugb2YgUHJvcGVydHlDaGFuZ2VOb3RpZmllciBmb3IgdGhlIHNwZWNpZmllZCBzb3VyY2UuXG4gICAgICogQHBhcmFtIHNvdXJjZSAtIFRoZSBvYmplY3Qgc291cmNlIHRoYXQgc3Vic2NyaWJlcnMgd2lsbCByZWNlaXZlIG5vdGlmaWNhdGlvbnMgZnJvbS5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2UpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVycyA9IHt9O1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogTm90aWZpZXMgYWxsIHN1YnNjcmliZXJzLCBiYXNlZCBvbiB0aGUgc3BlY2lmaWVkIHByb3BlcnR5LlxuICAgICAqIEBwYXJhbSBwcm9wZXJ0eU5hbWUgLSBUaGUgcHJvcGVydHkgbmFtZSwgcGFzc2VkIGFsb25nIHRvIHN1YnNjcmliZXJzIGR1cmluZyBub3RpZmljYXRpb24uXG4gICAgICovXG4gICAgbm90aWZ5KHByb3BlcnR5TmFtZSkge1xuICAgICAgICBjb25zdCBzdWJzY3JpYmVycyA9IHRoaXMuc3Vic2NyaWJlcnNbcHJvcGVydHlOYW1lXTtcbiAgICAgICAgaWYgKHN1YnNjcmliZXJzICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXJzLm5vdGlmeShwcm9wZXJ0eU5hbWUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFN1YnNjcmliZXMgdG8gbm90aWZpY2F0aW9uIG9mIGNoYW5nZXMgaW4gYW4gb2JqZWN0J3Mgc3RhdGUuXG4gICAgICogQHBhcmFtIHN1YnNjcmliZXIgLSBUaGUgb2JqZWN0IHRoYXQgaXMgc3Vic2NyaWJpbmcgZm9yIGNoYW5nZSBub3RpZmljYXRpb24uXG4gICAgICogQHBhcmFtIHByb3BlcnR5VG9XYXRjaCAtIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0aGF0IHRoZSBzdWJzY3JpYmVyIGlzIGludGVyZXN0ZWQgaW4gd2F0Y2hpbmcgZm9yIGNoYW5nZXMuXG4gICAgICovXG4gICAgc3Vic2NyaWJlKHN1YnNjcmliZXIsIHByb3BlcnR5VG9XYXRjaCkge1xuICAgICAgICBsZXQgc3Vic2NyaWJlcnMgPSB0aGlzLnN1YnNjcmliZXJzW3Byb3BlcnR5VG9XYXRjaF07XG4gICAgICAgIGlmIChzdWJzY3JpYmVycyA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZXJzW3Byb3BlcnR5VG9XYXRjaF0gPSBzdWJzY3JpYmVycyA9IG5ldyBTdWJzY3JpYmVyU2V0KHRoaXMuc291cmNlKTtcbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpYmVycy5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFVuc3Vic2NyaWJlcyBmcm9tIG5vdGlmaWNhdGlvbiBvZiBjaGFuZ2VzIGluIGFuIG9iamVjdCdzIHN0YXRlLlxuICAgICAqIEBwYXJhbSBzdWJzY3JpYmVyIC0gVGhlIG9iamVjdCB0aGF0IGlzIHVuc3Vic2NyaWJpbmcgZnJvbSBjaGFuZ2Ugbm90aWZpY2F0aW9uLlxuICAgICAqIEBwYXJhbSBwcm9wZXJ0eVRvVW53YXRjaCAtIFRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSB0aGF0IHRoZSBzdWJzY3JpYmVyIGlzIG5vIGxvbmdlciBpbnRlcmVzdGVkIGluIHdhdGNoaW5nLlxuICAgICAqL1xuICAgIHVuc3Vic2NyaWJlKHN1YnNjcmliZXIsIHByb3BlcnR5VG9VbndhdGNoKSB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZXJzID0gdGhpcy5zdWJzY3JpYmVyc1twcm9wZXJ0eVRvVW53YXRjaF07XG4gICAgICAgIGlmIChzdWJzY3JpYmVycyA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3Vic2NyaWJlcnMudW5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgRE9NIH0gZnJvbSBcIi4uL2RvbVwiO1xuaW1wb3J0IHsgUHJvcGVydHlDaGFuZ2VOb3RpZmllciwgU3Vic2NyaWJlclNldCB9IGZyb20gXCIuL25vdGlmaWVyXCI7XG5jb25zdCB2b2xhdGlsZVJlZ2V4ID0gLyhcXDp8XFwmXFwmfFxcfFxcfHxpZikvO1xuY29uc3Qgbm90aWZpZXJMb29rdXAgPSBuZXcgV2Vha01hcCgpO1xuY29uc3QgYWNjZXNzb3JMb29rdXAgPSBuZXcgV2Vha01hcCgpO1xubGV0IHdhdGNoZXIgPSB2b2lkIDA7XG5sZXQgY3JlYXRlQXJyYXlPYnNlcnZlciA9IChhcnJheSkgPT4ge1xuICAgIHRocm93IG5ldyBFcnJvcihcIk11c3QgY2FsbCBlbmFibGVBcnJheU9ic2VydmF0aW9uIGJlZm9yZSBvYnNlcnZpbmcgYXJyYXlzLlwiKTtcbn07XG5jbGFzcyBEZWZhdWx0T2JzZXJ2YWJsZUFjY2Vzc29yIHtcbiAgICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuZmllbGQgPSBgXyR7bmFtZX1gO1xuICAgICAgICB0aGlzLmNhbGxiYWNrID0gYCR7bmFtZX1DaGFuZ2VkYDtcbiAgICB9XG4gICAgZ2V0VmFsdWUoc291cmNlKSB7XG4gICAgICAgIGlmICh3YXRjaGVyICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgIHdhdGNoZXIud2F0Y2goc291cmNlLCB0aGlzLm5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzb3VyY2VbdGhpcy5maWVsZF07XG4gICAgfVxuICAgIHNldFZhbHVlKHNvdXJjZSwgbmV3VmFsdWUpIHtcbiAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkO1xuICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHNvdXJjZVtmaWVsZF07XG4gICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gbmV3VmFsdWUpIHtcbiAgICAgICAgICAgIHNvdXJjZVtmaWVsZF0gPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IGNhbGxiYWNrID0gc291cmNlW3RoaXMuY2FsbGJhY2tdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2suY2FsbChzb3VyY2UsIG9sZFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVzZS1iZWZvcmUtZGVmaW5lICovXG4gICAgICAgICAgICBnZXROb3RpZmllcihzb3VyY2UpLm5vdGlmeSh0aGlzLm5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBDb21tb24gT2JzZXJ2YWJsZSBBUElzLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgT2JzZXJ2YWJsZSA9IE9iamVjdC5mcmVlemUoe1xuICAgIC8qKlxuICAgICAqIEBpbnRlcm5hbFxuICAgICAqIEBwYXJhbSBmYWN0b3J5IC0gVGhlIGZhY3RvcnkgdXNlZCB0byBjcmVhdGUgYXJyYXkgb2JzZXJ2ZXJzLlxuICAgICAqL1xuICAgIHNldEFycmF5T2JzZXJ2ZXJGYWN0b3J5KGZhY3RvcnkpIHtcbiAgICAgICAgY3JlYXRlQXJyYXlPYnNlcnZlciA9IGZhY3Rvcnk7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBHZXRzIGEgbm90aWZpZXIgZm9yIGFuIG9iamVjdCBvciBBcnJheS5cbiAgICAgKiBAcGFyYW0gc291cmNlIC0gVGhlIG9iamVjdCBvciBBcnJheSB0byBnZXQgdGhlIG5vdGlmaWVyIGZvci5cbiAgICAgKi9cbiAgICBnZXROb3RpZmllcihzb3VyY2UpIHtcbiAgICAgICAgbGV0IGZvdW5kID0gc291cmNlLiRmYXN0Q29udHJvbGxlciB8fCBub3RpZmllckxvb2t1cC5nZXQoc291cmNlKTtcbiAgICAgICAgaWYgKGZvdW5kID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IGNyZWF0ZUFycmF5T2JzZXJ2ZXIoc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vdGlmaWVyTG9va3VwLnNldChzb3VyY2UsIChmb3VuZCA9IG5ldyBQcm9wZXJ0eUNoYW5nZU5vdGlmaWVyKHNvdXJjZSkpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgfSxcbiAgICAvKipcbiAgICAgKiBSZWNvcmRzIGEgcHJvcGVydHkgY2hhbmdlIGZvciBhIHNvdXJjZSBvYmplY3QuXG4gICAgICogQHBhcmFtIHNvdXJjZSAtIFRoZSBvYmplY3QgdG8gcmVjb3JkIHRoZSBjaGFuZ2UgYWdhaW5zdC5cbiAgICAgKiBAcGFyYW0gcHJvcGVydHlOYW1lIC0gVGhlIHByb3BlcnR5IHRvIHRyYWNrIGFzIGNoYW5nZWQuXG4gICAgICovXG4gICAgdHJhY2soc291cmNlLCBwcm9wZXJ0eU5hbWUpIHtcbiAgICAgICAgaWYgKHdhdGNoZXIgIT09IHZvaWQgMCkge1xuICAgICAgICAgICAgd2F0Y2hlci53YXRjaChzb3VyY2UsIHByb3BlcnR5TmFtZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE5vdGlmaWVzIHdhdGNoZXJzIHRoYXQgdGhlIGN1cnJlbnRseSBleGVjdXRpbmcgcHJvcGVydHkgZ2V0dGVyIG9yIGZ1bmN0aW9uIGlzIHZvbGF0aWxlXG4gICAgICogd2l0aCByZXNwZWN0IHRvIGl0cyBvYnNlcnZhYmxlIGRlcGVuZGVuY2llcy5cbiAgICAgKi9cbiAgICB0cmFja1ZvbGF0aWxlKCkge1xuICAgICAgICBpZiAod2F0Y2hlciAhPT0gdm9pZCAwKSB7XG4gICAgICAgICAgICB3YXRjaGVyLm5lZWRzUmVmcmVzaCA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8qKlxuICAgICAqIE5vdGlmaWVzIHN1YnNjcmliZXJzIG9mIGEgc291cmNlIG9iamVjdCBvZiBjaGFuZ2VzLlxuICAgICAqIEBwYXJhbSBzb3VyY2UgLSB0aGUgb2JqZWN0IHRvIG5vdGlmeSBvZiBjaGFuZ2VzLlxuICAgICAqIEBwYXJhbSBhcmdzIC0gVGhlIGNoYW5nZSBhcmdzIHRvIHBhc3MgdG8gc3Vic2NyaWJlcnMuXG4gICAgICovXG4gICAgbm90aWZ5KHNvdXJjZSwgYXJncykge1xuICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVzZS1iZWZvcmUtZGVmaW5lICovXG4gICAgICAgIGdldE5vdGlmaWVyKHNvdXJjZSkubm90aWZ5KGFyZ3MpO1xuICAgIH0sXG4gICAgLyoqXG4gICAgICogRGVmaW5lcyBhbiBvYnNlcnZhYmxlIHByb3BlcnR5IG9uIGFuIG9iamVjdCBvciBwcm90b3R5cGUuXG4gICAgICogQHBhcmFtIHRhcmdldCAtIFRoZSB0YXJnZXQgb2JqZWN0IHRvIGRlZmluZSB0aGUgb2JzZXJ2YWJsZSBvbi5cbiAgICAgKiBAcGFyYW0gbmFtZU9yQWNjZXNzb3IgLSBUaGUgbmFtZSBvZiB0aGUgcHJvcGVydHkgdG8gZGVmaW5lIGFzIG9ic2VydmFibGU7XG4gICAgICogb3IgYSBjdXN0b20gYWNjZXNzb3IgdGhhdCBzcGVjaWZpZXMgdGhlIHByb3BlcnR5IG5hbWUgYW5kIGFjY2Vzc29yIGltcGxlbWVudGF0aW9uLlxuICAgICAqL1xuICAgIGRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZU9yQWNjZXNzb3IpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBuYW1lT3JBY2Nlc3NvciA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgbmFtZU9yQWNjZXNzb3IgPSBuZXcgRGVmYXVsdE9ic2VydmFibGVBY2Nlc3NvcihuYW1lT3JBY2Nlc3Nvcik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXRBY2Nlc3NvcnModGFyZ2V0KS5wdXNoKG5hbWVPckFjY2Vzc29yKTtcbiAgICAgICAgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIG5hbWVPckFjY2Vzc29yLm5hbWUsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmFtZU9yQWNjZXNzb3IuZ2V0VmFsdWUodGhpcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICBuYW1lT3JBY2Nlc3Nvci5zZXRWYWx1ZSh0aGlzLCBuZXdWYWx1ZSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIEZpbmRzIGFsbCB0aGUgb2JzZXJ2YWJsZSBhY2Nlc3NvcnMgZGVmaW5lZCBvbiB0aGUgdGFyZ2V0LFxuICAgICAqIGluY2x1ZGluZyBpdHMgcHJvdG90eXBlIGNoYWluLlxuICAgICAqIEBwYXJhbSB0YXJnZXQgLSBUaGUgdGFyZ2V0IG9iamVjdCB0byBzZWFyY2ggZm9yIGFjY2Vzc29yIG9uLlxuICAgICAqL1xuICAgIGdldEFjY2Vzc29ycyh0YXJnZXQpIHtcbiAgICAgICAgbGV0IGFjY2Vzc29ycyA9IGFjY2Vzc29yTG9va3VwLmdldCh0YXJnZXQpO1xuICAgICAgICBpZiAoYWNjZXNzb3JzID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50VGFyZ2V0ID0gUmVmbGVjdC5nZXRQcm90b3R5cGVPZih0YXJnZXQpO1xuICAgICAgICAgICAgd2hpbGUgKGFjY2Vzc29ycyA9PT0gdm9pZCAwICYmIGN1cnJlbnRUYXJnZXQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NvcnMgPSBhY2Nlc3Nvckxvb2t1cC5nZXQoY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICAgICAgY3VycmVudFRhcmdldCA9IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YoY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYWNjZXNzb3JzID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBhY2Nlc3NvcnMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFjY2Vzc29ycyA9IGFjY2Vzc29ycy5zbGljZSgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGFjY2Vzc29yTG9va3VwLnNldCh0YXJnZXQsIGFjY2Vzc29ycyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFjY2Vzc29ycztcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSB7QGxpbmsgQmluZGluZ09ic2VydmVyfSB0aGF0IGNhbiB3YXRjaCB0aGVcbiAgICAgKiBwcm92aWRlZCB7QGxpbmsgQmluZGluZ30gZm9yIGNoYW5nZXMuXG4gICAgICogQHBhcmFtIGJpbmRpbmcgLSBUaGUgYmluZGluZyB0byBvYnNlcnZlLlxuICAgICAqIEBwYXJhbSBpbml0aWFsU3Vic2NyaWJlciAtIEFuIGluaXRpYWwgc3Vic2NyaWJlciB0byBjaGFuZ2VzIGluIHRoZSBiaW5kaW5nIHZhbHVlLlxuICAgICAqIEBwYXJhbSBpc1ZvbGF0aWxlQmluZGluZyAtIEluZGljYXRlcyB3aGV0aGVyIHRoZSBiaW5kaW5nJ3MgZGVwZW5kZW5jeSBsaXN0IG11c3QgYmUgcmUtZXZhbHVhdGVkIG9uIGV2ZXJ5IHZhbHVlIGV2YWx1YXRpb24uXG4gICAgICovXG4gICAgYmluZGluZyhiaW5kaW5nLCBpbml0aWFsU3Vic2NyaWJlciwgaXNWb2xhdGlsZUJpbmRpbmcgPSB0aGlzLmlzVm9sYXRpbGVCaW5kaW5nKGJpbmRpbmcpKSB7XG4gICAgICAgIHJldHVybiBuZXcgQmluZGluZ09ic2VydmVySW1wbGVtZW50YXRpb24oYmluZGluZywgaW5pdGlhbFN1YnNjcmliZXIsIGlzVm9sYXRpbGVCaW5kaW5nKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIERldGVybWluZXMgd2hldGhlciBhIGJpbmRpbmcgZXhwcmVzc2lvbiBpcyB2b2xhdGlsZSBhbmQgbmVlZHMgdG8gaGF2ZSBpdHMgZGVwZW5kZW5jeSBsaXN0IHJlLWV2YWx1YXRlZFxuICAgICAqIG9uIGV2ZXJ5IGV2YWx1YXRpb24gb2YgdGhlIHZhbHVlLlxuICAgICAqIEBwYXJhbSBiaW5kaW5nIC0gVGhlIGJpbmRpbmcgdG8gaW5zcGVjdC5cbiAgICAgKi9cbiAgICBpc1ZvbGF0aWxlQmluZGluZyhiaW5kaW5nKSB7XG4gICAgICAgIHJldHVybiB2b2xhdGlsZVJlZ2V4LnRlc3QoYmluZGluZy50b1N0cmluZygpKTtcbiAgICB9LFxufSk7XG5jb25zdCBnZXROb3RpZmllciA9IE9ic2VydmFibGUuZ2V0Tm90aWZpZXI7XG5jb25zdCB0cmFja1ZvbGF0aWxlID0gT2JzZXJ2YWJsZS50cmFja1ZvbGF0aWxlO1xuY29uc3QgcXVldWVVcGRhdGUgPSBET00ucXVldWVVcGRhdGU7XG4vKipcbiAqIERlY29yYXRvcjogRGVmaW5lcyBhbiBvYnNlcnZhYmxlIHByb3BlcnR5IG9uIHRoZSB0YXJnZXQuXG4gKiBAcGFyYW0gdGFyZ2V0IC0gVGhlIHRhcmdldCB0byBkZWZpbmUgdGhlIG9ic2VydmFibGUgb24uXG4gKiBAcGFyYW0gbmFtZU9yQWNjZXNzb3IgLSBUaGUgcHJvcGVydHkgbmFtZSBvciBhY2Nlc3NvciB0byBkZWZpbmUgdGhlIG9ic2VydmFibGUgYXMuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZhYmxlKHRhcmdldCwgbmFtZU9yQWNjZXNzb3IpIHtcbiAgICBPYnNlcnZhYmxlLmRlZmluZVByb3BlcnR5KHRhcmdldCwgbmFtZU9yQWNjZXNzb3IpO1xufVxuLyoqXG4gKiBEZWNvcmF0b3I6IE1hcmtzIGEgcHJvcGVydHkgZ2V0dGVyIGFzIGhhdmluZyB2b2xhdGlsZSBvYnNlcnZhYmxlIGRlcGVuZGVuY2llcy5cbiAqIEBwYXJhbSB0YXJnZXQgLSBUaGUgdGFyZ2V0IHRoYXQgdGhlIHByb3BlcnR5IGlzIGRlZmluZWQgb24uXG4gKiBAcGFyYW0gbmFtZSAtIFRoZSBwcm9wZXJ0eSBuYW1lLlxuICogQHBhcmFtIG5hbWUgLSBUaGUgZXhpc3RpbmcgZGVzY3JpcHRvci5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHZvbGF0aWxlKHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcikge1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBkZXNjcmlwdG9yLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdHJhY2tWb2xhdGlsZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGRlc2NyaXB0b3IuZ2V0LmFwcGx5KHRoaXMpO1xuICAgICAgICB9LFxuICAgIH0pO1xufVxubGV0IGN1cnJlbnRFdmVudCA9IG51bGw7XG4vKipcbiAqIEBwYXJhbSBldmVudCAtIFRoZSBldmVudCB0byBzZXQgYXMgY3VycmVudCBmb3IgdGhlIGNvbnRleHQuXG4gKiBAaW50ZXJuYWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNldEN1cnJlbnRFdmVudChldmVudCkge1xuICAgIGN1cnJlbnRFdmVudCA9IGV2ZW50O1xufVxuLyoqXG4gKiBQcm92aWRlcyBhZGRpdGlvbmFsIGNvbnRleHR1YWwgaW5mb3JtYXRpb24gYXZhaWxhYmxlIHRvIGJlaGF2aW9ycyBhbmQgZXhwcmVzc2lvbnMuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBFeGVjdXRpb25Db250ZXh0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBpbmRleCBvZiB0aGUgY3VycmVudCBpdGVtIHdpdGhpbiBhIHJlcGVhdCBjb250ZXh0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5pbmRleCA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgbGVuZ3RoIG9mIHRoZSBjdXJyZW50IGNvbGxlY3Rpb24gd2l0aGluIGEgcmVwZWF0IGNvbnRleHQuXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgcGFyZW50IGRhdGEgb2JqZWN0IHdpdGhpbiBhIHJlcGVhdCBjb250ZXh0LlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wYXJlbnQgPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogVGhlIHBhcmVudCBleGVjdXRpb24gY29udGV4dCB3aGVuIGluIG5lc3RlZCBjb250ZXh0IHNjZW5hcmlvcy5cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucGFyZW50Q29udGV4dCA9IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRoZSBjdXJyZW50IGV2ZW50IHdpdGhpbiBhbiBldmVudCBoYW5kbGVyLlxuICAgICAqL1xuICAgIGdldCBldmVudCgpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRFdmVudDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGN1cnJlbnQgaXRlbSB3aXRoaW4gYSByZXBlYXQgY29udGV4dFxuICAgICAqIGhhcyBhbiBldmVuIGluZGV4LlxuICAgICAqL1xuICAgIGdldCBpc0V2ZW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluZGV4ICUgMiA9PT0gMDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGN1cnJlbnQgaXRlbSB3aXRoaW4gYSByZXBlYXQgY29udGV4dFxuICAgICAqIGhhcyBhbiBvZGQgaW5kZXguXG4gICAgICovXG4gICAgZ2V0IGlzT2RkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleCAlIDIgIT09IDA7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjdXJyZW50IGl0ZW0gd2l0aGluIGEgcmVwZWF0IGNvbnRleHRcbiAgICAgKiBpcyB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICBnZXQgaXNGaXJzdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5kZXggPT09IDA7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjdXJyZW50IGl0ZW0gd2l0aGluIGEgcmVwZWF0IGNvbnRleHRcbiAgICAgKiBpcyBzb21ld2hlcmUgaW4gdGhlIG1pZGRsZSBvZiB0aGUgY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICBnZXQgaXNJbk1pZGRsZSgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmlzRmlyc3QgJiYgIXRoaXMuaXNMYXN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgY3VycmVudCBpdGVtIHdpdGhpbiBhIHJlcGVhdCBjb250ZXh0XG4gICAgICogaXMgdGhlIGxhc3QgaXRlbSBpbiB0aGUgY29sbGVjdGlvbi5cbiAgICAgKi9cbiAgICBnZXQgaXNMYXN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pbmRleCA9PT0gdGhpcy5sZW5ndGggLSAxO1xuICAgIH1cbn1cbk9ic2VydmFibGUuZGVmaW5lUHJvcGVydHkoRXhlY3V0aW9uQ29udGV4dC5wcm90b3R5cGUsIFwiaW5kZXhcIik7XG5PYnNlcnZhYmxlLmRlZmluZVByb3BlcnR5KEV4ZWN1dGlvbkNvbnRleHQucHJvdG90eXBlLCBcImxlbmd0aFwiKTtcbi8qKlxuICogVGhlIGRlZmF1bHQgZXhlY3V0aW9uIGNvbnRleHQgdXNlZCBpbiBiaW5kaW5nIGV4cHJlc3Npb25zLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgZGVmYXVsdEV4ZWN1dGlvbkNvbnRleHQgPSBPYmplY3Quc2VhbChuZXcgRXhlY3V0aW9uQ29udGV4dCgpKTtcbmNsYXNzIEJpbmRpbmdPYnNlcnZlckltcGxlbWVudGF0aW9uIGV4dGVuZHMgU3Vic2NyaWJlclNldCB7XG4gICAgY29uc3RydWN0b3IoYmluZGluZywgaW5pdGlhbFN1YnNjcmliZXIsIGlzVm9sYXRpbGVCaW5kaW5nID0gZmFsc2UpIHtcbiAgICAgICAgc3VwZXIoYmluZGluZywgaW5pdGlhbFN1YnNjcmliZXIpO1xuICAgICAgICB0aGlzLmJpbmRpbmcgPSBiaW5kaW5nO1xuICAgICAgICB0aGlzLmlzVm9sYXRpbGVCaW5kaW5nID0gaXNWb2xhdGlsZUJpbmRpbmc7XG4gICAgICAgIHRoaXMubmVlZHNSZWZyZXNoID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5uZWVkc1F1ZXVlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5maXJzdCA9IHRoaXM7XG4gICAgICAgIHRoaXMubGFzdCA9IG51bGw7XG4gICAgICAgIHRoaXMucHJvcGVydHlTb3VyY2UgPSB2b2lkIDA7XG4gICAgICAgIHRoaXMucHJvcGVydHlOYW1lID0gdm9pZCAwO1xuICAgICAgICB0aGlzLm5vdGlmaWVyID0gdm9pZCAwO1xuICAgICAgICB0aGlzLm5leHQgPSB2b2lkIDA7XG4gICAgfVxuICAgIG9ic2VydmUoc291cmNlLCBjb250ZXh0KSB7XG4gICAgICAgIGlmICh0aGlzLm5lZWRzUmVmcmVzaCAmJiB0aGlzLmxhc3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZGlzY29ubmVjdCgpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHByZXZpb3VzV2F0Y2hlciA9IHdhdGNoZXI7XG4gICAgICAgIHdhdGNoZXIgPSB0aGlzLm5lZWRzUmVmcmVzaCA/IHRoaXMgOiB2b2lkIDA7XG4gICAgICAgIHRoaXMubmVlZHNSZWZyZXNoID0gdGhpcy5pc1ZvbGF0aWxlQmluZGluZztcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5iaW5kaW5nKHNvdXJjZSwgY29udGV4dCk7XG4gICAgICAgIHdhdGNoZXIgPSBwcmV2aW91c1dhdGNoZXI7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIGRpc2Nvbm5lY3QoKSB7XG4gICAgICAgIGlmICh0aGlzLmxhc3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGxldCBjdXJyZW50ID0gdGhpcy5maXJzdDtcbiAgICAgICAgICAgIHdoaWxlIChjdXJyZW50ICE9PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50Lm5vdGlmaWVyLnVuc3Vic2NyaWJlKHRoaXMsIGN1cnJlbnQucHJvcGVydHlOYW1lKTtcbiAgICAgICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5sYXN0ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMubmVlZHNSZWZyZXNoID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgd2F0Y2gocHJvcGVydHlTb3VyY2UsIHByb3BlcnR5TmFtZSkge1xuICAgICAgICBjb25zdCBwcmV2ID0gdGhpcy5sYXN0O1xuICAgICAgICBjb25zdCBub3RpZmllciA9IGdldE5vdGlmaWVyKHByb3BlcnR5U291cmNlKTtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHByZXYgPT09IG51bGwgPyB0aGlzLmZpcnN0IDoge307XG4gICAgICAgIGN1cnJlbnQucHJvcGVydHlTb3VyY2UgPSBwcm9wZXJ0eVNvdXJjZTtcbiAgICAgICAgY3VycmVudC5wcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWU7XG4gICAgICAgIGN1cnJlbnQubm90aWZpZXIgPSBub3RpZmllcjtcbiAgICAgICAgbm90aWZpZXIuc3Vic2NyaWJlKHRoaXMsIHByb3BlcnR5TmFtZSk7XG4gICAgICAgIGlmIChwcmV2ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMubmVlZHNSZWZyZXNoKSB7XG4gICAgICAgICAgICAgICAgd2F0Y2hlciA9IHZvaWQgMDtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmV2VmFsdWUgPSBwcmV2LnByb3BlcnR5U291cmNlW3ByZXYucHJvcGVydHlOYW1lXTtcbiAgICAgICAgICAgICAgICB3YXRjaGVyID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlTb3VyY2UgPT09IHByZXZWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5lZWRzUmVmcmVzaCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcHJldi5uZXh0ID0gY3VycmVudDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxhc3QgPSBjdXJyZW50O1xuICAgIH1cbiAgICAvKiogQGludGVybmFsICovXG4gICAgaGFuZGxlQ2hhbmdlKCkge1xuICAgICAgICBpZiAodGhpcy5uZWVkc1F1ZXVlKSB7XG4gICAgICAgICAgICB0aGlzLm5lZWRzUXVldWUgPSBmYWxzZTtcbiAgICAgICAgICAgIHF1ZXVlVXBkYXRlKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKiBAaW50ZXJuYWwgKi9cbiAgICBjYWxsKCkge1xuICAgICAgICBpZiAodGhpcy5sYXN0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLm5lZWRzUXVldWUgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5ub3RpZnkodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCIvKipcbiAqIEEgcmVmZXJlbmNlIHRvIGdsb2JhbFRoaXMsIHdpdGggc3VwcG9ydFxuICogZm9yIGJyb3dzZXJzIHRoYXQgZG9uJ3QgeWV0IHN1cHBvcnQgdGhlIHNwZWMuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCAkZ2xvYmFsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodHlwZW9mIGdsb2JhbFRoaXMgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gV2UncmUgcnVubmluZyBpbiBhIG1vZGVybiBlbnZpcm9ubWVudC5cbiAgICAgICAgcmV0dXJuIGdsb2JhbFRoaXM7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIC8vIFdlJ3JlIHJ1bm5pbmcgaW4gTm9kZUpTXG4gICAgICAgIHJldHVybiBnbG9iYWw7XG4gICAgfVxuICAgIGlmICh0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAvLyBXZSdyZSBydW5uaW5nIGluIGEgd29ya2VyLlxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gV2UncmUgcnVubmluZyBpbiB0aGUgYnJvd3NlcidzIG1haW4gdGhyZWFkLlxuICAgICAgICByZXR1cm4gd2luZG93O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyBIb3BlZnVsbHkgd2UgbmV2ZXIgZ2V0IGhlcmUuLi5cbiAgICAgICAgLy8gTm90IGFsbCBlbnZpcm9ubWVudHMgYWxsb3cgZXZhbCBhbmQgRnVuY3Rpb24uIFVzZSBvbmx5IGFzIGEgbGFzdCByZXNvcnQ6XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcbiAgICB9XG4gICAgY2F0Y2ggKF9hKSB7XG4gICAgICAgIC8vIElmIGFsbCBmYWlscywgZ2l2ZSB1cCBhbmQgY3JlYXRlIGFuIG9iamVjdC5cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9jb25zaXN0ZW50LXR5cGUtYXNzZXJ0aW9uc1xuICAgICAgICByZXR1cm4ge307XG4gICAgfVxufSkoKTtcbi8vIEFQSS1vbmx5IFBvbHlmaWxsIGZvciB0cnVzdGVkVHlwZXNcbmlmICgkZ2xvYmFsLnRydXN0ZWRUeXBlcyA9PT0gdm9pZCAwKSB7XG4gICAgJGdsb2JhbC50cnVzdGVkVHlwZXMgPSB7IGNyZWF0ZVBvbGljeTogKG4sIHIpID0+IHIgfTtcbn1cbiIsImltcG9ydCB7IERPTSB9IGZyb20gXCIuL2RvbVwiO1xuY29uc3Qgc3R5bGVMb29rdXAgPSBuZXcgTWFwKCk7XG4vKipcbiAqIFJlcHJlc2VudHMgc3R5bGVzIHRoYXQgY2FuIGJlIGFwcGxpZWQgdG8gYSBjdXN0b20gZWxlbWVudC5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIEVsZW1lbnRTdHlsZXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAvKiogQGludGVybmFsICovXG4gICAgICAgIHRoaXMuYmVoYXZpb3JzID0gbnVsbDtcbiAgICAgICAgLyogZXNsaW50LWVuYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvZXhwbGljaXQtZnVuY3Rpb24tcmV0dXJuLXR5cGUgKi9cbiAgICB9XG4gICAgLyoqXG4gICAgICogQXNzb2NpYXRlcyBiZWhhdmlvcnMgd2l0aCB0aGlzIHNldCBvZiBzdHlsZXMuXG4gICAgICogQHBhcmFtIGJlaGF2aW9ycyAtIFRoZSBiZWhhdmlvcnMgdG8gYXNzb2NpYXRlLlxuICAgICAqL1xuICAgIHdpdGhCZWhhdmlvcnMoLi4uYmVoYXZpb3JzKSB7XG4gICAgICAgIHRoaXMuYmVoYXZpb3JzID1cbiAgICAgICAgICAgIHRoaXMuYmVoYXZpb3JzID09PSBudWxsID8gYmVoYXZpb3JzIDogdGhpcy5iZWhhdmlvcnMuY29uY2F0KGJlaGF2aW9ycyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBZGRzIHRoZXNlIHN0eWxlcyB0byBhIGdsb2JhbCBjYWNoZSBmb3IgZWFzeSBsb29rdXAgYnkgYSBrbm93biBrZXkuXG4gICAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgdG8gdXNlIGZvciBsb29rdXAgYW5kIHJldHJpZXZhbCBpbiB0aGUgY2FjaGUuXG4gICAgICovXG4gICAgd2l0aEtleShrZXkpIHtcbiAgICAgICAgc3R5bGVMb29rdXAuc2V0KGtleSwgdGhpcyk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBdHRlbXB0cyB0byBmaW5kIGNhY2hlZCBzdHlsZXMgYnkgYSBrbm93biBrZXkuXG4gICAgICogQHBhcmFtIGtleSAtIFRoZSBrZXkgdG8gc2VhcmNoIHRoZSBzdHlsZSBjYWNoZSBmb3IuXG4gICAgICovXG4gICAgc3RhdGljIGZpbmQoa2V5KSB7XG4gICAgICAgIHJldHVybiBzdHlsZUxvb2t1cC5nZXQoa2V5KSB8fCBudWxsO1xuICAgIH1cbn1cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9leHBsaWNpdC1mdW5jdGlvbi1yZXR1cm4tdHlwZSAqL1xuLyoqXG4gKiBDcmVhdGUgRWxlbWVudFN0eWxlcyBmcm9tIENvbXBvc2FibGVTdHlsZXMuXG4gKi9cbkVsZW1lbnRTdHlsZXMuY3JlYXRlID0gKCgpID0+IHtcbiAgICBpZiAoRE9NLnN1cHBvcnRzQWRvcHRlZFN0eWxlU2hlZXRzKSB7XG4gICAgICAgIGNvbnN0IHN0eWxlU2hlZXRDYWNoZSA9IG5ldyBNYXAoKTtcbiAgICAgICAgcmV0dXJuIChzdHlsZXMpID0+IG5ldyBBZG9wdGVkU3R5bGVTaGVldHNTdHlsZXMoc3R5bGVzLCBzdHlsZVNoZWV0Q2FjaGUpO1xuICAgIH1cbiAgICByZXR1cm4gKHN0eWxlcykgPT4gbmV3IFN0eWxlRWxlbWVudFN0eWxlcyhzdHlsZXMpO1xufSkoKTtcbmZ1bmN0aW9uIHJlZHVjZVN0eWxlcyhzdHlsZXMpIHtcbiAgICByZXR1cm4gc3R5bGVzXG4gICAgICAgIC5tYXAoKHgpID0+IHggaW5zdGFuY2VvZiBFbGVtZW50U3R5bGVzID8gcmVkdWNlU3R5bGVzKHguc3R5bGVzKSA6IFt4XSlcbiAgICAgICAgLnJlZHVjZSgocHJldiwgY3VycikgPT4gcHJldi5jb25jYXQoY3VyciksIFtdKTtcbn1cbmZ1bmN0aW9uIHJlZHVjZUJlaGF2aW9ycyhzdHlsZXMpIHtcbiAgICByZXR1cm4gc3R5bGVzXG4gICAgICAgIC5tYXAoKHgpID0+ICh4IGluc3RhbmNlb2YgRWxlbWVudFN0eWxlcyA/IHguYmVoYXZpb3JzIDogbnVsbCkpXG4gICAgICAgIC5yZWR1Y2UoKHByZXYsIGN1cnIpID0+IHtcbiAgICAgICAgaWYgKGN1cnIgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICB9XG4gICAgICAgIGlmIChwcmV2ID09PSBudWxsKSB7XG4gICAgICAgICAgICBwcmV2ID0gW107XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHByZXYuY29uY2F0KGN1cnIpO1xuICAgIH0sIG51bGwpO1xufVxuLyoqXG4gKiBodHRwczovL3dpY2cuZ2l0aHViLmlvL2NvbnN0cnVjdC1zdHlsZXNoZWV0cy9cbiAqIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL3dlYi91cGRhdGVzLzIwMTkvMDIvY29uc3RydWN0YWJsZS1zdHlsZXNoZWV0c1xuICpcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY2xhc3MgQWRvcHRlZFN0eWxlU2hlZXRzU3R5bGVzIGV4dGVuZHMgRWxlbWVudFN0eWxlcyB7XG4gICAgY29uc3RydWN0b3Ioc3R5bGVzLCBzdHlsZVNoZWV0Q2FjaGUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zdHlsZXMgPSBzdHlsZXM7XG4gICAgICAgIHRoaXMuYmVoYXZpb3JzID0gbnVsbDtcbiAgICAgICAgdGhpcy5iZWhhdmlvcnMgPSByZWR1Y2VCZWhhdmlvcnMoc3R5bGVzKTtcbiAgICAgICAgdGhpcy5zdHlsZVNoZWV0cyA9IHJlZHVjZVN0eWxlcyhzdHlsZXMpLm1hcCgoeCkgPT4ge1xuICAgICAgICAgICAgaWYgKHggaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgc2hlZXQgPSBzdHlsZVNoZWV0Q2FjaGUuZ2V0KHgpO1xuICAgICAgICAgICAgaWYgKHNoZWV0ID09PSB2b2lkIDApIHtcbiAgICAgICAgICAgICAgICBzaGVldCA9IG5ldyBDU1NTdHlsZVNoZWV0KCk7XG4gICAgICAgICAgICAgICAgc2hlZXQucmVwbGFjZVN5bmMoeCk7XG4gICAgICAgICAgICAgICAgc3R5bGVTaGVldENhY2hlLnNldCh4LCBzaGVldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2hlZXQ7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZGRTdHlsZXNUbyh0YXJnZXQpIHtcbiAgICAgICAgdGFyZ2V0LmFkb3B0ZWRTdHlsZVNoZWV0cyA9IFsuLi50YXJnZXQuYWRvcHRlZFN0eWxlU2hlZXRzLCAuLi50aGlzLnN0eWxlU2hlZXRzXTtcbiAgICB9XG4gICAgcmVtb3ZlU3R5bGVzRnJvbSh0YXJnZXQpIHtcbiAgICAgICAgY29uc3Qgc291cmNlU2hlZXRzID0gdGhpcy5zdHlsZVNoZWV0cztcbiAgICAgICAgdGFyZ2V0LmFkb3B0ZWRTdHlsZVNoZWV0cyA9IHRhcmdldC5hZG9wdGVkU3R5bGVTaGVldHMuZmlsdGVyKCh4KSA9PiBzb3VyY2VTaGVldHMuaW5kZXhPZih4KSA9PT0gLTEpO1xuICAgIH1cbn1cbmxldCBzdHlsZUNsYXNzSWQgPSAwO1xuZnVuY3Rpb24gZ2V0TmV4dFN0eWxlQ2xhc3MoKSB7XG4gICAgcmV0dXJuIGBmYXN0LXN0eWxlLWNsYXNzLSR7KytzdHlsZUNsYXNzSWR9YDtcbn1cbi8qKlxuICogQGludGVybmFsXG4gKi9cbmV4cG9ydCBjbGFzcyBTdHlsZUVsZW1lbnRTdHlsZXMgZXh0ZW5kcyBFbGVtZW50U3R5bGVzIHtcbiAgICBjb25zdHJ1Y3RvcihzdHlsZXMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zdHlsZXMgPSBzdHlsZXM7XG4gICAgICAgIHRoaXMuYmVoYXZpb3JzID0gbnVsbDtcbiAgICAgICAgdGhpcy5iZWhhdmlvcnMgPSByZWR1Y2VCZWhhdmlvcnMoc3R5bGVzKTtcbiAgICAgICAgdGhpcy5zdHlsZVNoZWV0cyA9IHJlZHVjZVN0eWxlcyhzdHlsZXMpO1xuICAgICAgICB0aGlzLnN0eWxlQ2xhc3MgPSBnZXROZXh0U3R5bGVDbGFzcygpO1xuICAgIH1cbiAgICBhZGRTdHlsZXNUbyh0YXJnZXQpIHtcbiAgICAgICAgY29uc3Qgc3R5bGVTaGVldHMgPSB0aGlzLnN0eWxlU2hlZXRzO1xuICAgICAgICBjb25zdCBzdHlsZUNsYXNzID0gdGhpcy5zdHlsZUNsYXNzO1xuICAgICAgICBpZiAodGFyZ2V0ID09PSBkb2N1bWVudCkge1xuICAgICAgICAgICAgdGFyZ2V0ID0gZG9jdW1lbnQuYm9keTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gc3R5bGVTaGVldHMubGVuZ3RoIC0gMTsgaSA+IC0xOyAtLWkpIHtcbiAgICAgICAgICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHN0eWxlU2hlZXRzW2ldO1xuICAgICAgICAgICAgZWxlbWVudC5jbGFzc05hbWUgPSBzdHlsZUNsYXNzO1xuICAgICAgICAgICAgdGFyZ2V0LnByZXBlbmQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVtb3ZlU3R5bGVzRnJvbSh0YXJnZXQpIHtcbiAgICAgICAgaWYgKHRhcmdldCA9PT0gZG9jdW1lbnQpIHtcbiAgICAgICAgICAgIHRhcmdldCA9IGRvY3VtZW50LmJvZHk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3R5bGVzID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3RoaXMuc3R5bGVDbGFzc31gKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gc3R5bGVzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgICAgIHRhcmdldC5yZW1vdmVDaGlsZChzdHlsZXNbaV0pO1xuICAgICAgICB9XG4gICAgfVxufVxuLyoqXG4gKiBUcmFuc2Zvcm1zIGEgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgaW50byBzdHlsZXMuXG4gKiBAcGFyYW0gc3RyaW5ncyAtIFRoZSBzdHJpbmcgZnJhZ21lbnRzIHRoYXQgYXJlIGludGVycG9sYXRlZCB3aXRoIHRoZSB2YWx1ZXMuXG4gKiBAcGFyYW0gdmFsdWVzIC0gVGhlIHZhbHVlcyB0aGF0IGFyZSBpbnRlcnBvbGF0ZWQgd2l0aCB0aGUgc3RyaW5nIGZyYWdtZW50cy5cbiAqIEByZW1hcmtzXG4gKiBUaGUgY3NzIGhlbHBlciBzdXBwb3J0cyBpbnRlcnBvbGF0aW9uIG9mIHN0cmluZ3MgYW5kIEVsZW1lbnRTdHlsZSBpbnN0YW5jZXMuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjc3Moc3RyaW5ncywgLi4udmFsdWVzKSB7XG4gICAgY29uc3Qgc3R5bGVzID0gW107XG4gICAgbGV0IGNzc1N0cmluZyA9IFwiXCI7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlpID0gc3RyaW5ncy5sZW5ndGggLSAxOyBpIDwgaWk7ICsraSkge1xuICAgICAgICBjc3NTdHJpbmcgKz0gc3RyaW5nc1tpXTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB2YWx1ZXNbaV07XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEVsZW1lbnRTdHlsZXMgfHwgdmFsdWUgaW5zdGFuY2VvZiBDU1NTdHlsZVNoZWV0KSB7XG4gICAgICAgICAgICBpZiAoY3NzU3RyaW5nLnRyaW0oKSAhPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIHN0eWxlcy5wdXNoKGNzc1N0cmluZyk7XG4gICAgICAgICAgICAgICAgY3NzU3RyaW5nID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0eWxlcy5wdXNoKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNzc1N0cmluZyArPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjc3NTdHJpbmcgKz0gc3RyaW5nc1tzdHJpbmdzLmxlbmd0aCAtIDFdO1xuICAgIGlmIChjc3NTdHJpbmcudHJpbSgpICE9PSBcIlwiKSB7XG4gICAgICAgIHN0eWxlcy5wdXNoKGNzc1N0cmluZyk7XG4gICAgfVxuICAgIHJldHVybiBFbGVtZW50U3R5bGVzLmNyZWF0ZShzdHlsZXMpO1xufVxuIiwiaW1wb3J0IHsgRE9NLCBfaW50ZXJwb2xhdGlvbkVuZCwgX2ludGVycG9sYXRpb25TdGFydCB9IGZyb20gXCIuL2RvbVwiO1xuaW1wb3J0IHsgQmluZGluZ0RpcmVjdGl2ZSB9IGZyb20gXCIuL2RpcmVjdGl2ZXMvYmluZGluZ1wiO1xuY2xhc3MgQ29tcGlsYXRpb25Db250ZXh0IHtcbiAgICBhZGRGYWN0b3J5KGZhY3RvcnkpIHtcbiAgICAgICAgZmFjdG9yeS50YXJnZXRJbmRleCA9IHRoaXMudGFyZ2V0SW5kZXg7XG4gICAgICAgIHRoaXMuYmVoYXZpb3JGYWN0b3JpZXMucHVzaChmYWN0b3J5KTtcbiAgICB9XG4gICAgY2FwdHVyZUNvbnRlbnRCaW5kaW5nKGRpcmVjdGl2ZSkge1xuICAgICAgICBkaXJlY3RpdmUudGFyZ2V0QXRDb250ZW50KCk7XG4gICAgICAgIHRoaXMuYWRkRmFjdG9yeShkaXJlY3RpdmUpO1xuICAgIH1cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5iZWhhdmlvckZhY3RvcmllcyA9IFtdO1xuICAgICAgICB0aGlzLnRhcmdldEluZGV4ID0gLTE7XG4gICAgfVxuICAgIHJlbGVhc2UoKSB7XG4gICAgICAgIHNoYXJlZENvbnRleHQgPSB0aGlzO1xuICAgIH1cbiAgICBzdGF0aWMgYm9ycm93KGRpcmVjdGl2ZXMpIHtcbiAgICAgICAgY29uc3Qgc2hhcmVhYmxlID0gc2hhcmVkQ29udGV4dCB8fCBuZXcgQ29tcGlsYXRpb25Db250ZXh0KCk7XG4gICAgICAgIHNoYXJlYWJsZS5kaXJlY3RpdmVzID0gZGlyZWN0aXZlcztcbiAgICAgICAgc2hhcmVhYmxlLnJlc2V0KCk7XG4gICAgICAgIHNoYXJlZENvbnRleHQgPSBudWxsO1xuICAgICAgICByZXR1cm4gc2hhcmVhYmxlO1xuICAgIH1cbn1cbmxldCBzaGFyZWRDb250ZXh0ID0gbnVsbDtcbmZ1bmN0aW9uIGNyZWF0ZUFnZ3JlZ2F0ZUJpbmRpbmcocGFydHMpIHtcbiAgICBpZiAocGFydHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBwYXJ0c1swXTtcbiAgICB9XG4gICAgbGV0IHRhcmdldE5hbWU7XG4gICAgY29uc3QgcGFydENvdW50ID0gcGFydHMubGVuZ3RoO1xuICAgIGNvbnN0IGZpbmFsUGFydHMgPSBwYXJ0cy5tYXAoKHgpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiB4ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4geDtcbiAgICAgICAgfVxuICAgICAgICB0YXJnZXROYW1lID0geC50YXJnZXROYW1lIHx8IHRhcmdldE5hbWU7XG4gICAgICAgIHJldHVybiB4LmJpbmRpbmc7XG4gICAgfSk7XG4gICAgY29uc3QgYmluZGluZyA9IChzY29wZSwgY29udGV4dCkgPT4ge1xuICAgICAgICBsZXQgb3V0cHV0ID0gXCJcIjtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXJ0Q291bnQ7ICsraSkge1xuICAgICAgICAgICAgb3V0cHV0ICs9IGZpbmFsUGFydHNbaV0oc2NvcGUsIGNvbnRleHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgfTtcbiAgICBjb25zdCBkaXJlY3RpdmUgPSBuZXcgQmluZGluZ0RpcmVjdGl2ZShiaW5kaW5nKTtcbiAgICBkaXJlY3RpdmUudGFyZ2V0TmFtZSA9IHRhcmdldE5hbWU7XG4gICAgcmV0dXJuIGRpcmVjdGl2ZTtcbn1cbmNvbnN0IGludGVycG9sYXRpb25FbmRMZW5ndGggPSBfaW50ZXJwb2xhdGlvbkVuZC5sZW5ndGg7XG5mdW5jdGlvbiBwYXJzZUNvbnRlbnQoY29udGV4dCwgdmFsdWUpIHtcbiAgICBjb25zdCB2YWx1ZVBhcnRzID0gdmFsdWUuc3BsaXQoX2ludGVycG9sYXRpb25TdGFydCk7XG4gICAgaWYgKHZhbHVlUGFydHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBiaW5kaW5nUGFydHMgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMCwgaWkgPSB2YWx1ZVBhcnRzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgY29uc3QgY3VycmVudCA9IHZhbHVlUGFydHNbaV07XG4gICAgICAgIGNvbnN0IGluZGV4ID0gY3VycmVudC5pbmRleE9mKF9pbnRlcnBvbGF0aW9uRW5kKTtcbiAgICAgICAgbGV0IGxpdGVyYWw7XG4gICAgICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICAgIGxpdGVyYWwgPSBjdXJyZW50O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZGlyZWN0aXZlSW5kZXggPSBwYXJzZUludChjdXJyZW50LnN1YnN0cmluZygwLCBpbmRleCkpO1xuICAgICAgICAgICAgYmluZGluZ1BhcnRzLnB1c2goY29udGV4dC5kaXJlY3RpdmVzW2RpcmVjdGl2ZUluZGV4XSk7XG4gICAgICAgICAgICBsaXRlcmFsID0gY3VycmVudC5zdWJzdHJpbmcoaW5kZXggKyBpbnRlcnBvbGF0aW9uRW5kTGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobGl0ZXJhbCAhPT0gXCJcIikge1xuICAgICAgICAgICAgYmluZGluZ1BhcnRzLnB1c2gobGl0ZXJhbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGJpbmRpbmdQYXJ0cztcbn1cbmZ1bmN0aW9uIGNvbXBpbGVBdHRyaWJ1dGVzKGNvbnRleHQsIG5vZGUsIGluY2x1ZGVCYXNpY1ZhbHVlcyA9IGZhbHNlKSB7XG4gICAgY29uc3QgYXR0cmlidXRlcyA9IG5vZGUuYXR0cmlidXRlcztcbiAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBhdHRyaWJ1dGVzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgY29uc3QgYXR0ciA9IGF0dHJpYnV0ZXNbaV07XG4gICAgICAgIGNvbnN0IGF0dHJWYWx1ZSA9IGF0dHIudmFsdWU7XG4gICAgICAgIGNvbnN0IHBhcnNlUmVzdWx0ID0gcGFyc2VDb250ZW50KGNvbnRleHQsIGF0dHJWYWx1ZSk7XG4gICAgICAgIGxldCByZXN1bHQgPSBudWxsO1xuICAgICAgICBpZiAocGFyc2VSZXN1bHQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGlmIChpbmNsdWRlQmFzaWNWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBuZXcgQmluZGluZ0RpcmVjdGl2ZSgoKSA9PiBhdHRyVmFsdWUpO1xuICAgICAgICAgICAgICAgIHJlc3VsdC50YXJnZXROYW1lID0gYXR0ci5uYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0ID0gY3JlYXRlQWdncmVnYXRlQmluZGluZyhwYXJzZVJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgbm9kZS5yZW1vdmVBdHRyaWJ1dGVOb2RlKGF0dHIpO1xuICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgaWktLTtcbiAgICAgICAgICAgIGNvbnRleHQuYWRkRmFjdG9yeShyZXN1bHQpO1xuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gY29tcGlsZUNvbnRlbnQoY29udGV4dCwgbm9kZSwgd2Fsa2VyKSB7XG4gICAgY29uc3QgcGFyc2VSZXN1bHQgPSBwYXJzZUNvbnRlbnQoY29udGV4dCwgbm9kZS50ZXh0Q29udGVudCk7XG4gICAgaWYgKHBhcnNlUmVzdWx0ICE9PSBudWxsKSB7XG4gICAgICAgIGxldCBsYXN0Tm9kZSA9IG5vZGU7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHBhcnNlUmVzdWx0Lmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRQYXJ0ID0gcGFyc2VSZXN1bHRbaV07XG4gICAgICAgICAgICBjb25zdCBjdXJyZW50Tm9kZSA9IGkgPT09IDBcbiAgICAgICAgICAgICAgICA/IG5vZGVcbiAgICAgICAgICAgICAgICA6IGxhc3ROb2RlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpLCBsYXN0Tm9kZS5uZXh0U2libGluZyk7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGN1cnJlbnRQYXJ0ID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudE5vZGUudGV4dENvbnRlbnQgPSBjdXJyZW50UGFydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGN1cnJlbnROb2RlLnRleHRDb250ZW50ID0gXCIgXCI7XG4gICAgICAgICAgICAgICAgY29udGV4dC5jYXB0dXJlQ29udGVudEJpbmRpbmcoY3VycmVudFBhcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGFzdE5vZGUgPSBjdXJyZW50Tm9kZTtcbiAgICAgICAgICAgIGNvbnRleHQudGFyZ2V0SW5kZXgrKztcbiAgICAgICAgICAgIGlmIChjdXJyZW50Tm9kZSAhPT0gbm9kZSkge1xuICAgICAgICAgICAgICAgIHdhbGtlci5uZXh0Tm9kZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQudGFyZ2V0SW5kZXgtLTtcbiAgICB9XG59XG4vKipcbiAqIENvbXBpbGVzIGEgdGVtcGxhdGUgYW5kIGFzc29jaWF0ZWQgZGlyZWN0aXZlcyBpbnRvIGEgcmF3IGNvbXBpbGF0aW9uXG4gKiByZXN1bHQgd2hpY2ggaW5jbHVkZSBhIGNsb25lYWJsZSBEb2N1bWVudEZyYWdtZW50IGFuZCBmYWN0b3JpZXMgY2FwYWJsZVxuICogb2YgYXR0YWNoaW5nIHJ1bnRpbWUgYmVoYXZpb3IgdG8gbm9kZXMgd2l0aGluIHRoZSBmcmFnbWVudC5cbiAqIEBwYXJhbSB0ZW1wbGF0ZSAtIFRoZSB0ZW1wbGF0ZSB0byBjb21waWxlLlxuICogQHBhcmFtIGRpcmVjdGl2ZXMgLSBUaGUgZGlyZWN0aXZlcyByZWZlcmVuY2VkIGJ5IHRoZSB0ZW1wbGF0ZS5cbiAqIEByZW1hcmtzXG4gKiBUaGUgdGVtcGxhdGUgdGhhdCBpcyBwcm92aWRlZCBmb3IgY29tcGlsYXRpb24gaXMgYWx0ZXJlZCBpbi1wbGFjZVxuICogYW5kIGNhbm5vdCBiZSBjb21waWxlZCBhZ2Fpbi4gSWYgdGhlIG9yaWdpbmFsIHRlbXBsYXRlIG11c3QgYmUgcHJlc2VydmVkLFxuICogaXQgaXMgcmVjb21tZW5kZWQgdGhhdCB5b3UgY2xvbmUgdGhlIG9yaWdpbmFsIGFuZCBwYXNzIHRoZSBjbG9uZSB0byB0aGlzIEFQSS5cbiAqIEBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBpbGVUZW1wbGF0ZSh0ZW1wbGF0ZSwgZGlyZWN0aXZlcykge1xuICAgIGNvbnN0IGZyYWdtZW50ID0gdGVtcGxhdGUuY29udGVudDtcbiAgICAvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0xMTExODY0XG4gICAgZG9jdW1lbnQuYWRvcHROb2RlKGZyYWdtZW50KTtcbiAgICBjb25zdCBjb250ZXh0ID0gQ29tcGlsYXRpb25Db250ZXh0LmJvcnJvdyhkaXJlY3RpdmVzKTtcbiAgICBjb21waWxlQXR0cmlidXRlcyhjb250ZXh0LCB0ZW1wbGF0ZSwgdHJ1ZSk7XG4gICAgY29uc3QgaG9zdEJlaGF2aW9yRmFjdG9yaWVzID0gY29udGV4dC5iZWhhdmlvckZhY3RvcmllcztcbiAgICBjb250ZXh0LnJlc2V0KCk7XG4gICAgY29uc3Qgd2Fsa2VyID0gRE9NLmNyZWF0ZVRlbXBsYXRlV2Fsa2VyKGZyYWdtZW50KTtcbiAgICBsZXQgbm9kZTtcbiAgICB3aGlsZSAoKG5vZGUgPSB3YWxrZXIubmV4dE5vZGUoKSkpIHtcbiAgICAgICAgY29udGV4dC50YXJnZXRJbmRleCsrO1xuICAgICAgICBzd2l0Y2ggKG5vZGUubm9kZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgMTogLy8gZWxlbWVudCBub2RlXG4gICAgICAgICAgICAgICAgY29tcGlsZUF0dHJpYnV0ZXMoY29udGV4dCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6IC8vIHRleHQgbm9kZVxuICAgICAgICAgICAgICAgIGNvbXBpbGVDb250ZW50KGNvbnRleHQsIG5vZGUsIHdhbGtlcik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6IC8vIGNvbW1lbnRcbiAgICAgICAgICAgICAgICBpZiAoRE9NLmlzTWFya2VyKG5vZGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuYWRkRmFjdG9yeShkaXJlY3RpdmVzW0RPTS5leHRyYWN0RGlyZWN0aXZlSW5kZXhGcm9tTWFya2VyKG5vZGUpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGxldCB0YXJnZXRPZmZzZXQgPSAwO1xuICAgIGlmIChET00uaXNNYXJrZXIoZnJhZ21lbnQuZmlyc3RDaGlsZCkpIHtcbiAgICAgICAgLy8gSWYgdGhlIGZpcnN0IG5vZGUgaW4gYSBmcmFnbWVudCBpcyBhIG1hcmtlciwgdGhhdCBtZWFucyBpdCdzIGFuIHVuc3RhYmxlIGZpcnN0IG5vZGUsXG4gICAgICAgIC8vIGJlY2F1c2Ugc29tZXRoaW5nIGxpa2UgYSB3aGVuLCByZXBlYXQsIGV0Yy4gY291bGQgYWRkIG5vZGVzIGJlZm9yZSB0aGUgbWFya2VyLlxuICAgICAgICAvLyBUbyBtaXRpZ2F0ZSB0aGlzLCB3ZSBpbnNlcnQgYSBzdGFibGUgZmlyc3Qgbm9kZS4gSG93ZXZlciwgaWYgd2UgaW5zZXJ0IGEgbm9kZSxcbiAgICAgICAgLy8gdGhhdCB3aWxsIGFsdGVyIHRoZSByZXN1bHQgb2YgdGhlIFRyZWVXYWxrZXIuIFNvLCB3ZSBhbHNvIG5lZWQgdG8gb2Zmc2V0IHRoZSB0YXJnZXQgaW5kZXguXG4gICAgICAgIGZyYWdtZW50Lmluc2VydEJlZm9yZShkb2N1bWVudC5jcmVhdGVDb21tZW50KFwiXCIpLCBmcmFnbWVudC5maXJzdENoaWxkKTtcbiAgICAgICAgdGFyZ2V0T2Zmc2V0ID0gLTE7XG4gICAgfVxuICAgIGNvbnN0IHZpZXdCZWhhdmlvckZhY3RvcmllcyA9IGNvbnRleHQuYmVoYXZpb3JGYWN0b3JpZXM7XG4gICAgY29udGV4dC5yZWxlYXNlKCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgZnJhZ21lbnQsXG4gICAgICAgIHZpZXdCZWhhdmlvckZhY3RvcmllcyxcbiAgICAgICAgaG9zdEJlaGF2aW9yRmFjdG9yaWVzLFxuICAgICAgICB0YXJnZXRPZmZzZXQsXG4gICAgfTtcbn1cbiIsImltcG9ydCB7IGNvbXBpbGVUZW1wbGF0ZSB9IGZyb20gXCIuL3RlbXBsYXRlLWNvbXBpbGVyXCI7XG5pbXBvcnQgeyBIVE1MVmlldyB9IGZyb20gXCIuL3ZpZXdcIjtcbmltcG9ydCB7IERPTSB9IGZyb20gXCIuL2RvbVwiO1xuaW1wb3J0IHsgRGlyZWN0aXZlLCBOYW1lZFRhcmdldERpcmVjdGl2ZSB9IGZyb20gXCIuL2RpcmVjdGl2ZXMvZGlyZWN0aXZlXCI7XG5pbXBvcnQgeyBCaW5kaW5nRGlyZWN0aXZlIH0gZnJvbSBcIi4vZGlyZWN0aXZlcy9iaW5kaW5nXCI7XG5pbXBvcnQgeyBkZWZhdWx0RXhlY3V0aW9uQ29udGV4dCB9IGZyb20gXCIuL29ic2VydmF0aW9uL29ic2VydmFibGVcIjtcbi8qKlxuICogQSB0ZW1wbGF0ZSBjYXBhYmxlIG9mIGNyZWF0aW5nIEhUTUxWaWV3IGluc3RhbmNlcyBvciByZW5kZXJpbmcgZGlyZWN0bHkgdG8gRE9NLlxuICogQHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgVmlld1RlbXBsYXRlIHtcbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIGluc3RhbmNlIG9mIFZpZXdUZW1wbGF0ZS5cbiAgICAgKiBAcGFyYW0gaHRtbCAtIFRoZSBodG1sIHJlcHJlc2VudGluZyB3aGF0IHRoaXMgdGVtcGxhdGUgd2lsbCBpbnN0YW50aWF0ZSwgaW5jbHVkaW5nIHBsYWNlaG9sZGVycyBmb3IgZGlyZWN0aXZlcy5cbiAgICAgKiBAcGFyYW0gZGlyZWN0aXZlcyAtIFRoZSBkaXJlY3RpdmVzIHRoYXQgd2lsbCBiZSBjb25uZWN0ZWQgdG8gcGxhY2Vob2xkZXJzIGluIHRoZSBodG1sLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGh0bWwsIGRpcmVjdGl2ZXMpIHtcbiAgICAgICAgdGhpcy5iZWhhdmlvckNvdW50ID0gMDtcbiAgICAgICAgdGhpcy5oYXNIb3N0QmVoYXZpb3JzID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZnJhZ21lbnQgPSBudWxsO1xuICAgICAgICB0aGlzLnRhcmdldE9mZnNldCA9IDA7XG4gICAgICAgIHRoaXMudmlld0JlaGF2aW9yRmFjdG9yaWVzID0gbnVsbDtcbiAgICAgICAgdGhpcy5ob3N0QmVoYXZpb3JGYWN0b3JpZXMgPSBudWxsO1xuICAgICAgICB0aGlzLmh0bWwgPSBodG1sO1xuICAgICAgICB0aGlzLmRpcmVjdGl2ZXMgPSBkaXJlY3RpdmVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIEhUTUxWaWV3IGluc3RhbmNlIGJhc2VkIG9uIHRoaXMgdGVtcGxhdGUgZGVmaW5pdGlvbi5cbiAgICAgKiBAcGFyYW0gaG9zdEJpbmRpbmdUYXJnZXQgLSBUaGUgZWxlbWVudCB0aGF0IGhvc3QgYmVoYXZpb3JzIHdpbGwgYmUgYm91bmQgdG8uXG4gICAgICovXG4gICAgY3JlYXRlKGhvc3RCaW5kaW5nVGFyZ2V0KSB7XG4gICAgICAgIGlmICh0aGlzLmZyYWdtZW50ID09PSBudWxsKSB7XG4gICAgICAgICAgICBsZXQgdGVtcGxhdGU7XG4gICAgICAgICAgICBjb25zdCBodG1sID0gdGhpcy5odG1sO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBodG1sID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIik7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gRE9NLmNyZWF0ZUhUTUwoaHRtbCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZmVjID0gdGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgICAgICBpZiAoZmVjICE9PSBudWxsICYmIGZlYy50YWdOYW1lID09PSBcIlRFTVBMQVRFXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBmZWM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVtcGxhdGUgPSBodG1sO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY29tcGlsZVRlbXBsYXRlKHRlbXBsYXRlLCB0aGlzLmRpcmVjdGl2ZXMpO1xuICAgICAgICAgICAgdGhpcy5mcmFnbWVudCA9IHJlc3VsdC5mcmFnbWVudDtcbiAgICAgICAgICAgIHRoaXMudmlld0JlaGF2aW9yRmFjdG9yaWVzID0gcmVzdWx0LnZpZXdCZWhhdmlvckZhY3RvcmllcztcbiAgICAgICAgICAgIHRoaXMuaG9zdEJlaGF2aW9yRmFjdG9yaWVzID0gcmVzdWx0Lmhvc3RCZWhhdmlvckZhY3RvcmllcztcbiAgICAgICAgICAgIHRoaXMudGFyZ2V0T2Zmc2V0ID0gcmVzdWx0LnRhcmdldE9mZnNldDtcbiAgICAgICAgICAgIHRoaXMuYmVoYXZpb3JDb3VudCA9XG4gICAgICAgICAgICAgICAgdGhpcy52aWV3QmVoYXZpb3JGYWN0b3JpZXMubGVuZ3RoICsgdGhpcy5ob3N0QmVoYXZpb3JGYWN0b3JpZXMubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy5oYXNIb3N0QmVoYXZpb3JzID0gdGhpcy5ob3N0QmVoYXZpb3JGYWN0b3JpZXMubGVuZ3RoID4gMDtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBmcmFnbWVudCA9IHRoaXMuZnJhZ21lbnQuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICBjb25zdCB2aWV3RmFjdG9yaWVzID0gdGhpcy52aWV3QmVoYXZpb3JGYWN0b3JpZXM7XG4gICAgICAgIGNvbnN0IGJlaGF2aW9ycyA9IG5ldyBBcnJheSh0aGlzLmJlaGF2aW9yQ291bnQpO1xuICAgICAgICBjb25zdCB3YWxrZXIgPSBET00uY3JlYXRlVGVtcGxhdGVXYWxrZXIoZnJhZ21lbnQpO1xuICAgICAgICBsZXQgYmVoYXZpb3JJbmRleCA9IDA7XG4gICAgICAgIGxldCB0YXJnZXRJbmRleCA9IHRoaXMudGFyZ2V0T2Zmc2V0O1xuICAgICAgICBsZXQgbm9kZSA9IHdhbGtlci5uZXh0Tm9kZSgpO1xuICAgICAgICBmb3IgKGxldCBpaSA9IHZpZXdGYWN0b3JpZXMubGVuZ3RoOyBiZWhhdmlvckluZGV4IDwgaWk7ICsrYmVoYXZpb3JJbmRleCkge1xuICAgICAgICAgICAgY29uc3QgZmFjdG9yeSA9IHZpZXdGYWN0b3JpZXNbYmVoYXZpb3JJbmRleF07XG4gICAgICAgICAgICBjb25zdCBmYWN0b3J5SW5kZXggPSBmYWN0b3J5LnRhcmdldEluZGV4O1xuICAgICAgICAgICAgd2hpbGUgKG5vZGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0SW5kZXggPT09IGZhY3RvcnlJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBiZWhhdmlvcnNbYmVoYXZpb3JJbmRleF0gPSBmYWN0b3J5LmNyZWF0ZUJlaGF2aW9yKG5vZGUpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5vZGUgPSB3YWxrZXIubmV4dE5vZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SW5kZXgrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaGFzSG9zdEJlaGF2aW9ycykge1xuICAgICAgICAgICAgY29uc3QgaG9zdEZhY3RvcmllcyA9IHRoaXMuaG9zdEJlaGF2aW9yRmFjdG9yaWVzO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gaG9zdEZhY3Rvcmllcy5sZW5ndGg7IGkgPCBpaTsgKytpLCArK2JlaGF2aW9ySW5kZXgpIHtcbiAgICAgICAgICAgICAgICBiZWhhdmlvcnNbYmVoYXZpb3JJbmRleF0gPSBob3N0RmFjdG9yaWVzW2ldLmNyZWF0ZUJlaGF2aW9yKGhvc3RCaW5kaW5nVGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IEhUTUxWaWV3KGZyYWdtZW50LCBiZWhhdmlvcnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGFuIEhUTUxWaWV3IGZyb20gdGhpcyB0ZW1wbGF0ZSwgYmluZHMgaXQgdG8gdGhlIHNvdXJjZSwgYW5kIHRoZW4gYXBwZW5kcyBpdCB0byB0aGUgaG9zdC5cbiAgICAgKiBAcGFyYW0gc291cmNlIC0gVGhlIGRhdGEgc291cmNlIHRvIGJpbmQgdGhlIHRlbXBsYXRlIHRvLlxuICAgICAqIEBwYXJhbSBob3N0IC0gVGhlIEVsZW1lbnQgd2hlcmUgdGhlIHRlbXBsYXRlIHdpbGwgYmUgcmVuZGVyZWQuXG4gICAgICogQHBhcmFtIGhvc3RCaW5kaW5nVGFyZ2V0IC0gQW4gSFRNTCBlbGVtZW50IHRvIHRhcmdldCB0aGUgaG9zdCBiaW5kaW5ncyBhdCBpZiBkaWZmZXJlbnQgZnJvbSB0aGVcbiAgICAgKiBob3N0IHRoYXQgdGhlIHRlbXBsYXRlIGlzIGJlaW5nIGF0dGFjaGVkIHRvLlxuICAgICAqL1xuICAgIHJlbmRlcihzb3VyY2UsIGhvc3QsIGhvc3RCaW5kaW5nVGFyZ2V0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgaG9zdCA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgaG9zdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhvc3QpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChob3N0QmluZGluZ1RhcmdldCA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBob3N0QmluZGluZ1RhcmdldCA9IGhvc3Q7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgdmlldyA9IHRoaXMuY3JlYXRlKGhvc3RCaW5kaW5nVGFyZ2V0KTtcbiAgICAgICAgdmlldy5iaW5kKHNvdXJjZSwgZGVmYXVsdEV4ZWN1dGlvbkNvbnRleHQpO1xuICAgICAgICB2aWV3LmFwcGVuZFRvKGhvc3QpO1xuICAgICAgICByZXR1cm4gdmlldztcbiAgICB9XG59XG4vLyBNdWNoIHRoYW5rcyB0byBMaXRIVE1MIGZvciB3b3JraW5nIHRoaXMgb3V0IVxuY29uc3QgbGFzdEF0dHJpYnV0ZU5hbWVSZWdleCA9IFxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnRyb2wtcmVnZXhcbi8oWyBcXHgwOVxceDBhXFx4MGNcXHgwZF0pKFteXFwwLVxceDFGXFx4N0YtXFx4OUYgXCInPj0vXSspKFsgXFx4MDlcXHgwYVxceDBjXFx4MGRdKj1bIFxceDA5XFx4MGFcXHgwY1xceDBkXSooPzpbXiBcXHgwOVxceDBhXFx4MGNcXHgwZFwiJ2A8Pj1dKnxcIlteXCJdKnwnW14nXSopKSQvO1xuLyoqXG4gKiBUcmFuc2Zvcm1zIGEgdGVtcGxhdGUgbGl0ZXJhbCBzdHJpbmcgaW50byBhIHJlbmRlcmFibGUgVmlld1RlbXBsYXRlLlxuICogQHBhcmFtIHN0cmluZ3MgLSBUaGUgc3RyaW5nIGZyYWdtZW50cyB0aGF0IGFyZSBpbnRlcnBvbGF0ZWQgd2l0aCB0aGUgdmFsdWVzLlxuICogQHBhcmFtIHZhbHVlcyAtIFRoZSB2YWx1ZXMgdGhhdCBhcmUgaW50ZXJwb2xhdGVkIHdpdGggdGhlIHN0cmluZyBmcmFnbWVudHMuXG4gKiBAcmVtYXJrc1xuICogVGhlIGh0bWwgaGVscGVyIHN1cHBvcnRzIGludGVycG9sYXRpb24gb2Ygc3RyaW5ncywgbnVtYmVycywgYmluZGluZyBleHByZXNzaW9ucyxcbiAqIG90aGVyIHRlbXBsYXRlIGluc3RhbmNlcywgYW5kIERpcmVjdGl2ZSBpbnN0YW5jZXMuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBodG1sKHN0cmluZ3MsIC4uLnZhbHVlcykge1xuICAgIGNvbnN0IGRpcmVjdGl2ZXMgPSBbXTtcbiAgICBsZXQgaHRtbCA9IFwiXCI7XG4gICAgZm9yIChsZXQgaSA9IDAsIGlpID0gc3RyaW5ncy5sZW5ndGggLSAxOyBpIDwgaWk7ICsraSkge1xuICAgICAgICBjb25zdCBjdXJyZW50U3RyaW5nID0gc3RyaW5nc1tpXTtcbiAgICAgICAgbGV0IHZhbHVlID0gdmFsdWVzW2ldO1xuICAgICAgICBodG1sICs9IGN1cnJlbnRTdHJpbmc7XG4gICAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFZpZXdUZW1wbGF0ZSkge1xuICAgICAgICAgICAgY29uc3QgdGVtcGxhdGUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHZhbHVlID0gKCkgPT4gdGVtcGxhdGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IG5ldyBCaW5kaW5nRGlyZWN0aXZlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBOYW1lZFRhcmdldERpcmVjdGl2ZSkge1xuICAgICAgICAgICAgY29uc3QgbWF0Y2ggPSBsYXN0QXR0cmlidXRlTmFtZVJlZ2V4LmV4ZWMoY3VycmVudFN0cmluZyk7XG4gICAgICAgICAgICBpZiAobWF0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZS50YXJnZXROYW1lID0gbWF0Y2hbMl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRGlyZWN0aXZlKSB7XG4gICAgICAgICAgICAvLyBTaW5jZSBub3QgYWxsIHZhbHVlcyBhcmUgZGlyZWN0aXZlcywgd2UgY2FuJ3QgdXNlIGlcbiAgICAgICAgICAgIC8vIGFzIHRoZSBpbmRleCBmb3IgdGhlIHBsYWNlaG9sZGVyLiBJbnN0ZWFkLCB3ZSBuZWVkIHRvXG4gICAgICAgICAgICAvLyB1c2UgZGlyZWN0aXZlcy5sZW5ndGggdG8gZ2V0IHRoZSBuZXh0IGluZGV4LlxuICAgICAgICAgICAgaHRtbCArPSB2YWx1ZS5jcmVhdGVQbGFjZWhvbGRlcihkaXJlY3RpdmVzLmxlbmd0aCk7XG4gICAgICAgICAgICBkaXJlY3RpdmVzLnB1c2godmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaHRtbCArPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBodG1sICs9IHN0cmluZ3Nbc3RyaW5ncy5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gbmV3IFZpZXdUZW1wbGF0ZShodG1sLCBkaXJlY3RpdmVzKTtcbn1cbiIsIi8vIEEgc2luZ2xldG9uIFJhbmdlIGluc3RhbmNlIHVzZWQgdG8gZWZmaWNpZW50bHkgcmVtb3ZlIHJhbmdlcyBvZiBET00gbm9kZXMuXG4vLyBTZWUgdGhlIGltcGxlbWVudGF0aW9uIG9mIEhUTUxWaWV3IGJlbG93IGZvciBmdXJ0aGVyIGRldGFpbHMuXG5jb25zdCByYW5nZSA9IGRvY3VtZW50LmNyZWF0ZVJhbmdlKCk7XG4vKipcbiAqIFRoZSBzdGFuZGFyZCBWaWV3IGltcGxlbWVudGF0aW9uLCB3aGljaCBhbHNvIGltcGxlbWVudHMgRWxlbWVudFZpZXcgYW5kIFN5bnRoZXRpY1ZpZXcuXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBIVE1MVmlldyB7XG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0cyBhbiBpbnN0YW5jZSBvZiBIVE1MVmlldy5cbiAgICAgKiBAcGFyYW0gZnJhZ21lbnQgLSBUaGUgaHRtbCBmcmFnbWVudCB0aGF0IGNvbnRhaW5zIHRoZSBub2RlcyBmb3IgdGhpcyB2aWV3LlxuICAgICAqIEBwYXJhbSBiZWhhdmlvcnMgLSBUaGUgYmVoYXZpb3JzIHRvIGJlIGFwcGxpZWQgdG8gdGhpcyB2aWV3LlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGZyYWdtZW50LCBiZWhhdmlvcnMpIHtcbiAgICAgICAgdGhpcy5mcmFnbWVudCA9IGZyYWdtZW50O1xuICAgICAgICB0aGlzLmJlaGF2aW9ycyA9IGJlaGF2aW9ycztcbiAgICAgICAgLyoqXG4gICAgICAgICAqIFRoZSBkYXRhIHRoYXQgdGhlIHZpZXcgaXMgYm91bmQgdG8uXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnNvdXJjZSA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBUaGUgZXhlY3V0aW9uIGNvbnRleHQgdGhlIHZpZXcgaXMgcnVubmluZyB3aXRoaW4uXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmNvbnRleHQgPSBudWxsO1xuICAgICAgICB0aGlzLmZpcnN0Q2hpbGQgPSBmcmFnbWVudC5maXJzdENoaWxkO1xuICAgICAgICB0aGlzLmxhc3RDaGlsZCA9IGZyYWdtZW50Lmxhc3RDaGlsZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQXBwZW5kcyB0aGUgdmlldydzIERPTSBub2RlcyB0byB0aGUgcmVmZXJlbmNlZCBub2RlLlxuICAgICAqIEBwYXJhbSBub2RlIC0gVGhlIHBhcmVudCBub2RlIHRvIGFwcGVuZCB0aGUgdmlldydzIERPTSBub2RlcyB0by5cbiAgICAgKi9cbiAgICBhcHBlbmRUbyhub2RlKSB7XG4gICAgICAgIG5vZGUuYXBwZW5kQ2hpbGQodGhpcy5mcmFnbWVudCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEluc2VydHMgdGhlIHZpZXcncyBET00gbm9kZXMgYmVmb3JlIHRoZSByZWZlcmVuY2VkIG5vZGUuXG4gICAgICogQHBhcmFtIG5vZGUgLSBUaGUgbm9kZSB0byBpbnNlcnQgdGhlIHZpZXcncyBET00gYmVmb3JlLlxuICAgICAqL1xuICAgIGluc2VydEJlZm9yZShub2RlKSB7XG4gICAgICAgIGlmICh0aGlzLmZyYWdtZW50Lmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICAgICAgbm9kZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0aGlzLmZyYWdtZW50LCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudE5vZGUgPSBub2RlLnBhcmVudE5vZGU7XG4gICAgICAgICAgICBjb25zdCBlbmQgPSB0aGlzLmxhc3RDaGlsZDtcbiAgICAgICAgICAgIGxldCBjdXJyZW50ID0gdGhpcy5maXJzdENoaWxkO1xuICAgICAgICAgICAgbGV0IG5leHQ7XG4gICAgICAgICAgICB3aGlsZSAoY3VycmVudCAhPT0gZW5kKSB7XG4gICAgICAgICAgICAgICAgbmV4dCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoY3VycmVudCwgbm9kZSk7XG4gICAgICAgICAgICAgICAgY3VycmVudCA9IG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShlbmQsIG5vZGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIHZpZXcncyBET00gbm9kZXMuXG4gICAgICogVGhlIG5vZGVzIGFyZSBub3QgZGlzcG9zZWQgYW5kIHRoZSB2aWV3IGNhbiBsYXRlciBiZSByZS1pbnNlcnRlZC5cbiAgICAgKi9cbiAgICByZW1vdmUoKSB7XG4gICAgICAgIGNvbnN0IGZyYWdtZW50ID0gdGhpcy5mcmFnbWVudDtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5sYXN0Q2hpbGQ7XG4gICAgICAgIGxldCBjdXJyZW50ID0gdGhpcy5maXJzdENoaWxkO1xuICAgICAgICBsZXQgbmV4dDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT09IGVuZCkge1xuICAgICAgICAgICAgbmV4dCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBmcmFnbWVudC5hcHBlbmRDaGlsZChjdXJyZW50KTtcbiAgICAgICAgICAgIGN1cnJlbnQgPSBuZXh0O1xuICAgICAgICB9XG4gICAgICAgIGZyYWdtZW50LmFwcGVuZENoaWxkKGVuZCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIHZpZXcgYW5kIHVuYmluZHMgaXRzIGJlaGF2aW9ycywgZGlzcG9zaW5nIG9mIERPTSBub2RlcyBhZnRlcndhcmQuXG4gICAgICogT25jZSBhIHZpZXcgaGFzIGJlZW4gZGlzcG9zZWQsIGl0IGNhbm5vdCBiZSBpbnNlcnRlZCBvciBib3VuZCBhZ2Fpbi5cbiAgICAgKi9cbiAgICBkaXNwb3NlKCkge1xuICAgICAgICBjb25zdCBwYXJlbnQgPSB0aGlzLmZpcnN0Q2hpbGQucGFyZW50Tm9kZTtcbiAgICAgICAgY29uc3QgZW5kID0gdGhpcy5sYXN0Q2hpbGQ7XG4gICAgICAgIGxldCBjdXJyZW50ID0gdGhpcy5maXJzdENoaWxkO1xuICAgICAgICBsZXQgbmV4dDtcbiAgICAgICAgd2hpbGUgKGN1cnJlbnQgIT09IGVuZCkge1xuICAgICAgICAgICAgbmV4dCA9IGN1cnJlbnQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoY3VycmVudCk7XG4gICAgICAgICAgICBjdXJyZW50ID0gbmV4dDtcbiAgICAgICAgfVxuICAgICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQoZW5kKTtcbiAgICAgICAgY29uc3QgYmVoYXZpb3JzID0gdGhpcy5iZWhhdmlvcnM7XG4gICAgICAgIGNvbnN0IG9sZFNvdXJjZSA9IHRoaXMuc291cmNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBiZWhhdmlvcnMubGVuZ3RoOyBpIDwgaWk7ICsraSkge1xuICAgICAgICAgICAgYmVoYXZpb3JzW2ldLnVuYmluZChvbGRTb3VyY2UpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEJpbmRzIGEgdmlldydzIGJlaGF2aW9ycyB0byBpdHMgYmluZGluZyBzb3VyY2UuXG4gICAgICogQHBhcmFtIHNvdXJjZSAtIFRoZSBiaW5kaW5nIHNvdXJjZSBmb3IgdGhlIHZpZXcncyBiaW5kaW5nIGJlaGF2aW9ycy5cbiAgICAgKiBAcGFyYW0gY29udGV4dCAtIFRoZSBleGVjdXRpb24gY29udGV4dCB0byBydW4gdGhlIGJlaGF2aW9ycyB3aXRoaW4uXG4gICAgICovXG4gICAgYmluZChzb3VyY2UsIGNvbnRleHQpIHtcbiAgICAgICAgY29uc3QgYmVoYXZpb3JzID0gdGhpcy5iZWhhdmlvcnM7XG4gICAgICAgIGlmICh0aGlzLnNvdXJjZSA9PT0gc291cmNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5zb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZFNvdXJjZSA9IHRoaXMuc291cmNlO1xuICAgICAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDAsIGlpID0gYmVoYXZpb3JzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyZW50ID0gYmVoYXZpb3JzW2ldO1xuICAgICAgICAgICAgICAgIGN1cnJlbnQudW5iaW5kKG9sZFNvdXJjZSk7XG4gICAgICAgICAgICAgICAgY3VycmVudC5iaW5kKHNvdXJjZSwgY29udGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZSA9IHNvdXJjZTtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMCwgaWkgPSBiZWhhdmlvcnMubGVuZ3RoOyBpIDwgaWk7ICsraSkge1xuICAgICAgICAgICAgICAgIGJlaGF2aW9yc1tpXS5iaW5kKHNvdXJjZSwgY29udGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogVW5iaW5kcyBhIHZpZXcncyBiZWhhdmlvcnMgZnJvbSBpdHMgYmluZGluZyBzb3VyY2UuXG4gICAgICovXG4gICAgdW5iaW5kKCkge1xuICAgICAgICBpZiAodGhpcy5zb3VyY2UgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBiZWhhdmlvcnMgPSB0aGlzLmJlaGF2aW9ycztcbiAgICAgICAgY29uc3Qgb2xkU291cmNlID0gdGhpcy5zb3VyY2U7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IGJlaGF2aW9ycy5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgICAgICAgICBiZWhhdmlvcnNbaV0udW5iaW5kKG9sZFNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zb3VyY2UgPSBudWxsO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBFZmZpY2llbnRseSBkaXNwb3NlcyBvZiBhIGNvbnRpZ3VvdXMgcmFuZ2Ugb2Ygc3ludGhldGljIHZpZXcgaW5zdGFuY2VzLlxuICAgICAqIEBwYXJhbSB2aWV3cyAtIEEgY29udGlndW91cyByYW5nZSBvZiB2aWV3cyB0byBiZSBkaXNwb3NlZC5cbiAgICAgKi9cbiAgICBzdGF0aWMgZGlzcG9zZUNvbnRpZ3VvdXNCYXRjaCh2aWV3cykge1xuICAgICAgICBpZiAodmlld3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmFuZ2Uuc2V0U3RhcnRCZWZvcmUodmlld3NbMF0uZmlyc3RDaGlsZCk7XG4gICAgICAgIHJhbmdlLnNldEVuZEFmdGVyKHZpZXdzW3ZpZXdzLmxlbmd0aCAtIDFdLmxhc3RDaGlsZCk7XG4gICAgICAgIHJhbmdlLmRlbGV0ZUNvbnRlbnRzKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBpaSA9IHZpZXdzLmxlbmd0aDsgaSA8IGlpOyArK2kpIHtcbiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSB2aWV3c1tpXTtcbiAgICAgICAgICAgIGNvbnN0IGJlaGF2aW9ycyA9IHZpZXcuYmVoYXZpb3JzO1xuICAgICAgICAgICAgY29uc3Qgb2xkU291cmNlID0gdmlldy5zb3VyY2U7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMCwgamogPSBiZWhhdmlvcnMubGVuZ3RoOyBqIDwgamo7ICsraikge1xuICAgICAgICAgICAgICAgIGJlaGF2aW9yc1tqXS51bmJpbmQob2xkU291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCB7IFJWWFdpZGdldCB9IGZyb20gXCIuL3NyYy93aWRnZXRzXCI7XHJcblxyXG4vLyBVcHBlciBjYXNlXHJcbndpbmRvdy5BVkEgPSB3aW5kb3cuQVZBIHx8IHt9O1xyXG53aW5kb3cuQVZBLndpZGdldHMgPSB3aW5kb3cuQVZBLndpZGdldHMgfHwge307XHJcbndpbmRvdy5BVkEud2lkZ2V0cy5SVlggPSBSVlhXaWRnZXQ7XHJcbiIsIi8vIFdpbmRvdyBvYmplY3RcclxuZXhwb3J0ICogZnJvbSAnLi9nbG9iYWwuZGVmaW5pdGlvbnMnO1xyXG5cclxuXHJcbi8vIE5QTSBleHBvcnRzXHJcbmV4cG9ydCAqIGZyb20gJy4vbnBtLmRlZmluaXRpb25zJzsiLCJleHBvcnQgKiBmcm9tICcuL3NyYy93aWRnZXRzJztcclxuIiwiZXhwb3J0ICogZnJvbSAnLi9ydngtY29uZmlnLmRlZmluaXRpb25zJzsiLCJleHBvcnQgeyBSVlhXaWRnZXQgfSBmcm9tICcuL3J2eC13aWRnZXQnO1xyXG5leHBvcnQgKiBmcm9tICcuL2RlZmluaXRpb25zJzsiLCJpbXBvcnQgeyBCYXNlV2lkZ2V0IH0gZnJvbSBcIi4uL2Jhc2VcIjtcclxuaW1wb3J0IHsgY3VzdG9tRWxlbWVudCwgYXR0ciB9IGZyb20gJ0BtaWNyb3NvZnQvZmFzdC1lbGVtZW50JztcclxuXHJcbkBjdXN0b21FbGVtZW50KCdydngtd2lkZ2V0JylcclxuZXhwb3J0IGNsYXNzIFJWWFdpZGdldCBleHRlbmRzIEJhc2VXaWRnZXQge1xyXG4gIEBhdHRyIGdyZWV0aW5nOiBzdHJpbmcgPSAnSGVsbG8gUlZYIHdpZGdldCc7XHJcblxyXG4gIGdyZWV0aW5nQ2hhbmdlZCgpIHtcclxuICAgIHRoaXMuc2hhZG93Um9vdCEuaW5uZXJIVE1MID0gdGhpcy5ncmVldGluZztcclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgRkFTVEVsZW1lbnQgfSBmcm9tIFwiQG1pY3Jvc29mdC9mYXN0LWVsZW1lbnRcIjtcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlV2lkZ2V0IGV4dGVuZHMgRkFTVEVsZW1lbnQge1xyXG59XHJcbiIsIi8vIGJhc2Ugd2lkZ2V0XHJcbmV4cG9ydCAqIGZyb20gJy4vYmFzZS13aWRnZXQnOyIsImV4cG9ydCBjbGFzcyBXaWRnZXRHZW5lcmFsRXJyb3IgZXh0ZW5kcyBFcnJvciB7XHJcbiAgICBzdGF0aWMgZXJyb3JOYW1lID0gJ1dpZGdldEdlbmVyYWxFcnJvcic7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHVibGljIG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgIHN1cGVyKGAke1dpZGdldEdlbmVyYWxFcnJvci5lcnJvck5hbWV9OiBtZXNzYWdlYCk7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gV2lkZ2V0R2VuZXJhbEVycm9yLmVycm9yTmFtZTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgKiBmcm9tIFwiLi9lcnJvclwiO1xyXG5leHBvcnQgKiBmcm9tIFwiLi9vcHRpb25zXCI7IiwiLy8gQ29tbW9uXHJcbmV4cG9ydCAqIGZyb20gJy4vY29tbW9uJztcclxuXHJcbi8vIEluc2lnaHRzIHdpZGdldFxyXG5leHBvcnQgKiBmcm9tICcuL1JWWCc7XHJcblxyXG4vLyBCYXNlIGNvbmZpZ3VyYXRpb25zXHJcbmV4cG9ydCAqIGZyb20gJy4vYmFzZS13aWRnZXQtY29uZmlnLmRlZmluaXRpb25zJztcclxuZXhwb3J0ICogZnJvbSAnLi9sb2NhbGUuZGVmaW5pdGlvbnMnOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdGlmKF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0pIHtcblx0XHRyZXR1cm4gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gbW9kdWxlWydkZWZhdWx0J10gOlxuXHRcdCgpID0+IG1vZHVsZTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbl9fd2VicGFja19yZXF1aXJlX18oMTUwKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=