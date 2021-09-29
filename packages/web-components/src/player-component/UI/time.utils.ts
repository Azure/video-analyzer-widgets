export const OFFSET_MULTIPLAYER = 1000;
export const MILLI_SECONDS_IN_SECOND = 1000;
export const SECONDS_IN_HOUR = 3600;
export const SECONDS_IN_MINUTES = 60;

export function extractRealTime(time: number, timestampOffset: number) {
    const currentDate = new Date(timestampOffset + time * OFFSET_MULTIPLAYER);
    return currentDate.getUTCHours() * SECONDS_IN_HOUR + currentDate.getUTCMinutes() * SECONDS_IN_MINUTES + currentDate.getUTCSeconds();
}

export function extractRealTimeFromISO(time: string, currentDateStartTime: Date) {
    const currentDate = new Date(time);
    return (currentDate.getTime() - currentDateStartTime.getTime()) / MILLI_SECONDS_IN_SECOND;
}
