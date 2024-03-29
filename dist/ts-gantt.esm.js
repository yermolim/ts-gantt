const styles = `
<style>
  :host {
    --tsg-table-min-width-final: var(--tsg-table-min-width, 100px);
    --tsg-chart-min-width-final: var(--tsg-chart-min-width, 100px);
    --tsg-nesting-indent-final: var(--tsg-nesting-indent, 20px);

    --tsg-background-color-final: var(--tsg-background-color, white);
    --tsg-foreground-color-final: var(--tsg-foreground-color, black);
    --tsg-separator-color-final: var(--tsg-separator-color, dimgray);
    --tsg-header-color-final: var(--tsg-header-color, ghostwhite);
    --tsg-border-color-final: var(--tsg-border-color, lightgray);
    --tsg-symbol-color-final: var(--tsg-symbol-color, dimgray);
    --tsg-selection-color-final: var(--tsg-selection-color, ghostwhite);
    --tsg-scrollbar-track-color-final: var(--tsg-scrollbar-track-color, #eeeeee);
    --tsg-scrollbar-thumb-color-final: var(--tsg-scrollbar-thumb-color, #b0b0b0);

    --tsg-not-started-fg-color-final: var(--tsg-not-started-fg-color, dimgray);
    --tsg-in-progress-fg-color-final: var(--tsg-in-progress-fg-color, black);
    --tsg-overdue-fg-color-final: var(--tsg-overdue-fg-color, darkred);
    --tsg-completed-fg-color-final: var(--tsg-completed-fg-color, darkgreen);
    --tsg-completed-late-fg-color-final: var(--tsg-completed-late-fg-color, sienna);

    --tsg-today-line-color-final: var(--tsg-today-line-color, orangered);
    --tsg-chart-bar-color-1-final: var(--tsg-chart-bar-color-1, skyblue);
    --tsg-chart-bar-color-2-final: var(--tsg-chart-bar-color-2, lightcoral);
    --tsg-chart-bar-accent-1-final: var(--tsg-chart-bar-accent-1, darkcyan);
    --tsg-chart-bar-accent-2-final: var(--tsg-chart-bar-accent-2, darkred);

    --tsg-font-family-final: var(--tsg-font-family, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif);
    --tsg-font-size-final: var(--tsg-font-size, 14px);
    --tsg-line-height-final: var(--tsg-line-height, 16px);
    --tsg-max-cell-text-lines-final: var(--tsg-max-cell-text-lines, 2);
  }

  .tsg-no-text-selection {  
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .tsg-wrapper {  
    position: relative;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: var(--tsg-background-color-final);
  }

  .tsg-wrapper * {
    box-sizing: border-box;
  }

  .tsg-separator {
    display: flex;
    flex: 0 0 auto;
    width: var(--tsg-separator-width);
    height: 100%;
    padding: 0;
    cursor: ew-resize;
    background-color: var(--tsg-separator-color-final);
  }

  .tsg-table-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: calc(50% - 5px);
    height: 100%;
    min-width: var(--tsg-table-min-width-final);
    overflow-y: auto;
    overflow-x: scroll;
  }

  .tsg-table {
    width: 100%;
    border-spacing: 0;
    font-family: var(--tsg-font-family-final);
    color: var(--tsg-foreground-color-final);
    table-layout: fixed;
  }

  .tsg-table-header {
    position: sticky;
    top: 0;
    padding: 5px;
    height: var(--tsg-header-height) !important;
    font-size: var(--tsg-font-size-final);
    border-width: var(--tsg-gridlines-width) var(--tsg-gridlines-width) var(--tsg-gridlines-width) 0;
    border-color: var(--tsg-border-color-final);
    border-style: solid;
    background-color: var(--tsg-header-color-final);
    z-index: 5;
  }
  .tsg-table-col-resizer {
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 100%;
    cursor: col-resize;
  }

  .tsg-table-body-row {
    height: var(--tsg-row-height) !important;
  }
  .tsg-table-body-row.selected {
    background-color: var(--tsg-selection-color-final);
  }
  .selected .tsg-table-body-cell {
    font-weight: bold;
  }
  .not-started .tsg-table-body-cell {
    color: var(--tsg-not-started-fg-color-final);
  }
  .in-progress .tsg-table-body-cell {
    color: var(--tsg-in-progress-fg-color-final);
  }
  .overdue .tsg-table-body-cell {
    color: var(--tsg-overdue-fg-color-final);
  }
  .completed .tsg-table-body-cell {
    color: var(--tsg-completed-fg-color-final);
  }
  .completed-late .tsg-table-body-cell {
    color: var(--tsg-completed-late-fg-color-final);
  }

  .tsg-table-body-cell {
    padding: 0;
    cursor: default;
    border-width: 0 var(--tsg-gridlines-width) var(--tsg-gridlines-width) 0;
    border-color: var(--tsg-border-color-final);
    border-style: solid;
  }

  .tsg-table-body-cell-text-wrapper {
    display: flex;
    align-items: center;
    height: calc(var(--tsg-row-height) - 2px);
    padding: 2px;
  }
  .tsg-table-body-cell-text-wrapper.start {
    justify-content: flex-start;
  }
  .tsg-table-body-cell-text-wrapper.center {
    justify-content: center;
  }
  .tsg-table-body-cell-text-wrapper.end {
    justify-content: flex-end;
  }

  .tsg-table-body-cell-text-expander {
    width: var(--tsg-nesting-indent-final) !important;
    min-width: var(--tsg-nesting-indent-final) !important;
    color: var(--tsg-symbol-color-final);
    text-align: center;
    cursor: pointer;
  }
  .tsg-table-body-cell-text-expander.nesting-1 {
    padding-left: var(--tsg-nesting-indent-final) !important;
    width: calc(var(--tsg-nesting-indent-final) * 2) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 2) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-2 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 2) !important;
    width: calc(var(--tsg-nesting-indent-final) * 3) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 3) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-3 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 3) !important;
    width: calc(var(--tsg-nesting-indent-final) * 4) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 4) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-4 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 4) !important;
    width: calc(var(--tsg-nesting-indent-final) * 5) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 5) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-5 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 5) !important;
    width: calc(var(--tsg-nesting-indent-final) * 6) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 6) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-6 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 6) !important;
    width: calc(var(--tsg-nesting-indent-final) * 7) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 7) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-7 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 7) !important;
    width: calc(var(--tsg-nesting-indent-final) * 8) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 8) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-8 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 8) !important;
    width: calc(var(--tsg-nesting-indent-final) * 9) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 9) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-9 {
    padding-left: calc(var(--tsg-nesting-indent-final) * 9) !important;
    width: calc(var(--tsg-nesting-indent-final) * 10) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 10) !important;
  }
  .tsg-table-body-cell-text-expander.nesting-max {
    padding-left: calc(var(--tsg-nesting-indent-final) * 10) !important;
    width: calc(var(--tsg-nesting-indent-final) * 11) !important;
    min-width: calc(var(--tsg-nesting-indent-final) * 11) !important;
  }

  .tsg-table-body-cell-text {
    position: relative;
    overflow: hidden;
    max-height: calc(var(--tsg-max-cell-text-lines-final) * var(--tsg-line-height-final));
    font-size: var(--tsg-font-size-final);
    line-height: var(--tsg-line-height-final);
    display: -webkit-box;
    -webkit-line-clamp: var(--tsg-max-cell-text-lines-final);
    -webkit-box-orient: vertical;
  }

  .tsg-chart-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;
    min-width: var(--tsg-chart-min-width-final);
    overflow-y: auto;
    overflow-x: scroll;
  }

  .tsg-chart {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  .tsg-chart-header {
    position: sticky;
    top: 0;
  }

  .tsg-chart-header-bg {
    fill: var(--tsg-header-color-final);
    stroke-width: var(--tsg-gridlines-width);
    stroke: var(--tsg-border-color-final);
  }

  .tsg-chart-header-text {
    font-family: var(--tsg-font-family-final);
    font-size: var(--tsg-font-size-final);
    font-weight: bold;
  }

  .tsg-chart-header-gl,
  .tsg-chart-body-gl {
    stroke-width: var(--tsg-gridlines-width);
    stroke: var(--tsg-border-color-final);
    shape-rendering: crispEdges;
  }
  .tsg-chart-body-gl-today {
    stroke-width: calc(var(--tsg-gridlines-width) + 2px);
    stroke: var(--tsg-today-line-color-final);
  }

  .tsg-chart-body-bg {
    fill: transparent;
  }

  .tsg-chart-row-bg {
    fill: var(--tsg-background-color-final);
  }
  .tsg-chart-row-bg.selected {
    fill: var(--tsg-selection-color-final);
  }

  .tsg-chart-row {
    fill: transparent;
  }

  .tsg-chart-bar-planned {
    fill: var(--tsg-chart-bar-color-1-final);
    stroke: var(--tsg-chart-bar-color-1-final);
    stroke-width: var(--tsg-bar-stroke-width);
  }
  .selected .tsg-chart-bar-planned {
    stroke: var(--tsg-chart-bar-accent-1-final);
  }
  .tsg-chart-bar-planned-progress {
    fill: var(--tsg-chart-bar-accent-1-final);
    stroke: var(--tsg-chart-bar-accent-1-final);
    stroke-width: var(--tsg-bar-stroke-width);
  }

  .tsg-chart-bar-actual {
    fill: var(--tsg-chart-bar-color-2-final);
    stroke: var(--tsg-chart-bar-color-2-final);
    stroke-width: var(--tsg-bar-stroke-width);
  }
  .selected .tsg-chart-bar-actual {
    stroke: var(--tsg-chart-bar-accent-2-final);
  }
  .tsg-chart-bar-actual-progress {
    fill: var(--tsg-chart-bar-accent-2-final);
    stroke: var(--tsg-chart-bar-accent-2-final);
    stroke-width: var(--tsg-bar-stroke-width);
  }

  .tsg-chart-bar-handle {
    fill: var(--tsg-symbol-color-final);
    cursor: ew-resize;
  }

  .tsg-table-wrapper::-webkit-scrollbar { 
    width: 0;
    height: 15px;
  }
  .tsg-chart-wrapper::-webkit-scrollbar { 
    width: 15px;
    height: 15px;
  }
  .tsg-table-wrapper::-webkit-scrollbar-track,
  .tsg-chart-wrapper::-webkit-scrollbar-track {
    border-radius: 0;
    background: var(--tsg-scrollbar-track-color-final);
  }
  .tsg-table-wrapper::-webkit-scrollbar-thumb,
  .tsg-chart-wrapper::-webkit-scrollbar-thumb {
    border-radius: 0;
    background: var(--tsg-scrollbar-thumb-color-final);
  }
</style>
`;

