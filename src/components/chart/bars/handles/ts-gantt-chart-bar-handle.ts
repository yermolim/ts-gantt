import { createSvgElement } from "../../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../../core/ts-gantt-const";
import { TsGanttTask } from "../../../../core/ts-gantt-task";

import { TsGanttSvgComponentBase } from "../../../abstract/ts-gantt-svg-component-base";

import { TsGanttChartBarHandleOptions } from "./ts-gantt-chart-bar-handle-options";

export abstract class TsGanttChartBarHandle extends TsGanttSvgComponentBase {  
  protected readonly _options: TsGanttChartBarHandleOptions;
  protected readonly _task: TsGanttTask;
  protected readonly _callbackOnTaskUpdate: () => {};

  constructor(options: TsGanttChartBarHandleOptions, task: TsGanttTask, callbackOnTaskUpdate: () => {}) {
    super();

    this._options = options;
    this._task = task;
    this._callbackOnTaskUpdate = callbackOnTaskUpdate;

    this.draw();
  }

  protected draw() {
    const wrapper = this.createWrapper();
    this.drawHandle(wrapper);
    this._svg = wrapper;
  }  

  protected createWrapper(): SVGElement {
    const { width, height } = this._options;

    const wrapper = createSvgElement("svg", [TsGanttConst.CLASSES.CHART.BAR.HANDLE_WRAPPER], [
      ["x", "0"],
      ["y", "0"],
      ["viewBox", "0 0 100 100"],
      ["width", width + ""],
      ["height", height + ""],
    ]);

    return wrapper;
  }

  protected abstract drawHandle(wrapper: SVGElement): void;
}
