import { html, fixture, expect } from '@open-wc/testing';

import { SegmentsTimelineComponent } from './segments-timeline.component';

SegmentsTimelineComponent;

describe('SegmentsTimelineComponent', () => {
    const segments = [
        { endSeconds: 43.294, startSeconds: 42.209 },
        { endSeconds: 45.838, startSeconds: 44.711, color: 'red' },
        { endSeconds: 50.175, startSeconds: 49.466 },
        { endSeconds: 53.095, startSeconds: 51.468 }
    ];
    const duration = 90.1;
    const defaultDisplayOptions = {
        height: 48,
        barHeight: 12,
        tooltipHeight: 20,
        top: 0,
        renderTooltip: true,
        renderProgress: true
    };

    it('render segments line - config with tooltip & progress', async () => {
        const configWithTooltipProgress = {
            data: {
                segments: segments,
                duration: duration
            },
            displayOptions: defaultDisplayOptions
        };
        const el = await fixture<SegmentsTimelineComponent>(html`<media-segments-timeline></media-segments-timeline>`);
        el.config = configWithTooltipProgress;
        setTimeout(() => {
            expect(el.config).to.equal(configWithTooltipProgress);
            // Should contain 8 elements 1 for bar 1 for overlay 1 for progress 1 for tooltip 4 for segments
            expect(el.shadowRoot.querySelector('svg').childElementCount).to.equal(8);
        });
    });

    it('render segments line - config without progress', async () => {
        const configWithTooltipProgress = {
            data: {
                segments: segments,
                duration: duration
            },
            displayOptions: {
                ...defaultDisplayOptions,
                renderProgress: false
            }
        };
        const el = await fixture<SegmentsTimelineComponent>(html`<media-segments-timeline></media-segments-timeline>`);
        el.config = configWithTooltipProgress;
        setTimeout(() => {
            expect(el.config).to.equal(configWithTooltipProgress);
            // Should contain 7 elements 1 for bar 1 for overlay 1 for progress 4 for segments
            expect(el.shadowRoot.querySelector('svg').childElementCount).to.equal(7);
        });
    });

    it('render segments line - config without tooltip', async () => {
        const configWithTooltipProgress = {
            data: {
                segments: segments,
                duration: duration
            },
            displayOptions: {
                ...defaultDisplayOptions,
                renderTooltip: false
            }
        };
        const el = await fixture<SegmentsTimelineComponent>(html`<media-segments-timeline></media-segments-timeline>`);
        el.config = configWithTooltipProgress;

        setTimeout(() => {
            expect(el.config).to.equal(configWithTooltipProgress);
            // Should contain 7 elements 1 for bar 1 for overlay 1 for tooltip 4 for segments
            expect(el.shadowRoot.querySelector('svg').childElementCount).to.equal(7);
        });
    });

    it('render segments line - config without tooltip & progress', async () => {
        const configWithTooltipProgress = {
            data: {
                segments: segments,
                duration: duration
            },
            displayOptions: {
                ...defaultDisplayOptions,
                renderTooltip: false,
                renderProgress: false
            }
        };
        const el = await fixture<SegmentsTimelineComponent>(html`<media-segments-timeline></media-segments-timeline>`);
        el.config = configWithTooltipProgress;

        setTimeout(() => {
            expect(el.config).to.equal(configWithTooltipProgress);
            // Should contain 6 elements 1 for bar 1 for overlay 4 for segments
            expect(el.shadowRoot.querySelector('svg').childElementCount).to.equal(6);
        });
    });

    it('passes the a11y audit', async () => {
        const el = await fixture<SegmentsTimelineComponent>(html`<media-segments-timeline></media-segments-timeline>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});
