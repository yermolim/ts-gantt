import { TsGanttConst } from "../../core/ts-gantt-const";
import { TsGanttData, TsGanttDataChangeResult } from "../../core/ts-gantt-data";
import { TsGanttTaskSelectionChangeResult } from "../../core/ts-gantt-task";

import { TsGanttBaseComponent } from "../abstract/ts-gantt-base-component";

import { TsGanttChartBarGroupOptions } from "./bars/ts-gantt-chart-bar-group-options";
import { TsGanttChartBarGroup } from "./bars/ts-gantt-chart-bar-group";
import { TsGanttChartHeader } from "./ts-gantt-chart-header";
import { TsGanttChartBody } from "./ts-gantt-chart-body";

class TsGanttChart implements TsGanttBaseComponent {
  private _data: TsGanttData;
  
  private _activeUuids: string[] = [];

  private _html: HTMLDivElement;

  private _chartBarGroups: Map<string, TsGanttChartBarGroup> = new Map<string, TsGanttChartBarGroup>();
  private _header: TsGanttChartHeader;
  private _body: TsGanttChartBody;

  constructor(data: TsGanttData) {
    this._data = data;
    this._html = this.createChartDiv();
  }

  destroy() {
    this._html.remove();
  }

  appendTo(parent: HTMLElement) {
    parent.append(this._html);
  }

  update(forceRedraw: boolean, data: TsGanttDataChangeResult, uuids: string[]) {
    const { options, dateMinOffset, dateMaxOffset } = this._data;

    if (data?.datesChanged || forceRedraw) {
      this._header = new TsGanttChartHeader(options, dateMinOffset, dateMaxOffset);
    }
    if (data) {
      this.updateBarGroups(data);
    } 
    if (uuids) {
      this._activeUuids = uuids;
    }
    
    const barGroups = this._activeUuids.map(x => this._chartBarGroups.get(x));
    this._body = new TsGanttChartBody(this._data.options, barGroups, 
      this._header.xCoords, dateMinOffset, 
      this._header.height, this._header.width);
    this.redraw();
  }

  applySelection(selectionResult: TsGanttTaskSelectionChangeResult) {
    this._body?.applySelection(selectionResult);
  }

  private createChartDiv(): HTMLDivElement {
    const svg = document.createElement("div");
    svg.classList.add(TsGanttConst.CLASSES.CHART.MAIN_ELEMENT);
    return svg;
  }

  private updateBarGroups(data: TsGanttDataChangeResult) {
    const barGroupOptions = TsGanttChartBarGroupOptions.getFromGanttOptions(this._data.options);
    data.deleted.forEach(x => this._chartBarGroups.delete(x.uuid));
    data.changed.forEach(x => this._chartBarGroups.set(x.uuid, new TsGanttChartBarGroup(x, barGroupOptions)));
    data.added.forEach(x => this._chartBarGroups.set(x.uuid, new TsGanttChartBarGroup(x, barGroupOptions)));
  }

  private redraw() {
    const oldHtml = this._html;

    const newHtml = this.createChartDiv();
    
    this._header.appendTo(newHtml);
    this._body.appendTo(newHtml);

    oldHtml.replaceWith(newHtml);
    this._html = newHtml;
  }
}

export { TsGanttChart };
