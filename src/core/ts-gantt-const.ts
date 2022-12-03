export const TsGanttConst = {
  CSS_VAR_SEPARATOR_WIDTH: "--tsg-separator-width",
  CSS_VAR_HEADER_HEIGHT: "--tsg-header-height",
  CSS_VAR_ROW_HEIGHT: "--tsg-row-height",
  CSS_VAR_GRIDLINES_WIDTH: "--tsg-gridlines-width",
  CSS_VAR_BAR_STROKE_WIDTH: "--tsg-bar-stroke-width",

  EVENTS: {
    ROW_CLICK: "tsgrowclick",
    ROW_CONTEXT_MENU: "tsgrowcontextmenu",

    TABLE_COLUMN_REORDER: "tsgtablecolreorder",
    TABLE_BODY_CELL_EXPANDER_CLICK: "tsgexpanderclick",
    
    HANDLE_MOVE: "tsghandlemove",
    HANDLE_MOVE_END: "tsghandlemoveend",

    TASK_CHANGED_IN_CHART: "tsgtaskchangedinchart",
  },

  CLASSES: {

    ROOT: {
      TEXT_SELECTION_DISABLED: "tsg-no-text-selection",
      MAIN_ELEMENT: "tsg-wrapper",
      CHART_WRAPPER: "tsg-chart-wrapper",
      TABLE_WRAPPER: "tsg-table-wrapper",
      FOOTER: "tsg-footer",
      SEPARATOR: "tsg-separator",
      ROW_SELECTED: "selected",
    },

    CHART: {
      MAIN_ELEMENT: "tsg-chart",
      HEADER: "tsg-chart-header",
      HEADER_BACKGROUND: "tsg-chart-header-bg",
      HEADER_GRIDLINES: "tsg-chart-header-gl",
      HEADER_TEXT: "tsg-chart-header-text",
      BODY: "tsg-chart-body",
      BODY_BACKGROUND:  "tsg-chart-body-bg",
      BODY_GRIDLINES:  "tsg-chart-body-gl", 
      BODY_TODAY_LINE:  "tsg-chart-body-gl-today", 
      ROW_WRAPPER:  "tsg-chart-row-wrapper",
      ROW:  "tsg-chart-row",
      ROW_BACKGROUND:  "tsg-chart-row-bg",
      BAR: {
        GROUP:  "tsg-chart-bar-group",
        WRAPPER:  "tsg-chart-bar-wrapper",
        PLANNED:  "tsg-chart-bar-planned",
        PLANNED_PROGRESS:  "tsg-chart-bar-planned-progress",
        ACTUAL:  "tsg-chart-bar-actual",
        ACTUAL_PROGRESS:  "tsg-chart-bar-actual-progress",
        HANDLE_WRAPPER:  "tsg-chart-bar-handle-wrapper",
        HANDLE: "tsg-chart-bar-handle",
      },
    },

    TABLE: {
      MAIN_ELEMENT: "tsg-table",
      COLUMN_RESIZER: "tsg-table-col-resizer",
      HEADER: "tsg-table-header",
      BODY_ROW: "tsg-table-body-row",
      BODY_CELL: "tsg-table-body-cell",
      BODY_CELL_TEXT_WRAPPER: "tsg-table-body-cell-text-wrapper",
      BODY_CELL_TEXT: "tsg-table-body-cell-text",
      BODY_CELL_EXPANDER: "tsg-table-body-cell-text-expander", 
      BODY_CELL_EXPANDER_NESTING_PREFIX: "nesting-",
    },

  }
} as const;
