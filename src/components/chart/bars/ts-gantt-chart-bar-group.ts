import dayjs from "dayjs";

import { TsGanttConst } from "../../../core/ts-gantt-const";
import { ChartBarType, createSvgElement } from "../../../core/ts-gantt-common";
import { TsGanttTask } from "../../../core/ts-gantt-task";

import { TsGanttChartBarOptions } from "./ts-gantt-chart-bar-options";
import { TsGanttChartBarGroupOptions } from "./ts-gantt-chart-bar-group-options";
import { TsGanttChartBar } from "./ts-gantt-chart-bar";

export class TsGanttChartBarGroup {
  readonly task: TsGanttTask;
  
  private _svg: SVGElement;

  constructor(task: TsGanttTask, options: TsGanttChartBarGroupOptions) {
    this.task = task;
    this.draw(options, task);
  }

  appendTo(parent: SVGElement) {
    if (!this._svg) {
      return;
    }
    parent.append(this._svg);
  }

  appendToWithOffset(parent: SVGElement, offsetX: number) {    
    if (!this._svg || !offsetX) {
      return;
    }
    this._svg.setAttribute("x", offsetX + "");
    parent.append(this._svg);
  }

  private draw(options: TsGanttChartBarGroupOptions, task: TsGanttTask) {
    const { mode, showProgress, dayWidth, rowHeight, barMinWidth, barHeight, barBorder, barCornerR, y0, y1 } = options;

    const { minDate, maxDate } = task.getMinMaxDates(mode);
    if (!minDate || !maxDate) {
      return;
    }

    const { datePlannedStart, datePlannedEnd, dateActualStart, dateActualEnd } = task;
    const plannedDatesSet = datePlannedStart && datePlannedEnd;
    const actualDatesSet = dateActualStart && dateActualEnd;

    const commonBarOptionsPartial = {
      minDate,
      showProgress,
      dayWidth, 
      minWrapperWidth: barMinWidth,
      wrapperHeight: barHeight, 
      borderWidth: barBorder,
      cornerRadius: barCornerR,
      progress: task.progress,
    };
 
    const plannedBarOptionsPartial = {
      barType: "planned" as ChartBarType,
      startDate: datePlannedStart,
      endDate: datePlannedEnd,
    };

    const actualBarOptionsPartial = {
      barType: "actual" as ChartBarType,
      startDate: dateActualStart,
      endDate: dateActualEnd,
    };

    const barGroupSvg = this.createBarGroupWrapper(minDate, maxDate, dayWidth, barMinWidth, rowHeight);

    if (mode === "both") {
      if (actualDatesSet || plannedDatesSet) {
        if (plannedDatesSet) {
          new TsGanttChartBar(Object.assign({}, commonBarOptionsPartial, plannedBarOptionsPartial, {
            topPosition: y0,
          })).appendTo(barGroupSvg);
        }
        if (actualDatesSet) {
          new TsGanttChartBar(Object.assign({}, commonBarOptionsPartial, actualBarOptionsPartial, {
            topPosition: y1,
          })).appendTo(barGroupSvg);
        }
      }
    } else if (mode === "planned" && plannedDatesSet) {
      new TsGanttChartBar(Object.assign({}, commonBarOptionsPartial, plannedBarOptionsPartial, {
        topPosition: y0,
      })).appendTo(barGroupSvg);
    } else if (mode === "actual" && actualDatesSet) {
      new TsGanttChartBar(Object.assign({}, commonBarOptionsPartial, actualBarOptionsPartial, {
        topPosition: y0,
      })).appendTo(barGroupSvg);
    }

    this._svg = barGroupSvg;
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
}
