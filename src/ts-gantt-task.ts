import { getRandomUuid } from "./ts-gantt-common";

class TsGanttTaskModel {
  id: string;
  parentId: string | null;

  name: string;  
  progress: number;

  datePlannedStart: Date;
  datePlannedEnd: Date;  
  dateActualStart: Date | null;
  dateActualEnd: Date | null;
      
  constructor(id: string, parentId: string | null, 
    name: string, progress: number,
    datePlannedStart: Date, datePlannedEnd: Date,
    dateActualStart: Date | null = null, dateActualEnd: Date | null = null) {

    this.id = id;
    this.parentId = parentId;
    this.name = name;
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

  name: string;

  datePlannedStart: Date;
  datePlannedEnd: Date;
  dateActualStart: Date | null;
  dateActualEnd: Date | null;

  durationPlanned = 0;  
  durationActual = 0;

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
    progress: number,
    datePlannedStart: Date, 
    datePlannedEnd: Date,
    dateActualStart: Date | null = null, 
    dateActualEnd: Date | null = null,
    nestingLvl = 0,
    parentUuid: string = null,
    uuid: string = null) {

    this.externalId = id;
    this.parentExternalId = parentId;
    this.name = name;
    this.progress = progress;    
    this.datePlannedStart = datePlannedStart;
    this.datePlannedEnd = datePlannedEnd;
    this.dateActualStart = dateActualStart;
    this.dateActualEnd = dateActualEnd;
    this.nestingLvl = nestingLvl;
    this.parentUuid = parentUuid;
    this.uuid = uuid || getRandomUuid();

    this.refreshDuration();
  }

  static convertModelsToTasks(taskModels: TsGanttTaskModel[], 
    idsMap = new Map<string, string>()): TsGanttTask[] {

    const models = taskModels.slice();
    const tasks: TsGanttTask[] = [];
    let currentLevelTasks: TsGanttTask[] = [];
         
    for (let i = models.length - 1; i >= 0; i--) {
      const model = models[i];
      if (model.parentId === null) {
        const newTask = new TsGanttTask(model.id, model.parentId, model.name, model.progress,
          model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd, 
          0, null, idsMap.get(model.id));
        tasks.push(newTask);
        currentLevelTasks.push(newTask);
        models.splice(i, 1);
      }
    }  
    
    let currentNestingLvl = 1;    
    while (models.length !== 0 || currentLevelTasks.length !== 0) {
      const nextLevelTasks: TsGanttTask[] = [];

      currentLevelTasks.forEach(task => {
        for (let i = models.length - 1; i >= 0; i--) {
          const model = models[i];
          if (model.parentId === task.externalId) {
            const newTask = new TsGanttTask(model.id, model.parentId, model.name, model.progress,
              model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd,
              currentNestingLvl, task.uuid, idsMap.get(model.id));
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
    return tasks.map(x => new TsGanttTaskModel(x.externalId, x.parentExternalId, x.name, 
      x.progress, x.datePlannedStart, x.datePlannedEnd, x.dateActualStart, x.dateActualEnd));
  }
    
  static detectTaskChanges(data: TsGanttTaskUpdateResult): TsGanttTaskChangesDetectionResult {
    const { oldTasks, newTasks } = data;
    const oldUuids = oldTasks.map(x => x.uuid);
    const newUuids = newTasks.map(x => x.uuid);

    const deleted: TsGanttTask[] = oldTasks.filter(x => !newUuids.includes(x.uuid));
    const added: TsGanttTask[] = [];
    const changed: TsGanttTask[] = [];
    const unchanged: TsGanttTask[] = [];

    for (const newTask of newTasks) {
      if (!oldUuids.includes(newTask.uuid)) {
        added.push(newTask);
        continue;
      }
      const oldTask = oldTasks.find(x => x.uuid === newTask.uuid);
      if (newTask.equals(oldTask)) {
        unchanged.push(newTask);
      } else {
        changed.push(newTask);
      }
    }

    return { deleted, added, changed, unchanged };
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

  refreshDuration() {
    this.durationPlanned = this.datePlannedEnd.getTime() - 
      this.datePlannedStart.getTime();
      
    if (this.dateActualStart && this.dateActualEnd) {
      this.durationActual = this.dateActualEnd.getTime() - 
      this.dateActualStart.getTime();
    } else {
      this.durationActual = 0;
    }
  }

  equals(another: TsGanttTask): boolean {
    return this.uuid === another.uuid 
      && this.parentUuid === another.parentUuid
      && this.nestingLvl === another.nestingLvl
      && this.name === another.name
      && this.progress === another.progress
      && this.datePlannedStart?.getTime() === another.datePlannedStart?.getTime()
      && this.datePlannedEnd?.getTime() === another.datePlannedEnd?.getTime()
      && this.dateActualStart?.getTime() === another.dateActualStart?.getTime()
      && this.dateActualEnd?.getTime() === another.dateActualEnd?.getTime();
  }
}

class TsGanttTaskUpdateResult {
  oldTasks: TsGanttTask[]; 
  newTasks: TsGanttTask[];
}

class TsGanttTaskChangesDetectionResult {
  added: TsGanttTask[]; 
  deleted: TsGanttTask[]; 
  changed: TsGanttTask[]; 
  unchanged: TsGanttTask[];
}

export { TsGanttTask, TsGanttTaskModel, TsGanttTaskUpdateResult, 
  TsGanttTaskChangesDetectionResult };
