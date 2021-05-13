import { IAvailableMediaRange, IAvailableMediaResponse } from '../../../../common/services/media/media.definitions';
import { IUISegment } from '../../segments-timeline/segments-timeline.definitions';
import { shaka as shaka_player } from '../shaka';
import { extractRealTime, extractRealTimeFromISO } from './time.utils';

export function createTimelineSegments(
    availableSegments: IAvailableMediaResponse,
    segmentReferences: shaka_player.media.SegmentReference[],
    timestampOffset: number
): IUISegment[] {
    let currentSegmentIndex = 0;
    let currentSegment: IAvailableMediaRange = null;
    let segmentEnd = 0;
    let segmentStart = 0;
    // go over reference
    const segments = [];
    for (const iterator of segmentReferences) {
        currentSegment = availableSegments.timeRanges[currentSegmentIndex];
        segmentEnd = extractRealTimeFromISO(currentSegment.end);
        segmentStart = extractRealTimeFromISO(currentSegment.start);

        const segmentRefEnd = extractRealTime(iterator.getEndTime(), timestampOffset);
        const segmentRefStart = extractRealTime(iterator.getStartTime(), timestampOffset);
        if (segments.length) {
            // Take segment from data
            if (currentSegment) {
                // If this ref segment is inside the the segment, merge
                if (segmentRefStart >= segmentStart && segmentRefEnd <= segmentEnd) {
                    // merge
                    segments[segments.length - 1].endSeconds = segmentRefEnd;
                } else {
                    // Update the end of the segment before
                    segments[segments.length - 1].endSeconds = segmentEnd;
                    // Go to new segment
                    currentSegmentIndex++;

                    currentSegment = availableSegments.timeRanges[currentSegmentIndex];
                    // add new segment
                    segments.push({
                        startSeconds: extractRealTimeFromISO(currentSegment.start),
                        endSeconds: segmentRefEnd
                    });
                }
            }
        } else {
            // first segment
            const segment: IUISegment = {
                startSeconds: segmentStart,
                endSeconds: segmentRefEnd
            };
            segments.push(segment);
        }
    }

    return segments;
}
