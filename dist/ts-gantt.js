function getRandomUuid() {
    return crypto.getRandomValues(new Uint32Array(4)).join("-");
}

class TsGanttTaskModel {
    constructor(id, parentId, name, progress, datePlannedStart, datePlannedEnd, dateActualStart = null, dateActualEnd = null) {
        this.id = id;
        this.parentId = parentId;
        this.name = name;
        this.progress = progress > 100 ? 100 : progress < 0 ? 0 : progress;
        this.datePlannedStart = datePlannedStart;
        this.datePlannedEnd = datePlannedEnd;
        this.dateActualStart = dateActualStart;
        this.dateActualEnd = dateActualEnd;
    }
}
class TsGanttTask {
    constructor(id, parentId, name, progress, datePlannedStart, datePlannedEnd, dateActualStart = null, dateActualEnd = null, nestingLvl = 0, parentUuid = null, uuid = null) {
        this.durationPlanned = 0;
        this.durationActual = 0;
        this._progress = 0;
        this.externalId = id;
        this.parentExternalId = parentId;
        this.name = name;
        this.progress = progress;
        this.datePlannedStart = datePlannedStart;
        this.datePlannedEnd = datePlannedEnd;
        this.dateActualStart = dateActualStart;
        this.dateActualEnd = dateActualEnd;
        this.nestingLvl = nestingLvl;
        this.parentUuid = parentUuid;
        this.uuid = uuid || getRandomUuid();
        this.refreshDuration();
    }
    set progress(value) {
        this._progress = value < 0 ? 0 : value > 100 ? 100 : value;
    }
    get progress() {
        return this._progress;
    }
    static convertModelsToTasks(taskModels, idsMap = new Map()) {
        const models = taskModels.slice();
        const tasks = [];
        let currentLevelTasks = [];
        for (let i = models.length - 1; i >= 0; i--) {
            const model = models[i];
            if (model.parentId === null) {
                const newTask = new TsGanttTask(model.id, model.parentId, model.name, model.progress, model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd, 0, null, idsMap.get(model.id));
                tasks.push(newTask);
                currentLevelTasks.push(newTask);
                models.splice(i, 1);
            }
        }
        let currentNestingLvl = 1;
        while (models.length !== 0 || currentLevelTasks.length !== 0) {
            const nextLevelTasks = [];
            currentLevelTasks.forEach(task => {
                for (let i = models.length - 1; i >= 0; i--) {
                    const model = models[i];
                    if (model.parentId === task.externalId) {
                        const newTask = new TsGanttTask(model.id, model.parentId, model.name, model.progress, model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd, currentNestingLvl, task.uuid, idsMap.get(model.id));
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
    static convertTasksToModels(tasks) {
        return tasks.map(x => new TsGanttTaskModel(x.externalId, x.parentExternalId, x.name, x.progress, x.datePlannedStart, x.datePlannedEnd, x.dateActualStart, x.dateActualEnd));
    }
    static detectTaskChanges(data) {
        const { oldTasks, newTasks } = data;
        const oldUuids = oldTasks.map(x => x.uuid);
        const newUuids = newTasks.map(x => x.uuid);
        const deleted = oldTasks.filter(x => !newUuids.includes(x.uuid));
        const added = [];
        const changed = [];
        const unchanged = [];
        for (const newTask of newTasks) {
            if (!oldUuids.includes(newTask.uuid)) {
                added.push(newTask);
                continue;
            }
            const oldTask = oldTasks.find(x => x.uuid === newTask.uuid);
            if (newTask.equals(oldTask)) {
                unchanged.push(newTask);
            }
            else {
                changed.push(newTask);
            }
        }
        return { deleted, added, changed, unchanged };
    }
    static getTasksIdsMap(tasks) {
        const idsMap = new Map();
        for (const task of tasks) {
            if (!idsMap.has(task.externalId)) {
                idsMap.set(task.externalId, task.uuid);
            }
        }
        return idsMap;
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
    equals(another) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return this.uuid === another.uuid
            && this.parentUuid === another.parentUuid
            && this.nestingLvl === another.nestingLvl
            && this.name === another.name
            && this.progress === another.progress
            && ((_a = this.datePlannedStart) === null || _a === void 0 ? void 0 : _a.getTime()) === ((_b = another.datePlannedStart) === null || _b === void 0 ? void 0 : _b.getTime())
            && ((_c = this.datePlannedEnd) === null || _c === void 0 ? void 0 : _c.getTime()) === ((_d = another.datePlannedEnd) === null || _d === void 0 ? void 0 : _d.getTime())
            && ((_e = this.dateActualStart) === null || _e === void 0 ? void 0 : _e.getTime()) === ((_f = another.dateActualStart) === null || _f === void 0 ? void 0 : _f.getTime())
            && ((_g = this.dateActualEnd) === null || _g === void 0 ? void 0 : _g.getTime()) === ((_h = another.dateActualEnd) === null || _h === void 0 ? void 0 : _h.getTime());
    }
}
class TsGanttTaskUpdateResult {
}
class TsGanttTaskChangesDetectionResult {
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

class TsGanttChart {
    constructor(classList) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add(...classList);
        this._htmlSvg = svg;
    }
    get htmlSvg() {
        return this._htmlSvg;
    }
}

class TsGanttTable {
    constructor(classList, minWidth) {
        const table = document.createElement("table");
        table.classList.add(...classList);
        this._htmlTable = table;
        this._minWidth = minWidth;
    }
    get htmlTable() {
        return this._htmlTable;
    }
    setWidth(width) {
        this._htmlTable.style.width = (Math.max(this._minWidth, width)) + "px";
        this._htmlTable.style.flexGrow = "0";
    }
}

class TsGantt {
    constructor(containerSelector, options) {
        this._tasks = [];
        this._htmlSeparatorDragActive = false;
        this.onMouseDownOnSep = (e) => {
            if (e.target === this._htmlSeparator) {
                this._htmlSeparatorDragActive = true;
            }
        };
        this.onMouseMoveOnSep = (e) => {
            if (!this._htmlSeparatorDragActive) {
                return false;
            }
            const wrapperLeftOffset = this._htmlWrapper.offsetLeft;
            const pointerRelX = e.clientX - wrapperLeftOffset;
            this._table.setWidth(pointerRelX);
        };
        this.onMouseUpOnSep = (e) => {
            this._htmlSeparatorDragActive = false;
        };
        this._htmlContainer = document.querySelector(containerSelector);
        if (!this._htmlContainer) {
            throw new Error("Container is null");
        }
        this.createLayout();
        this._options = new TsGanttOptions(options);
    }
    get tasks() {
        return TsGanttTask.convertTasksToModels(this._tasks);
    }
    set tasks(taskModels) {
        const updateResult = this.updateTasks(taskModels);
        const changeDetectionResult = TsGanttTask.detectTaskChanges(updateResult);
        this.updateRows(changeDetectionResult);
    }
    destroy() {
        document.removeEventListener("mousedown", this.onMouseDownOnSep);
        document.removeEventListener("mousemove", this.onMouseMoveOnSep);
        document.removeEventListener("mouseup", this.onMouseUpOnSep);
    }
    createLayout() {
        const wrapper = document.createElement("div");
        wrapper.classList.add(TsGantt.WRAPPER_CLASS);
        const separator = document.createElement("div");
        separator.classList.add(TsGantt.SEPARATOR_CLASS);
        this._table = new TsGanttTable([TsGantt.TABLE_CLASS], TsGantt.TABLE_MIN_WIDTH);
        this._chart = new TsGanttChart([TsGantt.CHART_CLASS]);
        wrapper.appendChild(this._table.htmlTable);
        wrapper.appendChild(separator);
        wrapper.appendChild(this._chart.htmlSvg);
        this._htmlContainer.appendChild(wrapper);
        this._htmlWrapper = wrapper;
        this._htmlSeparator = separator;
        document.addEventListener("mousedown", this.onMouseDownOnSep);
        document.addEventListener("mousemove", this.onMouseMoveOnSep);
        document.addEventListener("mouseup", this.onMouseUpOnSep);
    }
    updateTasks(taskModels) {
        const oldTasks = this._tasks;
        const oldIdsMap = TsGanttTask.getTasksIdsMap(oldTasks);
        const newTasks = TsGanttTask.convertModelsToTasks(taskModels, oldIdsMap);
        this._tasks = newTasks;
        return { oldTasks, newTasks };
    }
    updateRows(data) {
    }
}
TsGantt.WRAPPER_CLASS = "ts-gantt-wrapper";
TsGantt.TABLE_CLASS = "ts-gantt-grid";
TsGantt.CHART_CLASS = "ts-gantt-chart";
TsGantt.SEPARATOR_CLASS = "ts-gantt-separator";
TsGantt.TABLE_MIN_WIDTH = 100;

export { TsGantt, TsGanttChart, TsGanttOptions, TsGanttTable, TsGanttTask, TsGanttTaskChangesDetectionResult, TsGanttTaskModel, TsGanttTaskUpdateResult };
