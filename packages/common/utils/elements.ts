// Find the closest element (throw the selector) to the base element.
/* eslint-disable  @typescript-eslint/no-explicit-any */
export function closestElement(selector: string, base: Element) {
    function closestFrom(el: Element | Window | Document): any {
        if (!el || el === document || el === window) {
            return null;
        }

        if ((el as any).assignedSlot) {
            el = (el as any).assignedSlot;
        }

        const found = (el as Element).closest(selector);
        return found ? found : closestFrom(((el as Element).getRootNode() as ShadowRoot).host);
    }
    return closestFrom(base);
}
