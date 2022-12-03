import { Coords, createSvgElement } from "../../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../../core/ts-gantt-const";

import { TsGanttChartBarHandleDescriptor } from "./ts-gantt-chart-bar-handle-descriptor";
import { TsGanttChartBarHandle } from "./ts-gantt-chart-bar-handle";
import { HandleMoveEvent, HandleMoveEndEvent } from "./custom-events";

export class TsGanttDateEndHandle extends TsGanttChartBarHandle {
  
  constructor(descriptor: TsGanttChartBarHandleDescriptor) {
    super(descriptor, 
      (displacement: Coords) => { 
        document.dispatchEvent(new HandleMoveEvent({handleType: "end", displacement})); 
      },
      (displacement: Coords) => { 
        document.dispatchEvent(new HandleMoveEndEvent({handleType: "end", displacement})); 
      });
  }

  protected override drawHandle(wrapper: SVGElement): SVGElement {
    const handleSvg = createSvgElement("polygon", [TsGanttConst.CLASSES.CHART.BAR.HANDLE], [
      ["points", "40 25, 40 75, 90 50"],
    ], wrapper);

    return handleSvg;
  }
}
