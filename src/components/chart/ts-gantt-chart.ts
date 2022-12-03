import { TsGanttConst } from "../../core/ts-gantt-const";
import { TsGanttData, TsGanttDataChangeResult } from "../../core/ts-gantt-data";
import { TsGanttTask, TsGanttTaskSelectionChangeResult } from "../../core/ts-gantt-task";

import { TsGanttBaseComponent } from "../abstract/ts-gantt-base-component";

import { TaskChangeInChartEvent } from "./custom-events";

import { TsGanttChartHeader } from "./ts-gantt-chart-header";
import { TsGanttChartBody } from "./ts-gantt-chart-body";

import { HandleMoveEvent } from "./bars/handles/custom-events";
import { TsGanttChartBarGroupDescriptor } from "./bars/ts-gantt-chart-bar-group-descriptor";
import { TsGanttChartBarGroup } from "./bars/ts-gantt-chart-bar-group";

class TsGanttChart implements TsGanttBaseComponent {
  private _data: TsGanttData;
  
  private _activeUuids: string[] = [];

  private _html: HTMLDivElement;

  private _barGroupDescriptor: TsGanttChartBarGroupDescriptor;
  private _barGroups: Map<string, TsGanttChartBarGroup> = new Map<string, TsGanttChartBarGroup>();
  private _tempBarGroup: TsGanttChartBarGroup;

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

    const barGroups = this._activeUuids.map(x => this._barGroups.get(x));
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
    this._barGroupDescriptor = TsGanttChartBarGroupDescriptor.getFromGanttOptions(this._data.options);
    data.deleted.forEach(task => {
      this._barGroups.get(task.uuid)?.destroy();
      this._barGroups.delete(task.uuid);
    });
    data.changed.forEach(task => {
      this._barGroups.get(task.uuid)?.destroy();
      this._barGroups.set(task.uuid, new TsGanttChartBarGroup(this._barGroupDescriptor, task, this._data.dateMinOffset));
    });
    data.added.forEach(task => 
      this._barGroups.set(task.uuid, new TsGanttChartBarGroup(this._barGroupDescriptor, task, this._data.dateMinOffset)));
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
    const { taskUuid, handleType, barType, displacement } = e.detail;

    this.destroyTempBarGroup();

    if (!this._barGroupDescriptor) {
      // Note. no data to build a temp bar broup 
      return;
    }

    const task = this._data.getTaskByUuid(taskUuid);
    if (!task) {
      return;
    }

    const tempTask = this.buildTempTask(task, handleType, barType, this._data.options.dayWidthPx, displacement.x);

    this._barGroups.get(tempTask.uuid)?.hide();
    this._tempBarGroup = new TsGanttChartBarGroup(this._barGroupDescriptor, tempTask, this._data.dateMinOffset);
    this._body.appendComponentToRow(tempTask.uuid, this._tempBarGroup);
  };

  private onHandleMoveEnd = (e: HandleMoveEvent) => {
    if (!this._tempBarGroup) {
      return;
    }

    document.dispatchEvent(new TaskChangeInChartEvent({
      manual: true,
      task: this._tempBarGroup.task,
    })); 

    this.destroyTempBarGroup();
  };

  // TODO. move it out of here. It's not within the current class' responsibility
  private buildTempTask(sourceTask: TsGanttTask,
    handleType: string, barType: string,
    dayWidthPx: number, xDisplacementPx: number) {
    const tempTask = sourceTask.clone();
    const shiftDays = Math.floor(xDisplacementPx / dayWidthPx);
    switch (handleType) {
      case "start":
        if (barType === "planned") {
          const maxStart = tempTask.datePlannedEnd;
          const shiftedStart = tempTask.datePlannedStart.add(shiftDays, "days");
          tempTask.datePlannedStart = shiftedStart.isAfter(maxStart)
            ? maxStart
            : shiftedStart;
        } else if (barType === "actual") {
          const maxStart = tempTask.dateActualEnd;
          const shiftedStart = tempTask.dateActualStart.add(shiftDays, "days");
          tempTask.dateActualStart = shiftedStart.isAfter(maxStart)
            ? maxStart
            : shiftedStart;
        }
        break;
      case "end":
        if (barType === "planned") {
          const minEnd = tempTask.datePlannedStart;
          const shiftedEnd = tempTask.datePlannedEnd.add(shiftDays, "days");
          tempTask.datePlannedEnd = shiftedEnd.isBefore(minEnd)
            ? minEnd
            : shiftedEnd;
        } else if (barType === "actual") {
          const minEnd = tempTask.dateActualStart;
          const shiftedEnd = tempTask.dateActualEnd.add(shiftDays, "days");
          tempTask.dateActualEnd = shiftedEnd.isBefore(minEnd)
            ? minEnd
            : shiftedEnd;
        }
        break;
      case "progress":
        const currentProgress = tempTask.progress;
        let totalBarWidth: number;
        if (barType === "planned") {
          totalBarWidth = tempTask.datePlannedEnd.diff(tempTask.datePlannedStart, "days") * dayWidthPx;
        } else if (barType === "actual") {
          totalBarWidth = tempTask.dateActualEnd.diff(tempTask.dateActualStart, "days") * dayWidthPx;
        }
        const currentPosition = totalBarWidth * currentProgress / 100;
        const newPosition = currentPosition + xDisplacementPx;
        const newProgress = Math.floor(Math.max(0, Math.min(100, newPosition / totalBarWidth * 100)));
        tempTask.progress = newProgress;
        break;
    }
    return tempTask;
  }

  private destroyTempBarGroup() {
    if (!this._tempBarGroup) {
      return;
    }
    this._tempBarGroup.destroy();
    this._tempBarGroup = null;
  }
}

export { TsGanttChart };
