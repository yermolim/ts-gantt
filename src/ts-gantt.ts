/* eslint-disable @typescript-eslint/member-ordering */
import "./styles.css";
import { TsGanttConst } from "./ts-gantt-const";
import { compareTwoStringSets } from "./ts-gantt-common";
import { TsGanttOptions } from "./ts-gantt-options";
import { TsGanttTask, TsGanttTaskModel,
  TsGanttTaskChangeResult, TsGanttTaskSelectionChangeResult } from "./ts-gantt-task";
import { TsGanttTable } from "./ts-gantt-table";
import { TsGanttChart } from "./ts-gantt-chart";

class TsGantt {  
  private _options: TsGanttOptions;

  private _htmlContainer: HTMLElement;
  private _htmlWrapper: HTMLDivElement;
  private _htmlTableWrapper: HTMLDivElement;
  private _htmlChartWrapper: HTMLDivElement;

  private _separatorDragActive = false;
  private _ignoreNextScrollEvent = false;

  private _table: TsGanttTable;
  private _chart: TsGanttChart; 

  private _tasks: TsGanttTask[] = [];
  get tasks(): TsGanttTaskModel[] {
    return this._tasks.map(x => x.toModel());
  }  
  set tasks(models: TsGanttTaskModel[]) {
    const changeDetectionResult = this.updateTasks(models);
    this.update(changeDetectionResult);
  }

  private _selectedTasks: TsGanttTask[] = [];
  get selectedTasks(): TsGanttTaskModel[] {
    return this._selectedTasks.map(x => x.toModel());
  }
  set selectedTasks(models: TsGanttTaskModel[]) {
    const ids = models.map(x => x.id);
    const targetTasks = this._tasks.filter(x => ids.includes(x.externalId));
    this.selectTasks(targetTasks);
  } 

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
    
  set chartDisplayMode(value: "planned" | "actual" | "both") {
    if (value !== this._options.chartDisplayMode) {
      this._options.chartDisplayMode = value;
      this.updateChartDisplayMode();
    }
  }

  onRowClickCb: (model: TsGanttTaskModel, event: MouseEvent) => void;
  onRowDoubleClickCb: (model: TsGanttTaskModel, event: MouseEvent) => void;
  onRowContextMenuCb: (model: TsGanttTaskModel, event: MouseEvent) => void;
  onSelectionChangeCb: (models: TsGanttTaskModel[]) => void;

  constructor(containerSelector: string,
    options: TsGanttOptions = null) {

    this._options = options instanceof TsGanttOptions
      ? options
      : new TsGanttOptions(options);
    this.setCssVariables(this._options);

    this._htmlContainer = document.querySelector(containerSelector);
    if (!this._htmlContainer) {
      throw new Error("Container is null");
    }

    this.createLayout();    
  }

  destroy() {
    this.removeWindowEventListeners();
    this.removeDocumentEventListeners();
    this._htmlWrapper.remove();
  }

  expandAll(state: boolean) {
    for (const task of this._tasks) {
      task.expanded = state;
      if (task.parentUuid) {
        task.shown = state;
      }
    }
    this.update(null);
  }

