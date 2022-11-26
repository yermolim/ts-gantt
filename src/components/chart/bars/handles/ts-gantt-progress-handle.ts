import { createSvgElement } from "../../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../../core/ts-gantt-const";

import { TsGanttChartBarHandleOptions } from "./ts-gantt-chart-bar-handle-options";
import { TsGanttChartBarHandle } from "./ts-gantt-chart-bar-handle";

export class TsGanttProgressHandle extends TsGanttChartBarHandle {
  
  constructor(options: TsGanttChartBarHandleOptions, callbackOnMove: () => {}) {
    super(options, callbackOnMove);
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
