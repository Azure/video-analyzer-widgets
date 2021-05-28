import { IAvailableMediaResponse } from '../../../../common/services/media/media.definitions';
import { IUISegment } from '../../segments-timeline/segments-timeline.definitions';
import { extractRealTimeFromISO } from './time.utils';

const MIN_DURATION_FILTER = 5;
export function createTimelineSegments(availableSegments: IAvailableMediaResponse): IUISegment[] {
    let segmentEnd = 0;
    let segmentStart = 0;
    // go over reference
    const segments = [];
    for (const currentSegment of availableSegments?.timeRanges) {
        segmentEnd = extractRealTimeFromISO(currentSegment.end);
        segmentStart = extractRealTimeFromISO(currentSegment.start);

        // If duration id more the 5 seconds - add it
        if (segmentEnd - segmentStart > MIN_DURATION_FILTER) {
            const segment: IUISegment = {
                startSeconds: segmentStart,
                endSeconds: segmentEnd
            };
            segments.push(segment);
        }
    }

    const mergedSegments = [];

    for (let index = 0; index < segments.length; index++) {
        const currentSegment = segments[index];
        const nextSegment = segments[index + 1];

        if (currentSegment?.endSeconds === nextSegment?.startSeconds) {
            // Merge
            mergedSegments.push({
                startSeconds: currentSegment.startSeconds,
                endSeconds: nextSegment.endSeconds
            });
            index++;
        } else {
            mergedSegments.push(currentSegment);
        }
    }

    return mergedSegments;
}
