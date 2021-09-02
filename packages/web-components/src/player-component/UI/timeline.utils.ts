import { IAvailableMediaResponse } from '../../../../common/services/media/media.definitions';
import { IUISegment } from '../../segments-timeline/segments-timeline.definitions';
import { extractRealTimeFromISO } from './time.utils';
import { IAvailableMetadataResponse, IMetadataSegmentsConfig, IMetadataSegments } from '../../metadata-timelines/metadata-timelines.definitions';
import { Logger } from '../../../../widgets/src/common/logger';

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


export function createMetadataTimelinesSegments(availableSegments: IAvailableMetadataResponse) : IMetadataSegmentsConfig[] {
    let segments : IMetadataSegments = createMetadataTimelineSegmentsDictionary(availableSegments);
    let metadataSegmentsConfig: IMetadataSegmentsConfig[] = [];
    for(const key in segments) {
        let segmentsConfig: IMetadataSegmentsConfig = {
            tag: key,
            segments: segments[key]
        }
        metadataSegmentsConfig.push(segmentsConfig);
    }
    return metadataSegmentsConfig;
}

export function createMetadataTimelineSegmentsDictionary(availableSegments: IAvailableMetadataResponse): IMetadataSegments {
    let segments : IMetadataSegments = {};
    for (let i = 0; i < availableSegments?.value.length; i++) {
        let segment = availableSegments?.value[i];
        let tag = segment.metadata.entity.tag.value;
        const startTime = extractRealTimeFromISO(segment.startTime);
        const endTime = extractRealTimeFromISO(segment.endTime);
        if (!(tag in segments)) {
            let newSegment: IUISegment = {
                startSeconds: startTime,
                endSeconds: endTime
            }
            segments[tag] = [newSegment];
        } else {
            let lastIndex = segments[tag].length - 1;
            if (segments[tag][lastIndex].endSeconds == startTime) {
                segments[tag][lastIndex].endSeconds = endTime;
            } else {
                segments[tag][lastIndex].startSeconds -= 3; // add buffer to segments
                segments[tag][lastIndex].endSeconds += 2;
                let newSegment: IUISegment = {
                    startSeconds: startTime,
                    endSeconds: endTime
                }
                segments[tag].push(newSegment);
            }
        }
    }
    Logger.log("Logging final segments");
    Logger.log(segments);
    return segments;
}
