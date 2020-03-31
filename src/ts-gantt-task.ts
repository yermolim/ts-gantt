import { getRandomUuid } from "./ts-gantt-common";

class TsGanttTaskModel {
  id: string | number;
  parentId: string | number | null;

  name: string;  
  progress: number;

  datePlannedStart: Date;
  datePlannedEnd: Date;  
  dateActualStart: Date | null;
  dateActualEnd: Date | null;
      
  constructor(id: string | number, parentId: string | number | null, 
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
  readonly externalId: string | number;
  readonly uuid: string;
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
    
  constructor(id: string | number,
    name: string, 
    progress: number,
    datePlannedStart: Date, 
    datePlannedEnd: Date,
    dateActualStart: Date | null = null, 
    dateActualEnd: Date | null = null,
    nestingLvl: number = 0,
    parentUuid: string = null) {

    this.externalId = id;
    this.name = name;
    this.progress = progress;    
    this.datePlannedStart = datePlannedStart;
    this.datePlannedEnd = datePlannedEnd;
    this.dateActualStart = dateActualStart;
    this.dateActualEnd = dateActualEnd;
    this.nestingLvl = nestingLvl;
    this.parentUuid = parentUuid;

    this.refreshDuration();
    this.uuid = getRandomUuid();      
  }

  static initTasksFromModels(taskModels: TsGanttTaskModel[]): TsGanttTask[] {
    const models = taskModels.slice();
    const tasks: TsGanttTask[] = [];
    let currentLevelTasks: TsGanttTask[] = [];
         
    for (let i = models.length - 1; i >= 0; i--) {
      const model = models[i];
      if (model.parentId === null) {
        const newTask = new TsGanttTask(model.id, model.name, model.progress,
          model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd);
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
            const newTask = new TsGanttTask(model.id, model.name, model.progress,
              model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd,
              currentNestingLvl, task.uuid);
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
}

export { TsGanttTask, TsGanttTaskModel };
