import dayjs from "dayjs";

import { TsGanttConst } from "../../core/ts-gantt-const";
import { createSvgElement } from "../../core/ts-gantt-common";
import { TsGanttTask } from "../../core/ts-gantt-task";

import { TsGanttChartBarGroupOptions } from "./ts-gantt-chart-bar-options";

class TsGanttChartBarGroup {
  readonly task: TsGanttTask;
  readonly svg: SVGElement;

  constructor(task: TsGanttTask, options: TsGanttChartBarGroupOptions) {
    this.svg = this.createSvg(options, task);
    this.task = task;
  }

  private createSvg(options: TsGanttChartBarGroupOptions, task: TsGanttTask) {
    const { mode, showProgress, dayWidth, rowHeight, barMinWidth, barHeight, barBorder, barCornerR, y0, y1 } = options;

    const { minDate, maxDate } = task.getMinMaxDates(mode);

    const { datePlannedStart, datePlannedEnd, dateActualStart, dateActualEnd } = task;
    const plannedDatesSet = datePlannedStart && datePlannedEnd;
    const actualDatesSet = dateActualStart && dateActualEnd;

    let barSvg: SVGElement;
    if (mode === "both") {
      if (actualDatesSet || plannedDatesSet) {
        barSvg = this.createBarGroupWrapper(minDate, maxDate, dayWidth, barMinWidth, rowHeight);
        if (plannedDatesSet) {
          this.drawBar(barSvg,
            minDate, datePlannedStart, datePlannedEnd,
            dayWidth, barMinWidth, barHeight, y0, barBorder, barCornerR,
            "planned", task.progress, showProgress);
        }
        if (actualDatesSet) {
          this.drawBar(barSvg,
            minDate, dateActualStart, dateActualEnd,
            dayWidth, barMinWidth, barHeight, y1, barBorder, barCornerR,
            "actual", task.progress, showProgress);
        }
      }
    } else if (mode === "planned" && plannedDatesSet) {
      barSvg = this.createBarGroupWrapper(minDate, maxDate, dayWidth, barMinWidth, rowHeight);
      this.drawBar(barSvg,
        minDate, minDate, maxDate,
        dayWidth, barMinWidth, barHeight, y0, barBorder, barCornerR,
        "planned", task.progress, showProgress);

    } else if (mode === "actual" && actualDatesSet) {
      barSvg = this.createBarGroupWrapper(minDate, maxDate, dayWidth, barMinWidth, rowHeight);
      this.drawBar(barSvg,
        minDate, minDate, maxDate,
        dayWidth, barMinWidth, barHeight, y0, barBorder, barCornerR,
        "actual", task.progress, showProgress);
    }
    return barSvg;
  }

  private createBarGroupWrapper(minDate: dayjs.Dayjs, maxDate: dayjs.Dayjs,
    dayWidth: number, minWidth: number, rowHeight: number): SVGElement {

    const widthDays = maxDate.diff(minDate, "day") + 1;
    const width = Math.max(widthDays * dayWidth + minWidth, minWidth);
    const barSvg = createSvgElement("svg", [TsGanttConst.CHART_BAR_GROUP_CLASS], [
      ["width", width + ""],
      ["height", rowHeight + ""],
    ]); 
    return barSvg;
  }

  private drawBar(parent: SVGElement, 
    minDate: dayjs.Dayjs, start: dayjs.Dayjs, end: dayjs.Dayjs,
    dayWidth: number, minWrapperWidth: number, wrapperHeight: number, y: number,
    borderWidth: number, cornerRadius: number,
    barType: "planned" | "actual",
    progress: number, showProgress: boolean) {

    const barClassList = barType === "planned"
      ? [TsGanttConst.CHART_BAR_PLANNED_CLASS]
      : [TsGanttConst.CHART_BAR_ACTUAL_CLASS];
    const progressBarClassList = barType === "planned"
      ? [TsGanttConst.CHART_BAR_PLANNED_PROGRESS_CLASS]
      : [TsGanttConst.CHART_BAR_ACTUAL_PROGRESS_CLASS];
        
    const offsetX = (start.diff(minDate, "day")) * dayWidth;
    const widthDays = end.diff(start, "day") + 1;
    const wrapperWidth = Math.max(widthDays * dayWidth, minWrapperWidth);
    const wrapper = createSvgElement("svg", [TsGanttConst.CHART_BAR_WRAPPER_CLASS], [
      ["x", offsetX + ""],
      ["y", y + ""],
      ["width", wrapperWidth + ""],
      ["height", wrapperHeight + ""],
    ], parent); 
    const margin = borderWidth/2;
    const width = wrapperWidth - borderWidth;
    const height = wrapperHeight - borderWidth;
    const bar = createSvgElement("rect", barClassList, [
      ["x", margin + ""],
      ["y", margin + ""],
      ["width", width + ""],
      ["height", height + ""],
      ["rx", cornerRadius + ""],
      ["ry", cornerRadius + ""],
    ], wrapper);
    if (showProgress) {  
      const calculatedProgressWidth = width * progress / 100;
      const progressWidth = calculatedProgressWidth < minWrapperWidth - borderWidth 
        ? 0
        : calculatedProgressWidth;
      const barProgress = createSvgElement("rect", progressBarClassList, [
        ["x", margin + ""],
        ["y", margin + ""],
        ["width", progressWidth + ""],
        ["height", height + ""],
        ["rx", cornerRadius + ""],
        ["ry", cornerRadius + ""],
      ], wrapper);
    }
  }
}

export { TsGanttChartBarGroup };
