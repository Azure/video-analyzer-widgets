/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { attr, customElement, FASTElement } from '@microsoft/fast-element';
import { toInteger } from 'lodash-es';
import { MediaApi } from '../../../common/services/media/media-api.class';
import { IAvailableMediaResponse, Precision } from '../../../common/services/media/media.definitions';
import { DatePickerEvent, IDatePickerRenderEvent } from '../date-picker-component/date-picker-component.definitions';
import { Player } from './player.class';
import { styles } from './rvx-player.style';
import { template } from './rvx-player.template';
/**
 * RVX Player web component
 * @public
 */
@customElement({
    name: 'rvx-player',
    template,
    styles
})
export class PlayerComponent extends FASTElement {
    @attr public liveStream: string;
    @attr public vodStream: string;

    @attr public isLive = true;
    @attr public time = '';
    @attr public cameraName = 'Camera';
    @attr public currentDate = new Date();
    @attr public currentAllowedDays: string[] = [];
    @attr public currentAllowedMonths: string[] = [];
    @attr public currentAllowedYears: string[] = [];

    public player: Player;

    private video!: HTMLVideoElement;
    private videoContainer!: HTMLElement;
    private allowedDates: any = [];
    private afterInit = false;
    private connected = false;

    public constructor() {
        super();
    }

    public async init() {
        if (!this.connected) {
            return;
        }

        this.liveStream = MediaApi.baseStream ? MediaApi.getLiveStream() : this.liveStream;
        this.vodStream = MediaApi.baseStream ? MediaApi.getVODStream() : this.vodStream;

        // Init  player
        this.player = new Player(this.video, this.videoContainer, this.liveStream, this.vodStream, this.timeUpdateCallBack.bind(this));

        if (!MediaApi.baseStream) {
            return;
        }
        await this.fetchAvailableYears();

        // First initialization - init month and dates
        const currentYear = this.currentDate.getFullYear();
        const currentMonth = this.currentDate.getMonth() + 1;
        await this.updateMonthAndDates(currentYear, currentMonth);
    }

    public cameraNameChanged() {
        this.cameraName = this.cameraName || 'Camera';
    }

    public liveStreamChanged() {
        setTimeout(() => {
            if (this.player) {
                this.player.liveStream = this.liveStream;
            }
        });
    }

    public vodStreamChanged() {
        setTimeout(() => {
            if (this.player) {
                this.player.vodStream = this.vodStream;
            }
        });
    }

    public async connectedCallback() {
        super.connectedCallback();

        this.video = this.shadowRoot?.querySelector('#player-video') as HTMLVideoElement;
        this.videoContainer = this.shadowRoot?.querySelector('.video-container') as HTMLElement;
        this.connected = true;
        if (!this.video) {
            return;
        }

        document.addEventListener('player_live', ((event: CustomEvent) => {
            this.isLive = event.detail;
        }) as EventListener);

        const datePickerComponent: any = this.shadowRoot?.querySelector('media-date-picker');

        datePickerComponent.addEventListener(DatePickerEvent.DATE_CHANGE, (event: CustomEvent) => {
            if (event.detail?.toDateString() !== this.currentDate?.toDateString()) {
                this.currentDate = event.detail;
                // Load vod stream
                const nextDay = new Date(this.currentDate);
                nextDay.setDate(this.currentDate.getDate() + 1);
                this.vodStream = MediaApi.getVODStream({
                    start: this.currentDate,
                    end: nextDay
                });

                // Switch to VOD
                this.player.vodStream = this.vodStream;
                this.player.toggleLiveMode(false);
                this.isLive = false;
                // this.initAvailableDates();
            }
        });

        datePickerComponent.addEventListener(DatePickerEvent.RENDER, (event: CustomEvent) => {
            console.log(event.detail);
            const data = event.detail as IDatePickerRenderEvent;
            if (this.afterInit) {
                this.updateMonthAndDates(data.year, data.month + 1);
            }
        });

        this.init();

        this.afterInit = true;
    }

    private async fetchAvailableYears() {
        const availableYears = await MediaApi.getAvailableMedia(Precision.YEAR);
        const yearRanges: IAvailableMediaResponse = await availableYears.json();

        for (const range of yearRanges.timeRanges) {
            const start = toInteger(range.start);
            const end = toInteger(range.end);
            // Fill years between start-end
            for (let index = start; index <= end; index++) {
                this.allowedDates[index] = [];
            }
        }

        this.currentAllowedYears = Object.keys(this.allowedDates);
    }

    private async fetchAvailableMonths(year: number) {
        // Take available months according to year
        const availableMonths = await MediaApi.getAvailableMedia(Precision.MONTH, {
            start: new Date(year, 1),
            end: new Date(year, 12)
        });
        const monthRanges: IAvailableMediaResponse = await availableMonths.json();

        // Get last available month
        for (const range of monthRanges.timeRanges) {
            const start = new Date(range.start).getMonth() + 1;
            const end = new Date(range.end).getMonth() + 1;
            // Fill years between start-end
            for (let index = start; index <= end; index++) {
                this.allowedDates[year][index] = [];
            }
        }
    }

    private async fetchAvailableDays(year: number, month: number) {
        // fetch available days
        const availableDays = await MediaApi.getAvailableMedia(Precision.DAY, {
            start: new Date(`${year} ${month} Z`),
            end: new Date(year, month)
        });

        const dayRanges: IAvailableMediaResponse = await availableDays.json();

        this.allowedDates[year][month] = [];
        for (const range of dayRanges.timeRanges) {
            const start = new Date(range.start).getDate();
            const end = new Date(range.end).getDate();
            // Fill years between start-end
            for (let index = start; index <= end; index++) {
                this.allowedDates[year][month].push(index);
            }
        }
    }

    private async updateMonthAndDates(year: number, month: number) {
        this.currentAllowedDays = [];
        this.currentAllowedMonths = [];

        // If this year is available
        if (this.allowedDates[year]) {
            if (this.allowedDates[year].length) {
                this.currentAllowedMonths = Object.keys(this.allowedDates[year]);
                if (this.allowedDates[year][month]) {
                    if (this.allowedDates[year][month].length) {
                        this.currentAllowedDays = this.allowedDates[year][month];
                    } else {
                        // get days of this month
                        await this.fetchAvailableDays(year, month);
                        await this.updateMonthAndDates(year, month);
                    }
                } else {
                    // there is no available dates in the month
                }
            } else {
                // Get all months data
                await this.fetchAvailableMonths(year);
                // Update data
                await this.updateMonthAndDates(year, month);
            }
        } else {
            // there is no data - keep empty arrays
        }
    }

    private timeUpdateCallBack(time: string) {
        this.time = time;
    }
}
