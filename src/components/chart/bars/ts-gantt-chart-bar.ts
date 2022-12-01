import { createSvgElement } from "../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../core/ts-gantt-const";
import { TsGanttSvgComponentBase } from "../../abstract/ts-gantt-svg-component-base";

import { TsGanttChartBarOptions } from "./ts-gantt-chart-bar-options";

import { TsGanttChartBarHandleOptions } from "./handles/ts-gantt-chart-bar-handle-options";
import { TsGanttDateStartHandle } from "./handles/ts-gantt-date-start-handle";
import { TsGanttDateEndHandle } from "./handles/ts-gantt-date-end-handle";
import { TsGanttProgressHandle } from "./handles/ts-gantt-progress-handle";

export class TsGanttChartBar extends TsGanttSvgComponentBase {
  private readonly _options: TsGanttChartBarOptions;

  private _defaultOffsetX: number;

  constructor(options: TsGanttChartBarOptions) {
    super();

    this._options = options;
    this.draw();
  }

  override appendToWithOffset(parent: Element, offsetX: number, addOffsetToCurrent = false) {
    if (!addOffsetToCurrent) {
      offsetX = offsetX + this._defaultOffsetX;
    }
    super.appendToWithOffset(parent, offsetX, addOffsetToCurrent);
  }

  private draw() {
    const { wrapper: wrapperCoords, bar: barCoords, handles: handlesCoords } = this.getDrawData();

    const wrapper = this.createWrapper(wrapperCoords);

    this.drawTaskBar(wrapper, barCoords);

    if (this._options.showProgress) {
      this.drawProgressBars(wrapper, barCoords);
    }

    if (this._options.showHandles) {
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
    } = this._options;

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
    const { barType, cornerRadius } = this._options;

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
    const { barType, cornerRadius } = this._options;

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
    const handleOptions: TsGanttChartBarHandleOptions = { 
      width: coords.width, 
      height: coords.height,
      displacementThreshold: coords.displacementThreshold,
    };

    const startHandle = new TsGanttDateStartHandle(handleOptions);
    startHandle.appendToWithOffset(wrapper, coords.startHandleOffsetX);

    const endHandle = new TsGanttDateEndHandle(handleOptions);
    endHandle.appendToWithOffset(wrapper, coords.endHandleOffsetX);

    const progressHandle = new TsGanttProgressHandle(handleOptions);
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
