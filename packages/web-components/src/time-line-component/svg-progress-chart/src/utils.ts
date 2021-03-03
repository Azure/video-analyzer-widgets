export module Utils {
    // shim layer with setTimeout fallback
    export const requestAnimFrame: Function = (function () {
        return (
            window.requestAnimationFrame ||
            window['webkitRequestAnimationFrame'] ||
            window['mozRequestAnimationFrame'] ||
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            function (callback: any) {
                window.setTimeout(callback, 1000 / 60);
            }
        );
    })();
}
