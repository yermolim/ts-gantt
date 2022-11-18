import dayjs from "dayjs";

import { TsGanttConst } from "../../core/ts-gantt-const";
import { createSvgElement } from "../../core/ts-gantt-common";
import { TsGanttOptions } from "../../core/ts-gantt-options";
import { TsGanttTask, TsGanttTaskSelectionChangeResult } from "../../core/ts-gantt-task";

import { TsGanttChartBarGroup } from "./ts-gantt-chart-bar-group";

class TsGanttChartBody {
  private readonly _options: TsGanttOptions;

  private _svg: SVGElement;
  
  private _chartRowBgs: Map<string, SVGElement>;
  private _chartRowFgs: Map<string, SVGElement>;
  private _chartOffsetsX: Map<string, number>;

  constructor(options: TsGanttOptions, barGroups: TsGanttChartBarGroup[], xCoords: readonly number[], 
    minDate: dayjs.Dayjs, top: number, width: number) {
      
    this._options = options;
    this.createAndDrawSvg(barGroups, xCoords, minDate, top, width);
  }

  destroy() {
    this._svg.remove();
  }

  appendTo(parent: HTMLElement) {
    parent.append(this._svg);
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

  private createAndDrawSvg(barGroups: TsGanttChartBarGroup[], xCoords: readonly number[],
    minDate: dayjs.Dayjs, top: number, width: number) {

    const scale = this._options.chartScale;
    const dayWidth = this._options.chartDayWidthPx[scale];
    const rowHeight = this._options.rowHeightPx;
    const border = this._options.borderWidthPx;
    const todayLineEnabled = this._options.drawTodayLine;
    const mode = this._options.chartDisplayMode;

    const height = rowHeight * barGroups.length;

    const body = this.createChartBody(top, width, height);
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

    this._svg = body;
    this._chartRowBgs = rowBgs;
    this._chartRowFgs = rowFgs;
    this._chartOffsetsX = offsetsX;
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
}

export { TsGanttChartBody };
