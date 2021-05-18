/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICanvasOptions } from '../../../../common/canvas/canvas.definitions';
import { CanvasElement } from '../../../../common/canvas/canvas.element';

export class BoundingBoxDrawer extends CanvasElement {
    public data: any = [];
    private requestAnimFrameCounter: number;
    private timeToInstances: ITimeToInstance = [];

    private readonly PADDING_RIGHT = 4;
    private readonly PADDING_TOP = 2;
    private readonly PADDING_TOP_TEXT = 6;

    public constructor(options: ICanvasOptions, private video: HTMLVideoElement) {
        super(options);
        this.setCanvasSize(options.width, options.height);
        this.setCanvasStyle();
        this.setContextStyle();
    }

    // Start the animation
    public on() {
        this.setCanvasSize(this.video.clientWidth, this.video.clientHeight);
        this.setContextStyle();
        this.playAnimation();

        // Add listeners to play and pause
        this.video.addEventListener('play', this.playAnimation.bind(this));
        this.video.addEventListener('pause', this.pauseAnimation.bind(this));
    }

    public setCanvasStyle() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.zIndex = '1';
        this.canvas.style.pointerEvents = 'none';
    }

    // Stop the animation
    public off() {
        this.pauseAnimation();
        this.video.removeEventListener('play', this.playAnimation.bind(this));
        this.video.removeEventListener('pause', this.pauseAnimation.bind(this));
    }

    public clearInstances() {
        this.timeToInstances = [];
    }

    public addItem(time: number, instance: any) {
        // Add new item to pack
        if (!this.timeToInstances[time?.toFixed(6)]) {
            this.timeToInstances[time?.toFixed(6)] = [];
        }

        this.timeToInstances[time?.toFixed(6)].push(instance);
    }

    public draw() {
        if (!this.requestAnimFrameCounter) {
            return;
        }

        this.context.globalCompositeOperation = 'destination-over';
        this.context.save();
        this.clear();
        const videoRatio = this.video.videoWidth / this.video.videoHeight;
        this.setCanvasSize(this.video.clientWidth, this.video.clientWidth / videoRatio);
        this.setContextStyle();
        this.canvas.style.marginTop = '0';
        if (window.document?.fullscreenElement) {
            const paddingTop = (this.video.clientHeight - this.video.clientWidth / videoRatio) / 2;
            this.canvas.style.marginTop = `${paddingTop}px`;
        }

        // take current time
        const currentTime = this.video.currentTime;

        // Take times
        const times = Object.keys(this.timeToInstances);
        let currentInstances: IInstanceData[] = [];
        let previousInstances: IInstanceData[] = [];
        for (let index = 0; index < times.length - 1; index++) {
            const timespan1 = times[index];
            const timespan2 = times[index + 1];
            if (currentTime >= Number(timespan1) && currentTime <= Number(timespan2)) {
                previousInstances = [...currentInstances];
                currentInstances = this.timeToInstances[timespan1];
            }
        }

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let index = 0; index < currentInstances.length; index++) {
            const instanceData = currentInstances[index];
            const prevBoxPlace = previousInstances[index];
            if (prevBoxPlace) {
                const gapX = Math.abs(instanceData.l - prevBoxPlace.l);
                const gapY = Math.abs(instanceData.t - prevBoxPlace.t);
                if (gapY <= 5 && gapY <= 5) {
                    this.context.arc(gapX, gapY, 50, 0, 180);
                }
            }

            this.context.lineWidth = 2;
            this.context.lineJoin = 'miter';
            this.context.strokeStyle = 'rgba(0, 0, 0, 0.87)';
            const x = Math.floor(instanceData.l * this.canvas.width);
            const y = Math.floor(instanceData.t * this.canvas.height);
            const w = Math.floor(instanceData.w * this.canvas.width);
            const h = Math.floor(instanceData.h * this.canvas.height);
            this.context.strokeRect(x, y, w, h);

            this.context.lineWidth = 1;
            this.context.strokeStyle = 'rgba(255, 255, 255, 0.74)';
            this.context.strokeRect(x + 2, y + 2, w - 4, h - 4);

            const cornerRadius = 5;
            this.context.fillStyle = 'rgba(0, 0, 0, 0.74)';
            this.context.strokeStyle = 'rgba(0, 0, 0, 0.74)';
            this.context.lineJoin = 'round';
            this.context.lineWidth = cornerRadius;

            if (instanceData.entity) {
                let label = `${instanceData.entity.tag} ${instanceData.entity.id || ''}`;
                let labelWidth = this.displayTextWidth(label);
                if (labelWidth > w) {
                    label = `${label.substring(0, 10)}...`;
                    labelWidth = this.displayTextWidth(label);
                }
                this.getFontSize();
                const width = labelWidth + this.PADDING_RIGHT * 2 * this.ratio;
                const height = this.getFontSize() + this.PADDING_TOP * 2 * this.ratio;
                this.context.strokeRect(x + this.PADDING_RIGHT, y - height - this.ratio, width, height);
                this.context.fillRect(x + this.PADDING_RIGHT, y - height - this.ratio, width, height);

                this.context.fillStyle = 'white';

                this.context.fillText(label, x + this.PADDING_RIGHT * this.ratio, y - this.PADDING_TOP * 2 * this.ratio);
            }

            this.context.stroke();
        }

        this.requestAnimFrameCounter = window.requestAnimationFrame(this.draw.bind(this));
    }

    public resize(): void {
        // Clear canvas
        this.clear();
        setTimeout(() => {
            this.setCanvasSize(this.video.clientWidth, this.video.clientHeight);
            this.setContextStyle();
            this.draw();
        });
    }

    public playAnimation() {
        if (this.requestAnimFrameCounter) {
            this.pauseAnimation();
        }
        this.requestAnimFrameCounter = window.requestAnimationFrame(this.draw.bind(this));
    }

    private pauseAnimation() {
        window.cancelAnimationFrame(this.requestAnimFrameCounter);
        this.requestAnimFrameCounter = 0;
    }

    private displayTextWidth(text: string) {
        const metrics = this.context.measureText(text);
        return metrics.width;
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

export interface IInstanceData {
    h: number;
    l: number;
    t: number;
    w: number;
    entity?: IEntity;
}

export interface IEntity {
    id: number;
    tag: string;
}
