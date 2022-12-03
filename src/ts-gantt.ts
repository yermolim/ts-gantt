import "./assets/styles.css"; // this import is here only for rollup
import { styles } from "./assets/styles";

import { TsGanttConst } from "./core/ts-gantt-const";
import { ChartBarMode, ChartScale } from "./core/ts-gantt-common";
import { TsGanttOptions } from "./core/ts-gantt-options";
import { TsGanttTaskModel } from "./core/ts-gantt-task-model";
import { TsGanttTask, TsGanttTaskSelectionChangeResult } from "./core/ts-gantt-task";
import { TsGanttData, TsGanttDataChangeResult } from "./core/ts-gantt-data";

import { TsGanttBaseComponent } from "./components/abstract/ts-gantt-base-component";
import { TsGanttTable } from "./components/table/ts-gantt-table";
import { TsGanttChart } from "./components/chart/ts-gantt-chart";
import { TaskChangeInChartEvent } from "./components/chart/custom-events";

class TsGantt {
  private readonly _data: TsGanttData;
  private get _options(): TsGanttOptions {
    return this._data?.options;
  }

  private _htmlContainer: HTMLElement;
  private _shadowRoot: ShadowRoot;

  private _htmlWrapper: HTMLDivElement;
  private _htmlTableWrapper: HTMLDivElement;
  private _htmlChartWrapper: HTMLDivElement;

  private _separatorDragActive = false;
  private _ignoreNextScrollEvent = false;

  private _baseComponents: TsGanttBaseComponent[] = [];
  private _table: TsGanttBaseComponent;
  private _chart: TsGanttBaseComponent; 

  /**
   * returns all the tasks models in their current state.
   * i.e. with all the changes applied if there were any
   */
  get tasks(): TsGanttTaskModel[] {
    return this._data.models;
  }
  set tasks(models: TsGanttTaskModel[]) {
    this.updateTasks(models);
  }

  get selectedTasks(): TsGanttTaskModel[] {
    return this._data.selectedModels;
  }  
  set selectedTasks(models: TsGanttTaskModel[]) {
    this.updateSelection(models);
  }

  set locale(value: string) {
    if (value !== this._options.locale) {
      this._options.locale = value;
      this.updateLocale();
    }
  }

  set chartScale(value: ChartScale) {
    if (value !== this._options.chartScale) {
      this._options.chartScale = value;
      this.updateChartScale();
    }
  }

  set chartDisplayMode(value: ChartBarMode) {
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

    options = options instanceof TsGanttOptions
      ? options
      : new TsGanttOptions(options);      

    this._data = new TsGanttData(options);

    this.setCssVariables(this._options);

    this._htmlContainer = document.querySelector(containerSelector);
    if (!this._htmlContainer) {
      throw new Error("Container is null");
    }

    this.createLayout();
  }

  destroy() {
    this.removeGlobalEventListeners();
    this._baseComponents.forEach(bc => bc.destroy());
    this._htmlWrapper.remove();
  }

  expandAll(state: boolean) {
    this._data.expandAllTasks(state);
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
    wrapper.classList.add(TsGanttConst.CLASSES.ROOT.MAIN_ELEMENT, TsGanttConst.CLASSES.ROOT.TEXT_SELECTION_DISABLED);
    const tableWrapper = document.createElement("div");
    tableWrapper.classList.add(TsGanttConst.CLASSES.ROOT.TABLE_WRAPPER);
    const chartWrapper = document.createElement("div");
    chartWrapper.classList.add(TsGanttConst.CLASSES.ROOT.CHART_WRAPPER);

    const separator = document.createElement("div");
    separator.classList.add(TsGanttConst.CLASSES.ROOT.SEPARATOR);  
    
    this._table = new TsGanttTable(this._data);
    this._chart = new TsGanttChart(this._data);
    this._baseComponents.push(this._table, this._chart);
 
    wrapper.append(tableWrapper);
    wrapper.append(separator);
    wrapper.append(chartWrapper);
    this._table.appendTo(tableWrapper);
    this._chart.appendTo(chartWrapper);

    tableWrapper.addEventListener("scroll", this.onWrapperScroll);
    chartWrapper.addEventListener("scroll", this.onWrapperScroll);
    separator.addEventListener("pointerdown", this.onPointerDownOnPartsSeparator);

    if (this._options.useShadowDom) {
      this._shadowRoot = this._htmlContainer.attachShadow({mode: "open"});
      this._shadowRoot.innerHTML = styles;
      this._shadowRoot.append(wrapper);
    } else {
      this._htmlContainer.append(wrapper);
    }

    this._htmlWrapper = wrapper;
    this._htmlTableWrapper = tableWrapper;
    this._htmlChartWrapper = chartWrapper;

    this.addGlobalEventListeners();
  }
  // #endregion

  // #region event listeners
  onResize = (e: Event) => {
    const wrapperWidth = this._htmlWrapper.getBoundingClientRect().width;
    const tableWrapperWidth = this._htmlTableWrapper.getBoundingClientRect().width;
    this._htmlChartWrapper.style.width = 
      (wrapperWidth - tableWrapperWidth - this._options.separatorWidthPx) + "px";
  };

