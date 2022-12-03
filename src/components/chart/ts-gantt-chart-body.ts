import dayjs from "dayjs";

import { TsGanttConst } from "../../core/ts-gantt-const";
import { createSvgElement } from "../../core/ts-gantt-common";
import { TsGanttOptions } from "../../core/ts-gantt-options";
import { TsGanttTask, TsGanttTaskSelectionChangeResult } from "../../core/ts-gantt-task";

import { TsGanttChartBarGroup } from "./bars/ts-gantt-chart-bar-group";

class TsGanttChartBody {
  private readonly _options: TsGanttOptions;

  private _svg: SVGElement;
  
  private _chartRowBgs: Map<string, SVGElement>;
  private _chartRowFgs: Map<string, SVGElement>;

  constructor(options: TsGanttOptions, barGroups: TsGanttChartBarGroup[], minDate: dayjs.Dayjs,
    xCoords: readonly number[], top: number, width: number) {

    this._options = options;
    this.drawSvg(barGroups, minDate, xCoords, top, width);
  }

  destroy() {
    this._svg.remove();
  }

  appendTo(parent: Element) {
    parent.append(this._svg);
  }

  applySelection(selectionResult: TsGanttTaskSelectionChangeResult) {
    const {selected, deselected} = selectionResult;
    for (const uuid of deselected) {
      const rowBg = this._chartRowBgs.get(uuid);
      if (rowBg) {
        rowBg.classList.remove(TsGanttConst.CLASSES.ROOT.ROW_SELECTED);
      }
      const rowWrapper = this._chartRowFgs.get(uuid);
      if (rowWrapper) {
        rowWrapper.classList.remove(TsGanttConst.CLASSES.ROOT.ROW_SELECTED);
      }
    }
    for (const uuid of selected) {
      const rowBg = this._chartRowBgs.get(uuid);
      if (rowBg) {
        rowBg.classList.add(TsGanttConst.CLASSES.ROOT.ROW_SELECTED);
      }
      const rowWrapper = this._chartRowFgs.get(uuid);
      if (rowWrapper) {
        rowWrapper.classList.add(TsGanttConst.CLASSES.ROOT.ROW_SELECTED);
      }
    }
  }

  private createWrapper(y0: number, width: number, height: number) {
    const body = createSvgElement("svg", [TsGanttConst.CLASSES.CHART.BODY], [
      ["y", y0 + ""],
      ["width", width + ""],
      ["height", height + ""],
    ]);
    createSvgElement("rect", [TsGanttConst.CLASSES.CHART.BODY_BACKGROUND], [
      ["width", width + ""],
      ["height", height + ""],
    ], body);
    return body;
  }

  private drawSvg(barGroups: TsGanttChartBarGroup[], minDate: dayjs.Dayjs,
    xCoords: readonly number[], top: number, width: number) {

    const { dayWidthPx, rowHeightPx, borderWidthPx, drawTodayLine, chartDisplayMode } = this._options;
    const heightPx = rowHeightPx * barGroups.length;

    const body = this.createWrapper(top, width, heightPx);
    const rowBgs = this.drawRowBackgrounds(body, barGroups.map(bg => bg.task.uuid), rowHeightPx, width);
    this.drawChartGridLines(body, barGroups.length, rowHeightPx, width, heightPx, borderWidthPx, xCoords);
    if (drawTodayLine) {
      this.drawTodayLine(body, minDate, dayWidthPx, heightPx);
    }

    const rowFgs = new Map<string, SVGElement>();

    barGroups.forEach((barGroup, i) => {
      const task = barGroup.task;

      const offsetY = i * rowHeightPx;

      const row = this.drawRow(body, task, offsetY, width, rowHeightPx);
      rowFgs.set(task.uuid, row);

      const offsetX = task.getHorizontalOffsetPx(chartDisplayMode, minDate, dayWidthPx);
      barGroup.appendToWithOffset(row, offsetX);
    });

    this._svg = body;
    this._chartRowBgs = rowBgs;
    this._chartRowFgs = rowFgs;
  }

  private drawRow(parent: SVGElement, task: TsGanttTask, offsetY: number, width: number, height: number) {
    const rowWrapper = createSvgElement("svg", [TsGanttConst.CLASSES.CHART.ROW_WRAPPER], [
      ["y", offsetY + ""],
      ["width", width + ""],
      ["height", height + ""],
      ["data-tsg-row-uuid", task.uuid],
    ], parent);
    rowWrapper.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains(TsGanttConst.CLASSES.CHART.BAR.HANDLE)) {
        rowWrapper.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.ROW_CLICK, {
          bubbles: true,
          composed: true,
          detail: { task, event: e },
        }));
      }
    });
    rowWrapper.addEventListener("contextmenu", (e: MouseEvent) => {
      rowWrapper.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.ROW_CONTEXT_MENU, {
        bubbles: true,
        composed: true,
        detail: { task, event: e },
      }));
    });
    createSvgElement("rect", [TsGanttConst.CLASSES.CHART.ROW], [
      ["width", width + ""],
      ["height", height + ""],
    ], rowWrapper);
    return rowWrapper;
  }

  private drawRowBackground(parent: SVGElement, barGroupIndex: number, rowHeight: number, width: number) {
    const rowBg = createSvgElement("rect",
      [TsGanttConst.CLASSES.CHART.ROW_BACKGROUND], [
        ["y", (barGroupIndex * rowHeight) + ""],
        ["width", width + ""],
        ["height", rowHeight + ""],
      ], parent);
    return rowBg;
  }

  private drawRowBackgrounds(parent: SVGElement, taskUuids: readonly string[], 
    rowHeight: number, width: number) {
    const rowBgs = new Map<string, SVGElement>();
    taskUuids.forEach((uuid, i) => {
      rowBgs.set(uuid, this.drawRowBackground(parent, i, rowHeight, width));
    });
    return rowBgs;
  }

  private drawChartGridLines(parent: SVGElement, rowCount: number, 
    rowHeight: number, width: number, height: number, border: number, xCoords: readonly number[]) {
    for (let i = 0; i < rowCount;) {
      const lineY = ++i * rowHeight - border / 2;
      this.drawHorizontalLine(parent, lineY, width);
    }
    xCoords.forEach(x => {
      this.drawVerticalLine(parent, x, height);
    });
  }

  private drawTodayLine(parent: SVGElement, minDate: dayjs.Dayjs, dayWidth: number, height: number) {
    const todayX = dayjs().startOf("day").diff(minDate, "day") * dayWidth;
    createSvgElement("line", [TsGanttConst.CLASSES.CHART.BODY_TODAY_LINE], [
      ["x1", todayX + ""],
      ["y1", 0 + ""],
      ["x2", todayX + ""],
      ["y2", height + ""],
    ], parent);
  } 

  private drawHorizontalLine(parent: SVGElement, top: number, width: number) {
    createSvgElement("line", [TsGanttConst.CLASSES.CHART.BODY_GRIDLINES], [
      ["x1", 0 + ""],
      ["y1", top + ""],
      ["x2", width + ""],
      ["y2", top + ""],
    ], parent);
  }

  private drawVerticalLine(parent: SVGElement, left: number, height: number, ) {
    createSvgElement("line", [TsGanttConst.CLASSES.CHART.BODY_GRIDLINES], [
      ["x1", left + ""],
      ["y1", 0 + ""],
      ["x2", left + ""],
      ["y2", height + ""],
    ], parent);
  }
}

export { TsGanttChartBody };
