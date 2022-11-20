import { TsGanttOptions } from "../../../../core/ts-gantt-options";
import { TsGanttTask } from "../../../../core/ts-gantt-task";

export abstract class TsGanttChartBarHandle {  
  private readonly _options: TsGanttOptions;
  private readonly _task: TsGanttTask;
  
  private readonly _svg: SVGElement;

  private readonly _callbackOnTaskUpdate: () => {};

  constructor(options: TsGanttOptions, task: TsGanttTask, callbackOnTaskUpdate: () => {}) {
    this._options = options;
    this._task = task;
    this._callbackOnTaskUpdate = callbackOnTaskUpdate;
  }
}
