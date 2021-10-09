/* eslint-disable @typescript-eslint/no-explicit-any */
import { ICanvasOptions } from '../../../../common/canvas/canvas.definitions';
import { CanvasElement } from '../../../../common/canvas/canvas.element';

export class BoundingBoxDrawer extends CanvasElement {
    public data: any = [];
    private requestAnimFrameCounter: number;
    private timeToInstances: ITimeToInstance = [];
    private _isOn: boolean = false;
    private _boxOn: boolean = false;
    private _attributesOn: boolean = false;
    private _trackingOn: boolean = false;
    private _trackingPoints: object = {};
    private _colorMap: object = {};

    private readonly PADDING_RIGHT = 4;
    private readonly PADDING_TOP = 2;
    private readonly PADDING_TOP_TEXT = 6;
    private readonly COLORS = ['#1890F1', '#F1707B', '#92C353', '#FFC328', '#DB5FFF', '#D84A1B', '#642AB5'];

    public constructor(options: ICanvasOptions, private video: HTMLVideoElement) {
        super(options);
        this.setCanvasSize(options.width, options.height);
        this.setCanvasStyle();
        this.setContextStyle();
    }

    public get isOn() {
        return this._isOn;
    }

    // Start the animation
    public on() {
        this._isOn = true;
        this.setCanvasSize(this.video.clientWidth, this.video.clientHeight);
        this.setContextStyle();
        this.playAnimation();

        // Add listeners to play and pause
        this.video.addEventListener('play', this.playAnimation.bind(this));
        this.video.addEventListener('pause', this.pauseAnimation.bind(this));
        this.video.addEventListener('seeking', this.clear.bind(this));
    }

    public updateIsBox() {
        this._boxOn = !this._boxOn;
    }

    public updateIsAttributes() {
        this._attributesOn = !this._attributesOn;
    }

