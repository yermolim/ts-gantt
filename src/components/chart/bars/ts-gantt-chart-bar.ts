import { createSvgElement } from "../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../core/ts-gantt-const";
import { TsGanttSvgComponentBase } from "../../abstract/ts-gantt-svg-component-base";

import { TsGanttChartBarOptions } from "./ts-gantt-chart-bar-options";

export class TsGanttChartBar extends TsGanttSvgComponentBase {
  private readonly _options: TsGanttChartBarOptions;

  constructor(options: TsGanttChartBarOptions) {
    super();

    this._options = options;
    this.draw();
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
      ? [TsGanttConst.CLASSES.CHART.BAR_PLANNED]
      : [TsGanttConst.CLASSES.CHART.BAR_ACTUAL];
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
      ? [TsGanttConst.CLASSES.CHART.BAR_PLANNED_PROGRESS]
      : [TsGanttConst.CLASSES.CHART.BAR_ACTUAL_PROGRESS];
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
    const wrapper = createSvgElement("svg", [TsGanttConst.CLASSES.CHART.BAR_WRAPPER], [
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
