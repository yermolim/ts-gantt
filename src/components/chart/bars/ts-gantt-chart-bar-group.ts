import { ChartBarType } from "../../../core/ts-gantt-common";
import { TsGanttTask } from "../../../core/ts-gantt-task";

import { AppendableComponent } from "../../abstract/appendable-component";
import { TsGanttChartBarGroupOptions } from "./ts-gantt-chart-bar-group-options";
import { TsGanttChartBar } from "./ts-gantt-chart-bar";

export class TsGanttChartBarGroup implements AppendableComponent {
  readonly task: TsGanttTask;
  private _bars: TsGanttChartBar[];

  constructor(task: TsGanttTask, options: TsGanttChartBarGroupOptions) {
    this.task = task;
    this.draw(task, options);
  }

  destroy() {
    this._bars?.forEach(bar => {
      bar.destroy();
    });
  }

  appendTo(parent: Element) {
    if (!this._bars?.length) {
      return;
    }
    this._bars.forEach(bar => {
      bar.appendTo(parent);
    });
  }

  appendToWithOffset(parent: Element, offsetX: number) {
    if (!this._bars?.length || !offsetX) {
      return;
    }
    this._bars.forEach(bar => {
      bar.appendToWithOffset(parent, offsetX);
    });
  }

  private draw(task: TsGanttTask, options: TsGanttChartBarGroupOptions) {
    const { mode, showProgress, showHandles, 
      dayWidth, barMinWidth, barHeight, barBorder, barCornerR, y0, y1 } = options;

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
      showHandles,
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

    const bars: TsGanttChartBar[] = [];

    if (mode === "both") {
      if (actualDatesSet || plannedDatesSet) {
        if (plannedDatesSet) {
          bars.push(new TsGanttChartBar(Object.assign({}, 
            commonBarOptionsPartial, 
            plannedBarOptionsPartial, 
            {
              topPosition: y0,
            },
          )));
        }
        if (actualDatesSet) {
          bars.push(new TsGanttChartBar(Object.assign({}, 
            commonBarOptionsPartial, 
            actualBarOptionsPartial, 
            {
              topPosition: y1,
            },
          )));
        }
      }
    } else if (mode === "planned" && plannedDatesSet) {
      bars.push(new TsGanttChartBar(Object.assign({}, 
        commonBarOptionsPartial, 
        plannedBarOptionsPartial, 
        {
          topPosition: y0,
        },
      )));
    } else if (mode === "actual" && actualDatesSet) {
      bars.push(new TsGanttChartBar(Object.assign({}, 
        commonBarOptionsPartial, 
        actualBarOptionsPartial, 
        {
          topPosition: y0,
        },
      )));
    }

    this._bars = bars;
  }
}
