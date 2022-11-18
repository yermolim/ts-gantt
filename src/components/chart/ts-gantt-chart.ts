import dayjs from "dayjs";

import { TsGanttConst } from "../../core/ts-gantt-const";
import { createSvgElement } from "../../core/ts-gantt-common";
import { TsGanttOptions } from "../../core/ts-gantt-options";
import { TsGanttTask, TsGanttTaskChangeResult, TsGanttTaskSelectionChangeResult } from "../../core/ts-gantt-task";

import { TsGanttBaseComponent } from "../abstract/ts-gantt-base-component";

import { TsGanttChartBarGroupOptions } from "./ts-gantt-chart-bar-options";
import { TsGanttChartBarGroup } from "./ts-gantt-chart-bar-group";
import { TsGanttChartHeader } from "./ts-gantt-chart-header";
import { TsGanttChartBody } from "./ts-gantt-chart-body";

class TsGanttChart implements TsGanttBaseComponent {
  private _options: TsGanttOptions;

  private _dateMinOffset: dayjs.Dayjs;
  private _dateMaxOffset: dayjs.Dayjs;

  private _html: HTMLDivElement;

  private _header: TsGanttChartHeader;
  private _body: TsGanttChartBody;

  private _chartBarGroups: Map<string, TsGanttChartBarGroup> = new Map<string, TsGanttChartBarGroup>();
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
    
    const barGroups = this._activeUuids.map(x => this._chartBarGroups.get(x));
    this._body = new TsGanttChartBody(this._options, barGroups, 
      this._header.xCoords, this._dateMinOffset, 
      this._header.height, this._header.width);
    this.redraw();
  }

  applySelection(selectionResult: TsGanttTaskSelectionChangeResult) {
    this._body?.applySelection(selectionResult);
  }

  getBarOffsetByTaskUuid(uuid: string): number {
    return this._body?.getBarOffsetByTaskUuid(uuid);
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

  private refreshBarGroups(data: TsGanttTaskChangeResult) {
    const barGroupOptions = TsGanttChartBarGroupOptions.getFromGanttOptions(this._options);
    data.deleted.forEach(x => this._chartBarGroups.delete(x.uuid));
    data.changed.forEach(x => this._chartBarGroups.set(x.uuid, new TsGanttChartBarGroup(x, barGroupOptions)));
    data.added.forEach(x => this._chartBarGroups.set(x.uuid, new TsGanttChartBarGroup(x, barGroupOptions)));
  }

  private redraw() {
    const oldHtml = this._html;

    const newHtml = document.createElement("div");
    newHtml.classList.add(TsGanttConst.CHART_CLASS);
    
    this._header.appendTo(newHtml);
    this._body.appendTo(newHtml);

    oldHtml.replaceWith(newHtml);
    this._html = newHtml;
  }
}

export { TsGanttChart };
