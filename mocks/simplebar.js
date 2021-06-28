export default class SimpleBar {
    static removeObserver() {}
    static instances = {};

    el;

    constructor(element, options) {
        console.log('SimpleBar mock was called');
    }

    recalculate() {}
    getScrollElement() {}
    getContentElement() {}
    unMount() {}
}
