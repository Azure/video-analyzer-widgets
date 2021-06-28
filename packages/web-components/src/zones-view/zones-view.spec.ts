import { html, fixture, expect } from '@open-wc/testing';
import { IZone } from '../../../widgets/src/zone-drawer/zone-drawer.definitions';
import { ZonesCanvas } from './zones-canvas.class';
import { ZonesViewComponent } from './zones-view.component';
import { IZonesOptions } from './zones-view.definitions';

ZonesViewComponent;

describe('ZonesViewComponent', () => {
    const zones: IZone[] = [
        {
            points: [
                {
                    x: 0.9,
                    y: 0.1
                },
                {
                    x: 0.7,
                    y: 0.8
                }
            ],
            color: '#DB4646'
        },
        {
            points: [
                {
                    x: 0.8,
                    y: 0.1
                },
                {
                    x: 0.9,
                    y: 0.8
                },
                {
                    x: 0.5,
                    y: 0.7
                }
            ],
            color: '#A6C102'
        },
        {
            points: [
                {
                    x: 0.3,
                    y: 0.1
                },
                {
                    x: 0.3,
                    y: 0.8
                }
            ],
            color: '#F2880C'
        }
    ];
    it('passes the a11y audit', async () => {
        const el = await fixture<ZonesViewComponent>(html`<media-zones-view></media-zones-view>`);

        await expect(el).shadowDom.to.be.accessible();
    });

    it('zones canvas zones should equal to zones view component zones', async () => {
        const el = await fixture<ZonesViewComponent>(html`<media-zones-view></media-zones-view>`);

        el.zones = zones;
        setTimeout(() => {
            expect(el.zonesCanvas.zonesOptions.zones).to.equal(zones);
        });
    });

    it('zones canvas zones should equal to zones view component zones', async () => {
        const zonesOptions: IZonesOptions = {
            height: 22,
            width: 1000,
            fontFamily: 'Segue UI',
            fontSize: '12px',
            lineWidth: 1,
            fontColor: 'black',
            zones: zones
        };
        const zonesCanvas = new ZonesCanvas(zonesOptions);
        expect(zonesCanvas.zonesOptions).to.equal(zonesOptions);
    });
});