const TsGanttConst = {
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
            BODY_BACKGROUND: "tsg-chart-body-bg",
            BODY_GRIDLINES: "tsg-chart-body-gl",
            BODY_TODAY_LINE: "tsg-chart-body-gl-today",
            ROW_WRAPPER: "tsg-chart-row-wrapper",
            ROW: "tsg-chart-row",
            ROW_BACKGROUND: "tsg-chart-row-bg",
            BAR: {
                GROUP: "tsg-chart-bar-group",
                WRAPPER: "tsg-chart-bar-wrapper",
                PLANNED: "tsg-chart-bar-planned",
                PLANNED_PROGRESS: "tsg-chart-bar-planned-progress",
                ACTUAL: "tsg-chart-bar-actual",
                ACTUAL_PROGRESS: "tsg-chart-bar-actual-progress",
                HANDLE_WRAPPER: "tsg-chart-bar-handle-wrapper",
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
};

class TsGanttOptions {
    get dayWidthPx() {
        return this.chartDayWidthPx[this.chartScale];
    }
    constructor(item = null) {
        this.bindParentDatesToChild = false;
        this.enableChartEdit = false;
        this.multilineSelection = true;
        this.useCtrlKeyForMultilineSelection = true;
        this.drawTodayLine = true;
        this.highlightRowsDependingOnTaskState = true;
        this.columnsMinWidthPx = [200, 100, 100, 100, 100, 100, 100, 100];
        this.columnsContentAlign = ["start", "end", "center", "center", "center", "center", "center", "center"];
        this.separatorWidthPx = 5;
        this.headerHeightPx = 90;
        this.rowHeightPx = 40;
        this.borderWidthPx = 1;
        this.barStrokeWidthPx = 2;
        this.barMarginPx = 2;
        this.barCornerRadiusPx = 6;
        this.rowSymbols = {
            childless: "•",
            collapsed: "▾",
            expanded: "▴",
        };
        this.chartShowProgress = true;
        this.chartDisplayMode = "both";
        this.chartScale = "month";
        this.chartDateOffsetDays = {
            "day": 14,
            "week": 60,
            "month": 240,
            "year": 730,
        };
        this.chartDateOffsetDaysMin = {
            "day": 7,
            "week": 30,
            "month": 120,
            "year": 365,
        };
        this.chartDayWidthPx = {
            "day": 60,
            "week": 20,
            "month": 3,
            "year": 1,
        };
        this.locale = "en";
        this.localeDecimalSeparator = {
            en: ".",
            uk: ",",
            ru: ",",
            ja: ".",
        };
        this.localeDateFormat = {
            en: "MM/DD/YYYY",
            uk: "DD.MM.YYYY",
            ru: "DD.MM.YYYY",
            ja: "YYYY/MM/DD",
        };
        this.localeFirstWeekDay = {
            en: 0,
            uk: 1,
            ru: 1,
            ja: 0,
        };
        this.localeDateMonths = {
            en: ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"],
            uk: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
                "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
            ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            ja: ["1月", "2月", "3月", "4月", "5月", "6月",
                "7月", "8月", "9月", "10月", "11月", "12月"],
        };
        this.localeDateDays = {
            en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            uk: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
            ru: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
            ja: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
        };
        this.localeDateDaysShort = {
            en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            uk: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            ru: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            ja: ["日", "月", "火", "水", "木", "金", "土"],
        };
        this.localeDateScale = {
            en: ["Weeks", "Months", "Years"],
            uk: ["Тижні", "Місяці", "Роки"],
            ru: ["Недели", "Месяцы", "Годы"],
            ja: ["週間", "月間", "年間"],
        };
        this.localeFooters = {
            en: ["Total tasks", "Completed"],
            uk: ["Всього задач", "Завершено"],
            ru: ["Всего задач", "Завершено"],
            ja: ["総タスク", "完了"],
        };
        this.localeHeaders = {
            en: ["Name", "Progress", "Start date planned", "End date planned",
                "Start date actual", "End date actual", "Duration planned", "Duration actual"],
            uk: ["Ім'я", "Прогрес", "Дата початку планована", "Дата завершення планована",
                "Дата початку фактична", "Дата завершення фактична", "Тривалість планована", "Тривалість фактична"],
            ru: ["Имя", "Прогресс", "Дата начала планируемая", "Дата окончания планируемая",
                "Дата начала фактическая", "Дата окончания фактическая", "Длительность планируемая", "Длительность фактическая"],
            ja: ["タイトル", "進捗", "予定開始日", "予定終了日",
                "実績開始日", "実績終了日", "予定日数", "実績日数"],
        };
        this.localeDurationFormatters = {
            en: (duration) => duration === 1 ? "1 day" : duration + " days",
            uk: (duration) => {
                let d = duration % 100;
                if (d > 10 && d < 20) {
                    return duration + " днів";
                }
                else {
                    d = d % 10;
                    if (d === 1) {
                        return duration + " день";
                    }
                    else if (d < 5 && d > 0) {
                        return duration + " дні";
                    }
                    else {
                        return duration + " днів";
                    }
                }
            },
            ru: (duration) => {
                let d = duration % 100;
                if (d > 10 && d < 20) {
                    return duration + " дней";
                }
                else {
                    d = d % 10;
                    if (d === 1) {
                        return duration + " день";
                    }
                    else if (d < 5 && d > 0) {
                        return duration + " дня";
                    }
                    else {
                        return duration + " дней";
                    }
                }
            },
            ja: (duration) => duration === 1 ? "1 日" : duration + " 日間",
        };
        this.columnValueGetters = [
            (task) => task.localizedNames && task.localizedNames[this.locale] || task.name,
            (task) => (+task.progress.toFixed(2)).toLocaleString("en-US")
                .replace(".", this.localeDecimalSeparator[this.locale] || ".") + " %",
            (task) => task.datePlannedStart
                ? task.datePlannedStart.format(this.localeDateFormat[this.locale] || "L")
                : "",
            (task) => task.datePlannedEnd
                ? task.datePlannedEnd.format(this.localeDateFormat[this.locale] || "L")
                : "",
            (task) => task.dateActualStart
                ? task.dateActualStart.format(this.localeDateFormat[this.locale] || "L")
                : "",
            (task) => task.dateActualEnd
                ? task.dateActualEnd.format(this.localeDateFormat[this.locale] || "L")
                : "",
            (task) => {
                if (!task.datePlannedEnd || !task.datePlannedStart) {
                    return "";
                }
                const end = task.datePlannedEnd;
                const start = task.datePlannedStart;
                const duration = end.diff(start, "day") + 1;
                return this.localeDurationFormatters[this.locale]
                    ? this.localeDurationFormatters[this.locale](duration)
                    : duration.toString();
            },
            (task) => {
                if (!task.dateActualEnd || !task.dateActualStart) {
                    return "";
                }
                const end = task.dateActualEnd;
                const start = task.dateActualStart;
                const duration = end.diff(start, "day") + 1;
                return this.localeDurationFormatters[this.locale]
                    ? this.localeDurationFormatters[this.locale](duration)
                    : duration.toString();
            },
        ];
        if (item != null) {
            Object.assign(this, item);
        }
    }
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var dayjs_min = {exports: {}};

(function (module, exports) {
	!function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return "["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p=function(t){return t instanceof _},S=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else {var a=e.name;D[a]=e,i=a;}return !r&&i&&(g=i),i||!r&&g},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=v;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===l)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),l=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(h){case c:return r?l(1,0):l(31,11);case f:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),l=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,l=this;r=Number(r);var $=O.p(h),y=function(t){var e=w(l);return O.w(e.date(e.date()+Math.round(t*r)),l)};if($===f)return this.set(f,this.$M+r);if($===c)return this.set(c,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},$={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||$[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,v=this-M,g=O.m(this,M);return g=($={},$[c]=g/12,$[f]=g,$[h]=g/3,$[o]=(v-m)/6048e5,$[a]=(v-m)/864e5,$[u]=v/n,$[s]=v/e,$[i]=v/t,$)[y]||v,l?g:O.a(g)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),T=_.prototype;return w.prototype=T,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){T[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=D[g],w.Ls=D,w.p={},w}));
} (dayjs_min));

var dayjs = dayjs_min.exports;

function getRandomUuid() {
    return crypto.getRandomValues(new Uint32Array(4)).join("-");
}
function compareTwoStringSets(setA, setB) {
    if (setA.size !== setB.size) {
        return false;
    }
    const commonSet = new Set([...setA, ...setB]);
    return setA.size === commonSet.size;
}
function createSvgElement(elementTag, classList = [], attributes = [], parent = null, innerHtml = null) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", elementTag);
    for (const attribute of attributes) {
        element.setAttribute(attribute[0], attribute[1]);
    }
    if (classList.length !== 0) {
        element.classList.add(...classList);
    }
    if (innerHtml) {
        element.innerHTML = innerHtml;
    }
    if (parent) {
        parent.append(element);
    }
    return element;
}
function getAllDatesBetweenTwoDates(start, end) {
    const dateStart = start.startOf("day");
    const dateEnd = end.startOf("day");
    if (!dateStart || !dateEnd || dateEnd.diff(dateStart) < 0) {
        return [];
    }
    if (dateEnd.diff(dateStart) === 0) {
        return [dateStart];
    }
    const dates = [];
    let currentDate = dateStart;
    while (currentDate.isBefore(dateEnd) || currentDate.isSame(dateEnd)) {
        dates.push(currentDate);
        currentDate = currentDate.add(1, "day");
    }
    return dates;
}

