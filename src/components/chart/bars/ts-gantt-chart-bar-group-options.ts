import { ChartBarMode } from "../../../core/ts-gantt-common";
import { TsGanttOptions } from "../../../core/ts-gantt-options";

class TsGanttChartBarGroupOptions {
  readonly mode: ChartBarMode;
  readonly showProgress: boolean;
  readonly dayWidth: number;
  readonly rowHeight: number; 
  readonly barMinWidth: number;
  readonly barHeight: number;
  readonly barBorder: number; 
  readonly barCornerR: number;
  readonly y0: number; 
  readonly y1: number;

  static getFromGanttOptions(options: TsGanttOptions): TsGanttChartBarGroupOptions {
    const mode = options.chartDisplayMode;
    const showProgress = options.chartShowProgress;
    const dayWidth = options.dayWidthPx;
    const rowHeight = options.rowHeightPx;
    const border = options.borderWidthPx;
    const barMargin = options.barMarginPx;
    const barBorder = options.barStrokeWidthPx;
    const barCornerR = options.barCornerRadiusPx;
    const barMinWidth = barBorder + 2 * barCornerR;

    const y0 = barMargin - border/2;
    let barHeight: number;
    let y1: number;
    switch (mode) {
      case "both":
        barHeight = (rowHeight - 3*barMargin)/2;
        y1 = barHeight + 2*barMargin - border/2;
        break;
      case "planned":
      case "actual":
        barHeight = rowHeight - 2 * barMargin;
        break;
    }

    return { mode, showProgress, dayWidth, rowHeight,
      barMinWidth, barHeight, barBorder, barCornerR, y0, y1 };
  }
}

export { TsGanttChartBarGroupOptions };
