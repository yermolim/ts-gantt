export interface TsGanttTaskModel {
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
