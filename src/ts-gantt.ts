import "./styles.css";
import { TsGanttConst } from "./ts-gantt-const";
import { TsGanttTask, TsGanttTaskModel, TsGanttTaskUpdateResult, 
  TsGanttTaskChangesDetectionResult } from "./ts-gantt-task";
import { TsGanttOptions } from "./ts-gantt-options";
import { TsGanttChart } from "./ts-gantt-chart";
import { TsGanttTable } from "./ts-gantt-table";


class TsGantt {  

  private _options: TsGanttOptions;

  private _tasks: TsGanttTask[] = [];
  get tasks(): TsGanttTaskModel[] {
    return TsGanttTask.convertTasksToModels(this._tasks);
  }  
  set tasks(models: TsGanttTaskModel[]) {
    const updateResult = this.updateTasks(models);
    const changeDetectionResult = TsGanttTask.detectTaskChanges(updateResult);
    this.update(changeDetectionResult);
  }

  private _selectedTask: TsGanttTask;
  get selectedTask(): TsGanttTaskModel {
    return this._selectedTask
      ? TsGanttTask.convertTasksToModels([this._selectedTask])[0]
      : null;
  }
  set selectedTask(model: TsGanttTaskModel) {
    const targetTask = this._tasks.find(x => x.externalId === model.id);
    if (targetTask !== this._selectedTask) {
      this.selectTask(targetTask);
    }
  }

  private _htmlContainer: HTMLElement;

  private _htmlWrapper: HTMLDivElement;
  private _htmlTableWrapper: HTMLDivElement;
  private _htmlChartWrapper: HTMLDivElement;
  private _htmlSeparator: HTMLDivElement;
  private _htmlSeparatorDragActive = false;

  private _table: TsGanttTable;
  private _chart: TsGanttChart;  

  set locale(value: string) {
    if (value !== this._options.locale) {
      this._options.locale = value;
      this.updateLocale();
    }
  }
  
  set chartScale(value: "day" | "week" | "month" | "year") {
    if (value !== this._options.chartScale) {
      this._options.chartScale = value;
      this.updateChartScale();
    }
  }
    
  set chartBarMode(value: "planned" | "actual" | "both") {
    if (value !== this._options.chartBarMode) {
      this._options.chartBarMode = value;
      this.updateChartBarMode();
    }
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
    const wrapperWidth = this._htmlWrapper.getBoundingClientRect().width;
    const userDefinedWidth = e.clientX - wrapperLeftOffset;

    this._htmlTableWrapper.style.width = (userDefinedWidth - 5) + "px";
    this._htmlChartWrapper.style.width = (wrapperWidth - userDefinedWidth) + "px";
  };        
  onMouseUpOnSep = (e: MouseEvent) => {
    this._htmlSeparatorDragActive = false;
  }; 
  
  onRowClick = (e: Event) => {
    const target = e.target as HTMLElement;
    const uuid = target.dataset[TsGanttConst.ROW_UUID_DATASET_KEY];
    const newSelectedTask = this._tasks.find(x => x.uuid === uuid);
    this.selectTask(newSelectedTask);
  };    
  onRowExpanderClick = (e: Event) => {
    const target = e.target as HTMLElement;    
    this.toggleTaskExpanded(target.dataset[TsGanttConst.ROW_UUID_DATASET_KEY]);
  };

  private removeSepEventListeners() {
    document.removeEventListener("mousedown", this.onMouseDownOnSep);
    document.removeEventListener("mousemove", this.onMouseMoveOnSep);
    document.removeEventListener("mouseup", this.onMouseUpOnSep);
  }

  private removeRowEventListeners() {
    document.removeEventListener(TsGanttConst.ROW_CLICK, this.onRowClick);
    document.removeEventListener(TsGanttConst.CELL_EXPANDER_CLICK, this.onRowExpanderClick);
  }
  // #endregion

  private createLayout() {
    const wrapper = document.createElement("div");
    wrapper.classList.add(TsGanttConst.WRAPPER_CLASS);    
    const tableWrapper = document.createElement("div");
    tableWrapper.classList.add(TsGanttConst.TABLE_WRAPPER_CLASS);
    const chartWrapper = document.createElement("div");
    chartWrapper.classList.add(TsGanttConst.CHART_WRAPPER_CLASS);

    const separator = document.createElement("div");
    separator.classList.add(TsGanttConst.SEPARATOR_CLASS);  
    
    this._table = new TsGanttTable(this._options);
    this._chart = new TsGanttChart(this._options);      
 
    wrapper.append(tableWrapper);
    wrapper.append(separator);
    wrapper.append(chartWrapper);
    tableWrapper.append(this._table.html);
    chartWrapper.append(this._chart.html);
     
    this._htmlContainer.append(wrapper);     
    this._htmlWrapper = wrapper;
    this._htmlTableWrapper = tableWrapper;
    this._htmlChartWrapper = chartWrapper;
    this._htmlSeparator = separator;

    document.addEventListener("mousedown", this.onMouseDownOnSep);
    document.addEventListener("mousemove", this.onMouseMoveOnSep);
    document.addEventListener("mouseup", this.onMouseUpOnSep);
    document.addEventListener(TsGanttConst.ROW_CLICK, this.onRowClick);
    document.addEventListener(TsGanttConst.CELL_EXPANDER_CLICK, this.onRowExpanderClick);
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

    this.update({added: [], deleted: [], changed: changedTasks, all: this._tasks});
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

    this.update({added: [], deleted: [], changed: changedTasks, all: this._tasks});
  }

  private update(data: TsGanttTaskChangesDetectionResult) {
    this._table.update(false, data);
    this._chart.update(false, data);
  }

  private updateLocale() {    
    const data = <TsGanttTaskChangesDetectionResult>{
      deleted: [],
      added: [],
      changed: this._tasks,
      all: this._tasks,
    };
    this._table.update(true, data);
    this._chart.update(true, data);
  }
  
  private updateChartScale() {
    this._chart.update(true, <TsGanttTaskChangesDetectionResult>{
      deleted: [],
      added: [],
      changed: this._tasks,
      all: this._tasks,
    });
  }  

  private updateChartBarMode() {
    this._chart.update(false, <TsGanttTaskChangesDetectionResult>{
      deleted: [],
      added: [],
      changed: this._tasks,
      all: this._tasks,
    });
  }
  // #endregion
}

export { TsGantt, TsGanttOptions, TsGanttChart, TsGanttTable,
  TsGanttTask, TsGanttTaskModel, TsGanttTaskUpdateResult, 
  TsGanttTaskChangesDetectionResult };
