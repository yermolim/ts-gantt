import { TsGanttTask } from "./ts-gantt-task";

class TsGanttOptions {
  headerHeight = 60;
  rowHeight = 0;
  columnWidth = 0;

  scale: "hour" | "day" | "week" | "month" = "day";
  locale: "ru" | "en" | "uk" = "en";
  customDateFormat = "YYYY-MM-DD";

  allowMoveBars = true;
  allowResizeBars = true;
  allowMoveProgress = true;
  
  constructor(item: object = null) {
    if (item != null) {
      Object.assign(this, item);
    }
  }
  
  barHeaderGetter = (a: TsGanttTask) => a.name;

  tooltipHeaderGetter = (a: TsGanttTask) => a.name;
  tooltipPlannedPeriodGetter = (a: TsGanttTask) => `${a.datePlannedStart}-${a.datePlannedEnd}`;
  tooltipActualPeriodGetter = (a: TsGanttTask) => `${a.dateActualStart}-${a.dateActualEnd}`;
  tooltipPlannedDurationGetter = (a: TsGanttTask) => a.durationPlanned;
  tooltipActualDurationGetter = (a: TsGanttTask) => a.durationActual;
  tooltipProgressGetter = (a: TsGanttTask) => a.progress;
}

export { TsGanttOptions };
