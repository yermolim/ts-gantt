import dayjs from "dayjs";
import { getRandomUuid } from "./ts-gantt-common";

class TsGanttTask {
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
    
  constructor(id: string,
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

    this.shown = !parentUuid;
    this.expanded = false;
  }

  static convertModelsToTasks(taskModels: TsGanttTaskModel[]): TsGanttTask[] {

    const models = taskModels.slice();
    const allParentIds = new Set(models.map(x => x.parentId));
    const tasks: TsGanttTask[] = [];
    let currentLevelTasks: TsGanttTask[] = [];
         
    for (let i = models.length - 1; i >= 0; i--) {
      const model = models[i];
      if (!model.parentId) {
        const newTask = new TsGanttTask(model.id, model.parentId, 
          model.name, model.localizedNames, model.progress,
          model.datePlannedStart, model.datePlannedEnd, 
          model.dateActualStart, model.dateActualEnd, 
          0, allParentIds.has(model.id));
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
            const newTask = new TsGanttTask(model.id, model.parentId, 
              model.name, model.localizedNames, model.progress,
              model.datePlannedStart, model.datePlannedEnd, 
              model.dateActualStart, model.dateActualEnd,
              currentNestingLvl, allParentIds.has(model.id), task.uuid);
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
  
  static convertTasksToModels(tasks: TsGanttTask[]): TsGanttTaskModel[] {
    return tasks.map(x => <TsGanttTaskModel>{
      id: x.externalId,
      parentId: x.parentExternalId,
      name: x.name,
      progress: x.progress,
      datePlannedStart: x.datePlannedStart?.toDate() || null,
      datePlannedEnd: x.datePlannedEnd?.toDate() || null,
      dateActualStart: x.dateActualStart?.toDate() || null,
      dateActualEnd: x.dateActualEnd?.toDate() || null,
      localizedNames: x.localizedNames
    });
  }
    
  static detectTaskChanges(data: TsGanttTaskUpdateResult): TsGanttTaskChangeResult {
    const { oldTasks, newTasks } = data;
    const oldIds = oldTasks.map(x => x.externalId);
    const newIds = newTasks.map(x => x.externalId);

    const deleted: TsGanttTask[] = oldTasks.filter(x => !newIds.includes(x.externalId));
    const added: TsGanttTask[] = [];
    const changed: TsGanttTask[] = [];

    for (const newTask of newTasks) {
      if (!oldIds.includes(newTask.externalId)) {
        added.push(newTask);
        continue;
      }
      const oldTask = oldTasks.find(x => x.externalId === newTask.externalId);
      if (!newTask.equals(oldTask)) {
        changed.push(newTask);
      }
    }

    return { deleted, added, changed, all: newTasks };
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

  static checkForCollapsedParent(tasks: TsGanttTask[], 
    task: TsGanttTask): boolean {
    while(task.parentUuid) {
      task = tasks.find(x => x.uuid === task.parentUuid);
      if (!task.expanded) {
        return true;
      }
    }
    return false;      
  }
      
  static sortTasksRecursively(tasks: TsGanttTask[], 
    parentUuid: string): TsGanttTask[] {      
    const tasksFiltered = tasks.filter(x => x.parentUuid === parentUuid)
      .sort((a: TsGanttTask, b: TsGanttTask): number => a.compareTo(b));
    const sorted: TsGanttTask[] = [];
    for (const task of tasksFiltered) {
      sorted.push(task);
      sorted.push(...this.sortTasksRecursively(tasks, task.uuid));
    }
    return sorted;
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
    if (this.datePlannedStart?.unix() > another.datePlannedStart?.unix()) {
      return 1;
    }
    if (this.datePlannedStart?.unix() < another.datePlannedStart?.unix()) {
      return -1;
    }
    if (this.datePlannedEnd?.unix() > another.datePlannedEnd?.unix()) {
      return 1;
    }
    if (this.datePlannedEnd?.unix() < another.datePlannedEnd?.unix()) {
      return -1;
    }
    if (this.dateActualStart?.unix() > another.dateActualStart?.unix()) {
      return 1;
    }
    if (this.dateActualStart?.unix() < another.dateActualStart?.unix()) {
      return -1;
    }
    if (this.dateActualEnd?.unix() > another.dateActualEnd?.unix()) {
      return 1;
    }
    if (this.dateActualEnd?.unix() < another.dateActualEnd?.unix()) {
      return -1;
    }
    return this.name.localeCompare(another.name);
  }

  getState(): "not-started" | "in-progress" | "overdue" | "completed" | "completed-late" {   
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
}

interface TsGanttTaskModel {
  id: string;
  parentId: string;

  name: string;  
  progress: number;

  datePlannedStart: Date;
  datePlannedEnd: Date;  
  dateActualStart: Date;
  dateActualEnd: Date;
  
  localizedNames: {[key: string]: string};
}

interface TsGanttTaskUpdateResult {
  oldTasks: TsGanttTask[]; 
  newTasks: TsGanttTask[];
}

interface TsGanttTaskChangeResult {
  added: TsGanttTask[]; 
  deleted: TsGanttTask[]; 
  changed: TsGanttTask[];
  all: TsGanttTask[];
}

interface TsGanttTaskSelectionChangeResult {
  deselected: TsGanttTask[];
  selected: TsGanttTask[];
}

export { TsGanttTask, TsGanttTaskModel, TsGanttTaskUpdateResult, 
  TsGanttTaskChangeResult, TsGanttTaskSelectionChangeResult };
