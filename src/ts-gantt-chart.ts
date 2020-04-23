import dayjs from "dayjs";
import { TsGanttConst } from "./ts-gantt-const";
import { TsGanttTask, TsGanttTaskChangesDetectionResult } from "./ts-gantt-task";
import { TsGanttOptions } from "./ts-gantt-options";
import { createSvgElement, getAllDatesBetweenTwoDates } from "./ts-gantt-common";

class TsGanttChartBarGroup {
  
  readonly task: TsGanttTask;
  readonly barSvg: SVGElement;

  constructor(task: TsGanttTask, mode: "planned" | "actual" | "both",
    dayWidth: number, height: number, y0: number, y1: number) {
    this.task = task;
    // IMPLEMENT
  }
}

class TsGanttChartRow {

  readonly barGroup: TsGanttChartBarGroup;
  readonly rowSvg: SVGElement;

  constructor(barGroup: TsGanttChartBarGroup, rowWidth: number, rowHeight: number) {
    this.barGroup = barGroup;
    // IMPLEMENT
  }
}

class TsGanttChartTooltip {

}

class TsGanttChart {

  private _options: TsGanttOptions;
  
  private _html: SVGElement;
  get html(): SVGElement {
    return this._html;
  }
  
  private _htmlHeader: SVGElement;
  private _htmlBody: SVGElement;

  private _chartBarGroups: TsGanttChartBarGroup[] = [];
  private _chartRows: TsGanttChartRow[] = [];
  
  private _dateMin: dayjs.Dayjs;
  private _dateMax: dayjs.Dayjs;
  private _dateMinOffset: dayjs.Dayjs;
  private _dateMaxOffset: dayjs.Dayjs;

  private _width: number;
  private _headerHeight: number;
  private _bodyHeight: number;
  private _verticalLinesXCoords: number[];
  
  constructor(options: TsGanttOptions) {
    this._options = options;
    
    const svg = createSvgElement("svg", [TsGanttConst.CHART_CLASS]);
    this._html = svg;
  }
  
  update(forceRedraw: boolean, data: TsGanttTaskChangesDetectionResult) {
    
    const datesCheckResult = this.checkDates(data.all);
    if (!datesCheckResult || forceRedraw) {
      this.refreshHeader();
    }
    if (data) {
      this.refreshBarGroups(data);
    } 
    this.refreshRows();
    this.refreshBody();
    this.redraw();
  }

  private checkDates(tasks: TsGanttTask[]): boolean {
    const currentDateMin = this._dateMinOffset;
    const currentDateMax = this._dateMaxOffset;
    const chartScale = this._options.chartScale;
    const dateOffsetMin = this._options.chartDateOffsetDaysMin[chartScale];
    const dateOffset = this._options.chartDateOffsetDays[chartScale];

    let dateMin = dayjs();
    let dateMax = dayjs();
    for (const task of tasks) {
      const plannedStart = dayjs(task.datePlannedStart);
      const plannedEnd = dayjs(task.datePlannedEnd);
      const actualStart = task.dateActualStart ? dayjs(task.dateActualStart) : null;
      const actualEnd = task.dateActualEnd ? dayjs(task.dateActualEnd) : null;
      if (plannedStart.isBefore(dateMin)) {
        dateMin = plannedStart;
      }
      if (plannedEnd.isAfter(dateMax)) {
        dateMax = plannedEnd;
      }      
      if (actualStart && actualStart.isBefore(dateMin)) {
        dateMin = actualStart;
      }
      if (actualEnd && actualEnd.isAfter(dateMax)) {
        dateMax = actualEnd;
      }
    }
    this._dateMin = dateMin;
    this._dateMax = dateMax;

    if (!currentDateMin 
      || currentDateMin.isAfter(dateMin) 
      || dateMin.diff(currentDateMin, "day") < dateOffsetMin) {        
      this._dateMinOffset = dateMin.subtract(dateOffset, "day");
    }
    if (!currentDateMax 
      || currentDateMax.isBefore(dateMax) 
      || currentDateMax.diff(dateMax, "day") < dateOffsetMin) {        
      this._dateMaxOffset = dateMax.add(dateOffset, "day");
    }

    return this._dateMinOffset === currentDateMin && this._dateMaxOffset === currentDateMax;
  }

