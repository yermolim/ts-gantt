import dayjs from "dayjs";

import { TsGanttConst } from "../../core/ts-gantt-const";
import { createSvgElement } from "../../core/ts-gantt-common";
import { TsGanttTask } from "../../core/ts-gantt-task";

import { TsGanttChartBarGroupOptions } from "./ts-gantt-chart-bar-options";

class TsGanttChartBarGroup {  
  readonly task: TsGanttTask;
  readonly minDate: dayjs.Dayjs;
  readonly maxDate: dayjs.Dayjs;
  readonly barSvg: SVGElement;

  constructor(task: TsGanttTask, options: TsGanttChartBarGroupOptions) {
    const { mode, showProgress, dayWidth, rowHeight, 
      barMinWidth, barHeight, barBorder, barCornerR, y0, y1 } = options;

    const { datePlannedStart, datePlannedEnd, dateActualStart, dateActualEnd } = task;    
    const plannedDatesSet = datePlannedStart && datePlannedEnd;
    const actualDatesSet = dateActualStart && dateActualEnd;

    let minDate: dayjs.Dayjs;
    let maxDate: dayjs.Dayjs;
    let barSvg: SVGElement;

    if (mode === "both") {

      if (actualDatesSet || plannedDatesSet) {
        if (actualDatesSet && plannedDatesSet) {
          minDate = datePlannedStart.isBefore(dateActualStart) ? datePlannedStart : dateActualStart;
          maxDate = datePlannedEnd.isAfter(dateActualEnd) ? datePlannedEnd : dateActualEnd;
        } else if (plannedDatesSet) {
          minDate = datePlannedStart;
          maxDate = datePlannedEnd;
        } else {
          minDate = dateActualStart;
          maxDate = dateActualEnd;
        }

        barSvg = this.createSvg(minDate, maxDate, dayWidth, barMinWidth, rowHeight);
        if (plannedDatesSet) {
          this.createBar(barSvg,
            minDate, datePlannedStart, datePlannedEnd,
            dayWidth, barMinWidth, barHeight, y0, barBorder, barCornerR,
            "planned", task.progress, showProgress);
        }
        if (actualDatesSet) {
          this.createBar(barSvg,
            minDate, dateActualStart, dateActualEnd,
            dayWidth, barMinWidth, barHeight, y1, barBorder, barCornerR,
            "actual", task.progress, showProgress);
        }   
      }     

    } else if (mode === "planned" && plannedDatesSet) {
      minDate = datePlannedStart;
      maxDate = datePlannedEnd;

      barSvg = this.createSvg(minDate, maxDate, dayWidth, barMinWidth, rowHeight);
      this.createBar(barSvg,
        minDate, minDate, maxDate,
        dayWidth, barMinWidth, barHeight, y0, barBorder, barCornerR,
        "planned", task.progress, showProgress);

    } else if (mode === "actual" && actualDatesSet) {  
      minDate = dateActualStart;
      maxDate = dateActualEnd;

      barSvg = this.createSvg(minDate, maxDate, dayWidth, barMinWidth, rowHeight);
      this.createBar(barSvg,
        minDate, minDate, maxDate,
        dayWidth, barMinWidth, barHeight, y0, barBorder, barCornerR,
        "actual", task.progress, showProgress);
    }   

    this.minDate = minDate;
    this.maxDate = maxDate;
    this.barSvg = barSvg;

    this.task = task;
  }

  private createSvg(minDate: dayjs.Dayjs, maxDate: dayjs.Dayjs,
    dayWidth: number, minWidth: number, rowHeight: number): SVGElement {

    const widthDays = maxDate.diff(minDate, "day") + 1;
    const width = Math.max(widthDays * dayWidth + minWidth, minWidth);
    const barSvg = createSvgElement("svg", [TsGanttConst.CHART_BAR_GROUP_CLASS], [
      ["width", width + ""],
      ["height", rowHeight + ""],
    ]); 
    return barSvg;
  }

  private createBar(parent: SVGElement, 
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
