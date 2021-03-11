export function closestElement(selector: string, base: Element) {
    function __closestFrom(el: Element | Window | Document): any {
        if (!el || el === document || el === window) return null;
        if ((el as any).assignedSlot) el = (el as any).assignedSlot;
        let found = (el as Element).closest(selector);
        return found ? found : __closestFrom(((el as Element).getRootNode() as ShadowRoot).host);
    }
    return __closestFrom(base);
}