  private refreshBarGroups(data: TsGanttTaskChangesDetectionResult) {
    const mode = this._options.chartBarMode;
    const rowHeight = this._options.chartRowHeightPx;
    // IMPLEMENT calculations

    data.deleted.forEach(x => {
      const index = this._chartBarGroups.findIndex(y => y.task.uuid === x.uuid);
      if (index !== 1) {
        this._chartBarGroups.splice(index, 1);
      }
    });
    data.changed.forEach(x => {      
      const index = this._chartBarGroups.findIndex(y => y.task.uuid === x.uuid);
      if (index !== -1) {
        this._chartBarGroups[index] = new TsGanttChartBarGroup(x, mode, 0, 0, 0, 0);
      }
    });
    data.added.forEach(x => this._chartBarGroups.push(new TsGanttChartBarGroup(x, mode, 0, 0, 0, 0)));
  }

  private refreshRows() {
    this._chartRows = this.getChartRowsRecursively(this._chartBarGroups, null,
      this._width, this._options.chartRowHeightPx);
  }
    
  private getChartRowsRecursively(barGroups: TsGanttChartBarGroup[], 
    parentUuid: string, rowWidth: number, rowHeight: number): TsGanttChartRow[] {
      
    const barGroupsFiltered = barGroups.filter(x => x.task.parentUuid === parentUuid)
      .sort((a: TsGanttChartBarGroup, b: TsGanttChartBarGroup): number => a.task.compareTo(b.task));
    const rows: TsGanttChartRow[] = [];
    for (const barGroup of barGroupsFiltered) {
      if (!barGroup.task.shown) {
        continue;
      }
      rows.push(new TsGanttChartRow(barGroup, rowWidth, rowHeight));
      if (barGroup.task.expanded) {
        rows.push(...this.getChartRowsRecursively(barGroups, barGroup.task.uuid, rowWidth, rowHeight));
      }
    }
    return rows;
  }

