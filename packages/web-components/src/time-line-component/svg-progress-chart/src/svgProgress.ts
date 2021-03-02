import { IChartData, IChartOptions, IComponentTree, Colors } from './interfaces';
import { Rect, Tooltip } from './models';

// Define requestAnimationFrame with fallback
const requestAnimFrame = (() => {
    const callbackFunc = (callback: any) => {
        window.setTimeout(callback, 1000 / 60);
    };
    return window.requestAnimationFrame || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFrame'] || callbackFunc;
})();

// Define the main class for the progress chart.
export class SVGProgressChart {
    public id: string;
    public rootElement: SVGElement;
    public components: IComponentTree;
    public timer: any;
    public lastMatch = false;
    public currentTooltipType: string;
    public options: IChartOptions = {
        height: 500,
        width: 500,
        data: [],
        time: 0,
        tooltipHeight: 20,
        barHeight: 12,
        top: 0,
        renderBuffer: false,
        renderProgress: false
    };

    constructor(element: SVGElement, options: IChartOptions) {
        if (!element) {
            throw new Error('Root SVG Element is missing');
        }
        this.rootElement = element;
        this.id = this.rootElement.id;

        if (options) {
            this.options.height = options.height;
            this.options.width = options.width || this.rootElement.parentElement?.clientWidth;
            this.options.data = options.data;
            this.options.time = options.time;
            this.options.barHeight = options.barHeight || this.options.barHeight;
            this.options.tooltipHeight = options.renderTooltip ? options.tooltipHeight || 30 : 0;
            this.options.renderTooltip = options.renderTooltip;
            this.options.top = options.renderTooltip ? 10 + this.options.tooltipHeight : 0;
            this.options.renderBuffer = options.renderBuffer;
            this.options.renderProgress = options.renderProgress;
        }
        this.rootElement.setAttribute('height', this.options.height.toString());
        this.rootElement.setAttribute('width', '100%');
        this.components = {
            progressBar: {
                bar: null,
                buffer: null,
                overlay: null,
                progress: null,
                tooltip: null
            },
            events: []
        };

        this.init();
    }

    public addClass(cls: string) {
        if ('classList' in this.rootElement) {
            this.rootElement.classList.add(cls);
        } else {
            // Up casting root element to Element
            const el: Element = this.rootElement;

            if (el) {
                el.className = el.className + ' ' + cls;
            }
        }
    }

    public onSetProgress(callback: Function) {
        const instance = this;
        if (!callback) {
            return;
        }

        this.components.progressBar.overlay._el.addEventListener('click', (e: MouseEvent) => {
            const percent = e.offsetX / instance.options.width;
            const time = Math.round(percent * instance.options.time);
            callback(time);
        });
    }

    public setProgress(time: number) {
        let value: number;
        const timeType = typeof time;
        if (timeType === 'undefined' || !this.options.renderProgress) {
            return;
        }
        // Make sure the time not pass the max duration
        time = Math.min(time, this.options.time);
        if (Math.abs(time - this.options.time) < 0.5) {
            time = Math.ceil(time);
        }

        // Make sure value is max 100%.
        value = Math.min((time / this.options.time) * 100, 100);
        this.components.progressBar.progress.moveTo(value);
    }

    public setPreBuffer(time: number) {
        time = Math.min(time, this.options.time);
        const per = time / this.options.time;
        let pixels = per * this.options.width - this.components.progressBar.tooltip?.width / 2;
        pixels = Math.max(Math.min(pixels, this.options.width - this.components.progressBar.tooltip?.width), 0);

        this.components.progressBar.tooltip?.show();
        if (this.options.renderBuffer) {
            this.components.progressBar.buffer.show();
            this.setBuffer(time);
        }
        this.components.progressBar.tooltip?.moveTo(pixels, time);
    }