class TsGanttTask {
    constructor(source, id, parentId, name, localizedNames, progress, datePlannedStart, datePlannedEnd, dateActualStart, dateActualEnd, nestingLvl, hasChildren, parentUuid, uuid, shown, expanded) {
        Object.assign(this, source !== null && source !== void 0 ? source : {});
        if (arguments.length < 2) {
            return;
        }
        this.externalId = id;
        this.parentExternalId = parentId;
        this.uuid = uuid || getRandomUuid();
        this.parentUuid = parentUuid;
        this.nestingLvl = nestingLvl !== null && nestingLvl !== void 0 ? nestingLvl : 0;
        this.hasChildren = hasChildren !== null && hasChildren !== void 0 ? hasChildren : false;
        this.name = name;
        this.localizedNames = localizedNames;
        this.datePlannedStart = datePlannedStart ? dayjs(datePlannedStart) : null;
        this.datePlannedEnd = datePlannedEnd ? dayjs(datePlannedEnd) : null;
        this.dateActualStart = dateActualStart ? dayjs(dateActualStart) : null;
        this.dateActualEnd = dateActualEnd ? dayjs(dateActualEnd) : null;
        this.progress = (!progress || progress < 0) ? 0 : progress > 100 ? 100 : progress;
        this.shown = shown !== null && shown !== void 0 ? shown : false;
        this.expanded = expanded !== null && expanded !== void 0 ? expanded : false;
    }
    static convertModelsToTasks(taskModels, idMap = new Map()) {
        const models = taskModels.slice();
        const allParentIds = new Set(models.map(x => x.parentId));
        const tasks = [];
        let currentLevelTasks = [];
        for (let i = models.length - 1; i >= 0; i--) {
            const model = models[i];
            if (!model.parentId) {
                const newTask = new TsGanttTask(model, model.id, model.parentId, model.name, model.localizedNames, model.progress, model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd, 0, allParentIds.has(model.id), null, idMap.get(model.id));
                tasks.push(newTask);
                currentLevelTasks.push(newTask);
                models.splice(i, 1);
            }
        }
        let currentNestingLvl = 1;
        while (currentLevelTasks.length !== 0) {
            const nextLevelTasks = [];
            currentLevelTasks.filter(x => x.hasChildren).forEach(task => {
                for (let i = models.length - 1; i >= 0; i--) {
                    const model = models[i];
                    if (model.parentId === task.externalId) {
                        const newTask = new TsGanttTask(model, model.id, model.parentId, model.name, model.localizedNames, model.progress, model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd, currentNestingLvl, allParentIds.has(model.id), task.uuid, idMap.get(model.id));
                        tasks.push(newTask);
                        nextLevelTasks.push(newTask);
                        models.splice(i, 1);
                    }
                }
            });
            currentLevelTasks = nextLevelTasks;
            currentNestingLvl++;
        }
        return tasks;
    }
    static detectTaskChanges(data) {
        const { oldTasks, newTasks } = data;
        const oldTaskByUuid = new Map();
        oldTasks.forEach(task => {
            oldTaskByUuid.set(task.uuid, task);
        });
        const newUuids = new Set();
        newTasks.forEach(task => {
            newUuids.add(task.uuid);
        });
        const deleted = oldTasks.filter(x => !newUuids.has(x.uuid));
        const added = [];
        const changed = [];
        const all = [];
        for (const newTask of newTasks) {
            if (!oldTaskByUuid.has(newTask.uuid)) {
                added.push(newTask);
                all.push(newTask);
                continue;
            }
            const oldTask = oldTaskByUuid.get(newTask.uuid);
            if (!newTask.equals(oldTask)) {
                changed.push(newTask);
                all.push(newTask);
            }
            else {
                all.push(oldTask);
            }
        }
        return { deleted, added, changed, all };
    }
    static createTasksIdMap(tasks) {
        const idsMap = new Map();
        for (const task of tasks) {
            if (!idsMap.has(task.externalId)) {
                idsMap.set(task.externalId, task.uuid);
            }
        }
        return idsMap;
    }
    static checkPaternity(tasks, parent, child) {
        var _a;
        let parentUuid = child.parentUuid;
        while (parentUuid) {
            if (parentUuid === parent.uuid) {
                return true;
            }
            parentUuid = (_a = tasks.find(x => x.uuid === parentUuid)) === null || _a === void 0 ? void 0 : _a.parentUuid;
        }
        return false;
    }
    static checkForCollapsedParent(tasks, task) {
        while (task.parentUuid) {
            task = tasks.find(x => x.uuid === task.parentUuid);
            if (!task.expanded) {
                return true;
            }
        }
        return false;
    }
    static sortTasksRecursively(tasks, parentUuid) {
        const tasksFiltered = tasks.filter(x => x.parentUuid === parentUuid)
            .sort(TsGanttTask.defaultComparer);
        const sorted = [];
        for (const task of tasksFiltered) {
            sorted.push(task);
            sorted.push(...this.sortTasksRecursively(tasks, task.uuid));
        }
        return sorted;
    }
    static getMinMaxDates(tasks) {
        let minDate = dayjs();
        let maxDate = dayjs();
        for (const task of tasks) {
            const plannedStart = dayjs(task.datePlannedStart);
            const plannedEnd = dayjs(task.datePlannedEnd);
            const actualStart = task.dateActualStart ? dayjs(task.dateActualStart) : null;
            const actualEnd = task.dateActualEnd ? dayjs(task.dateActualEnd) : null;
            if (plannedStart.isBefore(minDate)) {
                minDate = plannedStart;
            }
            if (plannedEnd.isAfter(maxDate)) {
                maxDate = plannedEnd;
            }
            if (actualStart && actualStart.isBefore(minDate)) {
                minDate = actualStart;
            }
            if (actualEnd && actualEnd.isAfter(maxDate)) {
                maxDate = actualEnd;
            }
        }
        return { minDate, maxDate };
    }
    equals(another) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return this.externalId === another.externalId
            && this.parentExternalId === another.parentExternalId
            && this.nestingLvl === another.nestingLvl
            && this.hasChildren === another.hasChildren
            && this.name === another.name
            && this.progress === another.progress
            && ((_a = this.datePlannedStart) === null || _a === void 0 ? void 0 : _a.unix()) === ((_b = another.datePlannedStart) === null || _b === void 0 ? void 0 : _b.unix())
            && ((_c = this.datePlannedEnd) === null || _c === void 0 ? void 0 : _c.unix()) === ((_d = another.datePlannedEnd) === null || _d === void 0 ? void 0 : _d.unix())
            && ((_e = this.dateActualStart) === null || _e === void 0 ? void 0 : _e.unix()) === ((_f = another.dateActualStart) === null || _f === void 0 ? void 0 : _f.unix())
            && ((_g = this.dateActualEnd) === null || _g === void 0 ? void 0 : _g.unix()) === ((_h = another.dateActualEnd) === null || _h === void 0 ? void 0 : _h.unix());
    }
    compareTo(another) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        if (this.nestingLvl > another.nestingLvl) {
            return 1;
        }
        if (this.nestingLvl < another.nestingLvl) {
            return -1;
        }
        if ((((_a = this.datePlannedStart) === null || _a === void 0 ? void 0 : _a.unix()) || 0) > (((_b = another.datePlannedStart) === null || _b === void 0 ? void 0 : _b.unix()) || 0)) {
            return 1;
        }
        if ((((_c = this.datePlannedStart) === null || _c === void 0 ? void 0 : _c.unix()) || 0) < ((_d = another.datePlannedStart) === null || _d === void 0 ? void 0 : _d.unix()) || 0) {
            return -1;
        }
        if ((((_e = this.datePlannedEnd) === null || _e === void 0 ? void 0 : _e.unix()) || 0) > (((_f = another.datePlannedEnd) === null || _f === void 0 ? void 0 : _f.unix()) || 0)) {
            return 1;
        }
        if ((((_g = this.datePlannedEnd) === null || _g === void 0 ? void 0 : _g.unix()) || 0) < (((_h = another.datePlannedEnd) === null || _h === void 0 ? void 0 : _h.unix()) || 0)) {
            return -1;
        }
        if ((((_j = this.dateActualStart) === null || _j === void 0 ? void 0 : _j.unix()) || 0) > (((_k = another.dateActualStart) === null || _k === void 0 ? void 0 : _k.unix()) || 0)) {
            return 1;
        }
        if ((((_l = this.dateActualStart) === null || _l === void 0 ? void 0 : _l.unix()) || 0) < (((_m = another.dateActualStart) === null || _m === void 0 ? void 0 : _m.unix()) || 0)) {
            return -1;
        }
        if ((((_o = this.dateActualEnd) === null || _o === void 0 ? void 0 : _o.unix()) || 0) > (((_p = another.dateActualEnd) === null || _p === void 0 ? void 0 : _p.unix()) || 0)) {
            return 1;
        }
        if ((((_q = this.dateActualEnd) === null || _q === void 0 ? void 0 : _q.unix()) || 0) < (((_r = another.dateActualEnd) === null || _r === void 0 ? void 0 : _r.unix()) || 0)) {
            return -1;
        }
        return this.name.localeCompare(another.name);
    }
    getState() {
        if (this.progress === 0) {
            return "not-started";
        }
        if (this.progress === 100) {
            if (this.datePlannedEnd) {
                if ((this.dateActualEnd && this.dateActualEnd.isAfter(this.datePlannedEnd))
                    || (this.dateActualStart && this.dateActualStart.isAfter(this.datePlannedEnd))) {
                    return "completed-late";
                }
            }
            return "completed";
        }
        if (this.datePlannedEnd && this.datePlannedEnd.isBefore(dayjs().startOf("day"))) {
            return "overdue";
        }
        return "in-progress";
    }
    toModel() {
        var _a, _b, _c, _d;
        const model = {};
        Object.assign(model, this);
        model.id = this.externalId;
        model.parentId = this.parentExternalId;
        model.name = this.name;
        model.progress = this.progress;
        model.datePlannedStart = ((_a = this.datePlannedStart) === null || _a === void 0 ? void 0 : _a.toDate()) || null;
        model.datePlannedEnd = ((_b = this.datePlannedEnd) === null || _b === void 0 ? void 0 : _b.toDate()) || null;
        model.dateActualStart = ((_c = this.dateActualStart) === null || _c === void 0 ? void 0 : _c.toDate()) || null;
        model.dateActualEnd = ((_d = this.dateActualEnd) === null || _d === void 0 ? void 0 : _d.toDate()) || null;
        model.localizedNames = this.localizedNames;
        return model;
    }
    toggleExpanded() {
        this.expanded = !this.expanded;
    }
    getMinMaxDates(chartBarMode) {
        const { datePlannedStart, datePlannedEnd, dateActualStart, dateActualEnd } = this;
        const plannedDatesSet = datePlannedStart && datePlannedEnd;
        const actualDatesSet = dateActualStart && dateActualEnd;
        let minDate;
        let maxDate;
        if (chartBarMode === "both") {
            if (actualDatesSet || plannedDatesSet) {
                if (actualDatesSet && plannedDatesSet) {
                    minDate = datePlannedStart.isBefore(dateActualStart) ? datePlannedStart : dateActualStart;
                    maxDate = datePlannedEnd.isAfter(dateActualEnd) ? datePlannedEnd : dateActualEnd;
                }
                else if (plannedDatesSet) {
                    minDate = datePlannedStart;
                    maxDate = datePlannedEnd;
                }
                else {
                    minDate = dateActualStart;
                    maxDate = dateActualEnd;
                }
            }
        }
        else if (chartBarMode === "planned" && plannedDatesSet) {
            minDate = datePlannedStart;
            maxDate = datePlannedEnd;
        }
        else if (chartBarMode === "actual" && actualDatesSet) {
            minDate = dateActualStart;
            maxDate = dateActualEnd;
        }
        return { minDate, maxDate };
    }
    getHorizontalOffsetPx(chartBarMode, chartMinDate, dayWidthPx) {
        const { minDate: taskMinDate } = this.getMinMaxDates(chartBarMode);
        if (!taskMinDate) {
            return null;
        }
        const offsetX = taskMinDate.diff(chartMinDate, "day") * dayWidthPx;
        return offsetX;
    }
    updateParents() {
    }
    applyChangesFrom(source) {
        this.datePlannedStart = source.datePlannedStart;
        this.datePlannedEnd = source.datePlannedEnd;
        this.dateActualStart = source.dateActualStart;
        this.dateActualEnd = source.dateActualEnd;
        this.progress = source.progress;
    }
    clone() {
        return new TsGanttTask(this);
    }
}
TsGanttTask.defaultComparer = (a, b) => a.compareTo(b);