  private refreshHeader() {
    const scale = this._options.chartScale;
    const dayWidth = this._options.chartDayWidthPx[scale];
    const height = this._options.chartHeaderHeightPx;
    
    const minDate = this._dateMinOffset;
    const maxDate = this._dateMaxOffset;

    const dates = getAllDatesBetweenTwoDates(this._dateMinOffset, this._dateMaxOffset);
    const width = dates.length * dayWidth;

    const locale = this._options.locale;
    const months = this._options.localeDateMonths[locale];
    const daysShort = this._options.localeDateDaysShort[locale];
    const days = this._options.localeDateDays[locale];
    
    const header = createSvgElement("svg", [TsGanttConst.CHART_HEADER_CLASS], [
      ["width", width + ""],
      ["height", height + ""],
    ]);
    const headerBg = createSvgElement("rect", [TsGanttConst.CHART_HEADER_BACKGROUND_CLASS], [
      ["width", width + ""],
      ["height", height + ""],
    ], header);

    let currentDayOffset = 0;
    let monthStartOffset = 0;
    let yearStartOffset = 0;
    const verticalLinesXCoords: number[] = [];
    if (scale === "year") {         
      for (const date of dates) {  
        const nextDayOffset = currentDayOffset + dayWidth;  
        
        if (date.isSame(date.endOf("year").startOf("day")) || date.isSame(maxDate)) {
          const yearWidth = nextDayOffset - yearStartOffset;
          const yearSvg = createSvgElement("svg", [], [
            ["x", yearStartOffset + ""],
            ["y", "0"],
            ["width", yearWidth + ""],
            ["height", height + ""],
          ], header);
          if (yearWidth >= 60) {
            const yearText = createSvgElement("text", [TsGanttConst.CHART_HEADER_TEXT_CLASS], [
              ["x", "50%"],
              ["y", "50%"],
              ["dominant-baseline", "middle"],
              ["text-anchor", "middle"],
            ], yearSvg, date.year() + "");
          }    
          const rightBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
            ["x1", nextDayOffset + ""],
            ["y1", 0 + ""],
            ["x2", nextDayOffset + ""],
            ["y2", height + ""],
          ], header);
          verticalLinesXCoords.push(nextDayOffset);
          yearStartOffset = nextDayOffset;
        }

        currentDayOffset = nextDayOffset;
      } 
    } else if (scale === "month") {   
      const rowHeight = height / 2;
      const y0 = 0;
      const y1 = rowHeight;

      const rowBottomBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
        ["x1", 0 + ""],
        ["y1", y1 + ""],
        ["x2", width + ""],
        ["y2", y1 + ""],
      ], header);
      
      for (const date of dates) {  
        const nextDayOffset = currentDayOffset + dayWidth;  
        
        if (date.isSame(date.endOf("year").startOf("day")) || date.isSame(maxDate)) {
          const yearWidth = nextDayOffset - yearStartOffset;
          const yearSvg = createSvgElement("svg", [], [
            ["x", yearStartOffset + ""],
            ["y", y0 + ""],
            ["width", yearWidth + ""],
            ["height", rowHeight + ""],
          ], header);
          if (yearWidth >= 60) {
            const yearText = createSvgElement("text", [TsGanttConst.CHART_HEADER_TEXT_CLASS], [
              ["x", "50%"],
              ["y", "50%"],
              ["dominant-baseline", "middle"],
              ["text-anchor", "middle"],
            ], yearSvg, date.year() + "");
          }
          const yearRightBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
            ["x1", nextDayOffset + ""],
            ["y1", y0 + ""],
            ["x2", nextDayOffset + ""],
            ["y2", y1 + ""],
          ], header);
          yearStartOffset = nextDayOffset;
        }

        if (date.isSame(date.endOf("month").startOf("day")) || date.isSame(maxDate)) {
          const monthWidth = nextDayOffset - monthStartOffset;
          const monthSvg = createSvgElement("svg", [], [
            ["x", monthStartOffset + ""],
            ["y", y1 + ""],
            ["width", monthWidth + ""],
            ["height", rowHeight + ""],
          ], header);
          if (monthWidth >= 60) {
            const monthName = months[date.month()];
            const monthText = createSvgElement("text", [TsGanttConst.CHART_HEADER_TEXT_CLASS], [
              ["x", "50%"],
              ["y", "50%"],
              ["dominant-baseline", "middle"],
              ["text-anchor", "middle"],
            ], monthSvg, monthName);
          }
          const monthRightBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
            ["x1", nextDayOffset + ""],
            ["y1", y1 + ""],
            ["x2", nextDayOffset + ""],
            ["y2", height + ""],
          ], header);
          verticalLinesXCoords.push(nextDayOffset);
          monthStartOffset = nextDayOffset;
        }

        currentDayOffset = nextDayOffset;
      }    

    } else if (scale === "week" || scale ==="day") {
      const rowHeight = height / 3;
      const y0 = 0;
      const y1 = rowHeight;
      const y2 = rowHeight * 2;
      
      const rowBottomBorder1 = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
        ["x1", 0 + ""],
        ["y1", y1 + ""],
        ["x2", width + ""],
        ["y2", y1 + ""],
      ], header);      
      const rowBottomBorder2 = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
        ["x1", 0 + ""],
        ["y1", y2 + ""],
        ["x2", width + ""],
        ["y2", y2 + ""],
      ], header);

      for (const date of dates) {  
        const nextDayOffset = currentDayOffset + dayWidth;  
        
        if (date.isSame(date.endOf("year").startOf("day")) || date.isSame(maxDate)) {
          const yearWidth = nextDayOffset - yearStartOffset;
          const yearSvg = createSvgElement("svg", [], [
            ["x", yearStartOffset + ""],
            ["y", y0 + ""],
            ["width", yearWidth + ""],
            ["height", rowHeight + ""],
          ], header);
          if (yearWidth >= 60) {
            const yearText = createSvgElement("text", [TsGanttConst.CHART_HEADER_TEXT_CLASS], [
              ["x", "50%"],
              ["y", "50%"],
              ["dominant-baseline", "middle"],
              ["text-anchor", "middle"],
            ], yearSvg, date.year() + "");
          }
          const yearRightBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
            ["x1", nextDayOffset + ""],
            ["y1", y0 + ""],
            ["x2", nextDayOffset + ""],
            ["y2", y1 + ""],
          ], header);
          yearStartOffset = nextDayOffset;
        }

        if (date.isSame(date.endOf("month").startOf("day")) || date.isSame(maxDate)) {
          const monthWidth = nextDayOffset - monthStartOffset;
          const monthSvg = createSvgElement("svg", [], [
            ["x", monthStartOffset + ""],
            ["y", y1 + ""],
            ["width", monthWidth + ""],
            ["height", rowHeight + ""],
          ], header);
          if (monthWidth >= 60) {
            const monthName = months[date.month()];
            const monthText = createSvgElement("text", [TsGanttConst.CHART_HEADER_TEXT_CLASS], [
              ["x", "50%"],
              ["y", "50%"],
              ["dominant-baseline", "middle"],
              ["text-anchor", "middle"],
            ], monthSvg, monthName);
          }
          const monthRightBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
            ["x1", nextDayOffset + ""],
            ["y1", y1 + ""],
            ["x2", nextDayOffset + ""],
            ["y2", y2 + ""],
          ], header);
          monthStartOffset = nextDayOffset;
        }

        const daySvg = createSvgElement("svg", [], [
          ["x", currentDayOffset + ""],
          ["y", y2 + ""],
          ["width", dayWidth + ""],
          ["height", rowHeight + ""],
        ], header);
        const dayName = dayWidth < 30 
          ? date.date() + ""
          : daysShort[date.day()] + " " + date.date();
        const dayText = createSvgElement("text", [TsGanttConst.CHART_HEADER_TEXT_CLASS], [
          ["x", "50%"],
          ["y", "50%"],
          ["dominant-baseline", "middle"],
          ["text-anchor", "middle"],
        ], daySvg, dayName);
        const dayRightBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
          ["x1", nextDayOffset + ""],
          ["y1", y2 + ""],
          ["x2", nextDayOffset + ""],
          ["y2", height + ""],
        ], header);
        verticalLinesXCoords.push(nextDayOffset);
        currentDayOffset = nextDayOffset;
      }      
    }

    this._width = width;
    this._headerHeight = height;
    this._verticalLinesXCoords = verticalLinesXCoords;
    this._htmlHeader = header;
  }

  private refreshBody() {
    const scale = this._options.chartScale;
    const width = this._width;
    const rowHeight = this._options.chartRowHeightPx;
    const rows = this._chartRows;
    const height = rowHeight * rows.length;
    const y0 = this._headerHeight;
    
    const body = createSvgElement("svg", [TsGanttConst.CHART_BODY_CLASS], [
      ["y", y0 + ""],
      ["width", width + ""],
      ["height", height + ""],
    ]); 
    const bodyBg = createSvgElement("rect", [TsGanttConst.CHART_BODY_BACKGROUND_CLASS], [
      ["width", width + ""],
      ["height", height + ""],
    ], body);

    const selectedRowIndex = rows.findIndex(x => x.barGroup.task.selected);
    if (selectedRowIndex !== -1) {
      const selectedRowBg = createSvgElement("rect", 
        [TsGanttConst.CHART_BODY_ROW_BACKGROUND_CLASS, TsGanttConst.ROW_SELECTED_CLASS], [
          ["y", (selectedRowIndex * rowHeight) + ""],
          ["width", width + ""],
          ["height", rowHeight + ""],
        ], body); 
    }

    for (let i = 0; i < rows.length;) {
      const lineY = ++i * rowHeight - 0.5;
      const horizontalLine = createSvgElement("line", [TsGanttConst.CHART_BODY_GRIDLINES_CLASS], [
        ["x1", 0 + ""],
        ["y1", lineY + ""],
        ["x2", width + ""],
        ["y2", lineY + ""],
      ], body);      
    }

    this._verticalLinesXCoords.forEach(x => {      
      const verticalLine = createSvgElement("line", [TsGanttConst.CHART_BODY_GRIDLINES_CLASS], [
        ["x1", x + ""],
        ["y1", 0 + ""],
        ["x2", x + ""],
        ["y2", height + ""],
      ], body);    
    });

    // IMPLEMENT adding bars

    this._bodyHeight = height;
    this._htmlBody = body;
  }

  private redraw() {
    const height = this._headerHeight + this._bodyHeight;
    const oldHtml = this._html;

    const newHtml = createSvgElement("svg", [TsGanttConst.CHART_CLASS], [
      ["width", this._width + ""],
      ["height", height + ""],
    ]);
    newHtml.append(this._htmlHeader, this._htmlBody);

    oldHtml.replaceWith(newHtml);
    this._html = newHtml;
  }
}

export { TsGanttChart };
