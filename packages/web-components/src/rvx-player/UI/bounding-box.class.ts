/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICanvasOptions } from '../../../../common/canvas/canvas.definitions';
import { CanvasElement } from '../../../../common/canvas/canvas.element';

export class BoundingBoxDrawer extends CanvasElement {
    public data: any = [];
    private rafId: number;
    private timeToInstances: ITimeToInstance = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public constructor(options: ICanvasOptions, private video: HTMLVideoElement) {
        super(options);
        this.canvas.width = this.video.clientWidth;
        this.canvas.height = this.video.clientHeight;

        // this.video.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
        this.video.addEventListener('play', this.playAnimation.bind(this));
        this.video.addEventListener('pause', this.pauseAnimation.bind(this));
    }

    public clear() {
        this.pauseAnimation();
        this.video.removeEventListener('play', this.playAnimation);
        this.video.removeEventListener('pause', this.pauseAnimation);
    }

    public clearInstances() {
        this.timeToInstances = [];
    }

    public addItem(time: number, instance: any) {
        if (!this.timeToInstances[time.toFixed(6)]) {
            this.timeToInstances[time.toFixed(6)] = [];
        }

        this.timeToInstances[time.toFixed(6)].push(instance);
    }

    public draw(): void {
        // throw new Error('Method not implemented.');
    }
    public resize(): void {
        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = this.video.clientWidth;
        this.canvas.height = this.video.clientHeight;
    }

    public playAnimation() {
        this.rafId = window.requestAnimationFrame(this.onAnimUpdate.bind(this));
        // this.snapshotMediator.playAnimation();
    }

    private pauseAnimation() {
        window.cancelAnimationFrame(this.rafId);
        this.rafId = 0;
        // this.snapshotMediator.pauseAnimation();
    }

    private onAnimUpdate() {
        if (!this.rafId) {
            return;
        }
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = this.video.clientWidth;
        this.canvas.height = this.video.clientHeight;
        // take current time
        const currentTime = this.video.currentTime;

        // Take times
        const times = Object.keys(this.timeToInstances);
        let currentInstances = [];
        for (let index = 0; index < times.length - 1; index++) {
            const timespan1 = times[index];
            const timespan2 = times[index + 1];
            if (currentTime >= Number(timespan1) && currentTime <= Number(timespan2)) {
                currentInstances = this.timeToInstances[timespan1];
            }
        }

        for (const box of currentInstances) {
            this.context.lineWidth = 2;
            this.context.lineJoin = 'miter';
            this.context.strokeStyle = 'rgba(0, 0, 0, 0.87)';
            const x = Math.floor(box.l * this.canvas.width);
            const y = Math.floor(box.t * this.canvas.height);
            const w = Math.floor(box.w * this.canvas.width);
            const h = Math.floor(box.h * this.canvas.height);
            // draw dashed rectangle for motion.
            // this.context.setLineDash([5, 2]);
            this.context.strokeRect(x, y, w, h);

            this.context.lineWidth = 1;
            this.context.strokeStyle = 'rgba(255, 255, 255, 0.74)';
            this.context.strokeRect(x + 2, y + 2, w - 4, h - 4);

            this.context.fillStyle = 'rgba(0, 0, 0, 0.74)';
            this.context.strokeStyle = 'rgba(0, 0, 0, 0.74)';
            this.context.lineJoin = 'round';
            this.context.lineWidth = 5;
            // this.context.setLineDash([]);
        }

        // Find the objects time
        // take snap shot
        // const snapshotContext = this.snapshotMediator.Snapshot();
        // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // this.context.drawImage(snapshotContext, 0, 0);
        this.rafId = window.requestAnimationFrame(this.onAnimUpdate.bind(this));
    }

    private onTimeUpdate() {
        // Get data
        // const playerTime = this.video.currentTime;
        // const trackedItems = [];
        // // const zeroPad = (num, places) => String(num).padStart(places, '0');
        // for (const item of this.data) {
        //     trackedItems.push(new TrackedItem(item.instances, 'rgba(0, 0, 0, 0.87)', 'item'));
        // }
        // this.snapshotMediator.trackedItems = trackedItems;
    }
}

export interface ITimeToInstance {
    [time: number]: Instance[];
}

export class Instance {
    public points: Point[];

    public start: number;
    public end: number;
    public topLeft: number[];
    public bottomRight: number[];

    public constructor() {}
}

export class Point {
    public x: number;
    public y: number;

    public constructor() {}
}
