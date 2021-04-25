import { BehaviorSubject } from 'rxjs';
import { IUISegment } from '../segments-timeline.definitions';
import { IChartData, IChartOptions, IComponentTree, Colors } from './svg-progress.definitions';
import { Rect, Tooltip } from './svg-progress.models';

// Define the main class for the progress chart.
export class SVGProgressChart {
    public id: string;
    public rootElement: SVGElement;
    public components: IComponentTree;
    /* eslint-disable-next-line  @typescript-eslint/no-explicit-any */
    public timer: any;
    public lastMatch = false;
    public currentTooltipType: string = 'default';
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

    public activeRect: Rect;
    public activeSegment$: BehaviorSubject<IUISegment> = new BehaviorSubject<IUISegment>(null);

    public constructor(element?: SVGElement, options?: IChartOptions) {
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
        const timeType = typeof time;

        this.updateActiveRect(time);
        if (timeType === 'undefined' || !this.options.renderProgress) {
            return;
        }
        // Make sure the time not pass the max duration
        time = Math.min(time, this.options.time);
        if (Math.abs(time - this.options.time) < 0.5) {
            time = Math.ceil(time);
        }

        // Make sure value is max 100%.
        const value = Math.min((time / this.options.time) * 100, 100);
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
            this.options.width = this.rootElement.parentElement.clientWidth;
        }
    }

    public destroy() {
        // Remove events
        this.clearEvents();

        // Remove elements
        this.components.events.forEach((e) => e.remove());

        // Remove components
        Object.keys(this.components.progressBar).forEach((c) => {
            if (this.components.progressBar[c]) {
                this.components.progressBar[c].remove();
            }
        });
    }

    public setData(data: IChartData[]) {
        // If new data obj less than what exists than delete data.
        this.components.events.forEach((e) => {
            e.remove();
        });

        // Reset
        this.components.events.length = 0;

        // Create events
        data.forEach((event, i) => {
            if (!event.x) {
                event.x = i ? this.options.data[i - 1].x + this.options.data[i - 1].width : 0;
            }
            // If event created - just modify the props.
            if (this.components.events && this.components.events[i] && this.components.events[i]._el) {
                this.components.events[i].x = event.x;
                this.components.events[i].width = event.width;
                this.components.events[i].type = event.type || 'default';
                this.components.events[i].color = event.color ? event.color : Colors[event.type || 'default'];

                if (
                    this.components.events[i].width &&
                    this.components.events[i].x &&
                    this.components.events[i].type &&
                    this.components.events[i].color
                ) {
                    this.components.events[i].update();
                }
            } else {
                const newEvent = new Rect(this.options.barHeight, event.width, event.x, 10 + this.options.tooltipHeight, event.color);
                newEvent.type = event.type;
                newEvent.addClass(event.type || 'default');
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

    public setTabIndex(newTabIndex: string): void {
        this.components.events.forEach((event) => {
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
        const value = Math.min((time / that.options.time) * 100, that.options.time);
        window.requestAnimationFrame(() => {
            that.components.progressBar.buffer.moveTo(value);
        });
    }

    private handleMouseLeave() {
        window.requestAnimationFrame(() => {
            this.components.progressBar.tooltip?.hide();
            if (this.options.renderBuffer) {
                this.components.progressBar.buffer.hide();
            }
        });
    }

    private handelFocusOut() {
        window.requestAnimationFrame(() => {
            this.components.progressBar.tooltip?.hide();
            if (this.options.renderBuffer) {
                this.components.progressBar.buffer.hide();
            }
        });
    }

    private handleFocus(e: FocusEvent) {
        const position: SVGAnimatedLength = e.currentTarget['x'];
        const widthObj: SVGAnimatedLength = e.currentTarget['width'];
        if (position) {
            const xPosition = position.animVal.value;
            const width = widthObj.animVal.value;
            // Reset tooltip
            this.components.progressBar.tooltip?.moveTo(0, 0);

            // Move tooltip to the middle of the event
            this.moveTooltip(xPosition + width / 2);
        }
    }

    private handleMouseMove(e: MouseEvent) {
        this.moveTooltip(e.offsetX);
    }

    private moveTooltip(xPosition: number) {
        if (!this.options.renderTooltip) {
            return;
        }

        const time = (xPosition / this.options.width) * this.options.time;

        clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            this.lastMatch = false;
            this.components.events.forEach((event) => {
                if (!event._el) {
                    return;
                }

                if (
                    xPosition >= (event.x * this.options.width) / 100 &&
                    xPosition < ((event.x + event.width) / 100) * this.options.width &&
                    event.type !== 'neutral'
                ) {
                    this.lastMatch = true;
                    if (event.type !== this.currentTooltipType) {
                        window.requestAnimationFrame(() => {
                            this.components.progressBar.tooltip?.removeClass(this.currentTooltipType);
                            this.currentTooltipType = event.type || 'default';
                            this.components.progressBar.tooltip?.addClass(this.currentTooltipType);
                            this.components.progressBar.tooltip?.updateColor(event.color);
                        });
                    }
                } else {
                    this.components.progressBar.tooltip?.updateColor();
                }

                // Set tooltip text, add event type of there was a focus event
                this.components.progressBar.tooltip?.setText(time);
            });

            if (!this.lastMatch) {
                this.components.progressBar.tooltip?.removeClass(this.currentTooltipType);
                this.currentTooltipType = 'neutral';
            }

            window.requestAnimationFrame(() => {
                this.setPreBuffer(time);
            });
        }, 10);
    }

    private handleMouseClick(e: MouseEvent) {
        const percent = (e.offsetX / this.options.width) * 100;
        this.updateActiveRect(this.options.time * (percent / 100));

        if (!this.options.renderProgress) {
            return;
        }

        window.requestAnimationFrame(() => {
            this.components.progressBar.progress.moveTo(percent);
        });
    }

    private updateActiveRect(time: number) {
        if (this.activeRect) {
            const startTime = (this.activeRect.x / 100) * this.options.time;
            const endTime = (this.activeRect.width / 100) * this.options.time + startTime;
            if (startTime <= time && endTime >= time) {
                return;
            } else {
                this.activeRect.removeClass('active');
                this.activeRect = null;
                this.activeSegment$.next(null);
            }
        }

        this.components.events.forEach((rect) => {
            const startTime = (rect.x / 100) * this.options.time;
            const endTime = (rect.width / 100) * this.options.time + startTime;
            if (startTime <= time && endTime >= time) {
                this.activeRect = rect;
                this.activeRect.addClass('active');
                this.activeSegment$.next({
                    startSeconds: startTime,
                    endSeconds: endTime,
                    color: rect.color
                });
                return;
            }
        });
    }

    private init() {
        let progress;
        let bufferProgress;
        // Create progress bar
        // 1. Create the bar element
        const bar = new Rect(this.options.barHeight, 100, 0, this.options.tooltipHeight + 10);
        bar.addClass('bar');
        this.rootElement.appendChild(bar._el);
        this.components.progressBar.bar = bar;

        // 2. Create the progress element
        if (this.options.renderProgress) {
            progress = new Rect(5, 1, 0, 10 + this.options.barHeight + this.options.tooltipHeight);
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
        const overlay = new Rect(this.options.barHeight * 3, 100, 0, this.options.tooltipHeight, 'rgba(255,255,255,0)');
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
window['SVGProgressChart'] = SVGProgressChart || {};
