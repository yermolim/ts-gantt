class TsGanttConst {    
  static readonly SVG_NS = "http://www.w3.org/2000/svg";

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

  static readonly CELL_TEXT_WRAPPER_CLASS = "tsg-cell-text-wrapper";
  static readonly CELL_TEXT_CLASS = "tsg-cell-text";
  static readonly CELL_INDENT_CLASS = "tsg-cell-text-indent";
  static readonly CELL_EXPANDER_CLASS = "tsg-cell-text-expander";  
  static readonly CELL_EXPANDER_CLICK = "tsgexpanderclick";
  static readonly CELL_EXPANDER_SYMBOL = "◆";
  static readonly CELL_EXPANDER_EXPANDABLE_SYMBOL = "⬘";
  static readonly CELL_EXPANDER_EXPANDED_SYMBOL = "⬙";
}

export { TsGanttConst };
