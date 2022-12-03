import { Coords, createSvgElement } from "../../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../../core/ts-gantt-const";

import { TsGanttChartBarHandleDescriptor } from "./ts-gantt-chart-bar-handle-descriptor";
import { TsGanttChartBarHandle } from "./ts-gantt-chart-bar-handle";
import { HandleMoveEvent, HandleMoveEndEvent } from "./custom-events";

export class TsGanttProgressHandle extends TsGanttChartBarHandle {
  
  constructor(descriptor: TsGanttChartBarHandleDescriptor) {
    super(descriptor, 
      (displacement: Coords) => { 
        document.dispatchEvent(new HandleMoveEvent({
          handleType: "progress", 
          displacement, taskUuid: 
          descriptor.taskUuid
        })); 
      },
      (displacement: Coords) => { 
        document.dispatchEvent(new HandleMoveEndEvent({
          handleType: "progress", 
          displacement, 
          taskUuid: descriptor.taskUuid
        })); 
      });
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
