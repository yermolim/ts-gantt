import dayjs from "dayjs";
import { ChartBarMode, getRandomUuid } from "./ts-gantt-common";
import { TsGanttTaskModel } from "./ts-gantt-task-model";

export class TsGanttTask {
  readonly uuid: string;
  readonly parentUuid: string;
  
  readonly externalId: string;
  readonly parentExternalId: string;

  readonly nestingLvl: number;
  readonly hasChildren: boolean;

  readonly name: string;
  readonly localizedNames: {[key: string]: string};

  readonly datePlannedStart: dayjs.Dayjs;
  readonly datePlannedEnd: dayjs.Dayjs;
  readonly dateActualStart: dayjs.Dayjs;
  readonly dateActualEnd: dayjs.Dayjs;  

  readonly progress: number;

  shown: boolean;
  expanded: boolean;

  // TODO. Reduce the parameters count
  constructor(
    source: TsGanttTaskModel,
    id: string,
    parentId: string,
    name: string,
    localizedNames: {[key: string]: string},
    progress: number,
    datePlannedStart: Date = null, 
    datePlannedEnd: Date = null,
    dateActualStart: Date = null, 
    dateActualEnd: Date = null,
    nestingLvl = 0,
    hasChildren = false,
    parentUuid: string = null,
    uuid: string = null) {

    // Note. Assign the source properties to allow custom column values
    Object.assign(this, source);

    this.externalId = id;
    this.parentExternalId = parentId;
    this.name = name;
    this.localizedNames = localizedNames;
    this.progress = progress < 0 ? 0 : progress > 100 ? 100 : progress;    
    this.datePlannedStart = datePlannedStart ? dayjs(datePlannedStart) : null;
    this.datePlannedEnd = datePlannedEnd ? dayjs(datePlannedEnd) : null;
    this.dateActualStart = dateActualStart ? dayjs(dateActualStart) : null;
    this.dateActualEnd = dateActualEnd ? dayjs(dateActualEnd) : null;   
    this.nestingLvl = nestingLvl;
    this.hasChildren = hasChildren;
    this.parentUuid = parentUuid;
    this.uuid = uuid || getRandomUuid();

    this.expanded = false;
  }

  static convertModelsToTasks(taskModels: TsGanttTaskModel[], 
    idMap = new Map<string, string>()): TsGanttTask[] {

    const models = taskModels.slice();
    const allParentIds = new Set(models.map(x => x.parentId));
    const tasks: TsGanttTask[] = [];
    let currentLevelTasks: TsGanttTask[] = [];

    for (let i = models.length - 1; i >= 0; i--) {
      const model = models[i];
      if (!model.parentId) {
        const newTask = new TsGanttTask(model, 
          model.id, model.parentId, 
          model.name, model.localizedNames, model.progress,
          model.datePlannedStart, model.datePlannedEnd, 
          model.dateActualStart, model.dateActualEnd, 
          0, allParentIds.has(model.id), 
          null, idMap.get(model.id));
        tasks.push(newTask);
        currentLevelTasks.push(newTask);
        models.splice(i, 1);
      }
    }  
    
    let currentNestingLvl = 1;    
    while (currentLevelTasks.length !== 0) {
      const nextLevelTasks: TsGanttTask[] = [];

      currentLevelTasks.filter(x => x.hasChildren).forEach(task => {
        for (let i = models.length - 1; i >= 0; i--) {
          const model = models[i];
          if (model.parentId === task.externalId) {
            const newTask = new TsGanttTask(model,
              model.id, model.parentId, 
              model.name, model.localizedNames, model.progress,
              model.datePlannedStart, model.datePlannedEnd, 
              model.dateActualStart, model.dateActualEnd,
              currentNestingLvl, allParentIds.has(model.id), 
              task.uuid, idMap.get(model.id));
            tasks.push(newTask);
            nextLevelTasks.push(newTask);
            models.splice(i, 1);
          }
        }  
      });
        
      currentLevelTasks = nextLevelTasks;
      currentNestingLvl++;
    }

    return tasks;
  }