class TsGanttData {
    get options() {
        return this._options;
    }
    get dateMinOffset() {
        return this._dateMinOffset;
    }
    get dateMaxOffset() {
        return this._dateMaxOffset;
    }
    get tasks() {
        return this._tasks;
    }
    get models() {
        return this._tasks.map(x => x.toModel());
    }
    get selectedTasks() {
        return this._selectedTasks;
    }
    get selectedModels() {
        return this._selectedTasks.map(x => x.toModel());
    }
    constructor(options) {
        this._tasks = [];
        this._taskByUuid = new Map();
        this._tasksByParentUuid = new Map();
        this._selectedTasks = [];
        this._options = options;
    }
    getTaskByUuid(uuid) {
        return this._taskByUuid.get(uuid);
    }
    getAllTasksAsChanged() {
        const minMaxDatesUpdated = this.updateMinMaxDates();
        return {
            deleted: [],
            added: [],
            changed: this._tasks,
            all: this._tasks,
            datesChanged: minMaxDatesUpdated,
        };
    }
    getShownTaskUuidsRecursively(parentUuid = null) {
        const tasks = this._tasksByParentUuid.get(parentUuid) || [];
        const uuids = [];
        for (const task of tasks) {
            uuids.push(task.uuid);
            if (task.expanded) {
                uuids.push(...this.getShownTaskUuidsRecursively(task.uuid));
            }
        }
        return uuids;
    }
    updateTasks(taskModels) {
        const oldTasks = this._tasks;
        const oldTasksIdMap = TsGanttTask.createTasksIdMap(oldTasks);
        const newTasks = TsGanttTask.convertModelsToTasks(taskModels, oldTasksIdMap);
        const changes = TsGanttTask.detectTaskChanges({ oldTasks, newTasks });
        this.updateInternalTaskCollections(changes.all);
        this.groupAndSortTasks();
        const datesChanged = this.updateMinMaxDates();
        return Object.assign({}, changes, { datesChanged });
    }
    updateSingleTask(updatedTask) {
        const currentTask = this._taskByUuid.get(updatedTask.uuid);
        if (!currentTask) {
            return {
                deleted: [],
                added: [],
                changed: [],
                all: this._tasks,
                datesChanged: false,
            };
        }
        currentTask.applyChangesFrom(updatedTask);
        if (this.options.bindParentDatesToChild) ;
        return {
            deleted: [],
            added: [],
            changed: [currentTask],
            all: this._tasks,
            datesChanged: this.updateMinMaxDates(),
        };
    }
    expandAllTasks(state) {
        for (const task of this._tasks) {
            task.expanded = state;
            if (task.parentUuid) {
                task.shown = state;
            }
        }
    }
    updateSelectedTasks(tasks) {
        let newSelectedTasks;
        if ((tasks === null || tasks === void 0 ? void 0 : tasks.length) && !(tasks[0] instanceof TsGanttTask)) {
            const ids = new Set(tasks.map(x => x.id));
            newSelectedTasks = this._tasks.filter(x => ids.has(x.externalId));
        }
        else {
            newSelectedTasks = tasks || [];
        }
        const oldSelectedTasks = this._selectedTasks;
        const selectionEmpty = oldSelectedTasks.length === 0 && newSelectedTasks.length === 0;
        if (selectionEmpty) {
            return null;
        }
        const oldUuids = oldSelectedTasks.map(x => x.uuid);
        const newUuids = newSelectedTasks.map(x => x.uuid);
        const selectionNotChanged = compareTwoStringSets(new Set(oldUuids), new Set(newUuids));
        if (selectionNotChanged) {
            return {
                selected: newUuids,
                selectedTasks: newSelectedTasks,
                deselected: [],
                deselectedTasks: [],
                changed: false,
            };
        }
        this._selectedTasks = newSelectedTasks;
        const deselectedTasks = oldSelectedTasks.filter(x => !newUuids.includes(x.uuid));
        const deselectedUuids = deselectedTasks.map(x => x.uuid);
        return {
            selected: newUuids,
            selectedTasks: newSelectedTasks,
            deselected: deselectedUuids,
            deselectedTasks,
            changed: true,
        };
    }
    refreshSelectedTasks() {
        const tasks = this._selectedTasks.filter(x => !TsGanttTask.checkForCollapsedParent(this._tasks, x));
        return this.updateSelectedTasks(tasks);
    }
    toggleTaskSelection(task, ctrl) {
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
            }
            else {
                selectedTasks.splice(selectedTasks.findIndex(x => x === task), 1);
            }
        }
        else {
            selectedTasks.push(task);
        }
        return this.updateSelectedTasks(selectedTasks);
    }
    updateInternalTaskCollections(tasks) {
        this._tasks = [...tasks];
        this._taskByUuid = new Map();
        for (const task of tasks) {
            this._taskByUuid.set(task.uuid, task);
        }
    }
    groupAndSortTasks() {
        this._tasksByParentUuid.clear();
        for (const task of this._tasks) {
            if (this._tasksByParentUuid.has(task.parentUuid)) {
                this._tasksByParentUuid.get(task.parentUuid).push(task);
            }
            else {
                this._tasksByParentUuid.set(task.parentUuid, [task]);
            }
        }
        this._tasksByParentUuid.forEach((v) => v.sort(this._options.taskComparer || TsGanttTask.defaultComparer));
    }
    updateMinMaxDates() {
        const tasks = this._tasks;
        const currentDateMin = this._dateMinOffset;
        const currentDateMax = this._dateMaxOffset;
        const chartScale = this._options.chartScale;
        const dateOffsetMin = this._options.chartDateOffsetDaysMin[chartScale];
        const dateOffset = this._options.chartDateOffsetDays[chartScale];
        const { minDate, maxDate } = TsGanttTask.getMinMaxDates(tasks);
        if (!currentDateMin
            || currentDateMin.isAfter(minDate)
            || minDate.diff(currentDateMin, "day") < dateOffsetMin) {
            this._dateMinOffset = minDate.subtract(dateOffset, "day");
        }
        if (!currentDateMax
            || currentDateMax.isBefore(maxDate)
            || currentDateMax.diff(maxDate, "day") < dateOffsetMin) {
            this._dateMaxOffset = maxDate.add(dateOffset, "day");
        }
        return this._dateMinOffset !== currentDateMin || this._dateMaxOffset !== currentDateMax;
    }
}

class TsGanttTableColumnDescriptor {
    static buildFromGanttOptions(options, order) {
        const descriptors = [];
        let currentOrder = 0;
        for (const i of order) {
            const minColumnWidth = options.columnsMinWidthPx[i];
            if (!minColumnWidth) {
                continue;
            }
            const columnOptions = Object.assign(new TsGanttTableColumnDescriptor(), {
                minWidth: minColumnWidth,
                order: currentOrder++,
                header: options.localeHeaders[options.locale][i] || "",
                textAlign: options.columnsContentAlign[i],
                valueGetter: options.columnValueGetters[i] || ((task) => ""),
            });
            descriptors.push(columnOptions);
        }
        return descriptors;
    }
}

class TsGanttTableColumnOrder {
    constructor(length) {
        this._columnOrder = Array.from(new Array(length).keys());
    }
    move(from, to) {
        this._columnOrder.splice(to, 0, this._columnOrder.splice(from, 1)[0]);
    }
    *[Symbol.iterator]() {
        for (const columnIndex of this._columnOrder) {
            yield columnIndex;
        }
    }
}

class TsGanttHtmlComponentBase {
    destroy() {
        this._html.remove();
    }
    appendTo(parent) {
        parent.append(this._html);
    }
}

class TsGanttTableDataCell extends TsGanttHtmlComponentBase {
    constructor(value, alignment, expander) {
        super();
        this._html = this.createElement(value, alignment, expander);
    }
    createElement(value, alignment, expander) {
        const cellElement = document.createElement("td");
        cellElement.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL);
        const cellInnerDiv = document.createElement("div");
        cellInnerDiv.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL_TEXT_WRAPPER, alignment);
        expander === null || expander === void 0 ? void 0 : expander.appendTo(cellInnerDiv);
        const cellText = document.createElement("p");
        cellText.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL_TEXT);
        cellText.innerHTML = value;
        cellInnerDiv.append(cellText);
        cellElement.append(cellInnerDiv);
        return cellElement;
    }
}

class TsGanttTableExpander extends TsGanttHtmlComponentBase {
    constructor(options, task) {
        super();
        this._options = options;
        this._task = task;
        this._html = this.createElement();
    }
    updateSymbol() {
        const task = this._task;
        const symbols = this._options.rowSymbols;
        if (!task.hasChildren) {
            this._html.innerHTML = symbols.childless;
        }
        else if (task.expanded) {
            this._html.innerHTML = symbols.expanded;
        }
        else {
            this._html.innerHTML = symbols.collapsed;
        }
    }
    createElement() {
        const task = this._task;
        const expanderElement = document.createElement("p");
        expanderElement.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL_EXPANDER);
        const lvl = task.nestingLvl;
        if (lvl) {
            expanderElement.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL_EXPANDER_NESTING_PREFIX +
                (lvl < 10 ? lvl : 10));
        }
        if (task.hasChildren) {
            expanderElement.addEventListener("click", (e) => {
                expanderElement.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.TABLE_BODY_CELL_EXPANDER_CLICK, {
                    bubbles: true,
                    composed: true,
                    detail: { task, event: e },
                }));
            });
        }
        return expanderElement;
    }
}

class TsGanttTableDataRow extends TsGanttHtmlComponentBase {
    constructor(options, task, columns) {
        super();
        this._task = task;
        this._expander = new TsGanttTableExpander(options, task);
        this._html = this.createElement(columns, options.highlightRowsDependingOnTaskState);
    }
    appendTo(parent) {
        this._expander.updateSymbol();
        super.appendTo(parent);
    }
    select() {
        this._html.classList.add(TsGanttConst.CLASSES.ROOT.ROW_SELECTED);
    }
    deselect() {
        this._html.classList.remove(TsGanttConst.CLASSES.ROOT.ROW_SELECTED);
    }
    createElement(columns, addStateClass) {
        const task = this._task;
        const row = document.createElement("tr");
        row.classList.add(TsGanttConst.CLASSES.TABLE.BODY_ROW);
        row.addEventListener("click", (e) => {
            const target = e.target;
            if (!target.classList.contains(TsGanttConst.CLASSES.TABLE.BODY_CELL_EXPANDER)) {
                row.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.ROW_CLICK, {
                    bubbles: true,
                    composed: true,
                    detail: { task, event: e },
                }));
            }
        });
        row.addEventListener("contextmenu", (e) => {
            const target = e.target;
            if (!target.classList.contains(TsGanttConst.CLASSES.TABLE.BODY_CELL_EXPANDER)) {
                row.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.ROW_CONTEXT_MENU, {
                    bubbles: true,
                    composed: true,
                    detail: { task, event: e },
                }));
            }
        });
        if (addStateClass) {
            row.classList.add(task.getState());
        }
        columns.forEach((column, i) => {
            const taskValue = column.valueGetter(task);
            const cell = new TsGanttTableDataCell(taskValue, column.textAlign, i === 0 ? this._expander : null);
            cell.appendTo(row);
        });
        return row;
    }
}

const TABLE_COLUMN_DATA_ORDER = "tsgColOrder";
const TABLE_COLUMN_REORDER_DATA = "application/tsg-col-order";
class TsGanttTableHeaderCell extends TsGanttHtmlComponentBase {
    constructor(columnDescriptor) {
        super();
        this._dragActive = false;
        this.onPointerDownOnResizer = (e) => {
            if (!e.isPrimary || e.button === 2) {
                return;
            }
            const target = e.target;
            target.addEventListener("pointermove", this.onPointerMoveWhileResizing);
            target.addEventListener("pointerup", this.onPointerUpWhileResizing);
            target.addEventListener("pointerout", this.onPointerUpWhileResizing);
            target.setPointerCapture(e.pointerId);
            this._dragActive = true;
        };
        this.onPointerMoveWhileResizing = (e) => {
            if (!e.isPrimary || !this._dragActive) {
                return false;
            }
            const headerOffset = this._html.getBoundingClientRect().left;
            const userDefinedWidth = e.clientX - headerOffset;
            this._html.style.width = Math.max(this._columnDescriptor.minWidth, userDefinedWidth) + "px";
            e.preventDefault();
        };
        this.onPointerUpWhileResizing = (e) => {
            if (!e.isPrimary) {
                return;
            }
            const target = e.target;
            target.removeEventListener("pointermove", this.onPointerMoveWhileResizing);
            target.removeEventListener("pointerup", this.onPointerUpWhileResizing);
            target.removeEventListener("pointerout", this.onPointerUpWhileResizing);
            target.releasePointerCapture(e.pointerId);
            this._dragActive = false;
        };
        this._columnDescriptor = columnDescriptor;
        this._html = this.createElement();
    }
    createElement() {
        const { header, order, minWidth } = this._columnDescriptor;
        const headerCell = document.createElement("th");
        headerCell.classList.add(TsGanttConst.CLASSES.TABLE.HEADER);
        headerCell.dataset[TABLE_COLUMN_DATA_ORDER] = order + "";
        headerCell.style.minWidth = minWidth + "px";
        headerCell.style.width = minWidth + "px";
        headerCell.draggable = true;
        headerCell.innerHTML = header;
        headerCell.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData(TABLE_COLUMN_REORDER_DATA, order + "");
        });
        headerCell.addEventListener("dragover", (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
        });
        headerCell.addEventListener("drop", (e) => {
            e.preventDefault();
            const orderFrom = e.dataTransfer.getData(TABLE_COLUMN_REORDER_DATA);
            if (!orderFrom && orderFrom !== "0") {
                return;
            }
            headerCell.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.TABLE_COLUMN_REORDER, {
                bubbles: true,
                composed: true,
                detail: { orderFrom: +orderFrom, orderTo: order, event: e },
            }));
        });
        headerCell.append(this.createResizer());
        return headerCell;
    }
    createResizer() {
        const resizer = document.createElement("div");
        resizer.classList.add(TsGanttConst.CLASSES.TABLE.COLUMN_RESIZER);
        resizer.addEventListener("pointerdown", this.onPointerDownOnResizer);
        return resizer;
    }
}

class TsGanttTableHeaderRow extends TsGanttHtmlComponentBase {
    constructor(options) {
        super();
        this._html = this.createElement(options);
    }
    createElement(columnDescriptors) {
        const row = document.createElement("tr");
        for (const columnDescriptor of columnDescriptors) {
            new TsGanttTableHeaderCell(columnDescriptor).appendTo(row);
        }
        return row;
    }
}

