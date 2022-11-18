import { ChartBarMode } from "../../core/ts-gantt-common";

interface TsGanttChartBarGroupOptions {
  mode: ChartBarMode;
  showProgress: boolean;
  dayWidth: number;
  rowHeight: number; 
  barMinWidth: number;
  barHeight: number;
  barBorder: number; 
  barCornerR: number;
  y0: number; 
  y1: number;
}

export { TsGanttChartBarGroupOptions };
