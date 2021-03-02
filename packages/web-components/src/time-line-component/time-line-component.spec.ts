import { html, fixture, expect } from '@open-wc/testing';

import { TimeLineComponent } from './time-line-component';

TimeLineComponent;

describe('TimeLineComponent', () => {
    const appearances = [
        { endSeconds: 43.294, startSeconds: 42.209 },
        { endSeconds: 45.838, startSeconds: 44.711, className: 'vi' },
        { endSeconds: 50.175, startSeconds: 49.466 },
        { endSeconds: 53.095, startSeconds: 51.468, className: 'test' }
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

    it('render timeline - config with tooltip & progress', async () => {
        const configWithTooltipProgress = {
            data: {
                appearances: appearances,
                duration: duration
            },
            displayOptions: defaultDisplayOptions
        };
        const el = await fixture<TimeLineComponent>(html`<time-line-component></time-line-component>`);
        el.config = configWithTooltipProgress;
        el.initTimeLine();

        expect(el.config).to.equal(configWithTooltipProgress);
        // Should contain 8 elements 1 for bar 1 for overlay 1 for progress 1 for tooltip 4 for appearances
        expect(el.shadowRoot.querySelector('svg').childElementCount).to.equal(8);
    });

    it('render timeline - config without progress', async () => {
        const configWithTooltipProgress = {
            data: {
                appearances: appearances,
                duration: duration
            },
            displayOptions: {
                ...defaultDisplayOptions,
                renderProgress: false
            }
        };
        const el = await fixture<TimeLineComponent>(html`<time-line-component></time-line-component>`);
        el.config = configWithTooltipProgress;
        el.initTimeLine();

        expect(el.config).to.equal(configWithTooltipProgress);
        // Should contain 7 elements 1 for bar 1 for overlay 1 for progress 4 for appearances
        expect(el.shadowRoot.querySelector('svg').childElementCount).to.equal(7);
    });

    it('render timeline - config without tooltip', async () => {
        const configWithTooltipProgress = {
            data: {
                appearances: appearances,
                duration: duration
            },
            displayOptions: {
                ...defaultDisplayOptions,
                renderTooltip: false
            }
        };
        const el = await fixture<TimeLineComponent>(html`<time-line-component></time-line-component>`);
        el.config = configWithTooltipProgress;
        el.initTimeLine();

        expect(el.config).to.equal(configWithTooltipProgress);
        // Should contain 7 elements 1 for bar 1 for overlay 1 for tooltip 4 for appearances
        expect(el.shadowRoot.querySelector('svg').childElementCount).to.equal(7);
    });

    it('render timeline - config without tooltip & progress', async () => {
        const configWithTooltipProgress = {
            data: {
                appearances: appearances,
                duration: duration
            },
            displayOptions: {
                ...defaultDisplayOptions,
                renderTooltip: false,
                renderProgress: false
            }
        };
        const el = await fixture<TimeLineComponent>(html`<time-line-component></time-line-component>`);
        el.config = configWithTooltipProgress;
        el.initTimeLine();

        expect(el.config).to.equal(configWithTooltipProgress);
        // Should contain 6 elements 1 for bar 1 for overlay 4 for appearances
        expect(el.shadowRoot.querySelector('svg').childElementCount).to.equal(6);
    });

    it('passes the a11y audit', async () => {
        const el = await fixture<TimeLineComponent>(html`<time-line-component></time-line-component>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});
