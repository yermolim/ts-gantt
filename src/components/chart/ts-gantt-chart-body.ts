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

  constructor(options: TsGanttOptions, barGroups: TsGanttChartBarGroup[], xCoords: readonly number[], 
    minDate: dayjs.Dayjs, top: number, width: number) {

    this._options = options;
    this.drawSvg(barGroups, xCoords, minDate, top, width);
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

  private createWrapper(y0: number, width: number, height: number) {
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

  private drawSvg(barGroups: TsGanttChartBarGroup[], xCoords: readonly number[],
    minDate: dayjs.Dayjs, top: number, width: number) {

    const { dayWidthPx, rowHeightPx, borderWidthPx, drawTodayLine, chartDisplayMode } = this._options;
    const heightPx = rowHeightPx * barGroups.length;

    const body = this.createWrapper(top, width, heightPx);
    const rowBgs = this.drawRowBackgrounds(body, barGroups, rowHeightPx, width);
    this.drawChartGridLines(body, barGroups, rowHeightPx, width, heightPx, borderWidthPx, xCoords);

    const rowFgs = new Map<string, SVGElement>();

    barGroups.forEach((barGroup, i) => {
      const task = barGroup.task;

      const offsetY = i * rowHeightPx;
      const row = this.drawRow(body, task, offsetY, width, rowHeightPx);
      rowFgs.set(task.uuid, row);

      if (barGroup.svg) {
        const offsetX = task.getHorizontalOffsetPx(chartDisplayMode, minDate, dayWidthPx);
        barGroup.svg.setAttribute("x", offsetX + "");
        row.append(barGroup.svg);
      }
    });

    if (drawTodayLine) {
      this.drawTodayLine(body, minDate, dayWidthPx, heightPx);
    }

    this._svg = body;
    this._chartRowBgs = rowBgs;
    this._chartRowFgs = rowFgs;
  }

  private drawRow(parent: SVGElement, task: TsGanttTask, offsetY: number, width: number, height: number) {
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

  private drawRowBackground(parent: SVGElement, barGroupIndex: number, rowHeight: number, width: number) {
    const rowBg = createSvgElement("rect",
      [TsGanttConst.CHART_ROW_BACKGROUND_CLASS], [
        ["y", (barGroupIndex * rowHeight) + ""],
        ["width", width + ""],
        ["height", rowHeight + ""],
      ], parent);
    return rowBg;
  }

  private drawRowBackgrounds(parent: SVGElement, barGroups: readonly TsGanttChartBarGroup[], 
    rowHeight: number, width: number) {
    const rowBgs = new Map<string, SVGElement>();
    barGroups.forEach((x, i) => {
      rowBgs.set(x.task.uuid, this.drawRowBackground(parent, i, rowHeight, width));
    });
    return rowBgs;
  }

  private drawChartGridLines(parent: SVGElement, barGroups: readonly TsGanttChartBarGroup[], 
    rowHeight: number, width: number, height: number, border: number, xCoords: readonly number[]) {
    for (let i = 0; i < barGroups.length;) {
      const lineY = ++i * rowHeight - border / 2;
      this.drawHorizontalLine(parent, lineY, width);
    }
    xCoords.forEach(x => {
      this.drawVerticalLine(parent, x, height);
    });
  }

  private drawTodayLine(parent: SVGElement, minDate: dayjs.Dayjs, dayWidth: number, height: number) {
    const todayX = dayjs().startOf("day").diff(minDate, "day") * dayWidth;
    createSvgElement("line", [TsGanttConst.CHART_BODY_TODAY_LINE_CLASS], [
      ["x1", todayX + ""],
      ["y1", 0 + ""],
      ["x2", todayX + ""],
      ["y2", height + ""],
    ], parent);
  } 

  private drawHorizontalLine(parent: SVGElement, top: number, width: number) {
    createSvgElement("line", [TsGanttConst.CHART_BODY_GRIDLINES_CLASS], [
      ["x1", 0 + ""],
      ["y1", top + ""],
      ["x2", width + ""],
      ["y2", top + ""],
    ], parent);
  }

  private drawVerticalLine(parent: SVGElement, left: number, height: number, ) {
    createSvgElement("line", [TsGanttConst.CHART_BODY_GRIDLINES_CLASS], [
      ["x1", left + ""],
      ["y1", 0 + ""],
      ["x2", left + ""],
      ["y2", height + ""],
    ], parent);
  }
}

export { TsGanttChartBody };
