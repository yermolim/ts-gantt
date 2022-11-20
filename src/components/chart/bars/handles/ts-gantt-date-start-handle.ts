import { TsGanttOptions } from "../../../../core/ts-gantt-options";
import { TsGanttTask } from "../../../../core/ts-gantt-task";

import { TsGanttChartBarHandle } from "./ts-gantt-chart-bar-handle";

export class TsGanttDateStartHandle extends TsGanttChartBarHandle {
  
  constructor(options: TsGanttOptions, task: TsGanttTask, callbackOnTaskUpdate: () => {}) {
    super(options, task, callbackOnTaskUpdate);
  }
}
