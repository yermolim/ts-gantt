import "./styles.css";
import { TsGanttTask, TsGanttTaskModel, TsGanttTaskUpdateResult, 
  TsGanttTaskChangesDetectionResult } from "./ts-gantt-task";
import { TsGanttOptions } from "./ts-gantt-options";
import { TsGanttChartRow, TsGanttChartColumn, TsGanttChart } from "./ts-gantt-chart";
import { TsGanttTableColumn, TsGanttTableRow, TsGanttTable } from "./ts-gantt-table";

class TsGantt {  
  private static readonly WRAPPER_CLASS = "ts-gantt-wrapper";
  private static readonly TABLE_CLASS = "ts-gantt-grid";
  private static readonly CHART_CLASS = "ts-gantt-chart";
  private static readonly SEPARATOR_CLASS = "ts-gantt-separator";
  private static readonly TABLE_MIN_WIDTH = 100;

  private _options: TsGanttOptions;
  private _tasks: TsGanttTask[] = [];
  get tasks(): TsGanttTaskModel[] {
    return TsGanttTask.convertTasksToModels(this._tasks);
  }  
  set tasks(taskModels: TsGanttTaskModel[]) {
    const updateResult = this.updateTasks(taskModels);
    const changeDetectionResult = TsGanttTask.detectTaskChanges(updateResult);
    this.updateRows(changeDetectionResult);
  }

  private _htmlContainer: HTMLElement;
  private _htmlWrapper: HTMLDivElement;
  private _htmlSeparator: HTMLDivElement;
  private _htmlSeparatorDragActive = false;

  private _table: TsGanttTable;
  private _chart: TsGanttChart;  

  constructor(containerSelector: string,
    options: TsGanttOptions) {
    this._htmlContainer = document.querySelector(containerSelector);
    if (!this._htmlContainer) {
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

    const separator = document.createElement("div");
    separator.classList.add(TsGantt.SEPARATOR_CLASS);  
    
    this._table = new TsGanttTable([TsGantt.TABLE_CLASS], TsGantt.TABLE_MIN_WIDTH);
    this._chart = new TsGanttChart([TsGantt.CHART_CLASS]);      
 
    wrapper.appendChild(this._table.htmlTable);
    wrapper.appendChild(separator);
    wrapper.appendChild(this._chart.htmlSvg);
     
    this._htmlContainer.appendChild(wrapper);     
    this._htmlWrapper = wrapper;
    this._htmlSeparator = separator;

    document.addEventListener("mousedown", this.onMouseDownOnSep);
    document.addEventListener("mousemove", this.onMouseMoveOnSep);
    document.addEventListener("mouseup", this.onMouseUpOnSep);
  }

  // #region task actions

  updateTasks(taskModels: TsGanttTaskModel[]): TsGanttTaskUpdateResult {
    const oldTasks = this._tasks;
    const oldIdsMap = TsGanttTask.getTasksIdsMap(oldTasks);
    const newTasks = TsGanttTask.convertModelsToTasks(taskModels, oldIdsMap);
    this._tasks = newTasks;
    return { oldTasks, newTasks };
  }

  updateRows(data: TsGanttTaskChangesDetectionResult) {

  }
  // #endregion
    
  // #region separator event listeners
  onMouseDownOnSep = (e: MouseEvent) => {
    if (e.target === this._htmlSeparator) {
      this._htmlSeparatorDragActive = true;
    }
  }; 
      
  onMouseMoveOnSep = (e: MouseEvent) => {
    if (!this._htmlSeparatorDragActive) {
      return false;
    }

    const wrapperLeftOffset = this._htmlWrapper.offsetLeft;
    const pointerRelX = e.clientX - wrapperLeftOffset;
    this._table.setWidth(pointerRelX);
  };
      
  onMouseUpOnSep = (e: MouseEvent) => {
    this._htmlSeparatorDragActive = false;
  }; 
  // #endregion
}

export { TsGantt, TsGanttOptions, TsGanttChart, TsGanttTable,
  TsGanttTask, TsGanttTaskModel, TsGanttTaskUpdateResult, 
  TsGanttTaskChangesDetectionResult };
