function getRandomUuid() {
    return crypto.getRandomValues(new Uint32Array(4)).join("-");
}

class TsGanttTask {
    constructor(name, progress, datePlannedStart, datePlannedEnd, dateActualStart = null, dateActualEnd = null, children = []) {
        this.durationPlanned = 0;
        this.durationActual = 0;
        this._progress = 0;
        this.name = name;
        this.progress = progress;
        this.datePlannedStart = datePlannedStart;
        this.datePlannedEnd = datePlannedEnd;
        this.dateActualStart = dateActualStart;
        this.dateActualEnd = dateActualEnd;
        this.children = children;
        this.refreshDuration();
        this.uuid = getRandomUuid();
    }
    set progress(value) {
        this._progress = value < 0 ? 0 : value > 100 ? 100 : value;
    }
    get progress() {
        return this._progress;
    }
    static flatten(tree) {
        const flattenedArray = [];
        for (const task of tree) {
            flattenedArray.push(task);
            if (task.children.length !== 0) {
                flattenedArray.push(...TsGanttTask.flatten(task.children));
            }
        }
        return flattenedArray;
    }
    refreshDuration() {
        this.durationPlanned = this.datePlannedEnd.getTime() -
            this.datePlannedStart.getTime();
        if (this.dateActualStart && this.dateActualEnd) {
            this.durationActual = this.dateActualEnd.getTime() -
                this.dateActualStart.getTime();
        }
        else {
            this.durationActual = 0;
        }
    }
}

class TsGanttOptions {
    constructor(item = null) {
        this.headerHeight = 60;
        this.rowHeight = 0;
        this.columnWidth = 0;
        this.scale = "day";
        this.locale = "en";
        this.customDateFormat = "YYYY-MM-DD";
        this.allowMoveBars = true;
        this.allowResizeBars = true;
        this.allowMoveProgress = true;
        this.barHeaderGetter = (a) => a.name;
        this.tooltipHeaderGetter = (a) => a.name;
        this.tooltipPlannedPeriodGetter = (a) => `${a.datePlannedStart}-${a.datePlannedEnd}`;
        this.tooltipActualPeriodGetter = (a) => `${a.dateActualStart}-${a.dateActualEnd}`;
        this.tooltipPlannedDurationGetter = (a) => a.durationPlanned;
        this.tooltipActualDurationGetter = (a) => a.durationActual;
        this.tooltipProgressGetter = (a) => a.progress;
        if (item != null) {
            Object.assign(this, item);
        }
    }
}

class TsGantt {
    constructor(containerSelector, options) {
        this._tasks = [];
        this._isSeparatorDragActive = false;
        this.onMouseDownOnSep = (e) => {
            if (e.target === this._separator) {
                this._isSeparatorDragActive = true;
            }
        };
        this.onMouseMoveOnSep = (e) => {
            if (!this._isSeparatorDragActive) {
                return false;
            }
            const wrapperLeftOffset = this._wrapper.offsetLeft;
            const pointerRelX = e.clientX - wrapperLeftOffset;
            this._table.style.width = (Math.max(TsGantt.GRID_MIN_WIDTH, pointerRelX)) + "px";
            this._table.style.flexGrow = "0";
        };
        this.onMouseUpOnSep = (e) => {
            this._isSeparatorDragActive = false;
        };
        this._container = document.querySelector(containerSelector);
        if (!this._container) {
            throw new Error("Container is null");
        }
        this.createLayout();
        this._options = new TsGanttOptions(options);
    }
    destroy() {
        document.removeEventListener("mousedown", this.onMouseDownOnSep);
        document.removeEventListener("mousemove", this.onMouseMoveOnSep);
        document.removeEventListener("mouseup", this.onMouseUpOnSep);
    }
    createLayout() {
        const wrapper = document.createElement("div");
        wrapper.classList.add(TsGantt.WRAPPER_CLASS);
        const table = document.createElement("table");
        table.classList.add(TsGantt.GRID_CLASS);
        const chartSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        chartSvg.classList.add(TsGantt.SVG_CLASS);
        const separator = document.createElement("div");
        separator.classList.add(TsGantt.SEPARATOR_CLASS);
        wrapper.appendChild(table);
        wrapper.appendChild(separator);
        wrapper.appendChild(chartSvg);
        this._container.appendChild(wrapper);
        this._wrapper = wrapper;
        this._table = table;
        this._chartSvg = chartSvg;
        this._separator = separator;
        document.addEventListener("mousedown", this.onMouseDownOnSep);
        document.addEventListener("mousemove", this.onMouseMoveOnSep);
        document.addEventListener("mouseup", this.onMouseUpOnSep);
    }
    clearTasks() {
        this._tasks.length = 0;
    }
    pushTasks(tasks) {
        this._tasks.push(...tasks);
    }
}
TsGantt.WRAPPER_CLASS = "ts-gantt-wrapper";
TsGantt.GRID_CLASS = "ts-gantt-grid";
TsGantt.SVG_CLASS = "ts-gantt-svg";
TsGantt.SEPARATOR_CLASS = "ts-gantt-separator";
TsGantt.GRID_MIN_WIDTH = 100;

export { TsGantt, TsGanttOptions, TsGanttTask };
