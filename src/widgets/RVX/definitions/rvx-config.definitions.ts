import { IWidgetBaseConfig } from '../../base-widget-config.definitions';

/**
 * Insights config, contains basic configurations for insights widget.
 */
export interface IRvxWidgetConfig extends IWidgetBaseConfig {
  /**
   * TBD
   */
  sources?: string[];
}
