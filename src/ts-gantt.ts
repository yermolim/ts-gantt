/* eslint-disable @typescript-eslint/member-ordering */
import "./styles.css";
import { TsGanttConst } from "./ts-gantt-const";
import { TsGanttTask, TsGanttTaskModel, TsGanttTaskUpdateResult, 
  TsGanttTaskChangeResult, TsGanttTaskSelectionChangeResult } from "./ts-gantt-task";
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
    this.setCssVariables(this._options);

    this._htmlContainer = document.querySelector(containerSelector);
    if (!this._htmlContainer) {
      throw new Error("Container is null");
    }

    this.createLayout();    
  }

  destroy() {
    this.removeResizeEventListeners();
    this.removeRowEventListeners();
    this._htmlWrapper.remove();
  }

  // #region event listeners
  onResize = (e: Event) => {
    const wrapperWidth = this._htmlWrapper.getBoundingClientRect().width;
    const tableWrapperWidth = this._htmlTableWrapper.getBoundingClientRect().width;
    this._htmlChartWrapper.style.width = 
      (wrapperWidth - tableWrapperWidth - this._options.separatorWidthPx) + "px";
  };

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

    this._htmlTableWrapper.style.width = (userDefinedWidth - this._options.separatorWidthPx) + "px";
    this._htmlChartWrapper.style.width = (wrapperWidth - userDefinedWidth) + "px";
  };        
  onMouseUpOnSep = (e: MouseEvent) => {
    this._htmlSeparatorDragActive = false;
  }; 

  onWrapperScroll = <EventListener>((e: UIEvent) => {
    const wrapper = e.currentTarget as Element;
    const scroll = wrapper.scrollTop;
    if (wrapper === this._htmlTableWrapper) {
      this._htmlChartWrapper.scrollTop = scroll;
    } else {
      this._htmlTableWrapper.scrollTop = scroll;
    }
  });
  
  onRowClick = <EventListener>((e: CustomEvent) => {
    const newSelectedTask = this._tasks.find(x => x.uuid === e.detail);
    this.selectTask(newSelectedTask);
  });    
  onRowExpanderClick = <EventListener>((e: CustomEvent) => {
    this.toggleTaskExpanded(e.detail);
  });

  private removeResizeEventListeners() {
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("mousedown", this.onMouseDownOnSep);
    document.removeEventListener("mousemove", this.onMouseMoveOnSep);
    document.removeEventListener("mouseup", this.onMouseUpOnSep);
  }

  private removeRowEventListeners() {
    document.removeEventListener(TsGanttConst.ROW_CLICK, this.onRowClick);
    document.removeEventListener(TsGanttConst.CELL_EXPANDER_CLICK, this.onRowExpanderClick);
  }
  // #endregion

  private setCssVariables(options: TsGanttOptions) {
    document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_SEPARATOR_WIDTH, options.separatorWidthPx + "px");
    document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_HEADER_HEIGHT, options.headerHeightPx + "px");
    document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_ROW_HEIGHT, options.rowHeightPx + "px");
    document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_GRIDLINES_WIDTH, options.borderWidthPx + "px");
    document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_BAR_STROKE_WIDTH, options.barStrokeWidthPx + "px");
  }

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

    tableWrapper.addEventListener("scroll", this.onWrapperScroll);
    chartWrapper.addEventListener("scroll", this.onWrapperScroll);
     
    this._htmlContainer.append(wrapper);     
    this._htmlWrapper = wrapper;
    this._htmlTableWrapper = tableWrapper;
    this._htmlChartWrapper = chartWrapper;
    this._htmlSeparator = separator;

    window.addEventListener("resize", this.onResize);
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

    this.update(null);
  }

  private selectTask(newSelectedTask: TsGanttTask, forceSelection = false) {
    const oldSelectedTask: TsGanttTask = this._selectedTask;
    if (!forceSelection && ((!oldSelectedTask && !newSelectedTask) 
        || oldSelectedTask === newSelectedTask)) {
      return;
    }
    this._selectedTask = newSelectedTask;    
    this._table.applySelection(<TsGanttTaskSelectionChangeResult>{
      selected: newSelectedTask,
      deselected: oldSelectedTask,
    });
    this._chart.applySelection(<TsGanttTaskSelectionChangeResult>{
      selected: newSelectedTask,
      deselected: oldSelectedTask,
    });
  }

  private update(data: TsGanttTaskChangeResult) {
    this._table.update(false, data);
    this._chart.update(false, data);
    this.refreshSelection();
  }

  private updateLocale() {    
    const data = <TsGanttTaskChangeResult>{
      deleted: [],
      added: [],
      changed: this._tasks,
      all: this._tasks,
    };
    this._table.update(true, data);
    this._chart.update(true, data);
  }
  
  private updateChartScale() {
    this._chart.update(true, <TsGanttTaskChangeResult>{
      deleted: [],
      added: [],
      changed: this._tasks,
      all: this._tasks,
    });
    this.refreshSelection();
  }  

  private updateChartBarMode() {
    this._chart.update(false, <TsGanttTaskChangeResult>{
      deleted: [],
      added: [],
      changed: this._tasks,
      all: this._tasks,
    });
    this.refreshSelection();
  }

  private refreshSelection() {    
    if (this._selectedTask) {
      if (this._tasks.filter(x => x.shown).find(x => x.uuid === this._selectedTask.uuid)) {
        this.selectTask(this._selectedTask, true);
      } else {
        this.selectTask(null);
      }
    }
  }
  // #endregion
}

export { TsGantt, TsGanttOptions, TsGanttChart, TsGanttTable,
  TsGanttTask, TsGanttTaskModel, TsGanttTaskUpdateResult, 
  TsGanttTaskChangeResult, TsGanttTaskSelectionChangeResult };
