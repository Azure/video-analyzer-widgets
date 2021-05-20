import { IAvailableMediaResponse } from '../../../../common/services/media/media.definitions';
import { IUISegment } from '../../segments-timeline/segments-timeline.definitions';
import { extractRealTimeFromISO } from './time.utils';

export function createTimelineSegments(availableSegments: IAvailableMediaResponse): IUISegment[] {
    let segmentEnd = 0;
    let segmentStart = 0;
    // go over reference
    const segments = [];
    for (const currentSegment of availableSegments.timeRanges) {
        segmentEnd = extractRealTimeFromISO(currentSegment.end);
        segmentStart = extractRealTimeFromISO(currentSegment.start);

        const diff = segmentEnd - segmentStart;
        // If duration id more the 5 seconds - add it
        if (diff > 5) {
            const segment: IUISegment = {
                startSeconds: segmentStart,
                endSeconds: segmentEnd
            };
            segments.push(segment);
        }
    }

    return segments;
}
