import dayjs from "dayjs";
import { TsGanttConst } from "./ts-gantt-const";
import { TsGanttTask, TsGanttTaskChangesDetectionResult } from "./ts-gantt-task";
import { TsGanttOptions } from "./ts-gantt-options";

class TsGanttChartHeader {

  readonly headerSvg: SVGSVGElement;

  constructor() {

  }
}

class TsGanttChartBody {

  readonly bodySvg: SVGSVGElement;
  readonly verticalLines: SVGGElement;
  readonly horizontalLines: SVGGElement;

  constructor() {

  }
}

class TsGanttChartBarGroup {
  
  readonly task: TsGanttTask;
  readonly barSvg: SVGSVGElement;

  constructor(task: TsGanttTask, rowHeight: number, barHeight: number, fontHeight: number) {

  }
}

class TsGanttChartRow {

  readonly barGroup: TsGanttChartBarGroup;
  readonly rowSvg: SVGSVGElement;

  constructor(barGroup: TsGanttChartBarGroup, rowHeight: number, rowWidth: number) {

  }
}

class TsGanttChartTooltip {

}

class TsGanttChart {

  private _options: TsGanttOptions;

  private _width: number;
  private _bodyHeight: number;

  private _chartHeader: TsGanttChartHeader;
  private _chartBody: TsGanttChartBody;
  private _chartBarGroups: TsGanttChartBarGroup[];
  private _chartRows: TsGanttChartRow[];
  
  private _htmlSvg: SVGSVGElement;
  get htmlSvg(): SVGSVGElement {
    return this._htmlSvg;
  }
  
  constructor(classList: string[], options: TsGanttOptions) {
    this._options = options;
    
    const svg = document.createElementNS(TsGanttConst.SVG_NS, "svg");
    svg.classList.add(...classList);
    this._htmlSvg = svg;
  }
  
  update(data: TsGanttTaskChangesDetectionResult) {
    data.deleted.forEach(x => {
      const index = this._chartBarGroups.findIndex(y => y.task.uuid === x.uuid);
      if (index !== 1) {
        this._chartBarGroups.splice(index, 1);
      }
    });
    data.changed.forEach(x => {      
      const index = this._chartBarGroups.findIndex(y => y.task.uuid === x.uuid);
      if (index !== -1) {
        this._chartBarGroups[index] = new TsGanttChartBarGroup(x, 0, 0, 0);
      }
    });
    data.added.forEach(x => this._chartBarGroups.push(new TsGanttChartBarGroup(x, 0, 0, 0)));
    
  }

  private recalculateSize() {

  }

  private refreshHeader() {

  }

  private refreshGrid() {
    
  }

  private redrawChart() {

  }
}

export { TsGanttChart };
