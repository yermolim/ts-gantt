import dayjs from "dayjs";

import { TsGanttConst } from "../../core/ts-gantt-const";
import { createSvgElement, getAllDatesBetweenTwoDates } from "../../core/ts-gantt-common";
import { TsGanttOptions } from "../../core/ts-gantt-options";
import { TsGanttTask, TsGanttTaskChangeResult, TsGanttTaskSelectionChangeResult } from "../../core/ts-gantt-task";

import { TsGanttBaseComponent } from "../abstract/ts-gantt-base-component";

import { TsGanttChartHeader } from "./ts-gantt-chart-header";
import { TsGanttChartBarGroupOptions } from "./ts-gantt-chart-bar-options";
import { TsGanttChartBarGroup } from "./ts-gantt-chart-bar-group";

class TsGanttChart implements TsGanttBaseComponent {
  private _options: TsGanttOptions;

  private _dateMinOffset: dayjs.Dayjs;
  private _dateMaxOffset: dayjs.Dayjs;

  private _html: HTMLDivElement;
  private _htmlBody: SVGElement;

  private _header: TsGanttChartHeader;

  private _chartBarGroups: Map<string, TsGanttChartBarGroup> = new Map<string, TsGanttChartBarGroup>();
  private _chartRowBgs: Map<string, SVGElement>;
  private _chartRowFgs: Map<string, SVGElement>;
  private _chartOffsetsX: Map<string, number>;

  private _activeUuids: string[] = [];

  constructor(options: TsGanttOptions) {
    this._options = options;
    this._html = this.createChartDiv();
  }

  destroy() {
    this._html.remove();
  }

  appendTo(parent: HTMLElement) {
    parent.append(this._html);
  }

