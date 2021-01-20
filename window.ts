import { RVXWidget } from "./src/widgets";

declare global {
  interface Widgets {
    RVX: typeof RVXWidget;
  }

  interface AVA {
    widgets: Widgets;
  }

  interface Window {
    AVA: AVA;
  }
}