class TsGanttTable {
    constructor(data) {
        this._activeUuids = [];
        this._dataRowByTaskUuid = new Map();
        this.onColumnReorder = ((e) => {
            const detail = e.detail;
            if (!detail) {
                return;
            }
            this.changeColumnIndex(detail.orderFrom, detail.orderTo);
        });
        this._data = data;
        this.initBaseHtml();
        this.updateColumns();
        this._html.addEventListener(TsGanttConst.EVENTS.TABLE_COLUMN_REORDER, this.onColumnReorder);
    }
    destroy() {
        this._html.removeEventListener(TsGanttConst.EVENTS.TABLE_COLUMN_REORDER, this.onColumnReorder);
        this._html.remove();
    }
    appendTo(parent) {
        parent.append(this._html);
    }
    update(updateColumns, data, uuids) {
        if (updateColumns) {
            this.updateColumns();
        }
        if (data) {
            this.updateRows(data);
        }
        if (uuids) {
            this._activeUuids = uuids;
        }
        this.redraw();
    }
    applySelection(selectionResult) {
        var _a, _b;
        const { selected, deselected } = selectionResult;
        for (const uuid of deselected) {
            (_a = this._dataRowByTaskUuid.get(uuid)) === null || _a === void 0 ? void 0 : _a.deselect();
        }
        for (const uuid of selected) {
            (_b = this._dataRowByTaskUuid.get(uuid)) === null || _b === void 0 ? void 0 : _b.select();
        }
        this._lastSelectionResult = selectionResult;
    }
    initBaseHtml() {
        const table = document.createElement("table");
        table.classList.add(TsGanttConst.CLASSES.TABLE.MAIN_ELEMENT);
        const tableHead = table.createTHead();
        const tableBody = table.createTBody();
        this._htmlHead = tableHead;
        this._htmlBody = tableBody;
        this._html = table;
    }
    updateColumns() {
        if (!this._columnOrder) {
            this._columnOrder = new TsGanttTableColumnOrder(this._data.options.columnsMinWidthPx.length);
        }
        this._columnDescriptors = TsGanttTableColumnDescriptor.buildFromGanttOptions(this._data.options, this._columnOrder);
        this._headerRow = new TsGanttTableHeaderRow(this._columnDescriptors);
    }
    updateRows(data) {
        const columnOptions = this._columnDescriptors;
        const rows = this._dataRowByTaskUuid;
        data.deleted.forEach(task => rows.delete(task.uuid));
        for (const task of data.changed.concat(data.added)) {
            rows.set(task.uuid, new TsGanttTableDataRow(this._data.options, task, columnOptions));
        }
    }
    changeColumnIndex(oldIndex, newIndex) {
        this._columnOrder.move(oldIndex, newIndex);
        this.updateColumns();
        this.updateRows(this._data.getAllTasksAsChanged());
        this.redraw();
        this.applySelection(this._lastSelectionResult);
    }
    redraw() {
        this._htmlHead.innerHTML = "";
        this._headerRow.appendTo(this._htmlHead);
        this._htmlBody.innerHTML = "";
        this._activeUuids.forEach(uuid => { var _a; return (_a = this._dataRowByTaskUuid.get(uuid)) === null || _a === void 0 ? void 0 : _a.appendTo(this._htmlBody); });
    }
}

class TaskChangeInChartEvent extends CustomEvent {
    constructor(detail) {
        super(TsGanttConst.EVENTS.TASK_CHANGED_IN_CHART, { detail });
    }
}

class TsGanttChartHeader {
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get xCoords() {
        return this._xCoords;
    }
    constructor(options, minDate, maxDate) {
        this._options = options;
        this.drawSvg(minDate, maxDate);
    }
    destroy() {
        this._svg.remove();
    }
    appendTo(parent) {
        parent.append(this._svg);
    }
    createWrapper(width, height) {
        const header = createSvgElement("svg", [TsGanttConst.CLASSES.CHART.HEADER], [
            ["width", width + ""],
            ["height", height + ""],
        ]);
        createSvgElement("rect", [TsGanttConst.CLASSES.CHART.HEADER_BACKGROUND], [
            ["width", width + ""],
            ["height", height + ""],
        ], header);
        return header;
    }
    drawSvg(minDate, maxDate) {
        const scale = this._options.chartScale;
        const dayWidth = this._options.chartDayWidthPx[scale];
        const height = this._options.headerHeightPx;
        const dates = getAllDatesBetweenTwoDates(minDate, maxDate);
        const width = dates.length * dayWidth;
        const header = this.createWrapper(width, height);
        const locale = this._options.locale;
        const months = this._options.localeDateMonths[locale];
        const daysShort = this._options.localeDateDaysShort[locale];
        let xCoords;
        if (scale === "year") {
            xCoords = this.drawYearScaledHeaderContent(header, dates, maxDate, dayWidth, height);
        }
        else if (scale === "month") {
            xCoords = this.drawMonthScaledHeaderContent(header, months, dates, maxDate, height, width, dayWidth);
        }
        else if (scale === "week" || scale === "day") {
            xCoords = this.drawWeekDayScaledHeaderContent(header, months, daysShort, dates, maxDate, height, width, dayWidth);
        }
        this._svg = header;
        this._width = width;
        this._height = height;
        this._xCoords = xCoords;
    }
    drawHeaderElementWrapper(parent, left, top, width, height) {
        return createSvgElement("svg", [], [
            ["x", left + ""],
            ["y", top + ""],
            ["width", width + ""],
            ["height", height + ""],
        ], parent);
    }
    drawHorizontalBorder(header, top, width) {
        createSvgElement("line", [TsGanttConst.CLASSES.CHART.HEADER_GRIDLINES], [
            ["x1", 0 + ""],
            ["y1", top + ""],
            ["x2", width + ""],
            ["y2", top + ""],
        ], header);
    }
    drawVerticalBorder(header, left, top, height) {
        createSvgElement("line", [TsGanttConst.CLASSES.CHART.HEADER_GRIDLINES], [
            ["x1", left + ""],
            ["y1", top + ""],
            ["x2", left + ""],
            ["y2", top + height + ""],
        ], header);
    }
    drawText(parent, text) {
        createSvgElement("text", [TsGanttConst.CLASSES.CHART.HEADER_TEXT], [
            ["x", "50%"],
            ["y", "50%"],
            ["dominant-baseline", "middle"],
            ["text-anchor", "middle"],
        ], parent, text);
    }
    drawYear(header, date, nextDayOffset, yearStartOffset, top, rowHeight) {
        const yearWidth = nextDayOffset - yearStartOffset;
        const yearSvg = this.drawHeaderElementWrapper(header, yearStartOffset, top, yearWidth, rowHeight);
        if (yearWidth >= 60) {
            this.drawText(yearSvg, date.year() + "");
        }
        this.drawVerticalBorder(header, nextDayOffset, top, rowHeight);
    }
    drawMonth(header, months, date, nextDayOffset, monthStartOffset, top, rowHeight) {
        const monthWidth = nextDayOffset - monthStartOffset;
        const monthSvg = this.drawHeaderElementWrapper(header, monthStartOffset, top, monthWidth, rowHeight);
        if (monthWidth >= 60) {
            const monthName = months[date.month()];
            this.drawText(monthSvg, monthName);
        }
        this.drawVerticalBorder(header, nextDayOffset, top, rowHeight);
    }
    drawDay(header, daysShort, date, currentDayOffset, nextDayOffset, dayWidth, top, rowHeight) {
        const daySvg = this.drawHeaderElementWrapper(header, currentDayOffset, top, dayWidth, rowHeight);
        const dayName = dayWidth < 30
            ? date.date() + ""
            : daysShort[date.day()] + " " + date.date();
        this.drawText(daySvg, dayName);
        this.drawVerticalBorder(header, nextDayOffset, top, rowHeight);
    }
    drawWeekDayScaledHeaderContent(header, months, daysShort, dates, maxDate, height, width, dayWidth) {
        const verticalLinesXCoords = [];
        const rowHeight = height / 3;
        const y0 = 0;
        const y1 = rowHeight;
        const y2 = rowHeight * 2;
        this.drawHorizontalBorder(header, y1, width);
        this.drawHorizontalBorder(header, y2, width);
        let yearStartOffset = 0;
        let currentDayOffset = 0;
        let monthStartOffset = 0;
        for (const date of dates) {
            const nextDayOffset = currentDayOffset + dayWidth;
            if (date.isSame(date.endOf("year").startOf("day")) || date.isSame(maxDate)) {
                this.drawYear(header, date, nextDayOffset, yearStartOffset, y0, rowHeight);
                yearStartOffset = nextDayOffset;
            }
            if (date.isSame(date.endOf("month").startOf("day")) || date.isSame(maxDate)) {
                this.drawMonth(header, months, date, nextDayOffset, monthStartOffset, y1, rowHeight);
                monthStartOffset = nextDayOffset;
            }
            this.drawDay(header, daysShort, date, currentDayOffset, nextDayOffset, dayWidth, y2, rowHeight);
            verticalLinesXCoords.push(nextDayOffset);
            currentDayOffset = nextDayOffset;
        }
        return verticalLinesXCoords;
    }
    drawMonthScaledHeaderContent(header, months, dates, maxDate, height, width, dayWidth) {
        const verticalLinesXCoords = [];
        const rowHeight = height / 2;
        const y0 = 0;
        const y1 = rowHeight;
        this.drawHorizontalBorder(header, y1, width);
        let yearStartOffset = 0;
        let currentDayOffset = 0;
        let monthStartOffset = 0;
        for (const date of dates) {
            const nextDayOffset = currentDayOffset + dayWidth;
            if (date.isSame(date.endOf("year").startOf("day")) || date.isSame(maxDate)) {
                this.drawYear(header, date, nextDayOffset, yearStartOffset, y0, rowHeight);
                yearStartOffset = nextDayOffset;
            }
            if (date.isSame(date.endOf("month").startOf("day")) || date.isSame(maxDate)) {
                this.drawMonth(header, months, date, nextDayOffset, monthStartOffset, y1, rowHeight);
                verticalLinesXCoords.push(nextDayOffset);
                monthStartOffset = nextDayOffset;
            }
            currentDayOffset = nextDayOffset;
        }
        return verticalLinesXCoords;
    }
    drawYearScaledHeaderContent(header, dates, maxDate, dayWidth, height) {
        const verticalLinesXCoords = [];
        let yearStartOffset = 0;
        let currentDayOffset = 0;
        for (const date of dates) {
            const nextDayOffset = currentDayOffset + dayWidth;
            if (date.isSame(date.endOf("year").startOf("day")) || date.isSame(maxDate)) {
                this.drawYear(header, date, nextDayOffset, yearStartOffset, 0, height);
                verticalLinesXCoords.push(nextDayOffset);
                yearStartOffset = nextDayOffset;
            }
            currentDayOffset = nextDayOffset;
        }
        return verticalLinesXCoords;
    }
}

class TsGanttSvgComponentBase {
    destroy() {
        this._svg.remove();
    }
    appendTo(parent) {
        parent.append(this._svg);
    }
    appendToWithOffset(parent, offsetX, addOffsetToCurrent = false) {
        if (!this._svg || (!offsetX && offsetX !== 0)) {
            return;
        }
        if (addOffsetToCurrent) {
            const currentOffsetX = +this._svg.getAttribute("x") || 0;
            offsetX = currentOffsetX + offsetX;
        }
        this._svg.setAttribute("x", offsetX + "");
        parent.append(this._svg);
    }
}

