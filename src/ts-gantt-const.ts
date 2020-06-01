class TsGanttConst {  
  static readonly CSS_VAR_SEPARATOR_WIDTH = "--tsg-separator-width";
  static readonly CSS_VAR_HEADER_HEIGHT = "--tsg-header-height";
  static readonly CSS_VAR_ROW_HEIGHT = "--tsg-row-height";
  static readonly CSS_VAR_GRIDLINES_WIDTH = "--tsg-gridlines-width";
  static readonly CSS_VAR_BAR_STROKE_WIDTH = "--tsg-bar-stroke-width";
  
  static readonly TEXT_SELECTION_DISABLED = "tsg-no-text-selection";

  static readonly WRAPPER_CLASS = "tsg-wrapper";
  static readonly FOOTER_CLASS = "tsg-footer";
  static readonly SEPARATOR_CLASS = "tsg-separator";

  static readonly ROW_SELECTED_CLASS = "selected";
  static readonly ROW_OVERDUE_CLASS = "overdue";
  static readonly ROW_CLICK_EVENT = "tsgrowclick";
  static readonly ROW_CONTEXT_MENU_EVENT = "tsgrowcontextmenu";

  static readonly TABLE_WRAPPER_CLASS = "tsg-table-wrapper";
  static readonly TABLE_CLASS = "tsg-table";
  static readonly TABLE_COLUMN_RESIZER_CLASS = "tsg-table-col-resizer";
  static readonly TABLE_HEADER_CLASS = "tsg-table-header";
  static readonly TABLE_BODY_ROW_CLASS = "tsg-table-body-row";
  static readonly TABLE_BODY_CELL_CLASS = "tsg-table-body-cell";
  static readonly TABLE_BODY_CELL_TEXT_WRAPPER_CLASS = "tsg-table-body-cell-text-wrapper";
  static readonly TABLE_BODY_CELL_TEXT_CLASS = "tsg-table-body-cell-text";
  static readonly TABLE_BODY_CELL_EXPANDER_CLASS = "tsg-table-body-cell-text-expander";  
  static readonly TABLE_BODY_CELL_EXPANDER_NESTING_PREFIX = "nesting-";
  static readonly TABLE_BODY_CELL_EXPANDER_CLICK_EVENT = "tsgexpanderclick";
  
  static readonly CHART_WRAPPER_CLASS = "tsg-chart-wrapper";
  static readonly CHART_CLASS = "tsg-chart";
  static readonly CHART_HEADER_CLASS = "tsg-chart-header";
  static readonly CHART_HEADER_BACKGROUND_CLASS = "tsg-chart-header-bg";
  static readonly CHART_HEADER_GRIDLINES_CLASS = "tsg-chart-header-gl";
  static readonly CHART_HEADER_TEXT_CLASS = "tsg-chart-header-text";
  static readonly CHART_BODY_CLASS = "tsg-chart-body";
  static readonly CHART_BODY_BACKGROUND_CLASS = "tsg-chart-body-bg";
  static readonly CHART_BODY_GRIDLINES_CLASS = "tsg-chart-body-gl";  
  static readonly CHART_BODY_TODAY_LINE_CLASS = "tsg-chart-body-gl-today";  
  static readonly CHART_ROW_WRAPPER_CLASS = "tsg-chart-row-wrapper";
  static readonly CHART_ROW_CLASS = "tsg-chart-row";
  static readonly CHART_ROW_BACKGROUND_CLASS = "tsg-chart-row-bg";
  static readonly CHART_BAR_GROUP_CLASS = "tsg-chart-bar-group";
  static readonly CHART_BAR_WRAPPER_CLASS = "tsg-chart-bar-wrapper";
  static readonly CHART_BAR_PLANNED_CLASS = "tsg-chart-bar-planned";
  static readonly CHART_BAR_PLANNED_PROGRESS_CLASS = "tsg-chart-bar-planned-progress";
  static readonly CHART_BAR_ACTUAL_CLASS = "tsg-chart-bar-actual";
  static readonly CHART_BAR_ACTUAL_PROGRESS_CLASS = "tsg-chart-bar-actual-progress";
}

export { TsGanttConst };
