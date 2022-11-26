import { createSvgElement } from "../../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../../core/ts-gantt-const";
import { TsGanttTask } from "../../../../core/ts-gantt-task";

import { TsGanttChartBarHandleOptions } from "./ts-gantt-chart-bar-handle-options";
import { TsGanttChartBarHandle } from "./ts-gantt-chart-bar-handle";

export class TsGanttDateEndHandle extends TsGanttChartBarHandle {
  
  constructor(options: TsGanttChartBarHandleOptions, task: TsGanttTask, callbackOnTaskUpdate: () => {}) {
    super(options, task, callbackOnTaskUpdate);
  }

  protected override drawHandle(wrapper: SVGElement): SVGElement {
    const handleSvg = createSvgElement("polygon", [TsGanttConst.CLASSES.CHART.BAR.HANDLE], [
      ["points", "40 25, 40 75, 90 50"],
    ], wrapper);

    return handleSvg;
  }
}
