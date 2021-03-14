export function closestElement(selector: string, base: Element) {
    /* eslint-disable  @typescript-eslint/no-explicit-any */
    function closestFrom(el: Element | Window | Document): any {
        if (!el || el === document || el === window) {
            return null;
        }

        /* eslint-disable  @typescript-eslint/no-explicit-any */
        if ((el as any).assignedSlot) {
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            el = (el as any).assignedSlot;
        }

        const found = (el as Element).closest(selector);
        return found ? found : closestFrom(((el as Element).getRootNode() as ShadowRoot).host);
    }
    return closestFrom(base);
}
