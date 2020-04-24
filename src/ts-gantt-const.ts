class TsGanttConst {  
  static readonly CSS_VAR_HEADER_HEIGHT = "--tsg-header-height";
  static readonly CSS_VAR_ROW_HEIGHT = "--tsg-row-height";
  static readonly CSS_VAR_GRIDLINES_WIDTH = "--tsg-gridlines-width";
  static readonly CSS_VAR_BAR_STROKE_WIDTH = "--tsg-bar-stroke-width";

  static readonly WRAPPER_CLASS = "tsg-wrapper";
  static readonly FOOTER_CLASS = "tsg-footer";
  static readonly TABLE_WRAPPER_CLASS = "tsg-table-wrapper";
  static readonly CHART_WRAPPER_CLASS = "tsg-chart-wrapper";
  static readonly TABLE_CLASS = "tsg-table";
  static readonly CHART_CLASS = "tsg-chart";
  static readonly SEPARATOR_CLASS = "tsg-separator";

  static readonly ROW_UUID_ATTRIBUTE = "data-tsg-row-uuid";
  static readonly ROW_UUID_DATASET_KEY = "tsgRowUuid";
  static readonly ROW_SELECTED_CLASS = "selected";
  static readonly ROW_CLICK = "tsgrowclick";

  static readonly TABLE_CELL_TEXT_WRAPPER_CLASS = "tsg-cell-text-wrapper";
  static readonly TABLE_CELL_TEXT_CLASS = "tsg-cell-text";
  static readonly TABLE_CELL_INDENT_CLASS = "tsg-cell-text-indent";
  static readonly TABLE_CELL_EXPANDER_CLASS = "tsg-cell-text-expander";  

  static readonly CELL_EXPANDER_CLICK = "tsgexpanderclick";
  static readonly CELL_EXPANDER_SYMBOL = "◆";
  static readonly CELL_EXPANDER_EXPANDABLE_SYMBOL = "⬘";
  static readonly CELL_EXPANDER_EXPANDED_SYMBOL = "⬙";
  
  static readonly CHART_HEADER_CLASS = "tsg-chart-header";
  static readonly CHART_HEADER_BACKGROUND_CLASS = "tsg-chart-header-bg";
  static readonly CHART_HEADER_GRIDLINES_CLASS = "tsg-chart-header-gl";
  static readonly CHART_HEADER_TEXT_CLASS = "tsg-chart-header-text";
  static readonly CHART_BODY_CLASS = "tsg-chart-body";
  static readonly CHART_BODY_BACKGROUND_CLASS = "tsg-chart-body-bg";
  static readonly CHART_BODY_GRIDLINES_CLASS = "tsg-chart-body-gl";  
  static readonly CHART_ROW_WRAPPER_CLASS = "tsg-chart-row-wrapper";
  static readonly CHART_ROW_CLASS = "tsg-chart-row";
  static readonly CHART_ROW_BACKGROUND_CLASS = "tsg-chart-row-bg";
  static readonly CHART_BAR_GROUP_CLASS = "tsg-chart-bar-group";
  static readonly CHART_BAR_WRAPPER_CLASS = "tsg-chart-bar-wrapper";
  static readonly CHART_BAR_PLANNED_CLASS = "tsg-chart-bar-planned";
  static readonly CHART_BAR_ACTUAL_CLASS = "tsg-chart-bar-actual";
}

export { TsGanttConst };
