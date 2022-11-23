import { TsGanttTask } from "../../../../core/ts-gantt-task";

import { TsGanttChartBarOptions } from "../ts-gantt-chart-bar-options";
import { TsGanttChartBarHandle } from "./ts-gantt-chart-bar-handle";

export class TsGanttDateStartHandle extends TsGanttChartBarHandle {
  
  constructor(options: TsGanttChartBarOptions, task: TsGanttTask, callbackOnTaskUpdate: () => {}) {
    super(options, task, callbackOnTaskUpdate);
  }

  protected override draw(): void {
    const wrapper = this.createWrapper();
    const svg = this.createHandleSvg(wrapper);
    this._svg = svg;
  }

  protected createHandleSvg(wrapper: SVGElement): SVGElement {

    return null;
  }
}
