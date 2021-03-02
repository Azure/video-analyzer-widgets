import { TrimSpacesRegEx, IShowable, Colors } from './interfaces';
import { toTimeText } from '../../../../../common/utils/time';
// tslint:disable-next-line: no-http-string
export const SVGSchemaURI = 'http://www.w3.org/2000/svg';

export abstract class Shape {
    public width: number = 0;
    public defaultWidth: number = 0;
    public height: number = 0;
    public x: number = 0;
    public y: number = 0;
    public color: string = '';
    public classList: string[] = [];
    // tslint:disable-next-line: no-any
    public _el: SVGElement | any;
    public className: string = '';

    constructor(h: number, w: number, x: number, y: number, color?: string, className?: string) {
        this.height = h;
        this.width = w;
        this.defaultWidth = w;
        this.x = x;
        this.y = y;
        if (color) {
            this.color = color;
        }
        if (className) {
            this.className = className;
        }
        this.classList = [];
    }

    public abstract createElement(): SVGElement | any;
    public abstract update(): void;

    // Add class to svg element
    public addClass(cls: string) {
        if ('classList' in this._el) {
            this._el.classList.add(cls);
        } else {
            this._el.className.baseVal = this._el.className.baseVal + ' ' + cls;
        }
    }

    // jQuery Implementation of removeClass
    public removeClass(cls: string) {
        if ('classList' in this._el) {
            this._el.classList.remove(cls);
        } else {
            this._el.className.baseVal = this._el.className.baseVal.replace(this.classReg(cls), ' ');
        }
    }

    // jQuery Implementation of hasClass
    public hasClass(selector: string): boolean {
        const className = ' ' + selector + ' ';
        const l = this._el['length'];

        for (let i = 0; i < l; i = i + 1) {
            if (this._el[i].nodeType === 1 && (' ' + this._el[i].className + ' ').replace(/[\t\r\n]/g, ' ').indexOf(className) >= 0) {
                return true;
            }
        }

        return false;
    }

    private classReg(className: string) {
        return new RegExp('(^|\\s+)' + className + '(\\s+|$)');
    }
}

export class Rect extends Shape implements IShowable {
    public value: number = 0;
    public type?: string;
    public addTabIndex = false;
    constructor(h: number, w: number, x: number, y: number, color?: string, className?: string) {
        super(h, w, x, y, color, className);
        this._el = this.createElement();
        this.update();
    }

    public createElement(): SVGRectElement {
        return <SVGRectElement>document.createElementNS(SVGSchemaURI, 'rect');
    }

    public update() {
        const element = <SVGRectElement>this._el;
        if (!element || !isFinite(this.width) || !isFinite(this.height)) {
            return;
        }

        element.setAttribute('width', this.width.toString() + '%');
        element.setAttribute('height', this.height.toString());
        element.setAttribute('x', this.x.toString() + '%');
        element.setAttribute('y', this.y.toString());
        element.setAttribute('class', 'transition');
        if (this.addTabIndex) {
            element.setAttribute('tabindex', '0');
        }

        if (!!this.className) {
            element.setAttribute('style', `fill:var(--${this.className}-color)`);
        } else if (this.color) {
            element.setAttribute('style', `fill:${this.color}`);
        }

        this.classList.forEach((cls) => {
            if (!element.classList.contains(cls)) {
                element.classList.add(cls);
            }
        });
    }

    public remove() {
        this._el.remove();
    }

    public moveTo(percent: number) {
        percent = Math.min(percent, 100);
        this._el.setAttribute('transform', `scale(${percent},1)`);
        this._el.style.transform = `scale3d(${percent},1,1)`;
        this._el.style.webkitTransform = `scale3d(${percent},1,1)`;
        this._el.style['-ms-transform'] = `scale3d(${percent},1,1)`;
        this.value = percent;
    }

    public show() {
        this.addClass('show');
    }

    public hide() {
        this.removeClass('hide');
    }
}

export class Tooltip extends Shape implements IShowable {
    public text: string = '';
    public backgroundColor: string = '';
    public components: {
        text: SVGTextElement;
        path: SVGPathElement;
    };

