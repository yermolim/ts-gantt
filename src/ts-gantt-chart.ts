import dayjs from "dayjs";
import { TsGanttConst } from "./ts-gantt-const";
import { createSvgElement, getAllDatesBetweenTwoDates } from "./ts-gantt-common";
import { TsGanttOptions } from "./ts-gantt-options";
import { TsGanttTask, TsGanttTaskChangeResult, TsGanttTaskSelectionChangeResult } from "./ts-gantt-task";
import { TsGanttChartBarGroup, TsGanttChartBarGroupOptions } from "./ts-gantt-chart-parts";

class TsGanttChart {
  private _options: TsGanttOptions;
  
  private _dateMinOffset: dayjs.Dayjs;
  private _dateMaxOffset: dayjs.Dayjs;
  
  private _html: HTMLDivElement;
  get html(): HTMLDivElement {
    return this._html;
  }    
  private _htmlHeader: SVGElement;
  get htmlHeader(): SVGElement {
    return this._htmlHeader;
  }  
  private _htmlBody: SVGElement;

  private _chartBarGroups: TsGanttChartBarGroup[] = [];
  private _chartRowBgs: Map<string, SVGElement>;
  private _chartRowFgs: Map<string, SVGElement>;
  private _chartOffsetsX: Map<string, number>;

  private _width: number;
  private _headerHeight: number;
  private _verticalLinesXCoords: number[];
  
  constructor(options: TsGanttOptions) {
    this._options = options;
    
    this._html = this.createChartDiv();
  }
  
  update(forceRedraw: boolean, data: TsGanttTaskChangeResult) {
    
    const datesCheckResult = data 
      ? this.checkDates(data.all)
      : true;
    if (!datesCheckResult || forceRedraw) {
      this.refreshHeader();
    }
    if (data) {
      this.refreshBarGroups(data);
    } 
    this.refreshBody();
    this.redraw();
  }
  
  applySelection(selectionResult: TsGanttTaskSelectionChangeResult) {
    const {selected, deselected} = selectionResult;
    for (const uuid of deselected) {
      const rowBg = this._chartRowBgs.get(uuid);
      if (rowBg) {
        rowBg.classList.remove(TsGanttConst.ROW_SELECTED_CLASS);
      }
      const rowWrapper = this._chartRowFgs.get(uuid);
      if (rowWrapper) {
        rowWrapper.classList.remove(TsGanttConst.ROW_SELECTED_CLASS);
      }
    }
    for (const uuid of selected) {  
      const rowBg = this._chartRowBgs.get(uuid);
      if (rowBg) {
        rowBg.classList.add(TsGanttConst.ROW_SELECTED_CLASS);
      }
      const rowWrapper = this._chartRowFgs.get(uuid);
      if (rowWrapper) {
        rowWrapper.classList.add(TsGanttConst.ROW_SELECTED_CLASS);
      }
    }
  }

  getBarOffsetByTaskUuid(uuid: string): number {
    return this._chartOffsetsX.get(uuid);
  }

