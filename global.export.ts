import { AppearancesLineComponent } from './packages/web-components/src';
import { RVXWidget } from './packages/widgets/src';

window.ava = window.ava || { widgets: { rvx: RVXWidget, appearances: AppearancesLineComponent } };
window.ava.widgets = window.ava.widgets || { rvx: RVXWidget, appearances: AppearancesLineComponent };
window.ava.widgets.rvx = RVXWidget;
window.ava.widgets.appearances = AppearancesLineComponent;
