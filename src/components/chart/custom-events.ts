import { TsGanttConst } from "../../core/ts-gantt-const";
import { TsGanttTask } from "../../core/ts-gantt-task";

export interface TaskChangeEventDetail {
  manual: boolean;
  task: TsGanttTask;
}

export class TaskChangeInChartEvent extends CustomEvent<TaskChangeEventDetail> {
  constructor(detail: TaskChangeEventDetail) {
    super(TsGanttConst.EVENTS.TASK_CHANGED_IN_CHART, {detail});
  }
}

declare global {
  interface DocumentEventMap {
    [TsGanttConst.EVENTS.TASK_CHANGED_IN_CHART]: TaskChangeInChartEvent;
  }
}