  // #region initialization
  private setCssVariables(options: TsGanttOptions) {
    document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_SEPARATOR_WIDTH, options.separatorWidthPx + "px");
    document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_HEADER_HEIGHT, options.headerHeightPx + "px");
    document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_ROW_HEIGHT, options.rowHeightPx + "px");
    document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_GRIDLINES_WIDTH, options.borderWidthPx + "px");
    document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_BAR_STROKE_WIDTH, options.barStrokeWidthPx + "px");
  }

  private createLayout() {
    const wrapper = document.createElement("div");
    wrapper.classList.add(TsGanttConst.WRAPPER_CLASS, TsGanttConst.TEXT_SELECTION_DISABLED);    
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
    separator.addEventListener("mousedown", this.onMouseDownOnPartsSeparator);
    separator.addEventListener("touchstart", this.onMouseDownOnPartsSeparator);
     
    this._htmlContainer.append(wrapper);     
    this._htmlWrapper = wrapper;
    this._htmlTableWrapper = tableWrapper;
    this._htmlChartWrapper = chartWrapper;

    window.addEventListener("resize", this.onResize);
    document.addEventListener(TsGanttConst.ROW_CLICK, this.onRowClick);
    document.addEventListener(TsGanttConst.ROW_CONTEXT_MENU, this.onRowContextMenu);
    document.addEventListener(TsGanttConst.TABLE_CELL_EXPANDER_CLICK, this.onRowExpanderClick);
  }
  // #endregion

  // #region event listeners
  onResize = (e: Event) => {
    const wrapperWidth = this._htmlWrapper.getBoundingClientRect().width;
    const tableWrapperWidth = this._htmlTableWrapper.getBoundingClientRect().width;
    this._htmlChartWrapper.style.width = 
      (wrapperWidth - tableWrapperWidth - this._options.separatorWidthPx) + "px";
  };

  private onMouseDownOnPartsSeparator = (e: MouseEvent | TouchEvent) => {
    document.addEventListener("mousemove", this.onMouseMoveWhileResizingParts);
    document.addEventListener("mouseup", this.onMouseUpWhileResizingParts);
    document.addEventListener("touchmove", this.onMouseMoveWhileResizingParts);
    document.addEventListener("touchend", this.onMouseUpWhileResizingParts);
    this._separatorDragActive = true;
  };      
  private onMouseMoveWhileResizingParts = (e: MouseEvent | TouchEvent) => {
    if (!this._separatorDragActive) {
      return false;
    }  
    const rect = this._htmlWrapper.getBoundingClientRect();
    const wrapperLeftOffset = rect.left;
    const wrapperWidth = rect.width;
    const userDefinedWidth = e instanceof MouseEvent 
      ? e.clientX - wrapperLeftOffset 
      : e.touches[0].clientX - wrapperLeftOffset;

    this._htmlTableWrapper.style.width = (userDefinedWidth - this._options.separatorWidthPx) + "px";
    this._htmlChartWrapper.style.width = (wrapperWidth - userDefinedWidth) + "px";
  };       
  private onMouseUpWhileResizingParts = (e: MouseEvent | TouchEvent) => {
    document.removeEventListener("mousemove", this.onMouseMoveWhileResizingParts);
    document.removeEventListener("mouseup", this.onMouseUpWhileResizingParts);
    document.removeEventListener("touchmove", this.onMouseMoveWhileResizingParts);
    document.removeEventListener("touchend", this.onMouseUpWhileResizingParts);
    this._separatorDragActive = false;
  };

  private onWrapperScroll = <EventListener>((e: UIEvent) => {
    if (this._ignoreNextScrollEvent) {
      this._ignoreNextScrollEvent = false;
      return;
    }
    this._ignoreNextScrollEvent = true;
    
    const wrapper = e.currentTarget as Element;
    const scroll = wrapper.scrollTop;
    if (wrapper === this._htmlTableWrapper) {
      if (this._htmlChartWrapper.scrollTop !== scroll) {
        this._htmlChartWrapper.scrollTop = scroll;
      }
    } else if (wrapper === this._htmlChartWrapper) {
      if (this._htmlTableWrapper.scrollTop !== scroll) {
        this._htmlTableWrapper.scrollTop = scroll;
      }
    }
  });
  
  private onRowClick = <EventListener>((e: CustomEvent) => {
    const detail: {task: TsGanttTask; event: MouseEvent} = e.detail;
    if (!detail) {
      return;
    }
    const { task, event } = detail;

    if (event.detail === 1) {
      this.changeSelection(task, event.ctrlKey);
      if (this.onRowClickCb) {
        this.onRowClickCb(task.toModel(), event);
      }
    } else if (event.detail === 2){      
      if (this.onRowDoubleClickCb) {
        this.onRowDoubleClickCb(task.toModel(), event);
      }
    }
  });  
  private onRowContextMenu = <EventListener>((e: CustomEvent) => {
    const detail: {task: TsGanttTask; event: MouseEvent} = e.detail;
    if (!detail) {
      return;
    }
    const { task, event } = detail;

    if (this.onRowContextMenuCb) {
      this.onRowContextMenuCb(task.toModel(), event);
    }
  });

  private onRowExpanderClick = <EventListener>((e: CustomEvent) => {
    this.toggleTaskExpanded(e.detail.task);
  });

  private removeWindowEventListeners() {
    window.removeEventListener("resize", this.onResize);
  }
  private removeDocumentEventListeners() {
    document.removeEventListener(TsGanttConst.ROW_CLICK, this.onRowClick);
    document.removeEventListener(TsGanttConst.ROW_CONTEXT_MENU, this.onRowContextMenu);
    document.removeEventListener(TsGanttConst.TABLE_CELL_EXPANDER_CLICK, this.onRowExpanderClick);
  }
  // #endregion

  // #region task actions
  private updateTasks(taskModels: TsGanttTaskModel[]): TsGanttTaskChangeResult {
    const oldTasks = this._tasks;
    const oldTasksIdMap = TsGanttTask.createTasksIdMap(oldTasks);
    const newTasks = TsGanttTask.convertModelsToTasks(taskModels, oldTasksIdMap);

    const changes = TsGanttTask.detectTaskChanges({oldTasks, newTasks});
    this._tasks = changes.all;
    return changes;
  }

  private update(data: TsGanttTaskChangeResult) {
    const uuids = this.getShownUuidsRecursively();
    this._table.update(false, data, uuids);
    this._chart.update(false, data, uuids);
    this.refreshSelection();
  }
  
  private toggleTaskExpanded(task: TsGanttTask) {
    task.expanded = !task.expanded;
    this.update(null);
  }

  private changeSelection(task: TsGanttTask, ctrl: boolean) {
    if (!task) {
      return;
    }
    const selectedTasks = [];
    const taskInCurrentSelected = this._selectedTasks.includes(task);
    if (this._options.multilineSelection 
      && (!this._options.useCtrlKeyForMultilineSelection 
      || (this._options.useCtrlKeyForMultilineSelection && ctrl))) {
      selectedTasks.push(...this._selectedTasks);
      if (!taskInCurrentSelected) {
        selectedTasks.push(task);
      } else {          
        selectedTasks.splice(selectedTasks.findIndex(x => x === task), 1);
      }  
    } else {
      selectedTasks.push(task);
    }    

    this.selectTasks(selectedTasks);
  }

  private refreshSelection() {   
    const tasks = this._selectedTasks.filter(x => !TsGanttTask
      .checkForCollapsedParent(this._tasks, x));
    this.selectTasks(tasks);   
  }

  private selectTasks(newSelectedTasks: TsGanttTask[]) {
    const oldSelectedTasks = this._selectedTasks;
    const selectionEmpty = oldSelectedTasks.length === 0 && newSelectedTasks.length === 0;
    if (selectionEmpty) {
      return;
    }

    const oldUuids = oldSelectedTasks.map(x => x.uuid);
    const newUuids = newSelectedTasks.map(x => x.uuid);
    const selectionNotChanged = compareTwoStringSets(new Set(oldUuids), new Set(newUuids));
    if (selectionNotChanged) {
      return;
    } 

    const selected = newUuids;
    const deselected = oldUuids.filter(x => !newUuids.includes(x));
    
    this._selectedTasks = newSelectedTasks; 
    const result = <TsGanttTaskSelectionChangeResult>{selected, deselected};    
    this._table.applySelection(result);
    this._chart.applySelection(result);

    if (newSelectedTasks) {
      this.scrollChartToTasks(newUuids);
    }

    if (this.onSelectionChangeCb) {
      this.onSelectionChangeCb(newSelectedTasks.map(x => x.toModel()));
    }
  } 

  private scrollChartToTasks(uuids: string[]) {    
    const offset = Math.min(...uuids.map(x => this._chart.getBarOffsetByTaskUuid(x)));
    if (offset) {
      this._htmlChartWrapper.scrollLeft = offset - 20;
    }
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

  private updateChartDisplayMode() {
    this._chart.update(false, <TsGanttTaskChangeResult>{
      deleted: [],
      added: [],
      changed: this._tasks,
      all: this._tasks,
    });
    this.refreshSelection();
  }   

  private getShownUuidsRecursively(parentUuid: string = null): string[] {      
    const tasksFiltered = this._tasks.filter(x => x.parentUuid === parentUuid)
      .sort((a: TsGanttTask, b: TsGanttTask): number => a.compareTo(b));
    const uuids: string[] = [];
    for (const task of tasksFiltered) {
      uuids.push(task.uuid);
      if (task.expanded) {
        uuids.push(...this.getShownUuidsRecursively(task.uuid));
      }
    }
    return uuids;
  }
  // #endregion
}

export { TsGantt, TsGanttOptions, TsGanttTaskModel, TsGanttTask };
