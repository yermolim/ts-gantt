import { getRandomUuid } from "./ts-gantt-common";

export class TsGanttTask {
  uuid: string;
  parentUuid: string;

  id: any;
  name: string;

  datePlannedStart: Date;
  datePlannedEnd: Date;
  durationPlanned = 0;
  
  dateActualStart: Date | null;
  dateActualEnd: Date | null;
  durationActual = 0;
  
  children: TsGanttTask[];

  private _progress = 0;
  set progress(value: number) {
    this._progress = value < 0 ? 0 : value > 100 ? 100 : value; 
  }
  get progress(): number {
    return this._progress;
  }  
    
  constructor(name: string, progress: number,
    datePlannedStart: Date, datePlannedEnd: Date,
    dateActualStart: Date | null = null, dateActualEnd: Date | null = null,
    children: TsGanttTask[] = []) {

    this.name = name;
    this.progress = progress;    
    this.datePlannedStart = datePlannedStart;
    this.datePlannedEnd = datePlannedEnd;
    this.dateActualStart = dateActualStart;
    this.dateActualEnd = dateActualEnd;    
    this.children = children;

    this.refreshDuration();
    this.uuid = getRandomUuid();      
  }

  static flatten(tree: TsGanttTask[]): TsGanttTask[] {
    const flattenedArray: TsGanttTask[] = [];

    for (const task of tree) {
      flattenedArray.push(task);

      if (task.children.length !== 0) {
        flattenedArray.push(...TsGanttTask.flatten(task.children));
      }
    }

    return flattenedArray;
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
