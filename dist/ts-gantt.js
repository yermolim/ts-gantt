class TsGanttConst {
}
TsGanttConst.WRAPPER_CLASS = "tsg-wrapper";
TsGanttConst.FOOTER_CLASS = "tsg-footer";
TsGanttConst.TABLE_WRAPPER_CLASS = "tsg-table-wrapper";
TsGanttConst.CHART_WRAPPER_CLASS = "tsg-chart-wrapper";
TsGanttConst.TABLE_CLASS = "tsg-table";
TsGanttConst.CHART_CLASS = "tsg-chart";
TsGanttConst.SEPARATOR_CLASS = "tsg-separator";
TsGanttConst.ROW_UUID_ATTRIBUTE = "data-tsg-row-uuid";
TsGanttConst.ROW_UUID_DATASET_KEY = "tsgRowUuid";
TsGanttConst.ROW_SELECTED_CLASS = "selected";
TsGanttConst.ROW_CLICK = "tsgrowclick";
TsGanttConst.TABLE_CELL_TEXT_WRAPPER_CLASS = "tsg-cell-text-wrapper";
TsGanttConst.TABLE_CELL_TEXT_CLASS = "tsg-cell-text";
TsGanttConst.TABLE_CELL_INDENT_CLASS = "tsg-cell-text-indent";
TsGanttConst.TABLE_CELL_EXPANDER_CLASS = "tsg-cell-text-expander";
TsGanttConst.CELL_EXPANDER_CLICK = "tsgexpanderclick";
TsGanttConst.CELL_EXPANDER_SYMBOL = "◆";
TsGanttConst.CELL_EXPANDER_EXPANDABLE_SYMBOL = "⬘";
TsGanttConst.CELL_EXPANDER_EXPANDED_SYMBOL = "⬙";
TsGanttConst.CHART_HEADER_CLASS = "tsg-chart-header";
TsGanttConst.CHART_HEADER_BACKGROUND_CLASS = "tsg-chart-header-bg";
TsGanttConst.CHART_HEADER_GRIDLINES_CLASS = "tsg-chart-header-gl";
TsGanttConst.CHART_HEADER_TEXT_CLASS = "tsg-chart-header-text";
TsGanttConst.CHART_BODY_CLASS = "tsg-chart-body";
TsGanttConst.CHART_BODY_BACKGROUND_CLASS = "tsg-chart-body-bg";
TsGanttConst.CHART_BODY_GRIDLINES_CLASS = "tsg-chart-body-gl";
TsGanttConst.CHART_BODY_ROW_BACKGROUND_CLASS = "tsg-chart-body-row-bg";