class TsGanttChartBody extends TsGanttSvgComponentBase {
    constructor(data, tasks, xCoords, top, width) {
        super();
        this._options = data.options;
        this.draw(tasks, data.dateMinOffset, xCoords, top, width);
    }
    applySelection(selectionResult) {
        const { selected, deselected } = selectionResult;
        for (const uuid of deselected) {
            const rowBg = this._chartRowBgs.get(uuid);
            if (rowBg) {
                rowBg.classList.remove(TsGanttConst.CLASSES.ROOT.ROW_SELECTED);
            }
            const rowWrapper = this._chartRowFgs.get(uuid);
            if (rowWrapper) {
                rowWrapper.classList.remove(TsGanttConst.CLASSES.ROOT.ROW_SELECTED);
            }
        }
        for (const uuid of selected) {
            const rowBg = this._chartRowBgs.get(uuid);
            if (rowBg) {
                rowBg.classList.add(TsGanttConst.CLASSES.ROOT.ROW_SELECTED);
            }
            const rowWrapper = this._chartRowFgs.get(uuid);
            if (rowWrapper) {
                rowWrapper.classList.add(TsGanttConst.CLASSES.ROOT.ROW_SELECTED);
            }
        }
    }
    appendComponentToRow(rowUuid, element) {
        const row = this._chartRowFgs.get(rowUuid);
        if (row) {
            element.appendTo(row);
        }
    }
    draw(tasks, minDate, xCoords, top, width) {
        const { dayWidthPx, rowHeightPx, borderWidthPx, drawTodayLine } = this._options;
        const heightPx = rowHeightPx * tasks.length;
        const body = this.createWrapper(top, width, heightPx);
        const rowBgs = this.drawRowBackgrounds(body, tasks.map(task => task.uuid), rowHeightPx, width);
        this.drawChartGridLines(body, tasks.length, rowHeightPx, width, heightPx, borderWidthPx, xCoords);
        if (drawTodayLine) {
            this.drawTodayLine(body, minDate, dayWidthPx, heightPx);
        }
        const rowFgs = new Map();
        tasks.forEach((task, i) => {
            const row = this.drawRowForeground(body, task, i * rowHeightPx, width, rowHeightPx);
            rowFgs.set(task.uuid, row);
        });
        this._svg = body;
        this._chartRowBgs = rowBgs;
        this._chartRowFgs = rowFgs;
    }
    drawRowForeground(parent, task, offsetY, width, height) {
        const rowWrapper = createSvgElement("svg", [TsGanttConst.CLASSES.CHART.ROW_WRAPPER], [
            ["y", offsetY + ""],
            ["width", width + ""],
            ["height", height + ""],
            ["data-tsg-row-uuid", task.uuid],
        ], parent);
        rowWrapper.addEventListener("click", (e) => {
            const target = e.target;
            if (!target.classList.contains(TsGanttConst.CLASSES.CHART.BAR.HANDLE)) {
                rowWrapper.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.ROW_CLICK, {
                    bubbles: true,
                    composed: true,
                    detail: { task, event: e },
                }));
            }
        });
        rowWrapper.addEventListener("contextmenu", (e) => {
            rowWrapper.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.ROW_CONTEXT_MENU, {
                bubbles: true,
                composed: true,
                detail: { task, event: e },
            }));
        });
        createSvgElement("rect", [TsGanttConst.CLASSES.CHART.ROW], [
            ["width", width + ""],
            ["height", height + ""],
        ], rowWrapper);
        return rowWrapper;
    }
    drawRowBackground(parent, barGroupIndex, rowHeight, width) {
        const rowBg = createSvgElement("rect", [TsGanttConst.CLASSES.CHART.ROW_BACKGROUND], [
            ["y", (barGroupIndex * rowHeight) + ""],
            ["width", width + ""],
            ["height", rowHeight + ""],
        ], parent);
        return rowBg;
    }
    drawRowBackgrounds(parent, taskUuids, rowHeight, width) {
        const rowBgs = new Map();
        taskUuids.forEach((uuid, i) => {
            rowBgs.set(uuid, this.drawRowBackground(parent, i, rowHeight, width));
        });
        return rowBgs;
    }
    drawChartGridLines(parent, rowCount, rowHeight, width, height, border, xCoords) {
        for (let i = 0; i < rowCount;) {
            const lineY = ++i * rowHeight - border / 2;
            this.drawHorizontalLine(parent, lineY, width);
        }
        xCoords.forEach(x => {
            this.drawVerticalLine(parent, x, height);
        });
    }
    drawTodayLine(parent, minDate, dayWidth, height) {
        const todayX = dayjs().startOf("day").diff(minDate, "day") * dayWidth;
        createSvgElement("line", [TsGanttConst.CLASSES.CHART.BODY_TODAY_LINE], [
            ["x1", todayX + ""],
            ["y1", 0 + ""],
            ["x2", todayX + ""],
            ["y2", height + ""],
        ], parent);
    }
    drawHorizontalLine(parent, top, width) {
        createSvgElement("line", [TsGanttConst.CLASSES.CHART.BODY_GRIDLINES], [
            ["x1", 0 + ""],
            ["y1", top + ""],
            ["x2", width + ""],
            ["y2", top + ""],
        ], parent);
    }
    drawVerticalLine(parent, left, height) {
        createSvgElement("line", [TsGanttConst.CLASSES.CHART.BODY_GRIDLINES], [
            ["x1", left + ""],
            ["y1", 0 + ""],
            ["x2", left + ""],
            ["y2", height + ""],
        ], parent);
    }
    createWrapper(y0, width, height) {
        const body = createSvgElement("svg", [TsGanttConst.CLASSES.CHART.BODY], [
            ["y", y0 + ""],
            ["width", width + ""],
            ["height", height + ""],
        ]);
        createSvgElement("rect", [TsGanttConst.CLASSES.CHART.BODY_BACKGROUND], [
            ["width", width + ""],
            ["height", height + ""],
        ], body);
        return body;
    }
}

class TsGanttChartBarGroupDescriptor {
    static getFromGanttOptions(options) {
        const mode = options.chartDisplayMode;
        const showProgress = options.chartShowProgress;
        const showHandles = options.enableChartEdit;
        const dayWidth = options.dayWidthPx;
        const rowHeight = options.rowHeightPx;
        const border = options.borderWidthPx;
        const barMargin = options.barMarginPx;
        const barBorder = options.barStrokeWidthPx;
        const barCornerR = options.barCornerRadiusPx;
        const barMinWidth = barBorder + 2 * barCornerR;
        const y0 = barMargin - border / 2;
        let barHeight;
        let y1;
        switch (mode) {
            case "both":
                barHeight = (rowHeight - 3 * barMargin) / 2;
                y1 = barHeight + 2 * barMargin - border / 2;
                break;
            case "planned":
            case "actual":
                barHeight = rowHeight - 2 * barMargin;
                break;
        }
        return Object.assign(new TsGanttChartBarGroupDescriptor(), { mode, showProgress, showHandles, dayWidth, rowHeight,
            barMinWidth, barHeight, barBorder, barCornerR, y0, y1 });
    }
}

class TsGanttChartBarHandle extends TsGanttSvgComponentBase {
    constructor(descriptor, callbackOnMove, callbackOnMoveEnd) {
        super();
        this.onPointerDown = (e) => {
            if (!e.isPrimary || e.button === 2) {
                return;
            }
            const target = e.target;
            target.addEventListener("pointermove", this.onPointerMove);
            target.addEventListener("pointerup", this.onPointerUp);
            target.addEventListener("pointerout", this.onPointerUp);
            target.setPointerCapture(e.pointerId);
            this._moveStartCoords = { x: e.x, y: e.y };
        };
        this.onPointerMove = (e) => {
            if (!this._moveStartCoords || !e.isPrimary) {
                return;
            }
            const displacement = {
                x: e.x - this._moveStartCoords.x,
                y: e.y - this._moveStartCoords.y,
            };
            const displacementSinceLastEvent = this._lastMoveCoords
                ? Math.abs(e.x - this._lastMoveCoords.x)
                : Math.abs(displacement.x);
            const displacementThresholdExceeded = displacementSinceLastEvent > this._descriptor.displacementThreshold;
            if (displacementThresholdExceeded) {
                this._lastMoveCoords = { x: e.x, y: e.y };
                this._currentDisplacement = displacement;
                this._callbackOnMove(displacement);
            }
        };
        this.onPointerUp = (e) => {
            if (!e.isPrimary) {
                return;
            }
            const target = e.target;
            target.removeEventListener("pointermove", this.onPointerMove);
            target.removeEventListener("pointerup", this.onPointerUp);
            target.removeEventListener("pointerout", this.onPointerUp);
            target.releasePointerCapture(e.pointerId);
            const displacement = {
                x: e.x - this._moveStartCoords.x,
                y: e.y - this._moveStartCoords.y,
            };
            this._moveStartCoords = null;
            this._lastMoveCoords = null;
            this._currentDisplacement = displacement;
            this._callbackOnMoveEnd(this._currentDisplacement);
        };
        this._descriptor = descriptor;
        this._callbackOnMove = callbackOnMove;
        this._callbackOnMoveEnd = callbackOnMoveEnd;
        this.draw();
    }
    draw() {
        const wrapper = this.createWrapper();
        const handle = this.drawHandle(wrapper);
        handle.addEventListener("pointerdown", this.onPointerDown);
        this._svg = wrapper;
    }
    createWrapper() {
        const { width, height } = this._descriptor;
        const wrapper = createSvgElement("svg", [TsGanttConst.CLASSES.CHART.BAR.HANDLE_WRAPPER], [
            ["x", "0"],
            ["y", "0"],
            ["viewBox", "0 0 100 100"],
            ["width", width + ""],
            ["height", height + ""],
        ]);
        return wrapper;
    }
}

class HandleMoveEvent extends CustomEvent {
    constructor(detail) {
        super(TsGanttConst.EVENTS.HANDLE_MOVE, { detail });
    }
}
class HandleMoveEndEvent extends CustomEvent {
    constructor(detail) {
        super(TsGanttConst.EVENTS.HANDLE_MOVE_END, { detail });
    }
}

class TsGanttDateStartHandle extends TsGanttChartBarHandle {
    constructor(descriptor) {
        super(descriptor, (displacement) => {
            document.dispatchEvent(new HandleMoveEvent({
                handleType: "start",
                displacement,
                taskUuid: descriptor.taskUuid,
                barType: descriptor.barType,
            }));
        }, (displacement) => {
            document.dispatchEvent(new HandleMoveEndEvent({
                handleType: "start",
                displacement,
                taskUuid: descriptor.taskUuid,
                barType: descriptor.barType,
            }));
        });
    }
    drawHandle(wrapper) {
        const handleSvg = createSvgElement("polygon", [TsGanttConst.CLASSES.CHART.BAR.HANDLE], [
            ["points", "60 25, 60 75, 10 50"],
        ], wrapper);
        return handleSvg;
    }
}

class TsGanttDateEndHandle extends TsGanttChartBarHandle {
    constructor(descriptor) {
        super(descriptor, (displacement) => {
            document.dispatchEvent(new HandleMoveEvent({
                handleType: "end",
                displacement,
                taskUuid: descriptor.taskUuid,
                barType: descriptor.barType,
            }));
        }, (displacement) => {
            document.dispatchEvent(new HandleMoveEndEvent({
                handleType: "end",
                displacement,
                taskUuid: descriptor.taskUuid,
                barType: descriptor.barType,
            }));
        });
    }
    drawHandle(wrapper) {
        const handleSvg = createSvgElement("polygon", [TsGanttConst.CLASSES.CHART.BAR.HANDLE], [
            ["points", "40 25, 40 75, 90 50"],
        ], wrapper);
        return handleSvg;
    }
}

class TsGanttProgressHandle extends TsGanttChartBarHandle {
    constructor(descriptor) {
        super(descriptor, (displacement) => {
            document.dispatchEvent(new HandleMoveEvent({
                handleType: "progress",
                displacement, taskUuid: descriptor.taskUuid,
                barType: descriptor.barType,
            }));
        }, (displacement) => {
            document.dispatchEvent(new HandleMoveEndEvent({
                handleType: "progress",
                displacement,
                taskUuid: descriptor.taskUuid,
                barType: descriptor.barType,
            }));
        });
    }
    drawHandle(wrapper) {
        const handleSvg = createSvgElement("circle", [TsGanttConst.CLASSES.CHART.BAR.HANDLE], [
            ["cx", "50"],
            ["cy", "50"],
            ["r", "25"],
        ], wrapper);
        return handleSvg;
    }
}

