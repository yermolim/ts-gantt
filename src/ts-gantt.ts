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

  private _selectedTask: TsGanttTask;
  get selectedTask(): TsGanttTaskModel {
    return this._selectedTask
      ? TsGanttTask.convertTasksToModels([this._selectedTask])[0]
      : null;
  }
  set selectedTask(model: TsGanttTaskModel) {
    const targetTask = this._tasks.find(x => x.externalId === model.id);
    this.selectTask(targetTask);
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
    this._options.locale = value;
    this.updateLocale();
  }

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
    this.removeRowEventListeners();
    this._htmlWrapper.remove();
  }

  // #region event listeners
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
  
  onRowClick = (e: Event) => {
    const target = e.target as HTMLElement;
    const uuid = target.dataset.tsgRowUuid;
    const newSelectedTask = this._tasks.find(x => x.uuid === uuid);
    this.selectTask(newSelectedTask);
  };    
  onRowExpanderClick = (e: Event) => {
    const target = e.target as HTMLElement;    
    this.toggleTaskExpanded(target.dataset.tsgRowUuid);
  };

  private removeSepEventListeners() {
    document.removeEventListener("mousedown", this.onMouseDownOnSep);
    document.removeEventListener("mousemove", this.onMouseMoveOnSep);
    document.removeEventListener("mouseup", this.onMouseUpOnSep);
  }

  private removeRowEventListeners() {
    document.removeEventListener("tsgrowclick", this.onRowClick);
    document.removeEventListener("tsgexpanderclick", this.onRowExpanderClick);
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
    document.addEventListener("tsgrowclick", this.onRowClick);
    document.addEventListener("tsgexpanderclick", this.onRowExpanderClick);
  }

  // #region task actions
  private updateTasks(taskModels: TsGanttTaskModel[]): TsGanttTaskUpdateResult {
    const oldTasks = this._tasks;
    const oldIdsMap = TsGanttTask.getTasksIdsMap(oldTasks);
    const newTasks = TsGanttTask.convertModelsToTasks(taskModels, oldIdsMap);
    this._tasks = newTasks;
    return { oldTasks, newTasks };
  }
  
  private toggleTaskExpanded(uuid: string) {
    let targetTask: TsGanttTask;
    const targetChildren: TsGanttTask[] = [];
    for (const task of this._tasks) {
      if (!targetTask && task.uuid === uuid) {
        targetTask = task;
      } else if (task.parentUuid === uuid) {
        targetChildren.push(task);
      }
    }
    if (!targetTask) {
      return;
    }

    targetTask.expanded = !targetTask.expanded;
    targetChildren.forEach(x => x.shown = !x.shown);
    const changedTasks = [targetTask, ...targetChildren];

    const selectedTask = this._selectedTask;
    if (selectedTask && selectedTask !== targetTask
        && TsGanttTask.checkPaternity(this._tasks, targetTask, selectedTask)) {
      selectedTask.selected = false;
      this._selectedTask = null;
      if (selectedTask.parentUuid !== targetTask.uuid) {
        changedTasks.push(selectedTask);
      }
    }

    this.updateRows({added: [], deleted: [], changed: changedTasks});
  }

  private selectTask(newSelectedTask: TsGanttTask) {
    const oldSelectedTask: TsGanttTask = this._selectedTask;
    if ((!oldSelectedTask && !newSelectedTask) 
        || oldSelectedTask === newSelectedTask) {
      return;
    }

    this._selectedTask = null;

    const changedTasks: TsGanttTask[] = [];

    if (oldSelectedTask) {
      oldSelectedTask.selected = false;
      changedTasks.push(oldSelectedTask);
    }        
    if (newSelectedTask) {
      newSelectedTask.selected = true;
      changedTasks.push(newSelectedTask);
      this._selectedTask = newSelectedTask;
    }

    this.updateRows({added: [], deleted: [], changed: changedTasks});
  }

  private updateRows(data: TsGanttTaskChangesDetectionResult) {
    this._table.updateRows(data);
    this._chart.updateRows(data);
  }

  private updateLocale() {

  }
  // #endregion
   
  // #region ui methods
  private setTableWrapperWidth(width: number) {    
    this._htmlTableWrapper.style.width = (Math.max(this._options.tableMinWidth, width)) + "px";
  }
  // #endregion
}

export { TsGantt, TsGanttOptions, TsGanttChart, TsGanttTable,
  TsGanttTask, TsGanttTaskModel, TsGanttTaskUpdateResult, 
  TsGanttTaskChangesDetectionResult };