function getRandomUuid() {
    return crypto.getRandomValues(new Uint32Array(4)).join("-");
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

class TsGanttTaskModel {
    constructor(id, parentId, name, progress, datePlannedStart, datePlannedEnd, dateActualStart = null, dateActualEnd = null, localizedNames = {}) {
        this.id = id;
        this.parentId = parentId;
        this.name = name;
        this.localizedNames = localizedNames;
        this.progress = progress > 100 ? 100 : progress < 0 ? 0 : progress;
        this.datePlannedStart = datePlannedStart;
        this.datePlannedEnd = datePlannedEnd;
        this.dateActualStart = dateActualStart;
        this.dateActualEnd = dateActualEnd;
    }
}
class TsGanttTask {
    constructor(id, parentId, name, localizedNames, progress, datePlannedStart, datePlannedEnd, dateActualStart = null, dateActualEnd = null, nestingLvl = 0, hasChildren = false, parentUuid = null, uuid = null) {
        this._progress = 0;
        this.externalId = id;
        this.parentExternalId = parentId;
        this.name = name;
        this.localizedNames = localizedNames;
        this.progress = progress;
        this.datePlannedStart = datePlannedStart;
        this.datePlannedEnd = datePlannedEnd;
        this.dateActualStart = dateActualStart;
        this.dateActualEnd = dateActualEnd;
        this.nestingLvl = nestingLvl;
        this.hasChildren = hasChildren;
        this.parentUuid = parentUuid;
        this.uuid = uuid || getRandomUuid();
        this.shown = !parentUuid;
        this.expanded = false;
        this.selected = false;
    }
    set progress(value) {
        this._progress = value < 0 ? 0 : value > 100 ? 100 : value;
    }
    get progress() {
        return this._progress;
    }
    static convertModelsToTasks(taskModels, idsMap = new Map()) {
        const models = taskModels.slice();
        const allParentIds = new Set(models.map(x => x.parentId));
        const tasks = [];
        let currentLevelTasks = [];
        for (let i = models.length - 1; i >= 0; i--) {
            const model = models[i];
            if (model.parentId === null) {
                const newTask = new TsGanttTask(model.id, model.parentId, model.name, model.localizedNames, model.progress, model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd, 0, allParentIds.has(model.id), null, idsMap.get(model.id));
                tasks.push(newTask);
                currentLevelTasks.push(newTask);
                models.splice(i, 1);
            }
        }
        let currentNestingLvl = 1;
        while (models.length !== 0 || currentLevelTasks.length !== 0) {
            const nextLevelTasks = [];
            currentLevelTasks.filter(x => x.hasChildren).forEach(task => {
                for (let i = models.length - 1; i >= 0; i--) {
                    const model = models[i];
                    if (model.parentId === task.externalId) {
                        const newTask = new TsGanttTask(model.id, model.parentId, model.name, model.localizedNames, model.progress, model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd, currentNestingLvl, allParentIds.has(model.id), task.uuid, idsMap.get(model.id));
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
        return tasks.map(x => new TsGanttTaskModel(x.externalId, x.parentExternalId, x.name, x.progress, x.datePlannedStart, x.datePlannedEnd, x.dateActualStart, x.dateActualEnd, x.localizedNames));
    }
    static detectTaskChanges(data) {
        const { oldTasks, newTasks } = data;
        const oldUuids = oldTasks.map(x => x.uuid);
        const newUuids = newTasks.map(x => x.uuid);
        const deleted = oldTasks.filter(x => !newUuids.includes(x.uuid));
        const added = [];
        const changed = [];
        for (const newTask of newTasks) {
            if (!oldUuids.includes(newTask.uuid)) {
                added.push(newTask);
                continue;
            }
            const oldTask = oldTasks.find(x => x.uuid === newTask.uuid);
            if (!newTask.equals(oldTask)) {
                changed.push(newTask);
            }
        }
        return { deleted, added, changed, all: newTasks };
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
    equals(another) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return this.uuid === another.uuid
            && this.parentUuid === another.parentUuid
            && this.nestingLvl === another.nestingLvl
            && this.hasChildren === another.hasChildren
            && this.name === another.name
            && this.progress === another.progress
            && ((_a = this.datePlannedStart) === null || _a === void 0 ? void 0 : _a.getTime()) === ((_b = another.datePlannedStart) === null || _b === void 0 ? void 0 : _b.getTime())
            && ((_c = this.datePlannedEnd) === null || _c === void 0 ? void 0 : _c.getTime()) === ((_d = another.datePlannedEnd) === null || _d === void 0 ? void 0 : _d.getTime())
            && ((_e = this.dateActualStart) === null || _e === void 0 ? void 0 : _e.getTime()) === ((_f = another.dateActualStart) === null || _f === void 0 ? void 0 : _f.getTime())
            && ((_g = this.dateActualEnd) === null || _g === void 0 ? void 0 : _g.getTime()) === ((_h = another.dateActualEnd) === null || _h === void 0 ? void 0 : _h.getTime())
            && this.expanded === another.expanded
            && this.shown === another.shown
            && this.selected === another.selected;
    }
    compareTo(another) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        if (this.nestingLvl > another.nestingLvl) {
            return 1;
        }
        if (this.nestingLvl < another.nestingLvl) {
            return -1;
        }
        if (((_a = this.datePlannedStart) === null || _a === void 0 ? void 0 : _a.getTime()) > ((_b = another.datePlannedStart) === null || _b === void 0 ? void 0 : _b.getTime())) {
            return 1;
        }
        if (((_c = this.datePlannedStart) === null || _c === void 0 ? void 0 : _c.getTime()) < ((_d = another.datePlannedStart) === null || _d === void 0 ? void 0 : _d.getTime())) {
            return -1;
        }
        if (((_e = this.datePlannedEnd) === null || _e === void 0 ? void 0 : _e.getTime()) > ((_f = another.datePlannedEnd) === null || _f === void 0 ? void 0 : _f.getTime())) {
            return 1;
        }
        if (((_g = this.datePlannedEnd) === null || _g === void 0 ? void 0 : _g.getTime()) < ((_h = another.datePlannedEnd) === null || _h === void 0 ? void 0 : _h.getTime())) {
            return -1;
        }
        if (((_j = this.dateActualStart) === null || _j === void 0 ? void 0 : _j.getTime()) > ((_k = another.dateActualStart) === null || _k === void 0 ? void 0 : _k.getTime())) {
            return 1;
        }
        if (((_l = this.dateActualStart) === null || _l === void 0 ? void 0 : _l.getTime()) < ((_m = another.dateActualStart) === null || _m === void 0 ? void 0 : _m.getTime())) {
            return -1;
        }
        if (((_o = this.dateActualEnd) === null || _o === void 0 ? void 0 : _o.getTime()) > ((_p = another.dateActualEnd) === null || _p === void 0 ? void 0 : _p.getTime())) {
            return 1;
        }
        if (((_q = this.dateActualEnd) === null || _q === void 0 ? void 0 : _q.getTime()) < ((_r = another.dateActualEnd) === null || _r === void 0 ? void 0 : _r.getTime())) {
            return -1;
        }
        return 0;
    }
}
class TsGanttTaskUpdateResult {
}
class TsGanttTaskChangesDetectionResult {
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var dayjs_min = createCommonjsModule(function (module, exports) {
!function(t,n){module.exports=n();}(commonjsGlobal,function(){var t="millisecond",n="second",e="minute",r="hour",i="day",s="week",u="month",o="quarter",a="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,n,e){var r=String(t);return !r||r.length>=n?t:""+Array(n+1-r.length).join(e)+t},d={s:c,z:function(t){var n=-t.utcOffset(),e=Math.abs(n),r=Math.floor(e/60),i=e%60;return (n<=0?"+":"-")+c(r,2,"0")+":"+c(i,2,"0")},m:function(t,n){var e=12*(n.year()-t.year())+(n.month()-t.month()),r=t.clone().add(e,u),i=n-r<0,s=t.clone().add(e+(i?-1:1),u);return Number(-(e+(n-r)/(i?r-s:s-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:a,w:s,d:i,D:"date",h:r,m:e,s:n,ms:t,Q:o}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},l="en",m={};m[l]=$;var y=function(t){return t instanceof v},M=function(t,n,e){var r;if(!t)return l;if("string"==typeof t)m[t]&&(r=t),n&&(m[t]=n,r=t);else {var i=t.name;m[i]=t,r=i;}return !e&&r&&(l=r),r||!e&&l},g=function(t,n,e){if(y(t))return t.clone();var r=n?"string"==typeof n?{format:n,pl:e}:n:{};return r.date=t,new v(r)},D=d;D.l=M,D.i=y,D.w=function(t,n){return g(t,{locale:n.$L,utc:n.$u,$offset:n.$offset})};var v=function(){function c(t){this.$L=this.$L||M(t.locale,null,!0),this.parse(t);}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var n=t.date,e=t.utc;if(null===n)return new Date(NaN);if(D.u(n))return new Date;if(n instanceof Date)return new Date(n);if("string"==typeof n&&!/Z$/i.test(n)){var r=n.match(h);if(r)return e?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(n)}(t),this.init();},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},d.$utils=function(){return D},d.isValid=function(){return !("Invalid Date"===this.$d.toString())},d.isSame=function(t,n){var e=g(t);return this.startOf(n)<=e&&e<=this.endOf(n)},d.isAfter=function(t,n){return g(t)<this.startOf(n)},d.isBefore=function(t,n){return this.endOf(n)<g(t)},d.$g=function(t,n,e){return D.u(t)?this[n]:this.set(e,t)},d.year=function(t){return this.$g(t,"$y",a)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",e)},d.second=function(t){return this.$g(t,"$s",n)},d.millisecond=function(n){return this.$g(n,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,o){var h=this,f=!!D.u(o)||o,c=D.p(t),d=function(t,n){var e=D.w(h.$u?Date.UTC(h.$y,n,t):new Date(h.$y,n,t),h);return f?e:e.endOf(i)},$=function(t,n){return D.w(h.toDate()[t].apply(h.toDate(),(f?[0,0,0,0]:[23,59,59,999]).slice(n)),h)},l=this.$W,m=this.$M,y=this.$D,M="set"+(this.$u?"UTC":"");switch(c){case a:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var g=this.$locale().weekStart||0,v=(l<g?l+7:l)-g;return d(f?y-v:y+(6-v),m);case i:case"date":return $(M+"Hours",0);case r:return $(M+"Minutes",1);case e:return $(M+"Seconds",2);case n:return $(M+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,o){var h,f=D.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[i]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[a]=c+"FullYear",h[r]=c+"Hours",h[e]=c+"Minutes",h[n]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],$=f===i?this.$D+(o-this.$W):o;if(f===u||f===a){var l=this.clone().set("date",1);l.$d[d]($),l.init(),this.$d=l.set("date",Math.min(this.$D,l.daysInMonth())).toDate();}else d&&this.$d[d]($);return this.init(),this},d.set=function(t,n){return this.clone().$set(t,n)},d.get=function(t){return this[D.p(t)]()},d.add=function(t,o){var h,f=this;t=Number(t);var c=D.p(o),d=function(n){var e=g(f);return D.w(e.date(e.date()+Math.round(n*t)),f)};if(c===u)return this.set(u,this.$M+t);if(c===a)return this.set(a,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(h={},h[e]=6e4,h[r]=36e5,h[n]=1e3,h)[c]||1,l=this.$d.getTime()+t*$;return D.w(l,this)},d.subtract=function(t,n){return this.add(-1*t,n)},d.format=function(t){var n=this;if(!this.isValid())return "Invalid Date";var e=t||"YYYY-MM-DDTHH:mm:ssZ",r=D.z(this),i=this.$locale(),s=this.$H,u=this.$m,o=this.$M,a=i.weekdays,h=i.months,c=function(t,r,i,s){return t&&(t[r]||t(n,e))||i[r].substr(0,s)},d=function(t){return D.s(s%12||12,t,"0")},$=i.meridiem||function(t,n,e){var r=t<12?"AM":"PM";return e?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:D.s(o+1,2,"0"),MMM:c(i.monthsShort,o,h,3),MMMM:h[o]||h(this,e),D:this.$D,DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:c(i.weekdaysMin,this.$W,a,2),ddd:c(i.weekdaysShort,this.$W,a,3),dddd:a[this.$W],H:String(s),HH:D.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:D.s(u,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:r};return e.replace(f,function(t,n){return n||l[t]||r.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=D.p(h),$=g(t),l=6e4*($.utcOffset()-this.utcOffset()),m=this-$,y=D.m(this,$);return y=(c={},c[a]=y/12,c[u]=y,c[o]=y/3,c[s]=(m-l)/6048e5,c[i]=(m-l)/864e5,c[r]=m/36e5,c[e]=m/6e4,c[n]=m/1e3,c)[d]||m,f?y:D.a(y)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,n){if(!t)return this.$L;var e=this.clone(),r=M(t,n,!0);return r&&(e.$L=r),e},d.clone=function(){return D.w(this.$d,this)},d.toDate=function(){return new Date(this.valueOf())},d.toJSON=function(){return this.isValid()?this.toISOString():null},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return g.prototype=v.prototype,g.extend=function(t,n){return t(n,v,g),g},g.locale=M,g.isDayjs=y,g.unix=function(t){return g(1e3*t)},g.en=m[l],g.Ls=m,g});
});

class TsGanttOptions {
    constructor(item = null) {
        this.enableChartEdit = false;
        this.enablePlannedDatesEdit = true;
        this.enableActualDatesEdit = true;
        this.bindParentDatesToChild = true;
        this.enableProgressEdit = true;
        this.columnsMinWidthPx = [200, 100, 100, 100, 100, 100, 100, 100];
        this.columnsContentAlign = ["start", "end", "center", "center", "center", "center", "center", "center"];
        this.chartHeaderHeightPx = 90;
        this.chartRowHeightPx = 40;
        this.chartBarMode = "both";
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
        };
        this.localeDateFormat = {
            en: "MM/DD/YYYY",
            uk: "DD.MM.YYYY",
            ru: "DD.MM.YYYY",
        };
        this.localeFirstWeekDay = {
            en: 0,
            uk: 1,
            ru: 1,
        };
        this.localeDateMonths = {
            en: ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"],
            uk: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
                "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
            ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        };
        this.localeDateDays = {
            en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            uk: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
            ru: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        };
        this.localeDateDaysShort = {
            en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
            uk: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            ru: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        };
        this.localeDateScale = {
            en: ["Weeks", "Months", "Years"],
            uk: ["Тижні", "Місяці", "Роки"],
            ru: ["Недели", "Месяцы", "Годы"],
        };
        this.localeFooters = {
            en: ["Total tasks", "Completed"],
            uk: ["Всього задач", "Завершено"],
            ru: ["Всего задач", "Завершено"],
        };
        this.localeHeaders = {
            en: ["Name", "Progress", "Start date planned", "End date planned",
                "Start date actual", "End date actual", "Duration planned", "Duration actual"],
            uk: ["Ім'я", "Прогрес", "Дата початку планована", "Дата завершення планована",
                "Дата початку фактична", "Дата завершення фактична", "Тривалість планована", "Тривалість фактична"],
            ru: ["Имя", "Прогресс", "Дата начала планируемая", "Дата окончания планируемая",
                "Дата начала фактическая", "Дата окончания фактическая", "Длительность планируемая", "Длительность фактическая"],
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
        };
        this.columnValueGetters = [
            (task) => task.localizedNames[this.locale] || task.name,
            (task) => (+task.progress.toFixed(2)).toLocaleString("en-US")
                .replace(".", this.localeDecimalSeparator[this.locale] || ".") + " %",
            (task) => dayjs_min(task.datePlannedStart)
                .format(this.localeDateFormat[this.locale] || "L"),
            (task) => dayjs_min(task.datePlannedEnd)
                .format(this.localeDateFormat[this.locale] || "L"),
            (task) => task.dateActualStart
                ? dayjs_min(task.dateActualStart).format(this.localeDateFormat[this.locale] || "L")
                : "",
            (task) => task.dateActualEnd
                ? dayjs_min(task.dateActualEnd).format(this.localeDateFormat[this.locale] || "L")
                : "",
            (task) => {
                const end = dayjs_min(task.datePlannedEnd);
                const start = dayjs_min(task.datePlannedStart);
                const duration = end.diff(start, "day") + 1;
                return this.localeDurationFormatters[this.locale]
                    ? this.localeDurationFormatters[this.locale](duration)
                    : duration.toString();
            },
            (task) => {
                if (!task.dateActualEnd || !task.dateActualStart) {
                    return "";
                }
                const end = dayjs_min(task.dateActualEnd);
                const start = dayjs_min(task.dateActualStart);
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

class TsGanttChartBarGroup {
    constructor(task, mode, dayWidth, height, y0, y1) {
        this.task = task;
    }
}
class TsGanttChartRow {
    constructor(barGroup, rowWidth, rowHeight) {
        this.barGroup = barGroup;
    }
}
class TsGanttChart {
    constructor(options) {
        this._chartBarGroups = [];
        this._chartRows = [];
        this._options = options;
        const svg = createSvgElement("svg", [TsGanttConst.CHART_CLASS]);
        this._html = svg;
    }
    get html() {
        return this._html;
    }
    update(forceRedraw, data) {
        const datesCheckResult = this.checkDates(data.all);
        if (!datesCheckResult || forceRedraw) {
            this.refreshHeader();
        }
        if (data) {
            this.refreshBarGroups(data);
        }
        this.refreshRows();
        this.refreshBody();
        this.redraw();
    }
    checkDates(tasks) {
        const currentDateMin = this._dateMinOffset;
        const currentDateMax = this._dateMaxOffset;
        const chartScale = this._options.chartScale;
        const dateOffsetMin = this._options.chartDateOffsetDaysMin[chartScale];
        const dateOffset = this._options.chartDateOffsetDays[chartScale];
        let dateMin = dayjs_min();
        let dateMax = dayjs_min();
        for (const task of tasks) {
            const plannedStart = dayjs_min(task.datePlannedStart);
            const plannedEnd = dayjs_min(task.datePlannedEnd);
            const actualStart = task.dateActualStart ? dayjs_min(task.dateActualStart) : null;
            const actualEnd = task.dateActualEnd ? dayjs_min(task.dateActualEnd) : null;
            if (plannedStart.isBefore(dateMin)) {
                dateMin = plannedStart;
            }
            if (plannedEnd.isAfter(dateMax)) {
                dateMax = plannedEnd;
            }
            if (actualStart && actualStart.isBefore(dateMin)) {
                dateMin = actualStart;
            }
            if (actualEnd && actualEnd.isAfter(dateMax)) {
                dateMax = actualEnd;
            }
        }
        this._dateMin = dateMin;
        this._dateMax = dateMax;
        if (!currentDateMin
            || currentDateMin.isAfter(dateMin)
            || dateMin.diff(currentDateMin, "day") < dateOffsetMin) {
            this._dateMinOffset = dateMin.subtract(dateOffset, "day");
        }
        if (!currentDateMax
            || currentDateMax.isBefore(dateMax)
            || currentDateMax.diff(dateMax, "day") < dateOffsetMin) {
            this._dateMaxOffset = dateMax.add(dateOffset, "day");
        }
        return this._dateMinOffset === currentDateMin && this._dateMaxOffset === currentDateMax;
    }
    refreshBarGroups(data) {
        const mode = this._options.chartBarMode;
        const rowHeight = this._options.chartRowHeightPx;
        data.deleted.forEach(x => {
            const index = this._chartBarGroups.findIndex(y => y.task.uuid === x.uuid);
            if (index !== 1) {
                this._chartBarGroups.splice(index, 1);
            }
        });
        data.changed.forEach(x => {
            const index = this._chartBarGroups.findIndex(y => y.task.uuid === x.uuid);
            if (index !== -1) {
                this._chartBarGroups[index] = new TsGanttChartBarGroup(x, mode, 0, 0, 0, 0);
            }
        });
        data.added.forEach(x => this._chartBarGroups.push(new TsGanttChartBarGroup(x, mode, 0, 0, 0, 0)));
    }
    refreshRows() {
        this._chartRows = this.getChartRowsRecursively(this._chartBarGroups, null, this._width, this._options.chartRowHeightPx);
    }
    getChartRowsRecursively(barGroups, parentUuid, rowWidth, rowHeight) {
        const barGroupsFiltered = barGroups.filter(x => x.task.parentUuid === parentUuid)
            .sort((a, b) => a.task.compareTo(b.task));
        const rows = [];
        for (const barGroup of barGroupsFiltered) {
            if (!barGroup.task.shown) {
                continue;
            }
            rows.push(new TsGanttChartRow(barGroup, rowWidth, rowHeight));
            if (barGroup.task.expanded) {
                rows.push(...this.getChartRowsRecursively(barGroups, barGroup.task.uuid, rowWidth, rowHeight));
            }
        }
        return rows;
    }
    refreshHeader() {
        const scale = this._options.chartScale;
        const dayWidth = this._options.chartDayWidthPx[scale];
        const height = this._options.chartHeaderHeightPx;
        const minDate = this._dateMinOffset;
        const maxDate = this._dateMaxOffset;
        const dates = getAllDatesBetweenTwoDates(this._dateMinOffset, this._dateMaxOffset);
        const width = dates.length * dayWidth;
        const locale = this._options.locale;
        const months = this._options.localeDateMonths[locale];
        const daysShort = this._options.localeDateDaysShort[locale];
        const days = this._options.localeDateDays[locale];
        const header = createSvgElement("svg", [TsGanttConst.CHART_HEADER_CLASS], [
            ["width", width + ""],
            ["height", height + ""],
        ]);
        const headerBg = createSvgElement("rect", [TsGanttConst.CHART_HEADER_BACKGROUND_CLASS], [
            ["width", width + ""],
            ["height", height + ""],
        ], header);
        let currentDayOffset = 0;
        let monthStartOffset = 0;
        let yearStartOffset = 0;
        const verticalLinesXCoords = [];
        if (scale === "year") {
            for (const date of dates) {
                const nextDayOffset = currentDayOffset + dayWidth;
                if (date.isSame(date.endOf("year").startOf("day")) || date.isSame(maxDate)) {
                    const yearWidth = nextDayOffset - yearStartOffset;
                    const yearSvg = createSvgElement("svg", [], [
                        ["x", yearStartOffset + ""],
                        ["y", "0"],
                        ["width", yearWidth + ""],
                        ["height", height + ""],
                    ], header);
                    if (yearWidth >= 60) {
                        const yearText = createSvgElement("text", [TsGanttConst.CHART_HEADER_TEXT_CLASS], [
                            ["x", "50%"],
                            ["y", "50%"],
                            ["dominant-baseline", "middle"],
                            ["text-anchor", "middle"],
                        ], yearSvg, date.year() + "");
                    }
                    const rightBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
                        ["x1", nextDayOffset + ""],
                        ["y1", 0 + ""],
                        ["x2", nextDayOffset + ""],
                        ["y2", height + ""],
                    ], header);
                    verticalLinesXCoords.push(nextDayOffset);
                    yearStartOffset = nextDayOffset;
                }
                currentDayOffset = nextDayOffset;
            }
        }
        else if (scale === "month") {
            const rowHeight = height / 2;
            const y0 = 0;
            const y1 = rowHeight;
            const rowBottomBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
                ["x1", 0 + ""],
                ["y1", y1 + ""],
                ["x2", width + ""],
                ["y2", y1 + ""],
            ], header);
            for (const date of dates) {
                const nextDayOffset = currentDayOffset + dayWidth;
                if (date.isSame(date.endOf("year").startOf("day")) || date.isSame(maxDate)) {
                    const yearWidth = nextDayOffset - yearStartOffset;
                    const yearSvg = createSvgElement("svg", [], [
                        ["x", yearStartOffset + ""],
                        ["y", y0 + ""],
                        ["width", yearWidth + ""],
                        ["height", rowHeight + ""],
                    ], header);
                    if (yearWidth >= 60) {
                        const yearText = createSvgElement("text", [TsGanttConst.CHART_HEADER_TEXT_CLASS], [
                            ["x", "50%"],
                            ["y", "50%"],
                            ["dominant-baseline", "middle"],
                            ["text-anchor", "middle"],
                        ], yearSvg, date.year() + "");
                    }
                    const yearRightBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
                        ["x1", nextDayOffset + ""],
                        ["y1", y0 + ""],
                        ["x2", nextDayOffset + ""],
                        ["y2", y1 + ""],
                    ], header);
                    yearStartOffset = nextDayOffset;
                }
                if (date.isSame(date.endOf("month").startOf("day")) || date.isSame(maxDate)) {
                    const monthWidth = nextDayOffset - monthStartOffset;
                    const monthSvg = createSvgElement("svg", [], [
                        ["x", monthStartOffset + ""],
                        ["y", y1 + ""],
                        ["width", monthWidth + ""],
                        ["height", rowHeight + ""],
                    ], header);
                    if (monthWidth >= 60) {
                        const monthName = months[date.month()];
                        const monthText = createSvgElement("text", [TsGanttConst.CHART_HEADER_TEXT_CLASS], [
                            ["x", "50%"],
                            ["y", "50%"],
                            ["dominant-baseline", "middle"],
                            ["text-anchor", "middle"],
                        ], monthSvg, monthName);
                    }
                    const monthRightBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
                        ["x1", nextDayOffset + ""],
                        ["y1", y1 + ""],
                        ["x2", nextDayOffset + ""],
                        ["y2", height + ""],
                    ], header);
                    verticalLinesXCoords.push(nextDayOffset);
                    monthStartOffset = nextDayOffset;
                }
                currentDayOffset = nextDayOffset;
            }
        }
        else if (scale === "week" || scale === "day") {
            const rowHeight = height / 3;
            const y0 = 0;
            const y1 = rowHeight;
            const y2 = rowHeight * 2;
            const rowBottomBorder1 = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
                ["x1", 0 + ""],
                ["y1", y1 + ""],
                ["x2", width + ""],
                ["y2", y1 + ""],
            ], header);
            const rowBottomBorder2 = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
                ["x1", 0 + ""],
                ["y1", y2 + ""],
                ["x2", width + ""],
                ["y2", y2 + ""],
            ], header);
            for (const date of dates) {
                const nextDayOffset = currentDayOffset + dayWidth;
                if (date.isSame(date.endOf("year").startOf("day")) || date.isSame(maxDate)) {
                    const yearWidth = nextDayOffset - yearStartOffset;
                    const yearSvg = createSvgElement("svg", [], [
                        ["x", yearStartOffset + ""],
                        ["y", y0 + ""],
                        ["width", yearWidth + ""],
                        ["height", rowHeight + ""],
                    ], header);
                    if (yearWidth >= 60) {
                        const yearText = createSvgElement("text", [TsGanttConst.CHART_HEADER_TEXT_CLASS], [
                            ["x", "50%"],
                            ["y", "50%"],
                            ["dominant-baseline", "middle"],
                            ["text-anchor", "middle"],
                        ], yearSvg, date.year() + "");
                    }
                    const yearRightBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
                        ["x1", nextDayOffset + ""],
                        ["y1", y0 + ""],
                        ["x2", nextDayOffset + ""],
                        ["y2", y1 + ""],
                    ], header);
                    yearStartOffset = nextDayOffset;
                }
                if (date.isSame(date.endOf("month").startOf("day")) || date.isSame(maxDate)) {
                    const monthWidth = nextDayOffset - monthStartOffset;
                    const monthSvg = createSvgElement("svg", [], [
                        ["x", monthStartOffset + ""],
                        ["y", y1 + ""],
                        ["width", monthWidth + ""],
                        ["height", rowHeight + ""],
                    ], header);
                    if (monthWidth >= 60) {
                        const monthName = months[date.month()];
                        const monthText = createSvgElement("text", [TsGanttConst.CHART_HEADER_TEXT_CLASS], [
                            ["x", "50%"],
                            ["y", "50%"],
                            ["dominant-baseline", "middle"],
                            ["text-anchor", "middle"],
                        ], monthSvg, monthName);
                    }
                    const monthRightBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
                        ["x1", nextDayOffset + ""],
                        ["y1", y1 + ""],
                        ["x2", nextDayOffset + ""],
                        ["y2", y2 + ""],
                    ], header);
                    monthStartOffset = nextDayOffset;
                }
                const daySvg = createSvgElement("svg", [], [
                    ["x", currentDayOffset + ""],
                    ["y", y2 + ""],
                    ["width", dayWidth + ""],
                    ["height", rowHeight + ""],
                ], header);
                const dayName = dayWidth < 30
                    ? date.date() + ""
                    : daysShort[date.day()] + " " + date.date();
                const dayText = createSvgElement("text", [TsGanttConst.CHART_HEADER_TEXT_CLASS], [
                    ["x", "50%"],
                    ["y", "50%"],
                    ["dominant-baseline", "middle"],
                    ["text-anchor", "middle"],
                ], daySvg, dayName);
                const dayRightBorder = createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
                    ["x1", nextDayOffset + ""],
                    ["y1", y2 + ""],
                    ["x2", nextDayOffset + ""],
                    ["y2", height + ""],
                ], header);
                verticalLinesXCoords.push(nextDayOffset);
                currentDayOffset = nextDayOffset;
            }
        }
        this._width = width;
        this._headerHeight = height;
        this._verticalLinesXCoords = verticalLinesXCoords;
        this._htmlHeader = header;
    }
    refreshBody() {
        const scale = this._options.chartScale;
        const width = this._width;
        const rowHeight = this._options.chartRowHeightPx;
        const rows = this._chartRows;
        const height = rowHeight * rows.length;
        const y0 = this._headerHeight;
        const body = createSvgElement("svg", [TsGanttConst.CHART_BODY_CLASS], [
            ["y", y0 + ""],
            ["width", width + ""],
            ["height", height + ""],
        ]);
        const bodyBg = createSvgElement("rect", [TsGanttConst.CHART_BODY_BACKGROUND_CLASS], [
            ["width", width + ""],
            ["height", height + ""],
        ], body);
        const selectedRowIndex = rows.findIndex(x => x.barGroup.task.selected);
        if (selectedRowIndex !== -1) {
            const selectedRowBg = createSvgElement("rect", [TsGanttConst.CHART_BODY_ROW_BACKGROUND_CLASS, TsGanttConst.ROW_SELECTED_CLASS], [
                ["y", (selectedRowIndex * rowHeight) + ""],
                ["width", width + ""],
                ["height", rowHeight + ""],
            ], body);
        }
        for (let i = 0; i < rows.length;) {
            const lineY = ++i * rowHeight - 0.5;
            const horizontalLine = createSvgElement("line", [TsGanttConst.CHART_BODY_GRIDLINES_CLASS], [
                ["x1", 0 + ""],
                ["y1", lineY + ""],
                ["x2", width + ""],
                ["y2", lineY + ""],
            ], body);
        }
        this._verticalLinesXCoords.forEach(x => {
            const verticalLine = createSvgElement("line", [TsGanttConst.CHART_BODY_GRIDLINES_CLASS], [
                ["x1", x + ""],
                ["y1", 0 + ""],
                ["x2", x + ""],
                ["y2", height + ""],
            ], body);
        });
        this._bodyHeight = height;
        this._htmlBody = body;
    }
    redraw() {
        const height = this._headerHeight + this._bodyHeight;
        const oldHtml = this._html;
        const newHtml = createSvgElement("svg", [TsGanttConst.CHART_CLASS], [
            ["width", this._width + ""],
            ["height", height + ""],
        ]);
        newHtml.append(this._htmlHeader, this._htmlBody);
        oldHtml.replaceWith(newHtml);
        this._html = newHtml;
    }
}