class TsGanttChartBar extends TsGanttSvgComponentBase {
    constructor(descriptor) {
        super();
        this._descriptor = descriptor;
        this.draw();
    }
    appendToWithOffset(parent, offsetX, addOffsetToCurrent = false) {
        if (!addOffsetToCurrent) {
            offsetX = offsetX + this._defaultOffsetX;
        }
        super.appendToWithOffset(parent, offsetX, addOffsetToCurrent);
    }
    hide() {
        this._svg.style.visibility = "hidden";
    }
    draw() {
        const { wrapper: wrapperCoords, bar: barCoords, handles: handlesCoords } = this.getDrawData();
        const wrapper = this.createWrapper(wrapperCoords);
        this.drawTaskBar(wrapper, barCoords);
        if (this._descriptor.showProgress) {
            this.drawProgressBars(wrapper, barCoords);
        }
        if (this._descriptor.showHandles) {
            this.drawHandles(wrapper, handlesCoords);
        }
        this._defaultOffsetX = wrapperCoords.left;
        this._svg = wrapper;
    }
    getDrawData() {
        const { minDate, startDate, endDate, dayWidth, minWrapperWidth, wrapperHeight, borderWidth, topPosition, progress, } = this._descriptor;
        const baseOffsetX = (startDate.diff(minDate, "day")) * dayWidth;
        const widthDays = endDate.diff(startDate, "day") + 1;
        const baseWidth = Math.max(widthDays * dayWidth, minWrapperWidth);
        const handleWidth = wrapperHeight;
        const wrapperWidth = baseWidth + 2 * handleWidth;
        const wrapperLeft = baseOffsetX - handleWidth;
        const barWidth = baseWidth - borderWidth;
        const barHeight = wrapperHeight - borderWidth;
        const barLeft = borderWidth / 2 + handleWidth;
        const barTop = borderWidth / 2;
        const calculatedProgressWidth = barWidth * progress / 100;
        const progressBarWidth = calculatedProgressWidth < minWrapperWidth - borderWidth
            ? 0
            : calculatedProgressWidth;
        const startHandleOffsetX = 0;
        const endHandleOffsetX = wrapperWidth - handleWidth;
        const progressHandleOffsetX = barLeft + progressBarWidth - handleWidth / 2;
        return {
            wrapper: {
                width: wrapperWidth,
                height: wrapperHeight,
                left: wrapperLeft,
                top: topPosition,
            },
            bar: {
                width: barWidth,
                height: barHeight,
                left: barLeft,
                top: barTop,
                progressWidth: progressBarWidth,
            },
            handles: {
                width: handleWidth,
                height: handleWidth,
                startHandleOffsetX,
                endHandleOffsetX,
                progressHandleOffsetX,
                displacementThreshold: dayWidth,
            }
        };
    }
    drawTaskBar(wrapper, coords) {
        const { barType, cornerRadius } = this._descriptor;
        const barClassList = barType === "planned"
            ? [TsGanttConst.CLASSES.CHART.BAR.PLANNED]
            : [TsGanttConst.CLASSES.CHART.BAR.ACTUAL];
        createSvgElement("rect", barClassList, [
            ["x", coords.left + ""],
            ["y", coords.top + ""],
            ["width", coords.width + ""],
            ["height", coords.height + ""],
            ["rx", cornerRadius + ""],
            ["ry", cornerRadius + ""],
        ], wrapper);
    }
    drawProgressBars(wrapper, coords) {
        const { barType, cornerRadius } = this._descriptor;
        const progressBarClassList = barType === "planned"
            ? [TsGanttConst.CLASSES.CHART.BAR.PLANNED_PROGRESS]
            : [TsGanttConst.CLASSES.CHART.BAR.ACTUAL_PROGRESS];
        createSvgElement("rect", progressBarClassList, [
            ["x", coords.left + ""],
            ["y", coords.top + ""],
            ["width", coords.progressWidth + ""],
            ["height", coords.height + ""],
            ["rx", cornerRadius + ""],
            ["ry", cornerRadius + ""],
        ], wrapper);
    }
    drawHandles(wrapper, coords) {
        const handleOptions = {
            taskUuid: this._descriptor.taskUuid,
            width: coords.width,
            height: coords.height,
            displacementThreshold: coords.displacementThreshold,
            barType: this._descriptor.barType,
        };
        const startHandle = new TsGanttDateStartHandle(handleOptions);
        startHandle.appendToWithOffset(wrapper, coords.startHandleOffsetX);
        const endHandle = new TsGanttDateEndHandle(handleOptions);
        endHandle.appendToWithOffset(wrapper, coords.endHandleOffsetX);
        const progressHandle = new TsGanttProgressHandle(Object.assign({}, handleOptions, { displacementThreshold: 1 }));
        progressHandle.appendToWithOffset(wrapper, coords.progressHandleOffsetX);
    }
    createWrapper(coords) {
        const wrapper = createSvgElement("svg", [TsGanttConst.CLASSES.CHART.BAR.WRAPPER], [
            ["x", coords.left + ""],
            ["y", coords.top + ""],
            ["width", coords.width + ""],
            ["height", coords.height + ""],
        ]);
        return wrapper;
    }
}

class TsGanttChartBarGroup {
    set minDate(value) {
        this._minDate = value;
    }
    constructor(descriptor, task, minDate) {
        this.task = task;
        this._descriptor = descriptor;
        this._minDate = minDate;
        this.draw();
    }
    hide() {
        var _a;
        (_a = this._bars) === null || _a === void 0 ? void 0 : _a.forEach(bar => {
            bar.hide();
        });
    }
    destroy() {
        var _a;
        (_a = this._bars) === null || _a === void 0 ? void 0 : _a.forEach(bar => {
            bar.destroy();
        });
    }
    appendTo(parent) {
        var _a;
        if (!((_a = this._bars) === null || _a === void 0 ? void 0 : _a.length)) {
            return;
        }
        const offsetX = this.task.getHorizontalOffsetPx(this._descriptor.mode, this._minDate, this._descriptor.dayWidth);
        if (!offsetX) {
            return;
        }
        this._bars.forEach(bar => {
            bar.appendToWithOffset(parent, offsetX);
        });
    }
    draw() {
        const { mode, showProgress, showHandles, dayWidth, barMinWidth, barHeight, barBorder, barCornerR, y0, y1 } = this._descriptor;
        const task = this.task;
        const { minDate, maxDate } = task.getMinMaxDates(mode);
        if (!minDate || !maxDate) {
            return;
        }
        const { datePlannedStart, datePlannedEnd, dateActualStart, dateActualEnd } = task;
        const plannedDatesSet = datePlannedStart && datePlannedEnd;
        const actualDatesSet = dateActualStart && dateActualEnd;
        const commonBarDescriptorPartial = {
            minDate,
            showProgress,
            showHandles,
            dayWidth,
            minWrapperWidth: barMinWidth,
            wrapperHeight: barHeight,
            borderWidth: barBorder,
            cornerRadius: barCornerR,
            progress: task.progress,
            taskUuid: task.uuid,
        };
        const plannedBarDescriptorPartial = {
            barType: "planned",
            startDate: datePlannedStart,
            endDate: datePlannedEnd,
        };
        const actualBarDescriptorPartial = {
            barType: "actual",
            startDate: dateActualStart,
            endDate: dateActualEnd,
        };
        const bars = [];
        if (mode === "both") {
            if (actualDatesSet || plannedDatesSet) {
                if (plannedDatesSet) {
                    bars.push(new TsGanttChartBar(Object.assign({}, commonBarDescriptorPartial, plannedBarDescriptorPartial, {
                        topPosition: y0,
                    })));
                }
                if (actualDatesSet) {
                    bars.push(new TsGanttChartBar(Object.assign({}, commonBarDescriptorPartial, actualBarDescriptorPartial, {
                        topPosition: y1,
                    })));
                }
            }
        }
        else if (mode === "planned" && plannedDatesSet) {
            bars.push(new TsGanttChartBar(Object.assign({}, commonBarDescriptorPartial, plannedBarDescriptorPartial, {
                topPosition: y0,
            })));
        }
        else if (mode === "actual" && actualDatesSet) {
            bars.push(new TsGanttChartBar(Object.assign({}, commonBarDescriptorPartial, actualBarDescriptorPartial, {
                topPosition: y0,
            })));
        }
        this._bars = bars;
    }
}