  static detectTaskChanges(data: TsGanttTaskUpdateResult): TsGanttTaskChangeResult {
    const { oldTasks, newTasks } = data;

    const oldTaskByUuid = new Map<string, TsGanttTask>();
    oldTasks.forEach(task => {
      oldTaskByUuid.set(task.uuid, task);
    });

    const newUuids = new Set<string>();
    newTasks.forEach(task => {
      newUuids.add(task.uuid);
    });

    const deleted: TsGanttTask[] = oldTasks.filter(x => !newUuids.has(x.uuid));
    const added: TsGanttTask[] = [];
    const changed: TsGanttTask[] = [];
    const all: TsGanttTask[] = [];

    for (const newTask of newTasks) {
      if (!oldTaskByUuid.has(newTask.uuid)) {
        added.push(newTask);
        all.push(newTask);
        continue;
      }
      const oldTask = oldTaskByUuid.get(newTask.uuid);
      if (!newTask.equals(oldTask)) {
        changed.push(newTask);
        all.push(newTask);
      } else {
        all.push(oldTask);
      }
    }

    return { deleted, added, changed, all };
  }

  static createTasksIdMap(tasks: TsGanttTask[]): Map<string, string> {
    const idsMap = new Map<string, string>();
    for (const task of tasks) {
      if (!idsMap.has(task.externalId)) {
        idsMap.set(task.externalId, task.uuid);
      }
    }
    return idsMap;
  }  

  static checkPaternity(tasks: TsGanttTask[], 
    parent: TsGanttTask, child: TsGanttTask): boolean {
    let parentUuid = child.parentUuid;
    while(parentUuid) {
      if (parentUuid === parent.uuid) {
        return true;
      }
      parentUuid = tasks.find(x => x.uuid === parentUuid)?.parentUuid;
    }
    return false;
  }

  static checkForCollapsedParent(tasks: readonly TsGanttTask[], 
    task: TsGanttTask): boolean {
    while(task.parentUuid) {
      task = tasks.find(x => x.uuid === task.parentUuid);
      if (!task.expanded) {
        return true;
      }
    }
    return false;
  }

  static defaultComparer = (a: TsGanttTask, b: TsGanttTask) => a.compareTo(b);

  static sortTasksRecursively(tasks: TsGanttTask[], 
    parentUuid: string): TsGanttTask[] {      
    const tasksFiltered = tasks.filter(x => x.parentUuid === parentUuid)
      .sort(TsGanttTask.defaultComparer);
    const sorted: TsGanttTask[] = [];
    for (const task of tasksFiltered) {
      sorted.push(task);
      sorted.push(...this.sortTasksRecursively(tasks, task.uuid));
    }
    return sorted;
  }

  static getMinMaxDates(tasks: TsGanttTask[]): { minDate: dayjs.Dayjs; maxDate: dayjs.Dayjs } {
    let minDate = dayjs();
    let maxDate = dayjs();

    for (const task of tasks) {
      const plannedStart = dayjs(task.datePlannedStart);
      const plannedEnd = dayjs(task.datePlannedEnd);
      const actualStart = task.dateActualStart ? dayjs(task.dateActualStart) : null;
      const actualEnd = task.dateActualEnd ? dayjs(task.dateActualEnd) : null;
      if (plannedStart.isBefore(minDate)) {
        minDate = plannedStart;
      }
      if (plannedEnd.isAfter(maxDate)) {
        maxDate = plannedEnd;
      }
      if (actualStart && actualStart.isBefore(minDate)) {
        minDate = actualStart;
      }
      if (actualEnd && actualEnd.isAfter(maxDate)) {
        maxDate = actualEnd;
      }
    }

    return { minDate, maxDate };
  }

  equals(another: TsGanttTask): boolean {
    return this.externalId === another.externalId 
      && this.parentExternalId === another.parentExternalId
      && this.nestingLvl === another.nestingLvl
      && this.hasChildren === another.hasChildren
      && this.name === another.name
      && this.progress === another.progress
      && this.datePlannedStart?.unix() === another.datePlannedStart?.unix()
      && this.datePlannedEnd?.unix() === another.datePlannedEnd?.unix()
      && this.dateActualStart?.unix() === another.dateActualStart?.unix()
      && this.dateActualEnd?.unix() === another.dateActualEnd?.unix();
  }