  private createChartDiv(): HTMLDivElement {
    const svg = document.createElement("div");
    svg.classList.add(TsGanttConst.CHART_CLASS);
    return svg;
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

  private getBarGroupOptions(): TsGanttChartBarGroupOptions {
    const mode = this._options.chartDisplayMode;
    const showProgress = this._options.chartShowProgress;
    const dayWidth = this._options.chartDayWidthPx[this._options.chartScale];
    const rowHeight = this._options.rowHeightPx;
    const border = this._options.borderWidthPx;
    const barMargin = this._options.barMarginPx;
    const barBorder = this._options.barStrokeWidthPx;
    const barCornerR = this._options.barCornerRadiusPx;
    const barMinWidth = barBorder + 2 * barCornerR;

    const y0 = barMargin - border/2;
    let barHeight: number;
    let y1: number;
    switch (mode) {
      case "both":
        barHeight = (rowHeight - 3*barMargin)/2;
        y1 = barHeight + 2*barMargin - border/2;
        break;
      case "planned":
      case "actual":
        barHeight = rowHeight - 2 * barMargin;
        break;
    }

    return { mode, showProgress, dayWidth, rowHeight, 
      barMinWidth, barHeight, barBorder, barCornerR, y0, y1 };
  }

  private refreshBarGroups(data: TsGanttTaskChangeResult) {
    const barGroupOptions = this.getBarGroupOptions();

    data.deleted.forEach(x => {
      const index = this._chartBarGroups.findIndex(y => y.task.uuid === x.uuid);
      if (index !== 1) {
        this._chartBarGroups.splice(index, 1);
      }
    });
    data.changed.forEach(x => {      
      const index = this._chartBarGroups.findIndex(y => y.task.uuid === x.uuid);
      if (index !== -1) {
        this._chartBarGroups[index] = new TsGanttChartBarGroup(x, barGroupOptions);
      }
    });
    data.added.forEach(x => this._chartBarGroups.push(new TsGanttChartBarGroup(x, barGroupOptions)));
  }

  private refreshHeader() {
    const scale = this._options.chartScale;
    const dayWidth = this._options.chartDayWidthPx[scale];
    const height = this._options.headerHeightPx;
    
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
    
  private getShownBarGroupsRecursively(barGroups: TsGanttChartBarGroup[], 
    parentUuid: string): TsGanttChartBarGroup[] {
      
    const barGroupsFiltered = barGroups.filter(x => x.task.parentUuid === parentUuid)
      .sort((a: TsGanttChartBarGroup, b: TsGanttChartBarGroup): number => a.task.compareTo(b.task));
    const barGroupsShown: TsGanttChartBarGroup[] = [];
    for (const barGroup of barGroupsFiltered) {
      if (!barGroup.task.shown) {
        continue;
      }
      barGroupsShown.push(barGroup);
      if (barGroup.task.expanded) {
        barGroupsShown.push(...this.getShownBarGroupsRecursively(barGroups, barGroup.task.uuid));
      }
    }
    return barGroupsShown;
  }

  private refreshBody() {
    const scale = this._options.chartScale;
    const dayWidth = this._options.chartDayWidthPx[scale];
    const rowHeight = this._options.rowHeightPx;
    const border = this._options.borderWidthPx;
    
    const barGroups = this.getShownBarGroupsRecursively(this._chartBarGroups, null);
    const minDate = this._dateMinOffset;
    const xCoords = this._verticalLinesXCoords;
    const width = this._width;
    const height = rowHeight * barGroups.length;
    const y0 = this._headerHeight;

    const drawTodayLine = this._options.drawTodayLine;
    
    const body = createSvgElement("svg", [TsGanttConst.CHART_BODY_CLASS], [
      ["y", y0 + ""],
      ["width", width + ""],
      ["height", height + ""],
    ]); 
    const bodyBg = createSvgElement("rect", [TsGanttConst.CHART_BODY_BACKGROUND_CLASS], [
      ["width", width + ""],
      ["height", height + ""],
    ], body);

    const rowBgs = new Map<string, SVGElement>();
    barGroups.forEach((x, i) => {
      rowBgs.set(x.task.uuid,
        createSvgElement("rect", 
          [TsGanttConst.CHART_ROW_BACKGROUND_CLASS], [
            ["y", (i * rowHeight) + ""],
            ["width", width + ""],
            ["height", rowHeight + ""],
          ], body));
    });

    for (let i = 0; i < barGroups.length;) {
      const lineY = ++i * rowHeight - border/2;
      const horizontalLine = createSvgElement("line", [TsGanttConst.CHART_BODY_GRIDLINES_CLASS], [
        ["x1", 0 + ""],
        ["y1", lineY + ""],
        ["x2", width + ""],
        ["y2", lineY + ""],
      ], body);      
    }
    xCoords.forEach(x => {      
      const verticalLine = createSvgElement("line", [TsGanttConst.CHART_BODY_GRIDLINES_CLASS], [
        ["x1", x + ""],
        ["y1", 0 + ""],
        ["x2", x + ""],
        ["y2", height + ""],
      ], body);    
    });     
    const todayX = dayjs().startOf("day").diff(minDate, "day") * dayWidth;

    const rowFgs = new Map<string, SVGElement>();
    const offsetsX = new Map<string, number>();
    barGroups.forEach((x, i) => {            
      const offsetY = i * rowHeight;
      const rowWrapper = createSvgElement("svg", [TsGanttConst.CHART_ROW_WRAPPER_CLASS], [
        ["y", offsetY + ""],
        ["width", width + ""],
        ["height", rowHeight + ""],
        ["data-tsg-row-uuid", x.task.uuid],
      ], body);
      rowWrapper.addEventListener("click", (e: MouseEvent) => {
        rowWrapper.dispatchEvent(new CustomEvent(TsGanttConst.ROW_CLICK, {
          bubbles: true,
          detail: {uuid: x.task.uuid, ctrl: e.ctrlKey},
        }));
      });
      rowFgs.set(x.task.uuid, rowWrapper);
      const row = createSvgElement("rect", [TsGanttConst.CHART_ROW_CLASS], [
        ["width", width + ""],
        ["height", rowHeight + ""],
      ], rowWrapper);
      if (x.barSvg) {
        const offsetX = x.minDate.diff(minDate, "day") * dayWidth;
        offsetsX.set(x.task.uuid, offsetX);
        x.barSvg.setAttribute("x", offsetX + "");
        rowWrapper.append(x.barSvg);
      }
    });
    
    if (drawTodayLine) {
      const todayVerticalLine = createSvgElement("line", 
        [TsGanttConst.CHART_BODY_GRIDLINES_CLASS, TsGanttConst.CHART_BODY_TODAY_LINE_CLASS], [
          ["x1", todayX + ""],
          ["y1", 0 + ""],
          ["x2", todayX + ""],
          ["y2", height + ""],
        ], body);  
    }

    this._chartRowBgs = rowBgs;
    this._chartRowFgs = rowFgs;
    this._chartOffsetsX = offsetsX;
    this._htmlBody = body;
  }

  private redraw() {
    const oldHtml = this._html;

    const newHtml = document.createElement("div");
    newHtml.classList.add(TsGanttConst.CHART_CLASS);
    newHtml.append(this._htmlHeader, this._htmlBody);

    oldHtml.replaceWith(newHtml);
    this._html = newHtml;
  }
}

export { TsGanttChart };
