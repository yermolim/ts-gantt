function getRandomUuid() {
    return crypto.getRandomValues(new Uint32Array(4)).join("-");
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
        this.enableChartEdit = true;
        this.tableMinWidth = 100;
        this.rowNestingMaxCount = 5;
        this.rowNestingIndentPx = 20;
        this.columnsMinWidthPx = [200, 100, 100, 100, 100, 100, 100, 100];
        this.columnsContentAlign = ["start", "end", "center", "center", "center", "center", "center", "center"];
        this.defaultScale = "day";
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
        this.localeDateScale = {
            en: ["Hours", "Days", "Weeks", "Months"],
            uk: ["Години", "Дні", "Тижні", "Місяці"],
            ru: ["Часы", "Дни", "Недели", "Месяцы"],
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
                    return d + " днів";
                }
                else {
                    d = d % 10;
                    if (d === 1) {
                        return d + " день";
                    }
                    else if (d < 5) {
                        return d + " дні";
                    }
                    else {
                        return d + " днів";
                    }
                }
            },
            ru: (duration) => {
                let d = duration % 100;
                if (d > 10 && d < 20) {
                    return d + " дней";
                }
                else {
                    d = d % 10;
                    if (d === 1) {
                        return d + " день";
                    }
                    else if (d < 5) {
                        return d + " дня";
                    }
                    else {
                        return d + " дней";
                    }
                }
            },
        };
        this.columnValueGetters = [
            ((task) => task.localizedNames[this.locale] || task.name).bind(this),
            ((task) => (+task.progress.toFixed(2)).toLocaleString("en-US")
                .replace(".", this.localeDecimalSeparator[this.locale] || ".")).bind(this),
            ((task) => dayjs_min(task.datePlannedStart)
                .format(this.localeDateFormat[this.locale] || "L")).bind(this),
            ((task) => dayjs_min(task.datePlannedEnd)
                .format(this.localeDateFormat[this.locale] || "L")).bind(this),
            ((task) => task.dateActualStart
                ? dayjs_min(task.dateActualStart).format(this.localeDateFormat[this.locale] || "L")
                : "").bind(this),
            ((task) => task.dateActualEnd
                ? dayjs_min(task.dateActualEnd).format(this.localeDateFormat[this.locale] || "L")
                : "").bind(this),
            ((task) => {
                const end = dayjs_min(task.datePlannedEnd);
                const start = dayjs_min(task.datePlannedStart);
                const duration = end.diff(start, "day") + 1;
                return this.localeDurationFormatters[this.locale]
                    ? this.localeDurationFormatters[this.locale](duration)
                    : duration.toString();
            }).bind(this),
            ((task) => {
                if (!task.dateActualEnd || !task.dateActualStart) {
                    return "";
                }
                const end = dayjs_min(task.dateActualEnd);
                const start = dayjs_min(task.dateActualStart);
                const duration = end.diff(start, "day") + 1;
                return this.localeDurationFormatters[this.locale]
                    ? this.localeDurationFormatters[this.locale](duration)
                    : duration.toString();
            }).bind(this),
        ];
        if (item != null) {
            Object.assign(this, item);
        }
    }
}

