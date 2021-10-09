export function toTimeText(time: number, roundSeconds = true): string {
    const sec_num = time;
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
