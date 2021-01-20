import { IWidgetBaseConfig } from "../../base-widget-config.definitions";

/**
 * Insights config, contains basic configurations for insights widget.
 */
export interface IRVXWidgetConfig extends IWidgetBaseConfig {
  /**
   * TBS
   */
  sources?: string[];
}