class TsGanttChart {
    constructor(classList, options) {
        this._options = options;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.classList.add(...classList);
        this._htmlSvg = svg;
    }
    get htmlSvg() {
        return this._htmlSvg;
    }
    updateRows(data) {
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
        row.setAttribute("data-tsg-row-uuid", this.task.uuid);
        row.addEventListener("click", (e) => {
            const target = e.target;
            if (!target.classList.contains(TsGanttTableRow.CELL_EXPANDER_CLASS)) {
                row.dispatchEvent(new Event("tsgrowclick", { bubbles: true }));
            }
        });
        if (this.task.selected) {
            row.classList.add("selected");
        }
        columns.forEach((x, i) => {
            const cell = document.createElement("td");
            const cellInnerDiv = document.createElement("div");
            cellInnerDiv.classList.add(TsGanttTableRow.CELL_TEXT_WRAPPER_CLASS, x.contentAlign);
            if (i === 0) {
                for (let j = 0; j < this.task.nestingLvl; j++) {
                    cellInnerDiv.append(this.createEmptyIndent());
                }
                if (!this.task.hasChildren) {
                    cellInnerDiv.append(this.createEmptyIndent());
                }
                else {
                    const expander = document.createElement("p");
                    expander.classList.add(TsGanttTableRow.CELL_EXPANDER_CLASS);
                    expander.setAttribute("data-tsg-row-uuid", this.task.uuid);
                    expander.innerHTML = this.task.expanded ? "▴" : "▾";
                    expander.addEventListener("click", (e) => {
                        expander.dispatchEvent(new Event("tsgexpanderclick", { bubbles: true }));
                    });
                    cellInnerDiv.append(expander);
                }
            }
            const cellText = document.createElement("p");
            cellText.classList.add(TsGanttTableRow.CELL_TEXT_CLASS);
            cellText.innerHTML = x.valueGetter(this.task);
            cellInnerDiv.append(cellText);
            cell.append(cellInnerDiv);
            row.append(cell);
        });
        return row;
    }
    createEmptyIndent() {
        const indent = document.createElement("p");
        indent.classList.add(TsGanttTableRow.CELL_INDENT_CLASS);
        return indent;
    }
}
TsGanttTableRow.CELL_TEXT_WRAPPER_CLASS = "tsg-cell-text-wrapper";
TsGanttTableRow.CELL_TEXT_CLASS = "tsg-cell-text";
TsGanttTableRow.CELL_INDENT_CLASS = "tsg-cell-text-indent";
TsGanttTableRow.CELL_EXPANDER_CLASS = "tsg-cell-text-expander";
class TsGanttTable {
    constructor(classList, options) {
        this._tableRows = [];
        this._options = options;
        const table = document.createElement("table");
        table.classList.add(...classList);
        const tableHead = table.createTHead();
        const tableBody = table.createTBody();
        this._htmlTableHead = tableHead;
        this._htmlTableBody = tableBody;
        this._htmlTable = table;
        this.updateColumns();
    }
    get htmlTable() {
        return this._htmlTable;
    }
    updateColumns() {
        const columns = [];
        for (let i = 0; i < 9; i++) {
            const minColumnWidth = this._options.columnsMinWidthPx[i];
            const contentAlign = this._options.columnsContentAlign[i] === "center"
                ? "center"
                : this._options.columnsContentAlign[i] === "end"
                    ? "end"
                    : "start";
            if (minColumnWidth) {
                columns.push(new TsGanttTableColumn(minColumnWidth, contentAlign, this._options.localeHeaders[this._options.locale][i] || "", this._options.columnValueGetters[i] || ((task) => "")));
            }
        }
        const headerRow = document.createElement("tr");
        columns.forEach(x => headerRow.append(x.html));
        this._tableColumns = columns;
        this._htmlTableHead.innerHTML = "";
        this._htmlTableHead.append(headerRow);
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
        this._htmlTableBody.innerHTML = "";
        this._htmlTableBody.append(...this.getRowsHtmlRecursively(this._tableRows, null));
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
        this._dateFormat = "YYYY-MM-DD";
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
            this.setTableWrapperWidth(pointerRelX);
        };
        this.onMouseUpOnSep = (e) => {
            this._htmlSeparatorDragActive = false;
        };
        this.onRowClick = (e) => {
            const target = e.target;
            const uuid = target.dataset.tsgRowUuid;
            const newSelectedTask = this._tasks.find(x => x.uuid === uuid);
            this.selectTask(newSelectedTask);
        };
        this.onRowExpanderClick = (e) => {
            const target = e.target;
            this.toggleTaskExpanded(target.dataset.tsgRowUuid);
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
        this.updateRows(changeDetectionResult);
    }
    get selectedTask() {
        return this._selectedTask
            ? TsGanttTask.convertTasksToModels([this._selectedTask])[0]
            : null;
    }
    set selectedTask(model) {
        const targetTask = this._tasks.find(x => x.externalId === model.id);
        this.selectTask(targetTask);
    }
    set locale(value) {
        this._options.locale = value;
        this.updateLocale();
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
        document.removeEventListener("tsgrowclick", this.onRowClick);
        document.removeEventListener("tsgexpanderclick", this.onRowExpanderClick);
    }
    createLayout() {
        const wrapper = document.createElement("div");
        wrapper.classList.add(TsGantt.WRAPPER_CLASS);
        const tableWrapper = document.createElement("div");
        tableWrapper.classList.add(TsGantt.TABLE_WRAPPER_CLASS);
        const chartWrapper = document.createElement("div");
        chartWrapper.classList.add(TsGantt.CHART_WRAPPER_CLASS);
        const separator = document.createElement("div");
        separator.classList.add(TsGantt.SEPARATOR_CLASS);
        this._table = new TsGanttTable([TsGantt.TABLE_CLASS], this._options);
        this._chart = new TsGanttChart([TsGantt.CHART_CLASS], this._options);
        wrapper.append(tableWrapper);
        wrapper.append(separator);
        wrapper.append(chartWrapper);
        tableWrapper.append(this._table.htmlTable);
        chartWrapper.append(this._chart.htmlSvg);
        this._htmlContainer.append(wrapper);
        this._htmlWrapper = wrapper;
        this._htmlTableWrapper = tableWrapper;
        this._htmlChartWrapper = chartWrapper;
        this._htmlSeparator = separator;
        document.addEventListener("mousedown", this.onMouseDownOnSep);
        document.addEventListener("mousemove", this.onMouseMoveOnSep);
        document.addEventListener("mouseup", this.onMouseUpOnSep);
        document.addEventListener("tsgrowclick", this.onRowClick);
        document.addEventListener("tsgexpanderclick", this.onRowExpanderClick);
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
        const otherTasks = [];
        for (const task of this._tasks) {
            if (!targetTask && task.uuid === uuid) {
                targetTask = task;
            }
            else if (task.parentUuid === uuid) {
                targetChildren.push(task);
            }
            else {
                otherTasks.push(task);
            }
        }
        if (!targetTask) {
            return;
        }
        targetTask.expanded = !targetTask.expanded;
        targetChildren.forEach(x => {
            x.shown = !x.shown;
            if (!x.shown && x.selected) {
                x.selected = false;
                this._selectedTask = null;
            }
        });
        this.updateRows({ added: [], deleted: [], changed: [targetTask, ...targetChildren], unchanged: otherTasks });
    }
    selectTask(newSelectedTask) {
        const oldSelectedTask = this._selectedTask;
        if ((!oldSelectedTask && !newSelectedTask)
            || oldSelectedTask === newSelectedTask) {
            return;
        }
        this._selectedTask = null;
        const targetTasks = [];
        if (oldSelectedTask) {
            oldSelectedTask.selected = false;
            targetTasks.push(oldSelectedTask);
        }
        if (newSelectedTask) {
            newSelectedTask.selected = true;
            targetTasks.push(newSelectedTask);
            this._selectedTask = newSelectedTask;
        }
        const otherTasks = this._tasks.filter(x => x !== oldSelectedTask && x !== newSelectedTask);
        this.updateRows({ added: [], deleted: [], changed: targetTasks, unchanged: otherTasks });
    }
    updateRows(data) {
        this._table.updateRows(data);
        this._chart.updateRows(data);
    }
    updateLocale() {
    }
    setTableWrapperWidth(width) {
        this._htmlTableWrapper.style.width = (Math.max(this._options.tableMinWidth, width)) + "px";
    }
}
TsGantt.WRAPPER_CLASS = "tsg-wrapper";
TsGantt.FOOTER_CLASS = "tsg-footer";
TsGantt.TABLE_WRAPPER_CLASS = "tsg-table-wrapper";
TsGantt.CHART_WRAPPER_CLASS = "tsg-chart-wrapper";
TsGantt.TABLE_CLASS = "tsg-table";
TsGantt.CHART_CLASS = "tsg-chart";
TsGantt.SEPARATOR_CLASS = "tsg-separator";

export { TsGantt, TsGanttChart, TsGanttOptions, TsGanttTable, TsGanttTask, TsGanttTaskChangesDetectionResult, TsGanttTaskModel, TsGanttTaskUpdateResult };
