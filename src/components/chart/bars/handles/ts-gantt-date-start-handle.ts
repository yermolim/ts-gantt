import { Coords, createSvgElement } from "../../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../../core/ts-gantt-const";

import { TsGanttChartBarHandleDescriptor } from "./ts-gantt-chart-bar-handle-descriptor";
import { TsGanttChartBarHandle } from "./ts-gantt-chart-bar-handle";
import { HandleMoveEndEvent, HandleMoveEvent } from "./custom-events";

export class TsGanttDateStartHandle extends TsGanttChartBarHandle {
  
  constructor(descriptor: TsGanttChartBarHandleDescriptor) {
    super(descriptor, 
      (displacement: Coords) => { 
        document.dispatchEvent(new HandleMoveEvent({
          handleType: "start", 
          displacement, 
          taskUuid: descriptor.taskUuid,
          barType: descriptor.barType,
        })); 
      },
      (displacement: Coords) => { 
        document.dispatchEvent(new HandleMoveEndEvent({
          handleType: "start", 
          displacement, 
          taskUuid: descriptor.taskUuid,
          barType: descriptor.barType,
        })); 
      });
  }

  protected override drawHandle(wrapper: SVGElement): SVGElement {
    const handleSvg = createSvgElement("polygon", [TsGanttConst.CLASSES.CHART.BAR.HANDLE], [
      ["points", "60 25, 60 75, 10 50"],
    ], wrapper);

    return handleSvg;
  }
}