  compareTo(another: TsGanttTask): number {    
    if (this.nestingLvl > another.nestingLvl) {
      return 1;
    }
    if (this.nestingLvl < another.nestingLvl) {
      return -1;
    }
    if ((this.datePlannedStart?.unix() || 0) > (another.datePlannedStart?.unix() || 0)) {
      return 1;
    }
    if ((this.datePlannedStart?.unix() || 0) < another.datePlannedStart?.unix() || 0) {
      return -1;
    }
    if ((this.datePlannedEnd?.unix() || 0) > (another.datePlannedEnd?.unix() || 0)) {
      return 1;
    }
    if ((this.datePlannedEnd?.unix() || 0) < (another.datePlannedEnd?.unix() || 0)) {
      return -1;
    }
    if ((this.dateActualStart?.unix() || 0) > (another.dateActualStart?.unix() || 0)) {
      return 1;
    }
    if ((this.dateActualStart?.unix() || 0) < (another.dateActualStart?.unix() || 0)) {
      return -1;
    }
    if ((this.dateActualEnd?.unix() || 0) > (another.dateActualEnd?.unix() || 0)) {
      return 1;
    }
    if ((this.dateActualEnd?.unix() || 0) < (another.dateActualEnd?.unix() || 0)) {
      return -1;
    }
    return this.name.localeCompare(another.name);
  }

  getState(): TsGanttTaskState {
    if (this.progress === 0) {
      return "not-started";
    }

    if (this.progress === 100) {
      if (this.datePlannedEnd) {
        if ((this.dateActualEnd && this.dateActualEnd.isAfter(this.datePlannedEnd))
          || (this.dateActualStart && this.dateActualStart.isAfter(this.datePlannedEnd))) {
          return "completed-late";
        }
      }
      return "completed";
    }

    if (this.datePlannedEnd && this.datePlannedEnd.isBefore(dayjs().startOf("day"))) {
      return "overdue";
    }
    return "in-progress";
  }

  toModel(): TsGanttTaskModel {
    const model = <TsGanttTaskModel>{};

    // Note. To keep the custom column values
    Object.assign(model, this);

    model.id = this.externalId;
    model.parentId = this.parentExternalId;
    model.name = this.name;
    model.progress = this.progress;
    model.datePlannedStart = this.datePlannedStart?.toDate() || null;
    model.datePlannedEnd = this.datePlannedEnd?.toDate() || null;
    model.dateActualStart = this.dateActualStart?.toDate() || null;
    model.dateActualEnd = this.dateActualEnd?.toDate() || null;
    model.localizedNames = this.localizedNames;

    return model;
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  getMinMaxDates(chartBarMode: ChartBarMode): { minDate: dayjs.Dayjs; maxDate: dayjs.Dayjs } {    
    const { datePlannedStart, datePlannedEnd, dateActualStart, dateActualEnd } = this;
    const plannedDatesSet = datePlannedStart && datePlannedEnd;
    const actualDatesSet = dateActualStart && dateActualEnd;

    let minDate: dayjs.Dayjs;
    let maxDate: dayjs.Dayjs;

    if (chartBarMode === "both") {
      if (actualDatesSet || plannedDatesSet) {
        if (actualDatesSet && plannedDatesSet) {
          minDate = datePlannedStart.isBefore(dateActualStart) ? datePlannedStart : dateActualStart;
          maxDate = datePlannedEnd.isAfter(dateActualEnd) ? datePlannedEnd : dateActualEnd;
        } else if (plannedDatesSet) {
          minDate = datePlannedStart;
          maxDate = datePlannedEnd;
        } else {
          minDate = dateActualStart;
          maxDate = dateActualEnd;
        }
      }

    } else if (chartBarMode === "planned" && plannedDatesSet) {
      minDate = datePlannedStart;
      maxDate = datePlannedEnd;
    } else if (chartBarMode === "actual" && actualDatesSet) {  
      minDate = dateActualStart;
      maxDate = dateActualEnd;
    }

    return { minDate, maxDate };
  }

  getHorizontalOffsetPx(chartBarMode: ChartBarMode, chartMinDate: dayjs.Dayjs, dayWidthPx: number): number {
    const { minDate: taskMinDate } = this.getMinMaxDates(chartBarMode);
    if (!taskMinDate) {
      return null;
    }
    const offsetX = taskMinDate.diff(chartMinDate, "day") * dayWidthPx;
    return offsetX;
  }

  updateParents() {
    // TODO: implement
  }
}

export interface TsGanttTaskUpdateResult {
  oldTasks: TsGanttTask[]; 
  newTasks: TsGanttTask[];
}

export interface TsGanttTaskChangeResult {
  added: TsGanttTask[]; 
  deleted: TsGanttTask[]; 
  changed: TsGanttTask[];
  all: TsGanttTask[];
}

export interface TsGanttTaskSelectionChangeResult {
  deselected: string[];
  selected: string[];

  deselectedTasks: TsGanttTask[];
  selectedTasks: TsGanttTask[];
}

export type TsGanttTaskState = "not-started" | "in-progress" | "overdue" | "completed" | "completed-late";
