const DAYS_PER_MONTH: number = 146097 / 400 / 12;
const SECONDS_PER_HOUR: number = 60 * 60;
const SECONDS_PER_MINUTE: number = 60;

export interface IDurationDetails {
    number: number;
    units: string;
}

export function getSeconds(hms: string | number): number {
    if (typeof hms === 'number') {
        return hms;
    }

    const time = formatToStandardTime(hms);
    const timeSplit = time.split(':');
    const hours = +timeSplit[0];
    const minutes = +timeSplit[1];
    const seconds = +timeSplit[2];

    return hours * SECONDS_PER_HOUR + minutes * SECONDS_PER_MINUTE + seconds;
}

export function getTimeText(time: string): string {
    return time && time.split('.')[0];
}

export function formatToStandardTime(time: string | number): string {
    time = time?.toString();
    const displayTime = time?.split('.');

    if (!displayTime || !displayTime[0]) {
        return '';
    }
    const timeSplit = displayTime[0]?.split(':');
    const hours = timeSplit[0]?.padStart(2, '0');
    const minutes = timeSplit[1]?.padStart(2, '0');
    const seconds = timeSplit[2]?.padStart(2, '0');
    const milliseconds = displayTime[1]
        ? '.' + `${+displayTime[1] / Math.pow(10, displayTime[1]?.length)}`?.split('.')[1]?.padEnd(3, '0')
        : '';

    return hours + ':' + minutes + ':' + seconds + milliseconds;
}

export function toTimeText(time: number, roundSeconds = false): string {
    const sec_num = time; // don't forget the second param
    let hours: number | string = Math.floor(sec_num / 3600);
    let minutes: number | string = Math.floor((sec_num - hours * 3600) / 60);
    let seconds: number | string = sec_num - hours * 3600 - minutes * 60;
    if (roundSeconds) {
        seconds = Math.round(seconds);
    }
    if (seconds === 60) {
        seconds = 0;
        minutes++;
        if (minutes === 60) {
            minutes = 0;
            hours++;
        }
    }

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return hours + ':' + minutes + ':' + seconds;
}

// tslint:disable-next-line:no-any
export function humanize(duration: any): IDurationDetails | null {
    let ago = duration < 0;
    duration = Math.abs(duration);
    duration = [
        { n: thresh(45, duration / 1000), units: 'Seconds' },
        { n: thresh(45, duration / (60 * 1000)), units: 'Minutes' },
        { n: thresh(22, duration / (60 * 60 * 1000)), units: 'Hours' },
        { n: thresh(26, duration / (24 * 60 * 60 * 1000)), units: 'Days' },
        { n: thresh(11, duration / (DAYS_PER_MONTH * 24 * 60 * 60 * 1000)), units: 'Months' },
        { n: thresh(Number.MAX_VALUE, duration / (365 * 24 * 60 * 60 * 1000)), units: 'Years' },
        { n: 'Now', units: 'Now' }
    ];

    duration = first(duration, (part: any) => {
        return part.n !== 0;
    });
    ago = ago && duration.n !== 'Now';
    if (duration.n === 1) {
        duration.units = duration.units.replace(/s$/, '');
    }

    return duration
        ? {
              number: duration.n,
              units: duration.units
          }
        : null;
}

export function fromNow(date: Date | string): IDurationDetails | null {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    const now = new Date();
    const difference = getUTCDate(date).valueOf() - getUTCDate(now).valueOf();
    return humanize(difference);
}

export function getUTCDate(date: Date) {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

function thresh(t: number, val: number): number {
    val = Math.round(val);

    return val < t ? val : 0;
}

// tslint:disable-next-line:no-any
function first(arr: any, func: Function): string {
    for (const item of arr) {
        if (func(item)) {
            return item;
        }
    }

    return '';
}
