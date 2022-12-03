import dayjs from "dayjs";

import { ChartBarType } from "../../../core/ts-gantt-common";

export interface TsGanttChartBarDescriptor {
  minDate: dayjs.Dayjs; 
  startDate: dayjs.Dayjs; 
  endDate: dayjs.Dayjs;

  barType: ChartBarType;

  dayWidth: number;
  minWrapperWidth: number;
  wrapperHeight: number;
  borderWidth: number;
  cornerRadius: number;
  topPosition: number;

  showProgress: boolean;
  progress: number;

  showHandles: boolean;
}
