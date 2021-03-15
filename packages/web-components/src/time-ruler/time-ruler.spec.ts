import { html, fixture, expect } from '@open-wc/testing';
import { TimeRuler } from './time-ruler.class';

import { TimeRulerComponent } from './time-ruler.component';
import { IRulerOptions } from './time-ruler.definitions';

TimeRulerComponent;

describe('TimeRulerComponent', () => {
    it('passes the a11y audit', async () => {
        const el = await fixture<TimeRulerComponent>(html`<media-time-ruler></media-time-ruler>`);

        await expect(el).shadowDom.to.be.accessible();
    });
});

describe('TimeRulerClass', () => {
    const rulerOptions: IRulerOptions = {
        height: 22,
        width: 1000,
        fontFamily: 'Segue UI',
        fontSize: '12px',
        lineWidth: 1,
        fontColor: 'black',
        smallScaleColor: 'gray',
        timeColor: 'gray',
        dateText: new Date().toLocaleString('default', { month: 'long', day: 'numeric' })
    };

    it('should render all ruler scales + 3 time hours', async () => {
        const canvas = document.createElement('canvas');
        rulerOptions.width = 1000;
        const ruler = new TimeRuler(canvas, rulerOptions);
        ruler.draw();

        // Should equal 149 - 25 for the large hours scale, 120 for small scale (5 small scale per hour 5*24), 1 for start time, 3 hours time
        expect(ruler.canvasPointsDataList.length).to.equal(149);
    });

    it('should render all ruler scales + 1 time hours', async () => {
        const canvas = document.createElement('canvas');
        rulerOptions.width = 700;
        const ruler = new TimeRuler(canvas, rulerOptions);
        ruler.draw();
        ruler.preparePoints();

        // Should equal 147 - 25 for the large hours scale, 120 for small scale (5 small scale per hour 5*24), 1 for start time, 1 hours time
        expect(ruler.canvasPointsDataList.length).to.equal(147);
    });

    it('should render only large ruler scales', async () => {
        const canvas = document.createElement('canvas');
        rulerOptions.width = 500;
        const ruler = new TimeRuler(canvas, rulerOptions);
        ruler.draw();

        // Should equal 26 - 25 for the large hours scale, 1 for start time
        expect(ruler.canvasPointsDataList.length).to.equal(26);
    });
});