    constructor(h: number, w: number, x: number, y: number, text: string, color?: string, css?: any) {
        super(h, w, x, y, color);
        this.text = text || '00:00:00';
        this.components = {
            text: <SVGTextElement>document.createElementNS(SVGSchemaURI, 'text'),
            path: <SVGPathElement>document.createElementNS(SVGSchemaURI, 'path')
        };
        this._el = this.createElement();
    }

    public createElement(): SVGGElement {
        const path: SVGPathElement = <SVGPathElement>document.createElementNS(SVGSchemaURI, 'path');
        const text: SVGTextElement = <SVGTextElement>document.createElementNS(SVGSchemaURI, 'text');
        text.textContent = this.text;
        text.setAttribute('x', `${this.x + this.width / 2 - 20}`);
        text.setAttribute('y', `${this.y + this.height / 2 + 4}`);
        text.setAttribute('fill', 'rgba(0,0,0,.6)');
        if (this.color) {
            text.setAttribute('fill', `${this.color}`);
        }
        this.components.text = text;
        this.components.path = path;

        this.setDefaultWidth();
        const tooltip: SVGGElement = <SVGGElement>document.createElementNS(SVGSchemaURI, 'g');
        if (this.backgroundColor) {
            tooltip.setAttribute('fill', `${this.backgroundColor}`);
        }

        tooltip.setAttribute('class', 'tooltip');
        tooltip.appendChild(path);
        tooltip.appendChild(text);

        return tooltip;
    }

    public setDefaultWidth() {
        this.width = this.defaultWidth;
        this.components.path.setAttribute(
            'd',
            `M${this.x} ${this.y}
                                              L${this.width + this.x} ${this.y}
                                              L${this.width + this.x} ${this.height + this.y}
                                              L${this.x + this.width / 2 + 5} ${this.height + this.y}
                                              L${this.x + this.width / 2} ${this.height + this.y + 5}
                                              L${this.x + this.width / 2 - 5} ${this.height + this.y}
                                              L${this.x} ${this.height + this.y}`.replace(TrimSpacesRegEx, ' ')
        );
    }

    public setWidth(addedWidth: number) {
        this.width = this.defaultWidth + addedWidth;
        this.components.path.setAttribute(
            'd',
            `M${this.x} ${this.y}
                                              L${this.width + this.x} ${this.y}
                                              L${this.width + this.x} ${this.height + this.y}
                                              L${this.x + this.width / 2 + 5} ${this.height + this.y}
                                              L${this.x + this.width / 2} ${this.height + this.y + 5}
                                              L${this.x + this.width / 2 - 5} ${this.height + this.y}
                                              L${this.x} ${this.height + this.y}`.replace(TrimSpacesRegEx, ' ')
        );
    }

    public show() {
        if (!this.hasClass('show')) {
            this.addClass('show');
        }
    }

    public hide() {
        this.removeClass('show');
    }

    public moveTo(percent: number, time: number) {
        if (percent && time) {
            this._el.setAttribute('transform', `translate(${percent} 0)`);
            this._el.style.transform = `translate3d(${percent}px,0,0)`;
            this._el.style.webkitTransform = `translate3d(${percent}px,0,0)`;
        }
    }

    public setText(time: number, type: string) {
        this.setDefaultWidth();
        this.components.text.textContent = toTimeText(time, true);
    }

    public setColor(color: string) {
        this._el.setAttribute('fill', color);
    }

    public remove() {
        this._el.remove();
    }

    public update() {
        const element = <SVGRectElement>this._el;
        if (!element || !isFinite(this.width) || !isFinite(this.height)) {
            return;
        }

        element.setAttribute('width', this.width.toString() + '%');
        element.setAttribute('height', this.height.toString());
        element.setAttribute('x', this.x.toString() + '%');
        element.setAttribute('y', this.y.toString());
        element.setAttribute('class', 'transition');

        if (this.backgroundColor) {
            element.setAttribute('fill', `${this.backgroundColor}`);
        } else {
            element.setAttribute('fill', 'rgba(0, 0, 0, 0.1)');
        }

        const text: SVGTextElement = <SVGTextElement>element.getElementsByTagNameNS(SVGSchemaURI, 'text')[0];
        if (this.color) {
            text.setAttribute('fill', `${this.color}`);
        } else {
            text.setAttribute('fill', `${Colors.default}`);
        }

        this.classList.forEach((cls) => {
            if (!element.classList.contains(cls)) {
                element.classList.add(cls);
            }
        });
    }
}
