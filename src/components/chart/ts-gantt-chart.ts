import { TsGanttConst } from "../../core/ts-gantt-const";
import { TsGanttData, TsGanttDataChangeResult } from "../../core/ts-gantt-data";
import { TsGanttTaskSelectionChangeResult } from "../../core/ts-gantt-task";

import { TsGanttBaseComponent } from "../abstract/ts-gantt-base-component";

import { TsGanttChartHeader } from "./ts-gantt-chart-header";
import { TsGanttChartBody } from "./ts-gantt-chart-body";

import { HandleMoveEvent } from "./bars/handles/custom-events";
import { TsGanttChartBarGroupDescriptor } from "./bars/ts-gantt-chart-bar-group-descriptor";
import { TsGanttChartBarGroup } from "./bars/ts-gantt-chart-bar-group";

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
    this.removeEventListeners();

    this._html.remove();
  }

  appendTo(parent: HTMLElement) {
    parent.append(this._html);

    this.addEventListeners();
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
    const tasks = barGroups.map(bg => bg.task);

    // TODO: try to optimize this and get rid of redrawing the body on each update
    this._body = new TsGanttChartBody(this._data, tasks,
      this._header.xCoords, this._header.height, this._header.width);
    barGroups.forEach(bg => this._body.appendComponentToRow(bg.task.uuid, bg));

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
    const barGroupOptions = TsGanttChartBarGroupDescriptor.getFromGanttOptions(this._data.options);
    data.deleted.forEach(task => {
      this._chartBarGroups.get(task.uuid)?.destroy();
      this._chartBarGroups.delete(task.uuid);
    });
    data.changed.forEach(task => {
      this._chartBarGroups.get(task.uuid)?.destroy();
      this._chartBarGroups.set(task.uuid, new TsGanttChartBarGroup(barGroupOptions, task, this._data.dateMinOffset));
    });
    data.added.forEach(task => 
      this._chartBarGroups.set(task.uuid, new TsGanttChartBarGroup(barGroupOptions, task, this._data.dateMinOffset)));
  }

  private redraw() {
    const oldHtml = this._html;
    const newHtml = this.createChartDiv();
    
    this._header.appendTo(newHtml);
    this._body.appendTo(newHtml);

    oldHtml.replaceWith(newHtml);
    this._html = newHtml;
  }  

  private addEventListeners() {
    document.addEventListener(TsGanttConst.EVENTS.HANDLE_MOVE, this.onHandleMove);
    document.addEventListener(TsGanttConst.EVENTS.HANDLE_MOVE_END, this.onHandleMoveEnd);
  }

  private removeEventListeners() {
    document.removeEventListener(TsGanttConst.EVENTS.HANDLE_MOVE, this.onHandleMove);
    document.removeEventListener(TsGanttConst.EVENTS.HANDLE_MOVE_END, this.onHandleMoveEnd);
  }

  private onHandleMove = (e: HandleMoveEvent) => {
    console.log(e.detail.taskUuid);
    // if temp bar group is not created - create one with a temp task based on the task from the set
    // draw it as a semi-transparent one on top of the body
  };

  private onHandleMoveEnd = (e: HandleMoveEvent) => {
    console.log(e.detail.taskUuid);
    console.log("ENDED"); 
    // remove temp bar group if present
    // TODO: raise task changed event
  };
}

export { TsGanttChart };
