import dayjs from "dayjs";

import { compareTwoStringSets } from "./ts-gantt-common";

import { TsGanttOptions } from "./ts-gantt-options";
import { TsGanttTaskModel } from "./ts-gantt-task-model";
import { TsGanttTask, TsGanttTaskSelectionChangeResult, TsGanttTaskChangeResult } from "./ts-gantt-task";

export class TsGanttData {
  private _options: TsGanttOptions;
  get options(): TsGanttOptions {
    return this._options;
  }

  private _dateMinOffset: dayjs.Dayjs;
  get dateMinOffset(): dayjs.Dayjs {
    return this._dateMinOffset;
  }
  private _dateMaxOffset: dayjs.Dayjs;
  get dateMaxOffset(): dayjs.Dayjs {
    return this._dateMaxOffset;
  }
  
  private _tasks: TsGanttTask[] = [];
  get tasks(): readonly TsGanttTask[] {
    return this._tasks;
  }
  get models(): TsGanttTaskModel[] {
    return this._tasks.map(x => x.toModel());
  }
  
  private _taskByUuid: Map<string, TsGanttTask> = new Map<string, TsGanttTask>();
  private _tasksByParentUuid: Map<string, TsGanttTask[]> = new Map<string, TsGanttTask[]>();

  private _selectedTasks: TsGanttTask[] = [];
  get selectedTasks(): readonly TsGanttTask[] {
    return this._selectedTasks;
  }
  get selectedModels(): TsGanttTaskModel[] {
    return this._selectedTasks.map(x => x.toModel());
  }

  constructor(options: TsGanttOptions) {
    this._options = options;
  }

  getTaskByUuid(uuid: string): TsGanttTask {
    return this._taskByUuid.get(uuid);
  }

  getAllTasksAsChanged(): TsGanttDataChangeResult {
    const minMaxDatesUpdated = this.updateMinMaxDates();
    return  <TsGanttDataChangeResult>{
      deleted: [],
      added: [],
      changed: this._tasks,
      all: this._tasks,
      datesChanged: minMaxDatesUpdated,
    };
  }

  getShownTaskUuidsRecursively(parentUuid: string = null): string[] {
    const tasks = this._tasksByParentUuid.get(parentUuid) || [];
    const uuids: string[] = [];
    for (const task of tasks) {
      uuids.push(task.uuid);
      if (task.expanded) {
        uuids.push(...this.getShownTaskUuidsRecursively(task.uuid));
      }
    }

    return uuids;
  }

  updateTasks(taskModels: TsGanttTaskModel[]): TsGanttDataChangeResult {
    const oldTasks = this._tasks;

    const oldTasksIdMap = TsGanttTask.createTasksIdMap(oldTasks);
    const newTasks = TsGanttTask.convertModelsToTasks(taskModels, oldTasksIdMap);
    const changes = TsGanttTask.detectTaskChanges({oldTasks, newTasks});

    this.updateInternalTaskCollections(changes.all);
    this.groupAndSortTasks();
    const datesChanged = this.updateMinMaxDates();

    return Object.assign({}, changes, { datesChanged });
  }

  updateSingleTask(updatedTask: TsGanttTask): TsGanttDataChangeResult {
    const currentTask = this._taskByUuid.get(updatedTask.uuid);
    if (!currentTask) {
      return {
        deleted: [],
        added: [],
        changed: [],
        all: this._tasks,
        datesChanged: false,
      };
    }

    currentTask.applyChangesFrom(updatedTask);
    if (this.options.bindParentDatesToChild) {
      // TODO. implement updating task parents
    }

    return {
      deleted: [],
      added: [],
      changed: [currentTask],
      all: this._tasks,
      datesChanged: this.updateMinMaxDates(),
    };
  }

  expandAllTasks(state: boolean) {
    for (const task of this._tasks) {
      task.expanded = state;
      if (task.parentUuid) {
        task.shown = state;
      }
    }
  }

  //#region task selection
 