  update(forceRedraw: boolean, data: TsGanttTaskChangeResult, uuids: string[] = null) {    
    const datesCheckResult = data 
      ? this.updateMinMaxDates(data.all)
      : true;
    if (!datesCheckResult || forceRedraw) {
      this._header = new TsGanttChartHeader(this._options, this._dateMinOffset, this._dateMaxOffset);
    }
    if (data) {
      this.refreshBarGroups(data);
    } 
    if (uuids) {
      this._activeUuids = uuids;
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

  private updateMinMaxDates(tasks: TsGanttTask[]): boolean {
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

  //#region bars

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

    data.deleted.forEach(x => this._chartBarGroups.delete(x.uuid));
    data.changed.forEach(x => this._chartBarGroups.set(x.uuid, new TsGanttChartBarGroup(x, barGroupOptions)));
    data.added.forEach(x => this._chartBarGroups.set(x.uuid, new TsGanttChartBarGroup(x, barGroupOptions)));
  }

  //#endregion

  //#region body

  private refreshBody() {
    const scale = this._options.chartScale;
    const dayWidth = this._options.chartDayWidthPx[scale];
    const rowHeight = this._options.rowHeightPx;
    const border = this._options.borderWidthPx;
    const todayLineEnabled = this._options.drawTodayLine;
    const mode = this._options.chartDisplayMode;

    const barGroups = this._activeUuids.map(x => this._chartBarGroups.get(x));
    const minDate = this._dateMinOffset;
    const height = rowHeight * barGroups.length;

    const width = this._header.width;
    const y0 = this._header.height;
    const xCoords = this._header.xCoords;

    const body = this.createChartBody(y0, width, height);
    const rowBgs = this.createRowBackgrounds(body, barGroups, rowHeight, width);
    this.createChartGridLines(body, barGroups, rowHeight, width, height, border, xCoords);

    const rowFgs = new Map<string, SVGElement>();
    const offsetsX = new Map<string, number>();

    barGroups.forEach((x, i) => {
      const task = x.task;

      const offsetY = i * rowHeight;
      const row = this.createRow(body, task, offsetY, width, rowHeight);
      rowFgs.set(task.uuid, row);

      if (x.svg) {
        const { minDate: taskMinDate } = task.getMinMaxDates(mode); 
        const offsetX = taskMinDate.diff(minDate, "day") * dayWidth;
        offsetsX.set(task.uuid, offsetX);
        x.svg.setAttribute("x", offsetX + "");
        row.append(x.svg);
      }
    });

    if (todayLineEnabled) {
      this.createTodayLine(body, minDate, dayWidth, height);
    }

    this._chartRowBgs = rowBgs;
    this._chartRowFgs = rowFgs;
    this._chartOffsetsX = offsetsX;
    this._htmlBody = body;
  }

  private createRow(parent: SVGElement, task: TsGanttTask, offsetY: number, width: number, height: number) {
    const rowWrapper = createSvgElement("svg", [TsGanttConst.CHART_ROW_WRAPPER_CLASS], [
      ["y", offsetY + ""],
      ["width", width + ""],
      ["height", height + ""],
      ["data-tsg-row-uuid", task.uuid],
    ], parent);
    rowWrapper.addEventListener("click", (e: MouseEvent) => {
      rowWrapper.dispatchEvent(new CustomEvent(TsGanttConst.ROW_CLICK_EVENT, {
        bubbles: true,
        composed: true,
        detail: { task, event: e },
      }));
    });
    rowWrapper.addEventListener("contextmenu", (e: MouseEvent) => {
      rowWrapper.dispatchEvent(new CustomEvent(TsGanttConst.ROW_CONTEXT_MENU_EVENT, {
        bubbles: true,
        composed: true,
        detail: { task, event: e },
      }));
    });
    createSvgElement("rect", [TsGanttConst.CHART_ROW_CLASS], [
      ["width", width + ""],
      ["height", height + ""],
    ], rowWrapper);
    return rowWrapper;
  }

  private createChartBody(y0: number, width: number, height: number) {
    const body = createSvgElement("svg", [TsGanttConst.CHART_BODY_CLASS], [
      ["y", y0 + ""],
      ["width", width + ""],
      ["height", height + ""],
    ]);
    createSvgElement("rect", [TsGanttConst.CHART_BODY_BACKGROUND_CLASS], [
      ["width", width + ""],
      ["height", height + ""],
    ], body);
    return body;
  }

  private createRowBackground(barGroupIndex: number, rowHeight: number, width: number, body: SVGElement) {
    const rowBg= createSvgElement("rect",
      [TsGanttConst.CHART_ROW_BACKGROUND_CLASS], [
        ["y", (barGroupIndex * rowHeight) + ""],
        ["width", width + ""],
        ["height", rowHeight + ""],
      ], body);
    return rowBg;
  }

  private createRowBackgrounds(parent: SVGElement, barGroups: readonly TsGanttChartBarGroup[], 
    rowHeight: number, width: number) {
    const rowBgs = new Map<string, SVGElement>();
    barGroups.forEach((x, i) => {
      rowBgs.set(x.task.uuid, this.createRowBackground(i, rowHeight, width, parent));
    });
    return rowBgs;
  }

  private createChartGridLines(parent: SVGElement, barGroups: readonly TsGanttChartBarGroup[], 
    rowHeight: number, width: number, height: number, border: number, xCoords: readonly number[]) {
    for (let i = 0; i < barGroups.length;) {
      const lineY = ++i * rowHeight - border / 2;
      // draw horizontal line
      createSvgElement("line", [TsGanttConst.CHART_BODY_GRIDLINES_CLASS], [
        ["x1", 0 + ""],
        ["y1", lineY + ""],
        ["x2", width + ""],
        ["y2", lineY + ""],
      ], parent);
    }
    xCoords.forEach(x => {
      // draw vertical line
      createSvgElement("line", [TsGanttConst.CHART_BODY_GRIDLINES_CLASS], [
        ["x1", x + ""],
        ["y1", 0 + ""],
        ["x2", x + ""],
        ["y2", height + ""],
      ], parent);
    });
  }

  private createTodayLine(parent: SVGElement, minDate: dayjs.Dayjs, dayWidth: number, height: number) {
    const todayX = dayjs().startOf("day").diff(minDate, "day") * dayWidth;
    createSvgElement("line", [TsGanttConst.CHART_BODY_TODAY_LINE_CLASS], [
      ["x1", todayX + ""],
      ["y1", 0 + ""],
      ["x2", todayX + ""],
      ["y2", height + ""],
    ], parent);
  }

  //#endregion

  private redraw() {
    const oldHtml = this._html;

    const newHtml = document.createElement("div");
    newHtml.classList.add(TsGanttConst.CHART_CLASS);
    this._header.appendTo(newHtml);
    newHtml.append(this._htmlBody);

    oldHtml.replaceWith(newHtml);
    this._html = newHtml;
  }
}

export { TsGanttChart };