  private onPointerDownOnPartsSeparator = (e: PointerEvent) => {
    if (!e.isPrimary || e.button === 2) {
      return;
    }

    const target = e.target as HTMLElement;
    target.addEventListener("pointermove", this.onPointerMoveWhileResizingParts);
    target.addEventListener("pointerup", this.onPointerUpWhileResizingParts);
    target.addEventListener("pointerout", this.onPointerUpWhileResizingParts);
    target.setPointerCapture(e.pointerId);

    this._separatorDragActive = true;
  };
  private onPointerMoveWhileResizingParts = (e: PointerEvent) => {
    if (!this._separatorDragActive) {
      return false;
    }
    const rect = this._htmlWrapper.getBoundingClientRect();
    const wrapperLeftOffset = rect.left;
    const wrapperWidth = rect.width;
    const userDefinedWidth = e.clientX - wrapperLeftOffset;

    this._htmlTableWrapper.style.width = (userDefinedWidth - this._options.separatorWidthPx) + "px";
    this._htmlChartWrapper.style.width = (wrapperWidth - userDefinedWidth) + "px";
  };
  private onPointerUpWhileResizingParts = (e: PointerEvent) => {
    if (!e.isPrimary) {
      return;
    }

    const target = e.target as HTMLElement;
    target.removeEventListener("pointermove", this.onPointerMoveWhileResizingParts);
    target.removeEventListener("pointerup", this.onPointerUpWhileResizingParts);
    target.removeEventListener("pointerout", this.onPointerUpWhileResizingParts);
    target.releasePointerCapture(e.pointerId);

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
      this.toggleTaskSelection(task, event.ctrlKey);
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

  private onTaskChange = (e: TaskChangeInChartEvent) => {
    if (!e.detail?.task) {
      return;
    }

    const changes = this._data.updateSingleTask(e.detail.task);
    if (changes.changed?.length) {
      this.update(changes);
    }
  };

  private addGlobalEventListeners() {    
    window.addEventListener("resize", this.onResize);
    document.addEventListener(TsGanttConst.EVENTS.ROW_CLICK, this.onRowClick);
    document.addEventListener(TsGanttConst.EVENTS.ROW_CONTEXT_MENU, this.onRowContextMenu);
    document.addEventListener(TsGanttConst.EVENTS.TABLE_BODY_CELL_EXPANDER_CLICK, this.onRowExpanderClick);
    document.addEventListener(TsGanttConst.EVENTS.TASK_CHANGED_IN_CHART, this.onTaskChange);
  }
  private removeGlobalEventListeners() {
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener(TsGanttConst.EVENTS.ROW_CLICK, this.onRowClick);
    document.removeEventListener(TsGanttConst.EVENTS.ROW_CONTEXT_MENU, this.onRowContextMenu);
    document.removeEventListener(TsGanttConst.EVENTS.TABLE_BODY_CELL_EXPANDER_CLICK, this.onRowExpanderClick);
    document.removeEventListener(TsGanttConst.EVENTS.TASK_CHANGED_IN_CHART, this.onTaskChange);
  }
  // #endregion

  // #region task selection

  private toggleTaskSelection(task: TsGanttTask, ctrl: boolean) {
    const selectionResult = this._data.toggleTaskSelection(task, ctrl);
    this.applySelectionResult(selectionResult);  
  }

  private refreshSelection() {
    const selectionResult = this._data.refreshSelectedTasks();
    this.applySelectionResult(selectionResult);
  }

  private updateSelection(tasks: TsGanttTaskModel[] | TsGanttTask[]) {
    const selectionResult = this._data.updateSelectedTasks(tasks);
    this.applySelectionResult(selectionResult);
  }

  private applySelectionResult(selectionResult: TsGanttTaskSelectionChangeResult) {
    if (!selectionResult) {
      return;
    }

    this._table.applySelection(selectionResult);
    this._chart.applySelection(selectionResult);

    if (selectionResult.changed && selectionResult.selectedTasks?.length) {
      this.scrollChartToTasks(selectionResult.selectedTasks);
    }

    if (this.onSelectionChangeCb) {
      this.onSelectionChangeCb(selectionResult.selectedTasks.map(x => x.toModel()));
    }
  }

  // #endregion
  
  // #region global chart updates

  private update(data: TsGanttDataChangeResult) {
    const uuids = this._data.getShownTaskUuidsRecursively();
    this._table.update(false, data, uuids);
    this._chart.update(false, data, uuids);
    this.refreshSelection();
  }

  private updateTasks(taskModels: TsGanttTaskModel[]) {
    const changes = this._data.updateTasks(taskModels);
    this.update(changes);
  }

  private updateLocale() {
    const data = this._data.getAllTasksAsChanged();
    this._table.update(true, data, null);
    this._chart.update(true, data, null);
  }

  private updateChartScale() {
    const data = this._data.getAllTasksAsChanged();
    this._chart.update(true, data, null);
    this.refreshSelection();
    this.scrollChartToTasks(this._data.tasks);
  }

  private updateChartDisplayMode() {
    const data = this._data.getAllTasksAsChanged();
    this._chart.update(false, data, null);
    this.refreshSelection();
  }

  //#endregion

  private toggleTaskExpanded(task: TsGanttTask) {
    task.toggleExpanded();
    this.update(null);
  }

  private scrollChartToTasks(tasks: readonly TsGanttTask[]) {
    const { dayWidthPx, chartDisplayMode } = this._options;
    const offsets = tasks
      .map(task => task.getHorizontalOffsetPx(chartDisplayMode, this._data.dateMinOffset, dayWidthPx))
      .filter(offset => !!offset);
    const minOffset = Math.min(...offsets);
    if (minOffset) {
      this._htmlChartWrapper.scrollLeft = minOffset - 20;
    }
  }
}

export { TsGantt, TsGanttOptions, TsGanttTaskModel, TsGanttTask };
