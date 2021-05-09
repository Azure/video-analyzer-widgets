/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { attr, customElement, DOM, FASTElement, observable } from '@microsoft/fast-element';
import { MediaApi } from '../../../common/services/media/media-api.class';
import { IAvailableMediaResponse, Precision } from '../../../common/services/media/media.definitions';
import { WidgetGeneralError } from '../../../widgets/src';
import { DatePickerComponent } from '../date-picker';
import { DatePickerEvent, IDatePickerRenderEvent } from '../date-picker/date-picker.definitions';
import { PlayerWrapper } from './player.class';
import { ControlPanelElements } from './rvx-player.definitions';
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

    @attr public isLive = false;
    @observable public time = '';
    @attr public cameraName = 'Camera';
    @attr public currentDate = new Date();

    @attr public currentAllowedDays: string[] = [];
    @attr public currentAllowedMonths: string[] = [];
    @attr public currentAllowedYears: string[] = [];

    public player: PlayerWrapper;
    public datePickerComponent: DatePickerComponent;
    public hasError = false;

    private video!: HTMLVideoElement;
    private timeContainer!: HTMLElement;
    private videoContainer!: HTMLElement;
    private allowedDates: any = [];
    private afterInit = false;
    private connected = false;

    public constructor() {
        super();
        this.classList.add(this.isLive ? 'live-on' : 'live-off');
        this.classList.remove(!this.isLive ? 'live-on' : 'live-off');
    }

    public async init(allowCrossSiteCredentials = true, accessToken?: string, allowedControllers?: ControlPanelElements[]) {
        // Add loading mode
        this.classList.add('loading');

        if (!this.connected) {
            return;
        }

        this.liveStream = MediaApi.baseStream ? MediaApi.getLiveStream() : this.liveStream;
        this.vodStream = MediaApi.baseStream ? MediaApi.getVODStream() : this.vodStream;

        // Reload player
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }

        // Init  player
        this.player = new PlayerWrapper(
            this.video,
            this.videoContainer,
            this.liveStream,
            this.vodStream,
            this.timeUpdateCallBack.bind(this),
            allowedControllers
        );

        if (accessToken) {
            this.player.accessToken = accessToken;
        }
        this.player.allowCrossCred = allowCrossSiteCredentials;

        if (!MediaApi.baseStream) {
            return;
        }
        await this.initializeAvailableMedia();

        await this.player.toggleLiveMode(this.isLive);

        // Add loading mode
        this.classList.remove('loading');
    }

    public setPlaybackAuthorization(accessToken: string) {
        if (accessToken) {
            this.player.accessToken = accessToken;
        }
    }

    public async initializeAvailableMedia() {
        await this.fetchAvailableYears();

        // First initialization - init month and dates
        const currentYear = this.currentDate.getUTCFullYear();
        // Get month and add 1 because months starts from 0
        const currentMonth = this.currentDate.getUTCMonth() + 1;
        await this.updateMonthAndDates(currentYear, currentMonth);

        this.afterInit = true;

        // Select the last recorded date
        if (this.currentAllowedYears.length && this.currentAllowedMonths.length && this.currentAllowedDays.length) {
            const lastYear = this.currentAllowedYears[this.currentAllowedYears.length - 1];
            const lastMonth = this.currentAllowedMonths[this.currentAllowedMonths.length - 1];
            const lastDay = this.currentAllowedDays[this.currentAllowedDays.length - 1];
            const date = new Date(Date.UTC(parseInt(lastYear, 10), parseInt(lastMonth, 10) - 1, parseInt(lastDay, 10)));
            // Get previous day
            this.datePickerComponent.inputDate = date.toUTCString();
        }
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

    public play() {
        this.player?.play();
    }

    public pause() {
        this.player?.pause();
    }

    public handleError() {
        this.hasError = true;
        this.classList.add('error');
    }

    public async connectedCallback() {
        super.connectedCallback();

        this.video = this.shadowRoot?.querySelector('#player-video') as HTMLVideoElement;
        this.videoContainer = this.shadowRoot?.querySelector('.video-container') as HTMLElement;
        this.timeContainer = this.shadowRoot?.querySelector('.time-container') as HTMLElement;

        this.connected = true;
        if (!this.video) {
            return;
        }

        document.addEventListener('player_live', ((event: CustomEvent) => {
            this.isLive = event.detail;
            this.classList.add(this.isLive ? 'live-on' : 'live-off');
            this.classList.remove(!this.isLive ? 'live-on' : 'live-off');
        }) as EventListener);

        document.addEventListener('player_next_day', () => {
            this.selectNextDay();
        });

        document.addEventListener('player_prev_day', () => {
            this.selectPrevDay();
        });

        this.datePickerComponent = this.shadowRoot?.querySelector('media-date-picker');

        this.datePickerComponent.addEventListener(DatePickerEvent.DATE_CHANGE, ((event: CustomEvent<Date>) => {
            if (event.detail?.toUTCString() !== this.currentDate?.toUTCString()) {
                this.currentDate = event.detail;

                this.updateVODStream();
            }
        }) as EventListener);

        this.datePickerComponent.addEventListener(DatePickerEvent.RENDER, ((event: CustomEvent<IDatePickerRenderEvent>) => {
            const data = event.detail;
            if (this.afterInit) {
                this.updateMonthAndDates(data.year, data.month + 1);
            }
        }) as EventListener);
    }

    private async selectNextDay() {
        const nextDay = new Date(this.currentDate);
        nextDay.setDate(nextDay.getDate() + 1);

        await this.adjustNewDate(nextDay);
    }

    private async selectPrevDay() {
        const prevDay = new Date(this.currentDate);
        prevDay.setDate(prevDay.getDate() - 1);

        await this.adjustNewDate(prevDay);
    }

    private async adjustNewDate(date: Date) {
        const adjustedDateYear = date.getUTCFullYear();
        const adjustedDateMonth = date.getUTCMonth() + 1;
        const adjustedDateDay = date.getUTCDate();
        // First, check if it available
        if (this.allowedDates[adjustedDateYear] && this.allowedDates[adjustedDateYear][adjustedDateMonth]) {
            const allowedDays = this.allowedDates[adjustedDateYear][adjustedDateMonth];
            if (allowedDays.indexOf(adjustedDateDay) > -1) {
                this.datePickerComponent.inputDate = date.toUTCString();
            } else if (!allowedDays.length) {
                // Need to fetch data there is no data for this month
                await this.fetchAvailableDays(adjustedDateYear, adjustedDateMonth);
                await this.updateMonthAndDates(adjustedDateYear, adjustedDateMonth);

                if (this.allowedDates[adjustedDateYear][adjustedDateMonth].indexOf(adjustedDateDay) > -1) {
                    this.datePickerComponent.inputDate = date.toUTCString();
                }
            }
        }
    }

    private updateVODStream() {
        if (!this.afterInit) {
            return;
        }
        // Load vod stream
        const nextDay = new Date(this.currentDate);
        nextDay.setDate(this.currentDate.getDate() + 1);
        this.vodStream = MediaApi.getVODStream({
            start: this.currentDate,
            end: nextDay
        });

        // Switch to VOD
        if (this.player) {
            this.player.vodStream = this.vodStream;
            this.player.toggleLiveMode(false);
        }
        this.isLive = false;
        this.classList.add(this.isLive ? 'live-on' : 'live-off');
        this.classList.remove(!this.isLive ? 'live-on' : 'live-off');
    }

    private async fetchAvailableYears() {
        const availableYears = await MediaApi.getAvailableMedia(Precision.YEAR, null, this.player.allowCrossCred, this.player.accessToken);
        try {
            const yearRanges: IAvailableMediaResponse = await availableYears.json();

            for (const range of yearRanges.timeRanges) {
                const start = parseFloat(range.start);
                const end = parseFloat(range.end);
                // Fill years between start-end
                for (let index = start; index <= end; index++) {
                    this.allowedDates[index] = [];
                }
            }

            this.currentAllowedYears = Object.keys(this.allowedDates);
            this.datePickerComponent.allowedDates = {
                ...this.datePickerComponent.allowedDates,
                years: this.currentAllowedYears.toString()
            };
        } catch (error) {
            this.handleError();
            throw new WidgetGeneralError('Cannot parse available media');
        }
    }

    private async fetchAvailableMonths(year: number) {
        // Take available months according to year
        try {
            const firstMonth = new Date(Date.UTC(year, 0, 1));
            const lastMonth = new Date(Date.UTC(year, 11, 1));
            const availableMonths = await MediaApi.getAvailableMedia(
                Precision.MONTH,
                {
                    start: firstMonth,
                    end: lastMonth
                },
                this.player.allowCrossCred,
                this.player.accessToken
            );
            const monthRanges: IAvailableMediaResponse = await availableMonths.json();

            // Get last available month
            for (const range of monthRanges.timeRanges) {
                const start = parseFloat(range.start?.substring(range.start.length - 2, range.start.length));
                const end = parseFloat(range.end?.substring(range.end.length - 2, range.end.length));
                // Fill years between start-end
                for (let index = start; index <= end; index++) {
                    this.allowedDates[year][index] = [];
                }
            }
        } catch (error) {
            this.handleError();
            throw new WidgetGeneralError('Cannot parse available media');
        }
    }

    private async fetchAvailableDays(year: number, month: number) {
        try {
            const firstDayOfMonth = new Date(Date.UTC(year, month - 1, 1));

            // Take first day of the next month and then decrease one day
            const lastDayOfMonth = new Date(Date.UTC(year, month, 1));
            lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1);
            // fetch available days
            const availableDays = await MediaApi.getAvailableMedia(
                Precision.DAY,
                {
                    start: firstDayOfMonth,
                    end: lastDayOfMonth
                },
                this.player.allowCrossCred,
                this.player.accessToken
            );

            const dayRanges: IAvailableMediaResponse = await availableDays.json();

            this.allowedDates[year][month] = [];
            for (const range of dayRanges.timeRanges) {
                const start = parseFloat(range.start?.substring(range.start.length - 2, range.start.length));
                const end = parseFloat(range.end?.substring(range.end.length - 2, range.end.length));
                // Fill years between start-end
                for (let index = start; index <= end; index++) {
                    this.allowedDates[year][month].push(index);
                }
            }
        } catch (error) {
            this.handleError();
            throw new WidgetGeneralError('Cannot parse available media');
        }
    }

    private async updateMonthAndDates(year: number, month: number) {
        this.currentAllowedDays = [];
        this.currentAllowedMonths = [];

        this.datePickerComponent.allowedDates = {
            ...this.datePickerComponent.allowedDates,
            days: this.currentAllowedDays.toString(),
            months: this.currentAllowedMonths.toString()
        };
        // If this year is available
        if (this.allowedDates[year]) {
            if (this.allowedDates[year].length) {
                this.currentAllowedMonths = Object.keys(this.allowedDates[year]);
                this.datePickerComponent.allowedDates = {
                    ...this.datePickerComponent.allowedDates,
                    months: this.currentAllowedMonths.toString()
                };
                if (this.allowedDates[year][month]) {
                    if (this.allowedDates[year][month].length) {
                        this.currentAllowedDays = this.allowedDates[year][month];
                        this.datePickerComponent.allowedDates = {
                            ...this.datePickerComponent.allowedDates,
                            days: this.currentAllowedDays.toString()
                        };
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
        if (this.time === time || !time) {
            return;
        }

        DOM.queueUpdate(() => {
            this.time = time;
            this.timeContainer.innerText = this.time;
        });
        DOM.nextUpdate();
    }
}
