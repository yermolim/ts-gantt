class TsGanttChart {
  private _chartColumns: TsGanttChartColumn[];
  private _chartRows: TsGanttChartRow[];
  
  private _htmlSvg: SVGElement;
  get htmlSvg(): SVGElement {
    return this._htmlSvg;
  }
  
  constructor(classList: string[]) {
    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add(...classList);
    this._htmlSvg = svg;
  }
}

class TsGanttChartColumn {

}

class TsGanttChartRow {

}
class TsGanttChartTooltip {

}

export { TsGanttChart, TsGanttChartRow, TsGanttChartColumn, TsGanttChartTooltip };
