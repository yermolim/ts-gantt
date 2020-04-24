import { getRandomUuid } from "./ts-gantt-common";
import dayjs from "dayjs";

class TsGanttTaskModel {
  id: string;
  parentId: string;

  name: string;  
  localizedNames: {[key: string]: string};
  progress: number;

  datePlannedStart: Date;
  datePlannedEnd: Date;  
  dateActualStart: Date | null;
  dateActualEnd: Date | null;
      
  constructor(id: string, parentId: string, 
    name: string, progress: number,
    datePlannedStart: Date, datePlannedEnd: Date,
    dateActualStart: Date | null = null, dateActualEnd: Date | null = null,
    localizedNames: {[key: string]: string} = {}) {

    this.id = id;
    this.parentId = parentId;
    this.name = name;
    this.localizedNames = localizedNames;
    this.progress = progress > 100 ? 100 : progress < 0 ? 0 : progress;    
    this.datePlannedStart = datePlannedStart;
    this.datePlannedEnd = datePlannedEnd;
    this.dateActualStart = dateActualStart;
    this.dateActualEnd = dateActualEnd;   
  }
}

class TsGanttTask {
  readonly externalId: string;
  readonly uuid: string;
  parentExternalId: string;
  parentUuid: string;

  nestingLvl: number;
  hasChildren: boolean;

  name: string;
  localizedNames: {[key: string]: string};

  datePlannedStart: dayjs.Dayjs | null;
  datePlannedEnd: dayjs.Dayjs | null;
  dateActualStart: dayjs.Dayjs | null;
  dateActualEnd: dayjs.Dayjs | null;  

  shown: boolean;
  expanded: boolean;
  selected: boolean;

  private _progress = 0;
  set progress(value: number) {
    this._progress = value < 0 ? 0 : value > 100 ? 100 : value; 
  }
  get progress(): number {
    return this._progress;
  }  
    
  constructor(id: string,
    parentId: string,
    name: string,
    localizedNames: {[key: string]: string},
    progress: number,
    datePlannedStart: Date | null = null, 
    datePlannedEnd: Date | null = null,
    dateActualStart: Date | null = null, 
    dateActualEnd: Date | null = null,
    nestingLvl = 0,
    hasChildren = false,
    parentUuid: string = null,
    uuid: string = null) {

    this.externalId = id;
    this.parentExternalId = parentId;
    this.name = name;
    this.localizedNames = localizedNames;
    this.progress = progress;    
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
    this.selected = false;
  }

  static convertModelsToTasks(taskModels: TsGanttTaskModel[], 
    idsMap = new Map<string, string>()): TsGanttTask[] {

    const models = taskModels.slice();
    const allParentIds = new Set(models.map(x => x.parentId));
    const tasks: TsGanttTask[] = [];
    let currentLevelTasks: TsGanttTask[] = [];
         
    for (let i = models.length - 1; i >= 0; i--) {
      const model = models[i];
      if (model.parentId === null) {
        const newTask = new TsGanttTask(model.id, model.parentId, model.name, model.localizedNames, model.progress,
          model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd, 
          0, allParentIds.has(model.id), null, idsMap.get(model.id));
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
            const newTask = new TsGanttTask(model.id, model.parentId, model.name, model.localizedNames, model.progress,
              model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd,
              currentNestingLvl, allParentIds.has(model.id), task.uuid, idsMap.get(model.id));
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
    return tasks.map(x => new TsGanttTaskModel(x.externalId, x.parentExternalId, 
      x.name, x.progress, 
      x.datePlannedStart.toDate(), x.datePlannedEnd.toDate(), 
      x.dateActualStart.toDate(), x.dateActualEnd.toDate(), 
      x.localizedNames));
  }
    
  static detectTaskChanges(data: TsGanttTaskUpdateResult): TsGanttTaskChangesDetectionResult {
    const { oldTasks, newTasks } = data;
    const oldUuids = oldTasks.map(x => x.uuid);
    const newUuids = newTasks.map(x => x.uuid);

    const deleted: TsGanttTask[] = oldTasks.filter(x => !newUuids.includes(x.uuid));
    const added: TsGanttTask[] = [];
    const changed: TsGanttTask[] = [];

    for (const newTask of newTasks) {
      if (!oldUuids.includes(newTask.uuid)) {
        added.push(newTask);
        continue;
      }
      const oldTask = oldTasks.find(x => x.uuid === newTask.uuid);
      if (!newTask.equals(oldTask)) {
        changed.push(newTask);
      }
    }

    return { deleted, added, changed, all: newTasks };
  }

  static getTasksIdsMap(tasks: TsGanttTask[]): Map<string, string> {
    const idsMap = new Map<string, string>();
    for (const task of tasks) {
      if (!idsMap.has(task.externalId)) {
        idsMap.set(task.externalId, task.uuid);
      }
    }
    return idsMap;
  }  

  static checkPaternity(tasks: TsGanttTask[], parent: TsGanttTask, child: TsGanttTask): boolean {
    let parentUuid = child.parentUuid;
    while(parentUuid) {
      if (parentUuid === parent.uuid) {
        return true;
      }
      parentUuid = tasks.find(x => x.uuid === parentUuid)?.parentUuid;
    }
    return false;
  }

  equals(another: TsGanttTask): boolean {
    return this.uuid === another.uuid 
      && this.parentUuid === another.parentUuid
      && this.nestingLvl === another.nestingLvl
      && this.hasChildren === another.hasChildren
      && this.name === another.name
      && this.progress === another.progress
      && this.datePlannedStart?.unix() === another.datePlannedStart?.unix()
      && this.datePlannedEnd?.unix() === another.datePlannedEnd?.unix()
      && this.dateActualStart?.unix() === another.dateActualStart?.unix()
      && this.dateActualEnd?.unix() === another.dateActualEnd?.unix()
      && this.expanded === another.expanded
      && this.shown === another.shown
      && this.selected === another.selected;
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

    return 0;
  }
}

interface TsGanttTaskUpdateResult {
  oldTasks: TsGanttTask[]; 
  newTasks: TsGanttTask[];
}

interface TsGanttTaskChangesDetectionResult {
  added: TsGanttTask[]; 
  deleted: TsGanttTask[]; 
  changed: TsGanttTask[];
  all: TsGanttTask[];
}

export { TsGanttTask, TsGanttTaskModel, TsGanttTaskUpdateResult, 
  TsGanttTaskChangesDetectionResult };