class TsGanttTableColumn {
    constructor(minWidth, textAlign, header, valueGetter) {
        this.minWidth = minWidth;
        this.contentAlign = textAlign;
        this.header = header;
        this.valueGetter = valueGetter;
        const headerCell = document.createElement("th");
        headerCell.style.minWidth = this.minWidth + "px";
        headerCell.innerHTML = this.header;
        this.html = this.generateHtml();
    }
    generateHtml() {
        const headerCell = document.createElement("th");
        headerCell.style.minWidth = this.minWidth + "px";
        headerCell.innerHTML = this.header;
        return headerCell;
    }
}
class TsGanttTableRow {
    constructor(task, columns) {
        this.task = task;
        this.html = this.generateHtml(columns);
    }
    generateHtml(columns) {
        const row = document.createElement("tr");
        row.setAttribute(TsGanttConst.ROW_UUID_ATTRIBUTE, this.task.uuid);
        row.addEventListener("click", (e) => {
            const target = e.target;
            if (!target.classList.contains(TsGanttConst.TABLE_CELL_EXPANDER_CLASS)) {
                row.dispatchEvent(new Event(TsGanttConst.ROW_CLICK, { bubbles: true }));
            }
        });
        if (this.task.selected) {
            row.classList.add(TsGanttConst.ROW_SELECTED_CLASS);
        }
        columns.forEach((x, i) => {
            const cell = document.createElement("td");
            const cellInnerDiv = document.createElement("div");
            cellInnerDiv.classList.add(TsGanttConst.TABLE_CELL_TEXT_WRAPPER_CLASS, x.contentAlign);
            if (i === 0) {
                for (let j = 0; j < this.task.nestingLvl; j++) {
                    cellInnerDiv.append(this.createSimpleIndent());
                }
                if (!this.task.hasChildren) {
                    cellInnerDiv.append(this.createSimpleIndent(TsGanttConst.CELL_EXPANDER_SYMBOL));
                }
                else {
                    const expander = document.createElement("p");
                    expander.classList.add(TsGanttConst.TABLE_CELL_EXPANDER_CLASS);
                    expander.setAttribute(TsGanttConst.ROW_UUID_ATTRIBUTE, this.task.uuid);
                    expander.innerHTML = this.task.expanded
                        ? TsGanttConst.CELL_EXPANDER_EXPANDED_SYMBOL
                        : TsGanttConst.CELL_EXPANDER_EXPANDABLE_SYMBOL;
                    expander.addEventListener("click", (e) => {
                        expander.dispatchEvent(new Event(TsGanttConst.CELL_EXPANDER_CLICK, { bubbles: true }));
                    });
                    cellInnerDiv.append(expander);
                }
            }
            const cellText = document.createElement("p");
            cellText.classList.add(TsGanttConst.TABLE_CELL_TEXT_CLASS);
            cellText.innerHTML = x.valueGetter(this.task);
            cellInnerDiv.append(cellText);
            cell.append(cellInnerDiv);
            row.append(cell);
        });
        return row;
    }
    createSimpleIndent(innerHtml = "") {
        const indent = document.createElement("p");
        indent.classList.add(TsGanttConst.TABLE_CELL_INDENT_CLASS);
        indent.innerHTML = innerHtml;
        return indent;
    }
}
class TsGanttTable {
    constructor(options) {
        this._tableRows = [];
        this._options = options;
        const table = document.createElement("table");
        table.classList.add(TsGanttConst.TABLE_CLASS);
        const tableHead = table.createTHead();
        const tableBody = table.createTBody();
        this._htmlHead = tableHead;
        this._htmlBody = tableBody;
        this._html = table;
        this.updateColumns();
    }
    get html() {
        return this._html;
    }
    update(updateColumns, data) {
        if (updateColumns) {
            this.updateColumns();
        }
        if (data) {
            this.updateRows(data);
        }
    }
    updateColumns() {
        const columns = [];
        for (let i = 0; i < 9; i++) {
            const minColumnWidth = this._options.columnsMinWidthPx[i];
            const contentAlign = this._options.columnsContentAlign[i];
            if (minColumnWidth) {
                columns.push(new TsGanttTableColumn(minColumnWidth, contentAlign, this._options.localeHeaders[this._options.locale][i] || "", this._options.columnValueGetters[i] || ((task) => "")));
            }
        }
        const headerRow = document.createElement("tr");
        columns.forEach(x => headerRow.append(x.html));
        this._tableColumns = columns;
        this._htmlHead.innerHTML = "";
        this._htmlHead.append(headerRow);
    }
    updateRows(data) {
        data.deleted.forEach(x => {
            const index = this._tableRows.findIndex(y => y.task.uuid === x.uuid);
            if (index !== 1) {
                this._tableRows.splice(index, 1);
            }
        });
        data.changed.forEach(x => {
            const index = this._tableRows.findIndex(y => y.task.uuid === x.uuid);
            if (index !== -1) {
                this._tableRows[index] = new TsGanttTableRow(x, this._tableColumns);
            }
        });
        data.added.forEach(x => this._tableRows.push(new TsGanttTableRow(x, this._tableColumns)));
        this._htmlBody.innerHTML = "";
        this._htmlBody.append(...this.getRowsHtmlRecursively(this._tableRows, null));
    }
    getRowsHtmlRecursively(rows, parentUuid) {
        const rowsFiltered = rows.filter(x => x.task.parentUuid === parentUuid)
            .sort((a, b) => a.task.compareTo(b.task));
        const rowsHtml = [];
        for (const row of rowsFiltered) {
            if (!row.task.shown) {
                continue;
            }
            rowsHtml.push(row.html);
            if (row.task.expanded) {
                rowsHtml.push(...this.getRowsHtmlRecursively(rows, row.task.uuid));
            }
        }
        return rowsHtml;
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
            const wrapperWidth = this._htmlWrapper.getBoundingClientRect().width;
            const userDefinedWidth = e.clientX - wrapperLeftOffset;
            this._htmlTableWrapper.style.width = (userDefinedWidth - 5) + "px";
            this._htmlChartWrapper.style.width = (wrapperWidth - userDefinedWidth) + "px";
        };
        this.onMouseUpOnSep = (e) => {
            this._htmlSeparatorDragActive = false;
        };
        this.onRowClick = (e) => {
            const target = e.target;
            const uuid = target.dataset[TsGanttConst.ROW_UUID_DATASET_KEY];
            const newSelectedTask = this._tasks.find(x => x.uuid === uuid);
            this.selectTask(newSelectedTask);
        };
        this.onRowExpanderClick = (e) => {
            const target = e.target;
            this.toggleTaskExpanded(target.dataset[TsGanttConst.ROW_UUID_DATASET_KEY]);
        };
        this._options = new TsGanttOptions(options);
        this._htmlContainer = document.querySelector(containerSelector);
        if (!this._htmlContainer) {
            throw new Error("Container is null");
        }
        this.createLayout();
    }
    get tasks() {
        return TsGanttTask.convertTasksToModels(this._tasks);
    }
    set tasks(models) {
        const updateResult = this.updateTasks(models);
        const changeDetectionResult = TsGanttTask.detectTaskChanges(updateResult);
        this.update(changeDetectionResult);
    }
    get selectedTask() {
        return this._selectedTask
            ? TsGanttTask.convertTasksToModels([this._selectedTask])[0]
            : null;
    }
    set selectedTask(model) {
        const targetTask = this._tasks.find(x => x.externalId === model.id);
        if (targetTask !== this._selectedTask) {
            this.selectTask(targetTask);
        }
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
    set chartBarMode(value) {
        if (value !== this._options.chartBarMode) {
            this._options.chartBarMode = value;
            this.updateChartBarMode();
        }
    }
    destroy() {
        this.removeSepEventListeners();
        this.removeRowEventListeners();
        this._htmlWrapper.remove();
    }
    removeSepEventListeners() {
        document.removeEventListener("mousedown", this.onMouseDownOnSep);
        document.removeEventListener("mousemove", this.onMouseMoveOnSep);
        document.removeEventListener("mouseup", this.onMouseUpOnSep);
    }
    removeRowEventListeners() {
        document.removeEventListener(TsGanttConst.ROW_CLICK, this.onRowClick);
        document.removeEventListener(TsGanttConst.CELL_EXPANDER_CLICK, this.onRowExpanderClick);
    }
    createLayout() {
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
        this._htmlContainer.append(wrapper);
        this._htmlWrapper = wrapper;
        this._htmlTableWrapper = tableWrapper;
        this._htmlChartWrapper = chartWrapper;
        this._htmlSeparator = separator;
        document.addEventListener("mousedown", this.onMouseDownOnSep);
        document.addEventListener("mousemove", this.onMouseMoveOnSep);
        document.addEventListener("mouseup", this.onMouseUpOnSep);
        document.addEventListener(TsGanttConst.ROW_CLICK, this.onRowClick);
        document.addEventListener(TsGanttConst.CELL_EXPANDER_CLICK, this.onRowExpanderClick);
    }
    updateTasks(taskModels) {
        const oldTasks = this._tasks;
        const oldIdsMap = TsGanttTask.getTasksIdsMap(oldTasks);
        const newTasks = TsGanttTask.convertModelsToTasks(taskModels, oldIdsMap);
        this._tasks = newTasks;
        return { oldTasks, newTasks };
    }
    toggleTaskExpanded(uuid) {
        let targetTask;
        const targetChildren = [];
        for (const task of this._tasks) {
            if (!targetTask && task.uuid === uuid) {
                targetTask = task;
            }
            else if (task.parentUuid === uuid) {
                targetChildren.push(task);
            }
        }
        if (!targetTask) {
            return;
        }
        targetTask.expanded = !targetTask.expanded;
        targetChildren.forEach(x => x.shown = !x.shown);
        const changedTasks = [targetTask, ...targetChildren];
        const selectedTask = this._selectedTask;
        if (selectedTask && selectedTask !== targetTask
            && TsGanttTask.checkPaternity(this._tasks, targetTask, selectedTask)) {
            selectedTask.selected = false;
            this._selectedTask = null;
            if (selectedTask.parentUuid !== targetTask.uuid) {
                changedTasks.push(selectedTask);
            }
        }
        this.update({ added: [], deleted: [], changed: changedTasks, all: this._tasks });
    }
    selectTask(newSelectedTask) {
        const oldSelectedTask = this._selectedTask;
        if ((!oldSelectedTask && !newSelectedTask)
            || oldSelectedTask === newSelectedTask) {
            return;
        }
        this._selectedTask = null;
        const changedTasks = [];
        if (oldSelectedTask) {
            oldSelectedTask.selected = false;
            changedTasks.push(oldSelectedTask);
        }
        if (newSelectedTask) {
            newSelectedTask.selected = true;
            changedTasks.push(newSelectedTask);
            this._selectedTask = newSelectedTask;
        }
        this.update({ added: [], deleted: [], changed: changedTasks, all: this._tasks });
    }
    update(data) {
        this._table.update(false, data);
        this._chart.update(false, data);
    }
    updateLocale() {
        const data = {
            deleted: [],
            added: [],
            changed: this._tasks,
            all: this._tasks,
        };
        this._table.update(true, data);
        this._chart.update(true, data);
    }
    updateChartScale() {
        this._chart.update(true, {
            deleted: [],
            added: [],
            changed: this._tasks,
            all: this._tasks,
        });
    }
    updateChartBarMode() {
        this._chart.update(false, {
            deleted: [],
            added: [],
            changed: this._tasks,
            all: this._tasks,
        });
    }
}

export { TsGantt, TsGanttChart, TsGanttOptions, TsGanttTable, TsGanttTask, TsGanttTaskChangesDetectionResult, TsGanttTaskModel, TsGanttTaskUpdateResult };