class TsGanttChart {
    constructor(data) {
        this._activeUuids = [];
        this._barGroups = new Map();
        this.onHandleMove = (e) => {
            var _a;
            const { taskUuid, handleType, barType, displacement } = e.detail;
            this.destroyTempBarGroup();
            if (!this._barGroupDescriptor) {
                return;
            }
            const task = this._data.getTaskByUuid(taskUuid);
            if (!task) {
                return;
            }
            const tempTask = this.buildTempTask(task, handleType, barType, this._data.options.dayWidthPx, displacement.x);
            (_a = this._barGroups.get(tempTask.uuid)) === null || _a === void 0 ? void 0 : _a.hide();
            this._tempBarGroup = new TsGanttChartBarGroup(this._barGroupDescriptor, tempTask, this._data.dateMinOffset);
            this._body.appendComponentToRow(tempTask.uuid, this._tempBarGroup);
        };
        this.onHandleMoveEnd = (e) => {
            if (!this._tempBarGroup) {
                return;
            }
            document.dispatchEvent(new TaskChangeInChartEvent({
                manual: true,
                task: this._tempBarGroup.task,
            }));
            this.destroyTempBarGroup();
        };
        this._data = data;
        this._html = this.createChartDiv();
    }
    destroy() {
        this.removeEventListeners();
        this._html.remove();
    }
    appendTo(parent) {
        parent.append(this._html);
        this.addEventListeners();
    }
    update(forceRedraw, data, uuids) {
        const { options, dateMinOffset, dateMaxOffset } = this._data;
        if ((data === null || data === void 0 ? void 0 : data.datesChanged) || forceRedraw) {
            this._header = new TsGanttChartHeader(options, dateMinOffset, dateMaxOffset);
        }
        if (data) {
            this.updateBarGroups(data);
        }
        if (uuids) {
            this._activeUuids = uuids;
        }
        const barGroups = this._activeUuids.map(x => this._barGroups.get(x));
        const tasks = barGroups.map(bg => bg.task);
        this._body = new TsGanttChartBody(this._data, tasks, this._header.xCoords, this._header.height, this._header.width);
        barGroups.forEach(bg => this._body.appendComponentToRow(bg.task.uuid, bg));
        this.redraw();
    }
    applySelection(selectionResult) {
        var _a;
        (_a = this._body) === null || _a === void 0 ? void 0 : _a.applySelection(selectionResult);
    }
    createChartDiv() {
        const svg = document.createElement("div");
        svg.classList.add(TsGanttConst.CLASSES.CHART.MAIN_ELEMENT);
        return svg;
    }
    updateBarGroups(data) {
        data.deleted.concat(data.changed).forEach(task => {
            var _a;
            (_a = this._barGroups.get(task.uuid)) === null || _a === void 0 ? void 0 : _a.destroy();
            this._barGroups.delete(task.uuid);
        });
        if (data.datesChanged) {
            const minDate = this._data.dateMinOffset;
            this._barGroups.forEach(bg => bg.minDate = minDate);
        }
        this._barGroupDescriptor = TsGanttChartBarGroupDescriptor.getFromGanttOptions(this._data.options);
        data.changed.concat(data.added).forEach(task => this._barGroups.set(task.uuid, new TsGanttChartBarGroup(this._barGroupDescriptor, task, this._data.dateMinOffset)));
    }
    redraw() {
        const oldHtml = this._html;
        const newHtml = this.createChartDiv();
        this._header.appendTo(newHtml);
        this._body.appendTo(newHtml);
        oldHtml.replaceWith(newHtml);
        this._html = newHtml;
    }
    addEventListeners() {
        document.addEventListener(TsGanttConst.EVENTS.HANDLE_MOVE, this.onHandleMove);
        document.addEventListener(TsGanttConst.EVENTS.HANDLE_MOVE_END, this.onHandleMoveEnd);
    }
    removeEventListeners() {
        document.removeEventListener(TsGanttConst.EVENTS.HANDLE_MOVE, this.onHandleMove);
        document.removeEventListener(TsGanttConst.EVENTS.HANDLE_MOVE_END, this.onHandleMoveEnd);
    }
    buildTempTask(sourceTask, handleType, barType, dayWidthPx, xDisplacementPx) {
        const tempTask = sourceTask.clone();
        const shiftDays = Math.floor(xDisplacementPx / dayWidthPx);
        switch (handleType) {
            case "start":
                if (barType === "planned") {
                    const maxStart = tempTask.datePlannedEnd;
                    const shiftedStart = tempTask.datePlannedStart.add(shiftDays, "days");
                    tempTask.datePlannedStart = shiftedStart.isAfter(maxStart)
                        ? maxStart
                        : shiftedStart;
                }
                else if (barType === "actual") {
                    const maxStart = tempTask.dateActualEnd;
                    const shiftedStart = tempTask.dateActualStart.add(shiftDays, "days");
                    tempTask.dateActualStart = shiftedStart.isAfter(maxStart)
                        ? maxStart
                        : shiftedStart;
                }
                break;
            case "end":
                if (barType === "planned") {
                    const minEnd = tempTask.datePlannedStart;
                    const shiftedEnd = tempTask.datePlannedEnd.add(shiftDays, "days");
                    tempTask.datePlannedEnd = shiftedEnd.isBefore(minEnd)
                        ? minEnd
                        : shiftedEnd;
                }
                else if (barType === "actual") {
                    const minEnd = tempTask.dateActualStart;
                    const shiftedEnd = tempTask.dateActualEnd.add(shiftDays, "days");
                    tempTask.dateActualEnd = shiftedEnd.isBefore(minEnd)
                        ? minEnd
                        : shiftedEnd;
                }
                break;
            case "progress":
                const currentProgress = tempTask.progress;
                let totalBarWidth;
                if (barType === "planned") {
                    totalBarWidth = tempTask.datePlannedEnd.diff(tempTask.datePlannedStart, "days") * dayWidthPx;
                }
                else if (barType === "actual") {
                    totalBarWidth = tempTask.dateActualEnd.diff(tempTask.dateActualStart, "days") * dayWidthPx;
                }
                const currentPosition = totalBarWidth * currentProgress / 100;
                const newPosition = currentPosition + xDisplacementPx;
                const newProgress = Math.floor(Math.max(0, Math.min(100, newPosition / totalBarWidth * 100)));
                tempTask.progress = newProgress;
                break;
        }
        return tempTask;
    }
    destroyTempBarGroup() {
        if (!this._tempBarGroup) {
            return;
        }
        this._tempBarGroup.destroy();
        this._tempBarGroup = null;
    }
}

class TsGantt {
    get _options() {
        var _a;
        return (_a = this._data) === null || _a === void 0 ? void 0 : _a.options;
    }
    get tasks() {
        return this._data.models;
    }
    set tasks(models) {
        this.updateTasks(models);
    }
    get selectedTasks() {
        return this._data.selectedModels;
    }
    set selectedTasks(models) {
        this.updateSelection(models);
    }
    set locale(value) {
        if (value !== this._options.locale) {
            this._options.locale = value;
            this.updateLocale();
        }
    }
    set chartScale(value) {
        if (value !== this._options.chartScale) {
            this._options.chartScale = value;
            this.updateChartScale();
        }
    }
    set chartDisplayMode(value) {
        if (value !== this._options.chartDisplayMode) {
            this._options.chartDisplayMode = value;
            this.updateChartDisplayMode();
        }
    }
    constructor(containerSelector, options = null) {
        this._separatorDragActive = false;
        this._ignoreNextScrollEvent = false;
        this._baseComponents = [];
        this.onResize = (e) => {
            const wrapperWidth = this._htmlWrapper.getBoundingClientRect().width;
            const tableWrapperWidth = this._htmlTableWrapper.getBoundingClientRect().width;
            this._htmlChartWrapper.style.width =
                (wrapperWidth - tableWrapperWidth - this._options.separatorWidthPx) + "px";
        };
        this.onPointerDownOnPartsSeparator = (e) => {
            if (!e.isPrimary || e.button === 2) {
                return;
            }
            const target = e.target;
            target.addEventListener("pointermove", this.onPointerMoveWhileResizingParts);
            target.addEventListener("pointerup", this.onPointerUpWhileResizingParts);
            target.addEventListener("pointerout", this.onPointerUpWhileResizingParts);
            target.setPointerCapture(e.pointerId);
            this._separatorDragActive = true;
        };
        this.onPointerMoveWhileResizingParts = (e) => {
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
        this.onPointerUpWhileResizingParts = (e) => {
            if (!e.isPrimary) {
                return;
            }
            const target = e.target;
            target.removeEventListener("pointermove", this.onPointerMoveWhileResizingParts);
            target.removeEventListener("pointerup", this.onPointerUpWhileResizingParts);
            target.removeEventListener("pointerout", this.onPointerUpWhileResizingParts);
            target.releasePointerCapture(e.pointerId);
            this._separatorDragActive = false;
        };
        this.onWrapperScroll = ((e) => {
            if (this._ignoreNextScrollEvent) {
                this._ignoreNextScrollEvent = false;
                return;
            }
            this._ignoreNextScrollEvent = true;
            const wrapper = e.currentTarget;
            const scroll = wrapper.scrollTop;
            if (wrapper === this._htmlTableWrapper) {
                if (this._htmlChartWrapper.scrollTop !== scroll) {
                    this._htmlChartWrapper.scrollTop = scroll;
                }
            }
            else if (wrapper === this._htmlChartWrapper) {
                if (this._htmlTableWrapper.scrollTop !== scroll) {
                    this._htmlTableWrapper.scrollTop = scroll;
                }
            }
        });
        this.onRowClick = ((e) => {
            const detail = e.detail;
            if (!detail) {
                return;
            }
            const { task, event } = detail;
            if (event.detail === 1) {
                this.toggleTaskSelection(task, event.ctrlKey);
                if (this.onRowClickCb) {
                    this.onRowClickCb(task.toModel(), event);
                }
            }
            else if (event.detail === 2) {
                if (this.onRowDoubleClickCb) {
                    this.onRowDoubleClickCb(task.toModel(), event);
                }
            }
        });
        this.onRowContextMenu = ((e) => {
            const detail = e.detail;
            if (!detail) {
                return;
            }
            const { task, event } = detail;
            if (this.onRowContextMenuCb) {
                this.onRowContextMenuCb(task.toModel(), event);
            }
        });
        this.onRowExpanderClick = ((e) => {
            this.toggleTaskExpanded(e.detail.task);
        });
        this.onTaskChange = (e) => {
            var _a, _b;
            if (!((_a = e.detail) === null || _a === void 0 ? void 0 : _a.task)) {
                return;
            }
            const changes = this._data.updateSingleTask(e.detail.task);
            if ((_b = changes.changed) === null || _b === void 0 ? void 0 : _b.length) {
                this.update(changes);
            }
        };
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
    expandAll(state) {
        this._data.expandAllTasks(state);
        this.update(null);
    }
    setCssVariables(options) {
        document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_SEPARATOR_WIDTH, options.separatorWidthPx + "px");
        document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_HEADER_HEIGHT, options.headerHeightPx + "px");
        document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_ROW_HEIGHT, options.rowHeightPx + "px");
        document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_GRIDLINES_WIDTH, options.borderWidthPx + "px");
        document.documentElement.style.setProperty(TsGanttConst.CSS_VAR_BAR_STROKE_WIDTH, options.barStrokeWidthPx + "px");
    }
    createLayout() {
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
            this._shadowRoot = this._htmlContainer.attachShadow({ mode: "open" });
            this._shadowRoot.innerHTML = styles;
            this._shadowRoot.append(wrapper);
        }
        else {
            this._htmlContainer.append(wrapper);
        }
        this._htmlWrapper = wrapper;
        this._htmlTableWrapper = tableWrapper;
        this._htmlChartWrapper = chartWrapper;
        this.addGlobalEventListeners();
    }
    addGlobalEventListeners() {
        window.addEventListener("resize", this.onResize);
        document.addEventListener(TsGanttConst.EVENTS.ROW_CLICK, this.onRowClick);
        document.addEventListener(TsGanttConst.EVENTS.ROW_CONTEXT_MENU, this.onRowContextMenu);
        document.addEventListener(TsGanttConst.EVENTS.TABLE_BODY_CELL_EXPANDER_CLICK, this.onRowExpanderClick);
        document.addEventListener(TsGanttConst.EVENTS.TASK_CHANGED_IN_CHART, this.onTaskChange);
    }
    removeGlobalEventListeners() {
        window.removeEventListener("resize", this.onResize);
        document.removeEventListener(TsGanttConst.EVENTS.ROW_CLICK, this.onRowClick);
        document.removeEventListener(TsGanttConst.EVENTS.ROW_CONTEXT_MENU, this.onRowContextMenu);
        document.removeEventListener(TsGanttConst.EVENTS.TABLE_BODY_CELL_EXPANDER_CLICK, this.onRowExpanderClick);
        document.removeEventListener(TsGanttConst.EVENTS.TASK_CHANGED_IN_CHART, this.onTaskChange);
    }
    toggleTaskSelection(task, ctrl) {
        const selectionResult = this._data.toggleTaskSelection(task, ctrl);
        this.applySelectionResult(selectionResult);
    }
    refreshSelection() {
        const selectionResult = this._data.refreshSelectedTasks();
        this.applySelectionResult(selectionResult);
    }
    updateSelection(tasks) {
        const selectionResult = this._data.updateSelectedTasks(tasks);
        this.applySelectionResult(selectionResult);
    }
    applySelectionResult(selectionResult) {
        var _a;
        if (!selectionResult) {
            return;
        }
        this._table.applySelection(selectionResult);
        this._chart.applySelection(selectionResult);
        if (selectionResult.changed && ((_a = selectionResult.selectedTasks) === null || _a === void 0 ? void 0 : _a.length)) {
            this.scrollChartToTasks(selectionResult.selectedTasks);
        }
        if (this.onSelectionChangeCb) {
            this.onSelectionChangeCb(selectionResult.selectedTasks.map(x => x.toModel()));
        }
    }
    update(data) {
        const uuids = this._data.getShownTaskUuidsRecursively();
        this._table.update(false, data, uuids);
        this._chart.update(false, data, uuids);
        this.refreshSelection();
    }
    updateTasks(taskModels) {
        const changes = this._data.updateTasks(taskModels);
        this.update(changes);
    }
    updateLocale() {
        const data = this._data.getAllTasksAsChanged();
        this._table.update(true, data, null);
        this._chart.update(true, data, null);
    }
    updateChartScale() {
        const data = this._data.getAllTasksAsChanged();
        this._chart.update(true, data, null);
        this.refreshSelection();
        this.scrollChartToTasks(this._data.tasks);
    }
    updateChartDisplayMode() {
        const data = this._data.getAllTasksAsChanged();
        this._chart.update(false, data, null);
        this.refreshSelection();
    }
    toggleTaskExpanded(task) {
        task.toggleExpanded();
        this.update(null);
    }
    scrollChartToTasks(tasks) {
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

export { TsGantt, TsGanttOptions, TsGanttTask };
