import { createSvgElement } from "../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../core/ts-gantt-const";

import { TsGanttChartBarOptions } from "./ts-gantt-chart-bar-options";

export class TsGanttChartBar {
  private readonly _options: TsGanttChartBarOptions;

  private _svg: SVGElement;

  constructor(options: TsGanttChartBarOptions) {
    this._options = options;
    this.draw();
  }

  destroy() {
    this._svg.remove();
  }

  appendTo(parent: SVGElement) {
    parent.append(this._svg);
  }
  
  appendToWithOffset(parent: SVGElement, offsetX: number) {    
    if (!this._svg || !offsetX) {
      return;
    }
    const currentOffsetX = +this._svg.getAttribute("x");
    this._svg.setAttribute("x", currentOffsetX + offsetX + "");
    parent.append(this._svg);
  }

  private draw() {
    const drawTaskBarWrapperResult = this.createWrapper();

    this.drawTaskBar(drawTaskBarWrapperResult);

    if (this._options.showProgress) {
      this.drawProgressBars(drawTaskBarWrapperResult);
    }

    this._svg = drawTaskBarWrapperResult.wrapper;
  }

  private drawTaskBar(options: DrawTaskBarWrapperResult) {
    const { barType, cornerRadius } = this._options;
    const { wrapper, width, height, margin } = options;

    const barClassList = barType === "planned"
      ? [TsGanttConst.CHART_BAR_PLANNED_CLASS]
      : [TsGanttConst.CHART_BAR_ACTUAL_CLASS];
    createSvgElement("rect", barClassList, [
      ["x", margin + ""],
      ["y", margin + ""],
      ["width", width + ""],
      ["height", height + ""],
      ["rx", cornerRadius + ""],
      ["ry", cornerRadius + ""],
    ], wrapper);
  }

  private drawProgressBars(options: DrawTaskBarWrapperResult) {
    const { barType, minWrapperWidth, borderWidth, cornerRadius, progress } = this._options;
    const { wrapper, width, height, margin } = options;

    const calculatedProgressWidth = width * progress / 100;
    const progressWidth = calculatedProgressWidth < minWrapperWidth - borderWidth
      ? 0
      : calculatedProgressWidth;
    const progressBarClassList = barType === "planned"
      ? [TsGanttConst.CHART_BAR_PLANNED_PROGRESS_CLASS]
      : [TsGanttConst.CHART_BAR_ACTUAL_PROGRESS_CLASS];
    createSvgElement("rect", progressBarClassList, [
      ["x", margin + ""],
      ["y", margin + ""],
      ["width", progressWidth + ""],
      ["height", height + ""],
      ["rx", cornerRadius + ""],
      ["ry", cornerRadius + ""],
    ], wrapper);
  }

  private createWrapper(): DrawTaskBarWrapperResult {
    const {
      minDate, startDate, endDate,
      dayWidth, minWrapperWidth, wrapperHeight,
      borderWidth, topPosition 
    } = this._options;

    const offsetX = (startDate.diff(minDate, "day")) * dayWidth;
    const widthDays = endDate.diff(startDate, "day") + 1;
    const wrapperWidth = Math.max(widthDays * dayWidth, minWrapperWidth);
    const wrapper = createSvgElement("svg", [TsGanttConst.CHART_BAR_WRAPPER_CLASS], [
      ["x", offsetX + ""],
      ["y", topPosition + ""],
      ["width", wrapperWidth + ""],
      ["height", wrapperHeight + ""],
    ]);
    const margin = borderWidth / 2;
    const width = wrapperWidth - borderWidth;
    const height = wrapperHeight - borderWidth;

    return { wrapper, width, height, margin };
  }
}

interface DrawTaskBarWrapperResult {
  wrapper: SVGElement; 
  width: number; 
  height: number; 
  margin: number;
}