    public updateIsTracking() {
        this._trackingOn = !this._trackingOn;
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

    public roundRect(x: number, y: number, w: number, h: number, radius: number) {
        const context = this.context;
        const r = x + w;
        const b = y + h;
        context.beginPath();
        context.lineWidth= 0;
        context.moveTo(x+radius, y);
        context.lineTo(r-radius, y);
        context.quadraticCurveTo(r, y, r, y+radius);
        context.lineTo(r, y+h-radius);
        context.quadraticCurveTo(r, b, r-radius, b);
        context.lineTo(x+radius, b);
        context.quadraticCurveTo(x, b, x, b-radius);
        context.lineTo(x, y+radius);
        context.quadraticCurveTo(x, y, x+radius, y);
        context.stroke();
        context.fillStyle = 'rgba(0, 0, 0, 0.74)';
        context.fill();
    }

    public canvasArrow(fromx: number, fromy: number, tox: number, toy: number) {
        const headlen = 5; // length of head in pixels
        const dx = tox - fromx;
        const dy = toy - fromy;
        const angle = Math.atan2(dy, dx);
        this.context.moveTo(fromx, fromy);
        this.context.lineTo(tox, toy);
        this.context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        this.context.moveTo(tox, toy);
        this.context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
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

            const orientationPointY = y + h;
            const trackingLinePointY = y + h;

            // Draw bounding box
            if (this._boxOn){
                this.context.strokeRect(x, y, w, h);
            }

            this.context.lineWidth = 1;
            this.context.strokeStyle = 'rgba(255, 255, 255, 0.74)';
            if (this._boxOn){
                this.context.strokeRect(x + 2, y + 2, w - 4, h - 4);
            }

            const cornerRadius = 5;
            this.context.fillStyle = 'rgba(0, 0, 0, 0.74)';
            this.context.strokeStyle = 'rgba(0, 0, 0, 0.74)';
            this.context.lineJoin = 'round';
            this.context.lineWidth = cornerRadius;

            if (instanceData.entity) {
                if (!Object.prototype.hasOwnProperty.call(this._colorMap, instanceData.entity.trackingId)) {
                    this._colorMap[instanceData.entity.trackingId] = this.COLORS[Object.keys(this._colorMap).length % this.COLORS.length];
                }
                const color = this._colorMap[instanceData.entity.trackingId];

                const Id = instanceData.entity.trackingId.slice(instanceData.entity.trackingId.length - 6, instanceData.entity.trackingId.length);
                let label = `${instanceData.entity.tag} ${Id}`;
                let speed = `${instanceData.entity.speed}`;
                const orientation = `${instanceData.entity.orientation}`;

                let labelWidth = this.displayTextWidth(label);
                if (labelWidth > w) {
                    label = `${label.substring(0, 10)}...`;
                    labelWidth = this.displayTextWidth(label);
                }

                if (speed.length > 3) {
                    speed = parseFloat(speed).toFixed(1).toString();
                }

                const floatSpeed = parseFloat(speed);
                speed = speed + ' ft/s';

                this.getFontSize();
                const width = labelWidth + this.PADDING_RIGHT * 2 * this.ratio;
                const height = this.getFontSize() + this.PADDING_TOP * 2 * this.ratio;

                if (this._attributesOn) {

                    // Show the tag box and tag
                    this.context.strokeRect(x + this.PADDING_RIGHT, y - height - this.ratio, width + height, height);
                    this.context.fillRect(x + this.PADDING_RIGHT, y - height - this.ratio, width + height, height);

                    this.context.fillStyle = color;
                    this.context.fillRect(
                        x + this.PADDING_RIGHT * this.ratio + height/6,
                        y - this.PADDING_TOP * 2 * this.ratio - 2 * height/3,
                        2 * height/3,
                        2 * height/3
                    );

                    this.context.fillStyle = 'white';
                    this.context.fillText(label, x + this.PADDING_RIGHT * this.ratio + height, y - this.PADDING_TOP * 2 * this.ratio);
                    this.context.fillStyle = 'rgba(0, 0, 0, 0.74)';
                    
                    // Draw speed round pill
                    const speedWidth = this.displayTextWidth(speed) + 2.5 * height;
                    this.roundRect(x + w/2 - height/2, orientationPointY - height/2, speedWidth, height, height/2);
                    
                    // Draw the dot in the speed round pill
                    this.context.beginPath();
                    this.context.strokeStyle = color;
                    this.context.arc(x + w/2, orientationPointY, height/4, 0, 2 * Math.PI, true);
                    this.context.fillStyle = color;
                    this.context.fill();
                    
                    // Draw orientation arrow
                    if (floatSpeed === 0 || speed === 'inf'){
                        this.context.beginPath();
                        this.context.strokeStyle = 'white';
                        this.context.lineWidth = 3;
                        this.context.arc(x + w/2 + height, orientationPointY, 1, 0, 2 * Math.PI, true);
                        this.context.fillStyle = 'white';
                        this.context.fill();
                        this.context.stroke();
                    } else {
                        const floatOrientation = parseFloat(orientation);

                        this.context.beginPath();
                        this.context.lineWidth = 1;
                        this.context.strokeStyle = 'white';
                        this.context.moveTo(x + w/2 + height, orientationPointY);
                        this.context.lineTo(
                            x + w/2 + height + height/2 * Math.cos(floatOrientation - Math.PI),
                            orientationPointY + height/2 * Math.sin(floatOrientation - Math.PI)
                        );
                        this.context.closePath();
                        this.context.stroke();

                        this.context.beginPath();
                        this.context.strokeStyle = 'white';
                        this.context.lineWidth = 1;
                        this.canvasArrow(
                            x + w/2 + height,
                            orientationPointY,
                            x + w/2 + height + height/2 * Math.cos(floatOrientation),
                            orientationPointY + height/2 * Math.sin(floatOrientation)
                        );
                        this.context.stroke();
                    }

                    // Draw speed text
                    this.context.fillStyle = 'white';
                    this.context.fillText(speed, x + w/2 + 1.5 * height, orientationPointY + height/4);
                }

                if (!Object.prototype.hasOwnProperty.call(this._trackingPoints, instanceData.entity.trackingId)) {
                    this._trackingPoints[instanceData.entity.trackingId] = [[x + w/2, trackingLinePointY]];
                } else {
                    const length = this._trackingPoints[instanceData.entity.trackingId].length;
                    const lastX = this._trackingPoints[instanceData.entity.trackingId][length - 1][0];
                    const lastY = this._trackingPoints[instanceData.entity.trackingId][length - 1][1];
                    if (
                        Math.abs(x + w/2 - lastX) > 50 || Math.abs(trackingLinePointY - lastY) > 50
                    ) {
                        this._trackingPoints = {};
                        this._trackingPoints[instanceData.entity.trackingId] = [[x + w/2, trackingLinePointY]];
                    } else {
                        if (this._trackingPoints[instanceData.entity.trackingId].length > 240) {
                            this._trackingPoints[instanceData.entity.trackingId].shift();
                        }
                        this._trackingPoints[instanceData.entity.trackingId].push([x + w/2, trackingLinePointY]);
                    }
                }

                if (this._trackingOn) {
                    if (this._trackingPoints[instanceData.entity.trackingId].length !== 0) {
                        // Draw the current position dot for the tracking line
                        this.context.beginPath();
                        this.context.strokeStyle = color;
                        this.context.arc(x + w/2, trackingLinePointY, height/4, 0, 2 * Math.PI, true);
                        this.context.fillStyle = color;
                        this.context.fill();

                        // Draw the tracking line
                        this.context.beginPath();
                        this.context.strokeStyle = color;
                        this.context.lineWidth = 2;
                        this.context.moveTo(
                            this._trackingPoints[instanceData.entity.trackingId][0][0],
                            this._trackingPoints[instanceData.entity.trackingId][0][1]
                        );
                        for (const point of this._trackingPoints[instanceData.entity.trackingId]) {
                            this.context.lineTo(point[0], point[1]);
                        }
                        this.context.stroke();
                    }
                }
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
    speed: string;
    trackingId: string;
    orientation: string;
}
