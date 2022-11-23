import { createSvgElement } from "../../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../../core/ts-gantt-const";
import { TsGanttTask } from "../../../../core/ts-gantt-task";

import { TsGanttSvgComponentBase } from "../../../abstract/ts-gantt-svg-component-base";

import { TsGanttChartBarOptions } from "../ts-gantt-chart-bar-options";

export abstract class TsGanttChartBarHandle extends TsGanttSvgComponentBase {  
  protected readonly _options: TsGanttChartBarOptions;
  protected readonly _task: TsGanttTask;
  protected readonly _callbackOnTaskUpdate: () => {};

  constructor(options: TsGanttChartBarOptions, task: TsGanttTask, callbackOnTaskUpdate: () => {}) {
    super();

    this._options = options;
    this._task = task;
    this._callbackOnTaskUpdate = callbackOnTaskUpdate;

    this.draw();
  }

  protected abstract draw(): void;

  protected createWrapper(): any {
    const { wrapperHeight, topPosition } = this._options;

    const wrapper = createSvgElement("svg", [TsGanttConst.CLASSES.CHART.BAR_HANDLE_WRAPPER], [
      ["x", "0"],
      ["y", topPosition + ""],
      ["width", wrapperHeight + ""],
      ["height", wrapperHeight + ""],
    ]);

    return wrapper;
  }
}
