import { RVXWidget, ZoneDrawerWidget } from './packages/widgets/src';

window.ava = window.ava || { widgets: { rvx: RVXWidget, zoneDrawer: ZoneDrawerWidget } };
window.ava.widgets = window.ava.widgets || { rvx: RVXWidget, zoneDrawer: ZoneDrawerWidget };
window.ava.widgets.rvx = RVXWidget;
window.ava.widgets.zoneDrawer = ZoneDrawerWidget;
