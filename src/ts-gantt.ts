import "./styles.css";
import { TsGanttTask } from "./ts-gantt-task";
import { TsGanttOptions } from "./ts-gantt-options";
import { TsGanttChartRow, TsGanttChartColumn } from "./ts-gantt-chart";
import { TsGanttTableColumn, TsGanttTableRow } from "./ts-gantt-table";

class TsGantt {  
  private static readonly WRAPPER_CLASS = "ts-gantt-wrapper";
  private static readonly GRID_CLASS = "ts-gantt-grid";
  private static readonly SVG_CLASS = "ts-gantt-svg";
  private static readonly SEPARATOR_CLASS = "ts-gantt-separator";
  private static readonly GRID_MIN_WIDTH = 100;

  private _options: TsGanttOptions;
  private _tasks: TsGanttTask[] = [];

  private _chartColumns: TsGanttChartColumn[];
  private _chartRows: TsGanttChartRow[];
  private _tableColumns: TsGanttTableColumn[];
  private _tableRows: TsGanttTableRow[];

  private _container: HTMLElement;

  private _wrapper: HTMLDivElement;
  private _table: HTMLTableElement;
  private _chartSvg: SVGElement;
  private _separator: HTMLDivElement;
  private _isSeparatorDragActive = false;

  constructor(containerSelector: string,
    options: TsGanttOptions) {
    this._container = document.querySelector(containerSelector);
    if (!this._container) {
      throw new Error("Container is null");
    }

    this.createLayout();    
    this._options = new TsGanttOptions(options);
  }

  destroy() {
    document.removeEventListener("mousedown", this.onMouseDownOnSep);
    document.removeEventListener("mousemove", this.onMouseMoveOnSep);
    document.removeEventListener("mouseup", this.onMouseUpOnSep);
  }

  createLayout() {
    const wrapper = document.createElement("div");
    wrapper.classList.add(TsGantt.WRAPPER_CLASS);
    
    const table = document.createElement("table");
    table.classList.add(TsGantt.GRID_CLASS);

    const chartSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    chartSvg.classList.add(TsGantt.SVG_CLASS);
    
    const separator = document.createElement("div");
    separator.classList.add(TsGantt.SEPARATOR_CLASS);    
 
    wrapper.appendChild(table);
    wrapper.appendChild(separator);
    wrapper.appendChild(chartSvg); 
    this._container.appendChild(wrapper); 
    
    this._wrapper = wrapper;
    this._table = table;
    this._chartSvg = chartSvg;
    this._separator = separator;

    document.addEventListener("mousedown", this.onMouseDownOnSep);
    document.addEventListener("mousemove", this.onMouseMoveOnSep);
    document.addEventListener("mouseup", this.onMouseUpOnSep);
  }

  clearTasks() {
    this._tasks.length = 0;
  }

  pushTasks(tasks: TsGanttTask[]) {
    this._tasks.push(...tasks);
  }
    
  onMouseDownOnSep = (e: MouseEvent) => {
    if (e.target === this._separator) {
      this._isSeparatorDragActive = true;
    }
  }; 
      
  onMouseMoveOnSep = (e: MouseEvent) => {
    if (!this._isSeparatorDragActive) {
      return false;
    }

    const wrapperLeftOffset = this._wrapper.offsetLeft;
    const pointerRelX = e.clientX - wrapperLeftOffset;

    this._table.style.width = (Math.max(TsGantt.GRID_MIN_WIDTH, pointerRelX)) + "px";
    this._table.style.flexGrow = "0";
  };
      
  onMouseUpOnSep = (e: MouseEvent) => {
    this._isSeparatorDragActive = false;
  };  
}

export {TsGantt, TsGanttOptions, TsGanttTask};
