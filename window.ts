import { RVXWidget } from './src/widgets';

declare global {
  interface IWidgets {
    RVX: typeof RVXWidget;
  }

  interface IAva {
    widgets: IWidgets;
  }

  // tslint:disable-next-line: interface-name
  interface Window {
    AVA: IAva;
  }
}
