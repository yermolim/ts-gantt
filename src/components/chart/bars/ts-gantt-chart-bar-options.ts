import dayjs from "dayjs";

import { ChartBarType } from "../../../core/ts-gantt-common";

export interface TsGanttChartBarOptions {
  minDate: dayjs.Dayjs; 
  startDate: dayjs.Dayjs; 
  endDate: dayjs.Dayjs;
  barType: ChartBarType;
  showProgress: boolean;
  dayWidth: number; 
  minWrapperWidth: number; 
  wrapperHeight: number; 
  borderWidth: number;
  cornerRadius: number;
  topPosition: number;
  progress: number;
}
