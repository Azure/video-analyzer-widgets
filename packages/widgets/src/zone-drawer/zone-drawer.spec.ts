import { html, fixture, expect } from '@open-wc/testing';
import { IZone, IZoneDrawerWidgetConfig } from './zone-drawer.definitions';
import { ZoneDrawerWidget } from './zone-drawer.widget';

ZoneDrawerWidget;

describe('ZoneDrawerWidget', () => {
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

    const configWithZones: IZoneDrawerWidgetConfig = {
        zones: zones
    };

    it('passes the a11y audit', async () => {
        const el = await fixture<ZoneDrawerWidget>(html`<ava-zone-drawer></ava-zone-drawer>`);

        await expect(el).shadowDom.to.be.accessible();
    });

    it('widget zones should equal the config zones length', async () => {
        const el = await fixture<ZoneDrawerWidget>(html`<ava-zone-drawer></ava-zone-drawer>`);

        el.config = configWithZones;
        setTimeout(() => {
            expect(el.zones.length).to.equal(zones.length);
        });
    });

    it('labels-list elements count should equal the config zones length', async () => {
        const el = await fixture<ZoneDrawerWidget>(html`<ava-zone-drawer></ava-zone-drawer>`);

        el.config = configWithZones;
        const labelsList = el.shadowRoot.querySelector('.labels-list');
        setTimeout(() => {
            expect(labelsList.childElementCount).to.equal(zones.length);
        });
    });

    it('toggleDrawerMode should change isLineDrawMode', async () => {
        const el = await fixture<ZoneDrawerWidget>(html`<ava-zone-drawer></ava-zone-drawer>`);

        const isLineDrawMode = el.isLineDrawMode;
        el.toggleDrawerMode();
        expect(el.isLineDrawMode).to.equal(!isLineDrawMode);
    });
});
