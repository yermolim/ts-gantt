import { createSvgElement } from "../../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../../core/ts-gantt-const";
import { TsGanttTask } from "../../../../core/ts-gantt-task";

import { TsGanttChartBarHandleOptions } from "./ts-gantt-chart-bar-handle-options";
import { TsGanttChartBarHandle } from "./ts-gantt-chart-bar-handle";

export class TsGanttProgressHandle extends TsGanttChartBarHandle {
  
  constructor(options: TsGanttChartBarHandleOptions, task: TsGanttTask, callbackOnTaskUpdate: () => {}) {
    super(options, task, callbackOnTaskUpdate);
  }

  protected override drawHandle(wrapper: SVGElement): SVGElement {
    const handleSvg = createSvgElement("circle", [TsGanttConst.CLASSES.CHART.BAR.HANDLE], [
      ["cx", "50"],
      ["cy", "50"],
      ["r", "25"],
    ], wrapper);

    return handleSvg;
  }
}
