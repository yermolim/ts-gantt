import { createSvgElement } from "../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../core/ts-gantt-const";
import { TsGanttSvgComponentBase } from "../../abstract/ts-gantt-svg-component-base";

import { TsGanttChartBarDescriptor } from "./ts-gantt-chart-bar-descriptor";

import { TsGanttChartBarHandleDescriptor } from "./handles/ts-gantt-chart-bar-handle-descriptor";
import { TsGanttDateStartHandle } from "./handles/ts-gantt-date-start-handle";
import { TsGanttDateEndHandle } from "./handles/ts-gantt-date-end-handle";
import { TsGanttProgressHandle } from "./handles/ts-gantt-progress-handle";

export class TsGanttChartBar extends TsGanttSvgComponentBase {
  private readonly _descriptor: TsGanttChartBarDescriptor;

  private _defaultOffsetX: number;

  constructor(descriptor: TsGanttChartBarDescriptor) {
    super();

    this._descriptor = descriptor;
    this.draw();
  }

  override appendToWithOffset(parent: Element, offsetX: number, addOffsetToCurrent = false) {
    if (!addOffsetToCurrent) {
      offsetX = offsetX + this._defaultOffsetX;
    }
    super.appendToWithOffset(parent, offsetX, addOffsetToCurrent);
  }

  hide() {
    this._svg.style.visibility = "hidden";
  }

  private draw() {
    const { wrapper: wrapperCoords, bar: barCoords, handles: handlesCoords } = this.getDrawData();

    const wrapper = this.createWrapper(wrapperCoords);

    this.drawTaskBar(wrapper, barCoords);

    if (this._descriptor.showProgress) {
      this.drawProgressBars(wrapper, barCoords);
    }

    if (this._descriptor.showHandles) {
      this.drawHandles(wrapper, handlesCoords);
    }

    this._defaultOffsetX = wrapperCoords.left;
    this._svg = wrapper;
  }  

  private getDrawData(): DrawTaskBarData {
    const {
      minDate, startDate, endDate,
      dayWidth, minWrapperWidth, wrapperHeight,
      borderWidth, topPosition, progress,
    } = this._descriptor;

    const baseOffsetX = (startDate.diff(minDate, "day")) * dayWidth;
    const widthDays = endDate.diff(startDate, "day") + 1;
    const baseWidth = Math.max(widthDays * dayWidth, minWrapperWidth);

    const handleWidth = wrapperHeight;

    const wrapperWidth = baseWidth + 2 * handleWidth;
    const wrapperLeft = baseOffsetX - handleWidth;

    const barWidth = baseWidth - borderWidth;
    const barHeight = wrapperHeight - borderWidth;
    const barLeft = borderWidth / 2 + handleWidth;
    const barTop = borderWidth / 2;
    
    const calculatedProgressWidth = barWidth * progress / 100;
    const progressBarWidth = calculatedProgressWidth < minWrapperWidth - borderWidth
      ? 0
      : calculatedProgressWidth;

    const startHandleOffsetX = 0;
    const endHandleOffsetX = wrapperWidth - handleWidth;
    const progressHandleOffsetX = barLeft + progressBarWidth - handleWidth / 2;

    return {
      wrapper: {
        width: wrapperWidth,
        height: wrapperHeight,
        left: wrapperLeft,
        top: topPosition,
      },
      bar: {
        width: barWidth, 
        height: barHeight, 
        left: barLeft, 
        top: barTop,
        progressWidth: progressBarWidth,
      },
      handles: {
        width: handleWidth,
        height: handleWidth,
        startHandleOffsetX,
        endHandleOffsetX,
        progressHandleOffsetX,
        displacementThreshold: dayWidth,
      }
    };
  }

  private drawTaskBar(wrapper: SVGElement, coords: BarCoords) {
    const { barType, cornerRadius } = this._descriptor;

    const barClassList = barType === "planned"
      ? [TsGanttConst.CLASSES.CHART.BAR.PLANNED]
      : [TsGanttConst.CLASSES.CHART.BAR.ACTUAL];
    createSvgElement("rect", barClassList, [
      ["x", coords.left + ""],
      ["y", coords.top + ""],
      ["width", coords.width + ""],
      ["height", coords.height + ""],
      ["rx", cornerRadius + ""],
      ["ry", cornerRadius + ""],
    ], wrapper);
  }

  private drawProgressBars(wrapper: SVGElement, coords: BarCoords) {
    const { barType, cornerRadius } = this._descriptor;

    const progressBarClassList = barType === "planned"
      ? [TsGanttConst.CLASSES.CHART.BAR.PLANNED_PROGRESS]
      : [TsGanttConst.CLASSES.CHART.BAR.ACTUAL_PROGRESS];
    createSvgElement("rect", progressBarClassList, [
      ["x", coords.left + ""],
      ["y", coords.top + ""],
      ["width", coords.progressWidth + ""],
      ["height", coords.height + ""],
      ["rx", cornerRadius + ""],
      ["ry", cornerRadius + ""],
    ], wrapper);
  }

  private drawHandles(wrapper: SVGElement, coords: HandlesCoords) {
    const handleOptions: TsGanttChartBarHandleDescriptor = {
      taskUuid: this._descriptor.taskUuid,
      width: coords.width, 
      height: coords.height,
      displacementThreshold: coords.displacementThreshold,
      barType: this._descriptor.barType,
    };

    const startHandle = new TsGanttDateStartHandle(handleOptions);
    startHandle.appendToWithOffset(wrapper, coords.startHandleOffsetX);

    const endHandle = new TsGanttDateEndHandle(handleOptions);
    endHandle.appendToWithOffset(wrapper, coords.endHandleOffsetX);

    const progressHandle = new TsGanttProgressHandle(Object.assign({}, handleOptions, {displacementThreshold: 1}));
    progressHandle.appendToWithOffset(wrapper, coords.progressHandleOffsetX);
  }

  private createWrapper(coords: WrapperCoords): SVGElement {
    const wrapper = createSvgElement("svg", [TsGanttConst.CLASSES.CHART.BAR.WRAPPER], [
      ["x", coords.left + ""],
      ["y", coords.top + ""],
      ["width", coords.width + ""],
      ["height", coords.height + ""],
    ]);

    return wrapper;
  }
}

interface DrawTaskBarData {
  wrapper: WrapperCoords;
  bar: BarCoords;
  handles: HandlesCoords;
}

interface WrapperCoords {
  width: number; 
  height: number;
  left: number;
  top: number;
}

interface BarCoords {
  width: number; 
  height: number;
  left: number;
  top: number;
  progressWidth: number;
}

interface HandlesCoords {
  width: number; 
  height: number;
  startHandleOffsetX: number;
  endHandleOffsetX: number;
  progressHandleOffsetX: number;
  displacementThreshold: number;
}
