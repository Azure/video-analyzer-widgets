import { TimeLineComponent } from './packages/web-components/src';
import { RVXWidget } from './packages/widgets/src';

window.ava = window.ava || { widgets: { rvx: RVXWidget, timeline: TimeLineComponent } };
window.ava.widgets = window.ava.widgets || { rvx: RVXWidget, timeline: TimeLineComponent };
window.ava.widgets.rvx = RVXWidget;
window.ava.widgets.timeline = TimeLineComponent;
