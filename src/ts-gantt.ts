import "./styles.css";
import { TsGanttTask, TsGanttTaskModel, TsGanttTaskUpdateResult, 
  TsGanttTaskChangesDetectionResult } from "./ts-gantt-task";
import { TsGanttOptions } from "./ts-gantt-options";
import { TsGanttChartRow, TsGanttChartColumn, TsGanttChart } from "./ts-gantt-chart";
import { TsGanttTableColumn, TsGanttTableRow, TsGanttTable } from "./ts-gantt-table";

class TsGantt {  
  private static readonly WRAPPER_CLASS = "tsg-wrapper";
  private static readonly FOOTER_CLASS = "tsg-footer";
  private static readonly TABLE_WRAPPER_CLASS = "tsg-table-wrapper";
  private static readonly CHART_WRAPPER_CLASS = "tsg-chart-wrapper";
  private static readonly TABLE_CLASS = "tsg-table";
  private static readonly CHART_CLASS = "tsg-chart";
  private static readonly SEPARATOR_CLASS = "tsg-separator";

  private _options: TsGanttOptions;
  private _tasks: TsGanttTask[] = [];
  get tasks(): TsGanttTaskModel[] {
    return TsGanttTask.convertTasksToModels(this._tasks);
  }  
  set tasks(models: TsGanttTaskModel[]) {
    const updateResult = this.updateTasks(models);
    const changeDetectionResult = TsGanttTask.detectTaskChanges(updateResult);
    this.updateRows(changeDetectionResult);
  }

  private _htmlContainer: HTMLElement;

  private _htmlWrapper: HTMLDivElement;
  private _htmlTableWrapper: HTMLDivElement;
  private _htmlChartWrapper: HTMLDivElement;
  private _htmlSeparator: HTMLDivElement;
  private _htmlSeparatorDragActive = false;

  private _table: TsGanttTable;
  private _chart: TsGanttChart;  

  private _locale: string;
  set locale(value: string) {
    this._options.localeLang = value;
    this.updateLocale();
  }
  private _dateFormat = "YYYY-MM-DD";

  constructor(containerSelector: string,
    options: TsGanttOptions) {

    this._options = new TsGanttOptions(options);

    this._htmlContainer = document.querySelector(containerSelector);
    if (!this._htmlContainer) {
      throw new Error("Container is null");
    }

    this.createLayout();    
  }

  destroy() {
    this.removeSepEventListeners();
  }

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
    this.setTableWrapperWidth(pointerRelX);
  };
        
  onMouseUpOnSep = (e: MouseEvent) => {
    this._htmlSeparatorDragActive = false;
  }; 
  
  private setTableWrapperWidth(width: number) {    
    this._htmlTableWrapper.style.width = (Math.max(this._options.tableMinWidth, width)) + "px";
  }

  private removeSepEventListeners() {
    document.removeEventListener("mousedown", this.onMouseDownOnSep);
    document.removeEventListener("mousemove", this.onMouseMoveOnSep);
    document.removeEventListener("mouseup", this.onMouseUpOnSep);
  }
  // #endregion

  private createLayout() {
    const wrapper = document.createElement("div");
    wrapper.classList.add(TsGantt.WRAPPER_CLASS);    
    const tableWrapper = document.createElement("div");
    tableWrapper.classList.add(TsGantt.TABLE_WRAPPER_CLASS);
    const chartWrapper = document.createElement("div");
    chartWrapper.classList.add(TsGantt.CHART_WRAPPER_CLASS);

    const separator = document.createElement("div");
    separator.classList.add(TsGantt.SEPARATOR_CLASS);  
    
    this._table = new TsGanttTable([TsGantt.TABLE_CLASS], this._options);
    this._chart = new TsGanttChart([TsGantt.CHART_CLASS], this._options);      
 
    wrapper.append(tableWrapper);
    wrapper.append(separator);
    wrapper.append(chartWrapper);
    tableWrapper.append(this._table.htmlTable);
    chartWrapper.append(this._chart.htmlSvg);
     
    this._htmlContainer.append(wrapper);     
    this._htmlWrapper = wrapper;
    this._htmlTableWrapper = tableWrapper;
    this._htmlChartWrapper = chartWrapper;
    this._htmlSeparator = separator;

    document.addEventListener("mousedown", this.onMouseDownOnSep);
    document.addEventListener("mousemove", this.onMouseMoveOnSep);
    document.addEventListener("mouseup", this.onMouseUpOnSep);
  }

  // #region task actions
  private updateTasks(taskModels: TsGanttTaskModel[]): TsGanttTaskUpdateResult {
    const oldTasks = this._tasks;
    const oldIdsMap = TsGanttTask.getTasksIdsMap(oldTasks);
    const newTasks = TsGanttTask.convertModelsToTasks(taskModels, oldIdsMap);
    this._tasks = newTasks;
    return { oldTasks, newTasks };
  }

  private updateRows(data: TsGanttTaskChangesDetectionResult) {
    this._table.updateRows(data);
    this._chart.updateRows(data);
  }

  private updateLocale() {

  }
  // #endregion
    

}

export { TsGantt, TsGanttOptions, TsGanttChart, TsGanttTable,
  TsGanttTask, TsGanttTaskModel, TsGanttTaskUpdateResult, 
  TsGanttTaskChangesDetectionResult };
