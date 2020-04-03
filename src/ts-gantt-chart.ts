import { TsGanttTask, TsGanttTaskChangesDetectionResult } from "./ts-gantt-task";
import { TsGanttOptions } from "./ts-gantt-options";

class TsGanttChart {

  private _options: TsGanttOptions;

  private _chartColumns: TsGanttChartColumn[];
  private _chartRows: TsGanttChartRow[];
  
  private _htmlSvg: SVGElement;
  get htmlSvg(): SVGElement {
    return this._htmlSvg;
  }
  
  constructor(classList: string[], options: TsGanttOptions) {
    this._options = options;
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add(...classList);
    this._htmlSvg = svg;
  }
  
  updateRows(data: TsGanttTaskChangesDetectionResult) {
    
  }
}

class TsGanttChartColumn {

}

class TsGanttChartRow {

  constructor(task: TsGanttTask) {

  }
}

class TsGanttChartTooltip {

}

export { TsGanttChart, TsGanttChartRow, TsGanttChartColumn, TsGanttChartTooltip };
