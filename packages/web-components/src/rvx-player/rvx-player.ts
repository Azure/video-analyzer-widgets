import { attr, customElement, FASTElement, observable } from '@microsoft/fast-element';
import { keyCodeEnter, keyCodeSpace } from '@microsoft/fast-web-utilities';
import { MediaApi } from '../../../common/services/media/media-api.class';
import { IAvailableMediaResponse, IExpandedDate, Precision } from '../../../common/services/media/media.definitions';
import { HttpError } from '../../../common/utils/http.error';
import { PlayerEvents, WidgetGeneralError } from '../../../widgets/src';
import { DatePickerComponent } from '../date-picker';
import { DatePickerEvent, IDatePickerRenderEvent } from '../date-picker/date-picker.definitions';
import { PlayerWrapper } from './player.class';
import { ControlPanelElements, LiveState } from './rvx-player.definitions';
import { styles } from './rvx-player.style';
import { template } from './rvx-player.template';
import { getPlayerErrorString, getShakaPlayerErrorString } from './rvx-player.utils';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
DatePickerComponent;

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
    @attr public cameraName = '';

    @observable public isLive = false;
    @observable public isFullscreen = false;
    @observable public currentDate: Date = null;
    @observable public currentAllowedDays: string[] = [];
    @observable public currentAllowedMonths: string[] = [];
    @observable public currentAllowedYears: string[] = [];
    @observable public time = '';
    @observable public errorString = '';
    @observable public hasError = false;
    @observable public showRetryButton = false;
    @observable private currentYear: number = 0;
    @observable private currentMonth: number = 0;
    @observable private currentDay: number = 0;

    public player: PlayerWrapper;
    public datePickerComponent: DatePickerComponent;

    private video!: HTMLVideoElement;
    private timeContainer!: HTMLElement;
    private videoContainer!: HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private allowedDates: any = [];
    private hasLiveData = false;
    private afterInit = false;
    private connected = false;

    public constructor() {
        super();
        this.classList.add(this.isLive ? LiveState.ON : LiveState.OFF);
        this.classList.remove(!this.isLive ? LiveState.ON : LiveState.OFF);
    }

    public async init(allowCrossSiteCredentials = true, accessToken?: string, allowedControllers?: ControlPanelElements[]) {
        // Add loading mode
        this.classList.add('loading');

        if (!this.connected) {
            return;
        }

        // Reload player
        if (this.player) {
            // If there was an existing error -clear state
            this.clearError();
            this.player.destroy();
            this.player = null;
        }

        // Init player instance
        this.player = new PlayerWrapper(
            this.video,
            this.videoContainer,
            this.timeUpdateCallBack.bind(this),
            this.toggleLiveModeCallBack.bind(this),
            this.changeDayCallBack.bind(this),
            this.handleShakaError.bind(this),
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

        if (!this.currentAllowedYears?.length) {
            return;
        }
        // Get the last available year
        this.currentYear = parseFloat(this.currentAllowedYears[this.currentAllowedYears.length - 1]);

        // Get all the available months  this year
        await this.fetchAvailableMonths(this.currentYear);

        if (!this.allowedDates[this.currentYear]?.length) {
            return;
        }

        // Get last available month
        const months = Object.keys(this.allowedDates[this.currentYear]);

        this.currentMonth = parseFloat(months[months.length - 1]);

        // Update day data
        await this.updateMonthAndDates(this.currentYear, this.currentMonth);

        // Get current day
        if (!this.currentAllowedDays?.length) {
            return;
        }
        this.currentDay = parseFloat(this.currentAllowedDays[this.currentAllowedDays.length - 1]);

        // Select the last recorded date
        const date = new Date(Date.UTC(this.currentYear, this.currentMonth - 1, this.currentDay));

        // If the last recorded day is today - try switch to live
        const today = new Date();
        this.isLive =
            date.getUTCFullYear() === today.getUTCFullYear() &&
            date.getUTCMonth() === today.getUTCMonth() &&
            date.getUTCDate() === today.getUTCDate();

        this.hasLiveData = this.isLive;

        // If there is no live data - remove live button
        if (!this.hasLiveData) {
            this.classList.add('no-live-data');
        }

        this.afterInit = true;

        this.currentDate = date;
        this.datePickerComponent.inputDate = date.toUTCString();
        this.updateVODStream(false, true);
    }

    public cameraNameChanged() {
        this.cameraName = this.cameraName || '';
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

    public clearError() {
        this.hasError = false;
        this.showRetryButton = false;
        this.classList.remove('error');
    }

    public handleError(error: HttpError) {
        this.hasError = true;
        this.errorString = getPlayerErrorString(error);
        this.classList.add('error');
        this.$emit(PlayerEvents.PLAYER_ERROR, error);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public handleShakaError(error: any) {
        this.player.pause();
        this.hasError = true;
        this.showRetryButton = true;
        this.errorString = getShakaPlayerErrorString(error);
        this.classList.add('error');
        this.$emit(PlayerEvents.SHAKE_PLAYER_ERROR, error);
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('fullscreenchange', this.updateFullScreen.bind(this));
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

        this.datePickerComponent = this.shadowRoot?.querySelector('media-date-picker');

        this.datePickerComponent.addEventListener(DatePickerEvent.DATE_CHANGE, ((event: CustomEvent<Date>) => {
            if (this.afterInit && event.detail?.toUTCString() !== this.currentDate?.toUTCString()) {
                this.currentDate = event.detail;
                this.currentYear = this.currentDate.getUTCFullYear();
                this.currentMonth = this.currentDate.getUTCMonth() + 1;
                this.currentDay = this.currentDate.getUTCDate();
                this.updateVODStream(true);
            }
            // eslint-disable-next-line no-undef
        }) as EventListener);

        this.datePickerComponent.addEventListener(DatePickerEvent.RENDER, ((event: CustomEvent<IDatePickerRenderEvent>) => {
            const data = event.detail;
            if (this.afterInit) {
                this.updateMonthAndDates(data.year, data.month + 1);
            }
            // eslint-disable-next-line no-undef
        }) as EventListener);

        document.addEventListener('fullscreenchange', this.updateFullScreen.bind(this));
    }

    public handleRetryMouseUp(e: MouseEvent): boolean {
        switch (e.which) {
            case 1: // left mouse button.
                this.retryStreaming();
                return false;
        }

        return true;
    }

    public handleRetryKeyUp(e: KeyboardEvent): boolean {
        switch (e.keyCode) {
            case keyCodeEnter:
            case keyCodeSpace:
                this.retryStreaming();
                return false;
        }

        return true;
    }

    public retryStreaming() {
        this.clearError();
        this.player.retryStreaming();
    }

    private updateFullScreen() {
        this.isFullscreen = document.fullscreenElement !== null;
    }

    private changeDayCallBack(isNext: boolean) {
        if (isNext) {
            this.selectNextDay();
        } else {
            this.selectPrevDay();
        }
    }

    private toggleLiveModeCallBack(isLive: boolean) {
        this.isLive = isLive;
        this.classList.add(this.isLive ? LiveState.ON : LiveState.OFF);
        this.classList.remove(!this.isLive ? LiveState.ON : LiveState.OFF);
    }

    private async fetchAvailableSegments(startDate: IExpandedDate, end: IExpandedDate): Promise<IAvailableMediaResponse> {
        try {
            const availableHours = await MediaApi.getAvailableMedia(
                Precision.FULL,
                {
                    start: {
                        year: startDate.year,
                        month: startDate.month,
                        day: startDate.day
                    },
                    end: {
                        year: end.year,
                        month: end.month,
                        day: end.day
                    }
                },
                this.player.allowCrossCred,
                this.player.accessToken
            );

            return await availableHours.json();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('error fetching available segments');
            return null;
        }
    }

    private async selectNextDay() {
        // Get next day
        const startDate = new Date(this.currentYear, this.currentMonth - 1, this.currentDay + 1, 0, 0, 0);
        const untilDate = new Date(this.currentYear, this.currentMonth - 1, this.currentDay + 2, 0, 0, 0);

        const start: IExpandedDate = {
            year: startDate.getFullYear(),
            month: startDate.getMonth() + 1,
            day: startDate.getDate()
        };
        const end: IExpandedDate = {
            year: untilDate.getFullYear(),
            month: untilDate.getMonth() + 1,
            day: untilDate.getDate()
        };
        const segments = await this.fetchAvailableSegments(start, end);
        // eslint-disable-next-line no-console
        if (segments) {
            this.currentDay++;
            const date = new Date(Date.UTC(this.currentYear, this.currentMonth - 1, this.currentDay));
            this.currentDate = date;
            this.datePickerComponent.inputDate = date.toUTCString();
            this.updateVODStream(true);
        }
    }

    private async selectPrevDay() {
        // Get next day
        const startDate = new Date(this.currentYear, this.currentMonth - 1, this.currentDay - 1, 0, 0, 0);
        const untilDate = new Date(this.currentYear, this.currentMonth - 1, this.currentDay, 0, 0, 0);

        const start: IExpandedDate = {
            year: startDate.getFullYear(),
            month: startDate.getMonth() + 1,
            day: startDate.getDate()
        };
        const end: IExpandedDate = {
            year: untilDate.getFullYear(),
            month: untilDate.getMonth() + 1,
            day: untilDate.getDate()
        };
        const segments = await this.fetchAvailableSegments(start, end);
        // eslint-disable-next-line no-console
        if (segments) {
            this.currentDay--;
            const date = new Date(Date.UTC(this.currentYear, this.currentMonth - 1, this.currentDay));
            this.currentDate = date;
            this.datePickerComponent.inputDate = date.toUTCString();
            this.updateVODStream(true);
        }
    }

    private async updateVODStream(VODMode: boolean = false, init = false) {
        if (!this.afterInit) {
            return;
        }
        // Load vod stream
        const nextDay = new Date(Date.UTC(this.currentYear, this.currentMonth - 1, this.currentDay + 1));
        const start: IExpandedDate = {
            year: this.currentYear,
            month: this.currentMonth,
            day: this.currentDay
        };
        const end: IExpandedDate = {
            year: nextDay.getUTCFullYear(),
            month: nextDay.getUTCMonth() + 1,
            day: nextDay.getUTCDate()
        };
        this.vodStream = MediaApi.getVODStream({
            start: start,
            end: end
        });

        this.liveStream = MediaApi.getLiveStream();

        this.isLive = this.hasLiveData ? !VODMode : false;
        // Get segments
        const segments = await this.fetchAvailableSegments(start, end);
        // Switch to VOD
        if (this.player) {
            this.player.availableSegments = segments;
            this.player.vodStream = this.vodStream;
            this.player.liveStream = this.liveStream;
            const isStreamLive = await this.player.toggleLiveMode(this.isLive);
            // If we loaded the live stream at first time, update has live data
            if (init && this.isLive) {
                await this.updateLiveStateAfterStreamLoad(isStreamLive);
            }
        }
        this.classList.add(this.isLive ? 'live-on' : 'live-off');
        this.classList.remove(!this.isLive ? 'live-on' : 'live-off');
    }

    private async updateLiveStateAfterStreamLoad(isStreamLive: boolean) {
        // If the live stream is real on - keep the existing state
        if (isStreamLive) {
            this.hasLiveData = true;
            return;
        }

        // There is no live mode available - remove all live state
        this.hasLiveData = false;
        this.isLive = false;

        // Remove live button
        this.classList.add('no-live-data');

        // Load vod stream
        await this.player.toggleLiveMode(this.isLive);
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
            this.handleError(error);
            throw new WidgetGeneralError('Cannot parse available media');
        }
    }

    private async fetchAvailableMonths(year: number) {
        // Take available months according to year
        try {
            const availableMonths = await MediaApi.getAvailableMedia(
                Precision.MONTH,
                {
                    start: {
                        year: year,
                        month: 1,
                        day: 1
                    },
                    end: {
                        year: year,
                        month: 12,
                        day: 1
                    }
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
            this.handleError(error);
            throw new WidgetGeneralError('Cannot parse available media');
        }
    }

    private async fetchAvailableDays(year: number, month: number) {
        try {
            // Take first day of the next month and then decrease one day
            const lastDayOfMonth = new Date(year, month, 1, 0, 0, 0);
            lastDayOfMonth.setDate(lastDayOfMonth.getDate() - 1);
            // fetch available days
            const availableDays = await MediaApi.getAvailableMedia(
                Precision.DAY,
                {
                    start: {
                        year: year,
                        month: month,
                        day: 1
                    },
                    end: {
                        year: year,
                        month: month,
                        day: lastDayOfMonth.getDate()
                    }
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
            this.handleError(error);
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
                }
            } else {
                // Get all months data
                await this.fetchAvailableMonths(year);
                // Update data
                await this.updateMonthAndDates(year, month);
            }
        }
    }
    private timeUpdateCallBack(time: string) {
        if (this.time === time || !time) {
            return;
        }

        this.time = time;
        this.timeContainer.innerText = this.time;
    }
}
