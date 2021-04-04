import { customElement, FASTElement } from '@microsoft/fast-element';

/**
 * Time Line component.
 * @public
 */
@customElement({
    name: 'polygon-drawer'
})
export class PolygonDrawerComponent extends FASTElement {

    private canvas: any;
    private context: any;
    private offsetX = 0;
    private offsetY = 0;
    private clicks: any = [];
    private cursors = ['crosshair', 'grabbing', 'n-resize'];
    private currentCursor = 0;
    private isClosed: boolean;

    private init() {
        // Temporary
        this.canvas = document.createElement('canvas');
        this.canvas.style.border = '1px solid black';
        this.shadowRoot?.appendChild(this.canvas);
        this.context = this.canvas.getContext('2d');

        this.appendEvents();
        this.reOffset();
    }

    private reOffset() {
        var BB = this.canvas.getBoundingClientRect();
        this.offsetX = BB.left;
        this.offsetY = BB.top;
    }

    private drawPolygon() {
        this.context.fillStyle = 'rgba(100,100,100,0.5)';
        this.context.strokeStyle = "#df4b26";
        this.context.lineWidth = 1;

        this.context.beginPath();
        this.context.moveTo(this.clicks[0].x, this.clicks[0].y);
        for (var i = 1; i < this.clicks.length; i++) {
            this.context.lineTo(this.clicks[i].x, this.clicks[i].y);
        }

        // Compare between the dots.
        // If the last click equal to the first one, close the polygon
        const lastClickX = this.clicks[this.clicks.length - 1].x;
        const lastClickY = this.clicks[this.clicks.length - 1].y;
        const diffX = Math.abs(lastClickX - this.clicks[0].x);
        const diffY = Math.abs(lastClickY - this.clicks[0].y);
        if (this.clicks.length > 1 && diffX < 10 && diffY < 10) {
            this.context.closePath();
            this.context.fill();
            this.isClosed = true;
        }
        this.context.stroke();
    };

    private drawPoints() {
        this.context.strokeStyle = "#df4b26";
        this.context.lineJoin = "round";
        this.context.lineWidth = 5;

        for (var i = 0; i < this.clicks.length; i++) {
            this.context.beginPath();
            this.context.arc(this.clicks[i].x, this.clicks[i].y, 3, 0, 2 * Math.PI, false);
            this.context.fillStyle = '#ffffff';
            this.context.fill();
            this.context.lineWidth = 5;
            this.context.stroke();
        }
    };

    private redraw() {
        this.context.clearRect(0, 0, 500, 500); // Clear the canvas

        this.drawPolygon();
        this.drawPoints();
    };

    private handleMouseMove(e: MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        const mouseX = e.clientX - this.offsetX;
        const mouseY = e.clientY - this.offsetY;

        // Determine cursor by its position
        var newCursor;
        if (this.clicks.length !== 0) {
            const diffX = Math.abs(mouseX - this.clicks[0].x);
            const diffY = Math.abs(mouseY - this.clicks[0].y);

            var s = this.clicks[0];

            if (diffX < 10 && diffY < 10) {
                newCursor = s.cursor;
            }
            if (!newCursor) {
                if (this.currentCursor > 0) {
                    this.currentCursor = 0;
                    this.canvas.style.cursor = this.cursors[this.currentCursor];
                }
            } else if (newCursor !== this.currentCursor) {
                this.currentCursor = newCursor;
                this.canvas.style.cursor = this.cursors[this.currentCursor];
            }
        }
    }

    private handleMouseUp(e: MouseEvent) {
        if (this.isClosed) {
            return;
        }

        this.clicks.push({
            x: e.offsetX,
            y: e.offsetY,
            cursor: (this.clicks.length === 0) ? 1 : 0,
            counter: 1
        });

        this.redraw();
    }

    private appendEvents() {
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    public connectedCallback() {
        super.connectedCallback();
        this.init();
    }

}
