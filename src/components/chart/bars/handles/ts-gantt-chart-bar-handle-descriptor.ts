import { ChartBarType } from "../../../../core/ts-gantt-common";

export interface TsGanttChartBarHandleDescriptor {
  taskUuid: string;
  width: number;
  height: number;
  displacementThreshold: number;
  barType: ChartBarType;
}
