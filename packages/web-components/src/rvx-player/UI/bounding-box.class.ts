/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICanvasOptions } from '../../../../common/canvas/canvas.definitions';
import { CanvasElement } from '../../../../common/canvas/canvas.element';

export class BoundingBoxDrawer extends CanvasElement {
    public data: any = [];
    private requestAnimFrameCounter: number;
    private timeToInstances: ITimeToInstance = [];
    private _isOn = false;

    private readonly PADDING_RIGHT = 4;
    private readonly PADDING_TOP = 18;
    private readonly PADDING_TOP_TEXT = 6;

    public constructor(options: ICanvasOptions, private video: HTMLVideoElement) {
        super(options);
        this.setCanvasSize(options.width, options.height);
        this.setCanvasStyle();
    }

    public get isOn() {
        return this._isOn;
    }

    // Start the animation
    public on() {
        this._isOn = true;
        this.setCanvasSize(this.video.clientWidth, this.video.clientHeight);
        this.playAnimation();

        // Add listeners to play and pause
        this.video.addEventListener('play', this.playAnimation.bind(this));
        this.video.addEventListener('pause', this.pauseAnimation.bind(this));
        this.video.addEventListener('seeking', this.clear.bind(this));
    }

    public destroy() {
        this.clearInstances();
        this.clear();
        this.off();
    }

    public setCanvasStyle() {
        this.canvas.style.position = 'absolute';
        this.canvas.style.zIndex = '1';
        this.canvas.style.pointerEvents = 'none';
    }

    public clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Stop the animation
    public off() {
        this._isOn = false;
        this.pauseAnimation();
        this.video.removeEventListener('play', this.playAnimation.bind(this));
        this.video.removeEventListener('pause', this.pauseAnimation.bind(this));
        this.video.removeEventListener('seeking', this.clear.bind(this));
    }

    public clearInstances() {
        this.timeToInstances = [];
    }

    public addItem(time: number, endTime: number, instance: IInstanceData) {
        // Add new item to pack
        if (!this.timeToInstances[time?.toFixed(6)]) {
            this.timeToInstances[time?.toFixed(6)] = {
                end: endTime,
                instanceData: []
            };
        }

        this.timeToInstances[time?.toFixed(6)].instanceData.push(instance);
    }

    public draw() {
        if (!this.requestAnimFrameCounter) {
            return;
        }

        this.context.globalCompositeOperation = 'destination-over';
        this.context.save();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvas.width = this.video.clientWidth;
        this.canvas.height = this.video.clientHeight;
        // take current time
        const currentTime = this.video.currentTime;

        // Take times
        const times = Object.keys(this.timeToInstances);
        let currentInstances: IInstanceData[] = [];
        let previousInstances: IInstanceData[] = [];
        for (let index = 0; index < times.length - 1; index++) {
            const instanceStart = times[index];
            const currentInstance: IInstance = this.timeToInstances[instanceStart];
            const instanceEnd = currentInstance?.end;
            if (currentTime >= Number(instanceStart) && currentTime <= Number(instanceEnd)) {
                previousInstances = [...currentInstances];
                currentInstances = currentInstance.instanceData;
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
                let labelWidth = this.displayTextWidth(label, 'Segoe UI');
                if (labelWidth > w) {
                    label = `${label.substring(0, 10)}...`;
                    labelWidth = this.displayTextWidth(label, 'Segoe UI');
                }
                this.context.strokeRect(
                    x + this.PADDING_RIGHT,
                    y - this.PADDING_TOP + cornerRadius / 2,
                    labelWidth,
                    this.PADDING_TOP - cornerRadius
                );
                this.context.fillRect(
                    x + this.PADDING_RIGHT,
                    y - this.PADDING_TOP + cornerRadius / 2,
                    labelWidth,
                    this.PADDING_TOP - cornerRadius
                );

                this.context.font = '700 10px Segoe UI';

                this.context.fillStyle = 'white';

                this.context.fillText(label, x + this.PADDING_RIGHT, y - this.PADDING_TOP_TEXT);
            }

            this.context.restore();
        }

        this.requestAnimFrameCounter = window.requestAnimationFrame(this.draw.bind(this));
    }

    public resize(): void {
        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        setTimeout(() => {
            this.setCanvasSize(this.video.clientWidth, this.video.clientHeight);
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

    private displayTextWidth(text: string, font: string) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    }
}

export interface ITimeToInstance {
    [time: number]: IInstance;
}

export interface IInstance {
    end: number;
    instanceData: IInstanceData[];
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