    public clearEvents() {
        this.components.progressBar.overlay._el.removeEventListener('click', this.handleMouseClick.bind(this));
        this.components.progressBar.overlay._el.removeEventListener('mouseleave', this.handleMouseLeave.bind(this));
        this.components.progressBar.overlay._el.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    public setWidth(w?: number) {
        if (w) {
            this.options.width = w;
        } else {
            this.options.width = this.rootElement.parentElement?.clientWidth;
        }
    }

    public destroy() {
        // Remove events
        this.clearEvents();

        // Remove elements
        this.components.events.forEach((e: Rect) => e.remove());

        // Remove components
        Object.keys(this.components.progressBar).forEach((c) => {
            if (this.components.progressBar[c]) {
                this.components.progressBar[c].remove();
            }
        });
    }

    public setData(data: IChartData[]) {
        // If new data obj less than what exists than delete data.
        this.components.events.forEach((e: Rect, i: number) => {
            e.remove();
        });

        // Reset
        this.components.events.length = 0;

        // Create events
        data.forEach((event: IChartData, i: number) => {
            if (!event.x) {
                event.x = i ? this.options.data[i - 1].x + this.options.data[i - 1].width : 0;
            }
            // If event created - just modify the props.
            if (this.components.events && this.components.events[i] && this.components.events[i]._el) {
                this.components.events[i].x = event.x;
                this.components.events[i].width = event.width;
                this.components.events[i].className = event.className || 'default';
                if (event.className !== 'default') {
                    this.components.events[i].color = `var(--${event.className}-color)`;
                } else {
                    this.components.events[i].color = Colors[event.className || 'default'];
                }

                if (
                    this.components.events[i].width &&
                    this.components.events[i].x &&
                    this.components.events[i].className &&
                    this.components.events[i].color
                ) {
                    this.components.events[i].update();
                }
            } else {
                const newEvent = new Rect(
                    this.options.barHeight,
                    <number>event.width,
                    <number>event.x,
                    10 + this.options.tooltipHeight,
                    '',
                    event.className
                );
                newEvent.addTabIndex = true;
                newEvent.addClass(event.className || 'default');
                if (event.className !== 'default') {
                    newEvent.color = `var(--${event.className}-color)`;
                }
                newEvent.update();
                this.components.events.push(newEvent);
                if (this.components.progressBar.overlay) {
                    // prepend
                    this.components.progressBar.overlay._el.parentNode.insertBefore(newEvent._el, this.components.progressBar.overlay._el);
                } else {
                    this.rootElement.appendChild(newEvent._el);
                }
            }
        });
    }

    public setTabIndex(newTabIndex: any): void {
        this.components.events.forEach((event: Rect) => {
            event._el.setAttribute('tabindex', newTabIndex);

            if (newTabIndex) {
                event._el.addEventListener('focus', this.handleFocus.bind(this));
                event._el.addEventListener('focusout', this.handelFocusOut.bind(this));
            } else {
                event._el.removeEventListener('focus', this.handleFocus.bind(this));
                event._el.addEventListener('focusout', this.handelFocusOut.bind(this));
            }
        });
    }

    private setBuffer(time: number) {
        time = Math.min(time, this.options.time);
        const that = this;
        if (!time) {
            return;
        }
        let value = Math.min((time / that.options.time) * 100, that.options.time);
        requestAnimFrame(() => {
            that.components.progressBar.buffer.moveTo(value);
        });
    }

    private handleMouseLeave(e: MouseEvent) {
        requestAnimFrame(() => {
            this.components.progressBar.tooltip?.hide();
            if (this.options.renderBuffer) {
                this.components.progressBar.buffer.hide();
            }
        });
    }

    private handelFocusOut(e: FocusEvent) {
        requestAnimFrame(() => {
            this.components.progressBar.tooltip?.hide();
            if (this.options.renderBuffer) {
                this.components.progressBar.buffer.hide();
            }
        });
    }

    private handleFocus(e: any) {
        const position: SVGAnimatedLength = e.currentTarget['x'] || 0;
        const widthObj: SVGAnimatedLength = e.currentTarget['width'] || 0;
        if (position) {
            const xPosition = position.animVal.value;
            const width = widthObj.animVal.value;
            // Reset tooltip
            this.components.progressBar.tooltip?.moveTo(0, 0);

            // Move tooltip to the middle of the event
            this.moveTooltip(xPosition + width / 2, true);
        }
    }

    private handleMouseMove(e: MouseEvent) {
        this.moveTooltip(e.offsetX);
    }

    private moveTooltip(xPosition: number, bFromFocus = false) {
        if (!this.options.renderTooltip) {
            return;
        }

        let pixels = (xPosition / this.options.width) * this.options.width - this.components.progressBar.tooltip?.width / 2;
        const time = (xPosition / this.options.width) * this.options.time;
        pixels = Math.max(Math.min(pixels, this.options.width - this.components.progressBar.tooltip?.width), 0);

        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            this.lastMatch = false;
            this.components.events.forEach((event: Rect) => {
                if (!event._el) {
                    return;
                }

                if (
                    xPosition >= (event.x * this.options.width) / 100 &&
                    xPosition < ((event.x + event.width) / 100) * this.options.width &&
                    event.className !== 'neutral'
                ) {
                    this.lastMatch = true;
                    if (event.className !== this.currentTooltipType) {
                        requestAnimFrame(() => {
                            // event.addClass('selected');
                            this.components.progressBar.tooltip?.removeClass(this.currentTooltipType);
                            this.currentTooltipType = <string>event.className;
                            this.components.progressBar.tooltip?.addClass(<string>event.className);
                            if (event.className !== 'default') {
                                this.components.progressBar.tooltip.color = `var(--${event.className}-tooltip-text)`;
                                this.components.progressBar.tooltip.backgroundColor = `var(--${event.className}-tooltip-bg)`;
                                this.components.progressBar.tooltip.update();
                            } else {
                                this.components.progressBar.tooltip.color = `#dddddd`;
                                this.components.progressBar.tooltip.backgroundColor = `${Colors.default}`;
                                this.components.progressBar.tooltip.update();
                            }
                        });
                    }
                }

                // Set tooltip text, add event type of there was a focus event
                this.components.progressBar.tooltip?.setText(time, bFromFocus ? <string>event.className : '');
            });

            if (!this.lastMatch) {
                this.components.progressBar.tooltip?.removeClass(this.currentTooltipType);
                this.components.progressBar.tooltip.color = '';
                this.components.progressBar.tooltip.backgroundColor = '';
                this.components.progressBar.tooltip.update();
                this.currentTooltipType = 'neutral';
            }

            requestAnimFrame(() => {
                this.setPreBuffer(time);
            });
        }, 10);
    }

    private handleMouseClick(e: MouseEvent) {
        if (!this.options.renderProgress) {
            return;
        }
        const percent = (e.offsetX / this.options.width) * 100;
        requestAnimFrame(() => {
            this.components.progressBar.progress.moveTo(percent);
        });
    }

    private init() {
        const instance = this;
        let progress: Rect = new Rect(0, 0, 0, 0);
        let overlay: Rect = new Rect(0, 0, 0, 0);
        let bufferProgress: Rect = new Rect(0, 0, 0, 0);
        // Create progress bar
        // 1. Create the bar element
        const bar = new Rect(this.options.barHeight, 100, 0, this.options.tooltipHeight + 10);
        bar.addClass('bar');
        this.rootElement.appendChild(bar._el);
        this.components.progressBar.bar = bar;

        // 2. Create the progress element
        if (this.options.renderProgress) {
            // progressContainer = new Rect(5, 100, 0, 10 + this.options.barHeight + this.options.tooltipHeight);
            progress = new Rect(5, 1, 0, 10 + this.options.barHeight + this.options.tooltipHeight);
            // progressContainer.addClass('progress-container');
            progress.addClass('progress');
            progress.moveTo(0);
        }

        // 3. Create the dragging overlay progress
        if (this.options.renderBuffer) {
            bufferProgress = new Rect(this.options.barHeight, 1, 0, this.options.top);
            this.rootElement.appendChild(bufferProgress._el);
            this.components.progressBar.buffer = bufferProgress;
            bufferProgress.addClass('buffer');
            bufferProgress.moveTo(0);
        }

        if (this.options.renderProgress) {
            this.rootElement.appendChild(progress._el);
            this.components.progressBar.progress = progress;
        }

        // 4. Create timeline rects from data if exists
        if (this.options.data) {
            this.setData(this.options.data);
        }

        // 5. Create overlay on top of everything for catching events
        overlay = new Rect(this.options.barHeight * 3, 100, 0, this.options.tooltipHeight, 'rgba(255,255,255,0)');
        overlay.addClass('overlay');
        this.components.progressBar.overlay = overlay;
        this.rootElement.appendChild(overlay._el);

        // 6. Create the tooltip
        if (this.options.renderTooltip) {
            const tooltip = new Tooltip(this.options.tooltipHeight, this.options.tooltipHeight * 2.4, 0, 2, '00:00:00');
            this.components.progressBar.tooltip = tooltip;
            this.rootElement.appendChild(tooltip._el);
        }

        // Add event listeners
        overlay._el.addEventListener('click', this.handleMouseClick.bind(this));
        overlay._el.addEventListener('mouseleave', this.handleMouseLeave.bind(this));
        overlay._el.addEventListener('mousemove', this.handleMouseMove.bind(this));

        this.rootElement.setAttribute('class', 'show');
    }
}

// Expose instance globally
// window['SVGProgressChart'] = SVGProgressChart || {};