  updateSelectedTasks(tasks: TsGanttTask[] | TsGanttTaskModel[]): TsGanttTaskSelectionChangeResult {
    let newSelectedTasks: TsGanttTask[];

    if (tasks?.length && !(tasks[0] instanceof TsGanttTask)) {
      const ids = new Set<string>((<TsGanttTaskModel[]>tasks).map(x => x.id));
      newSelectedTasks = this._tasks.filter(x => ids.has(x.externalId));
    } else {
      newSelectedTasks = <TsGanttTask[]>tasks || [];
    }

    const oldSelectedTasks = this._selectedTasks;
    const selectionEmpty = oldSelectedTasks.length === 0 && newSelectedTasks.length === 0;
    if (selectionEmpty) {
      return null;
    }

    const oldUuids = oldSelectedTasks.map(x => x.uuid);
    const newUuids = newSelectedTasks.map(x => x.uuid);

    const selectionNotChanged = compareTwoStringSets(new Set(oldUuids), new Set(newUuids));
    if (selectionNotChanged) {
      return <TsGanttTaskSelectionChangeResult>{ 
        selected: newUuids, 
        selectedTasks: newSelectedTasks,
        deselected: [],
        deselectedTasks: [],
      }; 
    } 

    this._selectedTasks = newSelectedTasks;
    
    const deselectedTasks = oldSelectedTasks.filter(x => !newUuids.includes(x.uuid));
    const deselectedUuids = deselectedTasks.map(x => x.uuid);

    return <TsGanttTaskSelectionChangeResult>{ 
      selected: newUuids, 
      selectedTasks: newSelectedTasks,
      deselected: deselectedUuids,
      deselectedTasks,
    }; 
  }

  refreshSelectedTasks(): TsGanttTaskSelectionChangeResult {
    const tasks = this._selectedTasks.filter(x => !TsGanttTask.checkForCollapsedParent(this._tasks, x));  
    return this.updateSelectedTasks(tasks);
  }

  // TODO: replace current multiple tasks selection with something more abstract
  toggleTaskSelection(task: TsGanttTask, ctrl: boolean): TsGanttTaskSelectionChangeResult {
    if (!task) {
      return;
    }

    const selectedTasks = [];
    const taskInCurrentSelected = this._selectedTasks.includes(task);
    if (this._options.multilineSelection 
      && (!this._options.useCtrlKeyForMultilineSelection 
      || (this._options.useCtrlKeyForMultilineSelection && ctrl))) {
      selectedTasks.push(...this._selectedTasks);
      if (!taskInCurrentSelected) {
        selectedTasks.push(task);
      } else {
        selectedTasks.splice(selectedTasks.findIndex(x => x === task), 1);
      }
    } else {
      selectedTasks.push(task);
    }

    return this.updateSelectedTasks(selectedTasks);   
  }

  //#endregion  

  private updateInternalTaskCollections(tasks: TsGanttTask[]) {
    this._tasks = [...tasks];
    this._taskByUuid = new Map<string, TsGanttTask>();
    for (const task of tasks) {
      this._taskByUuid.set(task.uuid, task);
    }
  }

  private groupAndSortTasks() {
    this._tasksByParentUuid.clear();
    for (const task of this._tasks) {
      if (this._tasksByParentUuid.has(task.parentUuid)) {
        this._tasksByParentUuid.get(task.parentUuid).push(task);
      } else {
        this._tasksByParentUuid.set(task.parentUuid, [task]);
      }
    }
    this._tasksByParentUuid.forEach((v: TsGanttTask[]) => 
      v.sort(this._options.taskComparer || TsGanttTask.defaultComparer));
  }

  private updateMinMaxDates(): boolean {
    const tasks = this._tasks;
    const currentDateMin = this._dateMinOffset;
    const currentDateMax = this._dateMaxOffset;

    const chartScale = this._options.chartScale;
    const dateOffsetMin = this._options.chartDateOffsetDaysMin[chartScale];
    const dateOffset = this._options.chartDateOffsetDays[chartScale];

    const { minDate, maxDate } = TsGanttTask.getMinMaxDates(tasks);

    if (!currentDateMin 
      || currentDateMin.isAfter(minDate) 
      || minDate.diff(currentDateMin, "day") < dateOffsetMin) {
      this._dateMinOffset = minDate.subtract(dateOffset, "day");
    }
    if (!currentDateMax 
      || currentDateMax.isBefore(maxDate) 
      || currentDateMax.diff(maxDate, "day") < dateOffsetMin) {
      this._dateMaxOffset = maxDate.add(dateOffset, "day");
    }

    return this._dateMinOffset !== currentDateMin || this._dateMaxOffset !== currentDateMax;
  }  
}

export interface TsGanttDataChangeResult extends TsGanttTaskChangeResult {
  datesChanged: boolean; 
}
