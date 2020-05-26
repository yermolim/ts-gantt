let TsGanttConst = (() => {
    class TsGanttConst {
    }
    TsGanttConst.CSS_VAR_SEPARATOR_WIDTH = "--tsg-separator-width";
    TsGanttConst.CSS_VAR_HEADER_HEIGHT = "--tsg-header-height";
    TsGanttConst.CSS_VAR_ROW_HEIGHT = "--tsg-row-height";
    TsGanttConst.CSS_VAR_GRIDLINES_WIDTH = "--tsg-gridlines-width";
    TsGanttConst.CSS_VAR_BAR_STROKE_WIDTH = "--tsg-bar-stroke-width";
    TsGanttConst.TEXT_SELECTION_DISABLED = "tsg-no-text-selection";
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
    TsGanttConst.ROW_OVERDUE_CLASS = "overdue";
    TsGanttConst.ROW_CLICK = "tsgrowclick";
    TsGanttConst.ROW_CONTEXT_MENU = "tsgrowcontextmenu";
    TsGanttConst.TABLE_COLUMN_RESIZER = "tsg-column-resizer";
    TsGanttConst.TABLE_CELL_TEXT_WRAPPER_CLASS = "tsg-cell-text-wrapper";
    TsGanttConst.TABLE_CELL_TEXT_CLASS = "tsg-cell-text";
    TsGanttConst.TABLE_CELL_INDENT_CLASS = "tsg-cell-text-indent";
    TsGanttConst.TABLE_CELL_EXPANDER_CLASS = "tsg-cell-text-expander";
    TsGanttConst.TABLE_CELL_EXPANDER_CLICK = "tsgexpanderclick";
    TsGanttConst.CHART_HEADER_CLASS = "tsg-chart-header";
    TsGanttConst.CHART_HEADER_BACKGROUND_CLASS = "tsg-chart-header-bg";
    TsGanttConst.CHART_HEADER_GRIDLINES_CLASS = "tsg-chart-header-gl";
    TsGanttConst.CHART_HEADER_TEXT_CLASS = "tsg-chart-header-text";
    TsGanttConst.CHART_BODY_CLASS = "tsg-chart-body";
    TsGanttConst.CHART_BODY_BACKGROUND_CLASS = "tsg-chart-body-bg";
    TsGanttConst.CHART_BODY_GRIDLINES_CLASS = "tsg-chart-body-gl";
    TsGanttConst.CHART_BODY_TODAY_LINE_CLASS = "today";
    TsGanttConst.CHART_ROW_WRAPPER_CLASS = "tsg-chart-row-wrapper";
    TsGanttConst.CHART_ROW_CLASS = "tsg-chart-row";
    TsGanttConst.CHART_ROW_BACKGROUND_CLASS = "tsg-chart-row-bg";
    TsGanttConst.CHART_BAR_GROUP_CLASS = "tsg-chart-bar-group";
    TsGanttConst.CHART_BAR_WRAPPER_CLASS = "tsg-chart-bar-wrapper";
    TsGanttConst.CHART_BAR_PLANNED_CLASS = "tsg-chart-bar-planned";
    TsGanttConst.CHART_BAR_PLANNED_PROGRESS_CLASS = "tsg-chart-bar-planned-progress";
    TsGanttConst.CHART_BAR_ACTUAL_CLASS = "tsg-chart-bar-actual";
    TsGanttConst.CHART_BAR_ACTUAL_PROGRESS_CLASS = "tsg-chart-bar-actual-progress";
    return TsGanttConst;
})();

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

class TsGanttOptions {
    constructor(item = null) {
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

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var dayjs_min = createCommonjsModule(function (module, exports) {
!function(t,e){module.exports=e();}(commonjsGlobal,function(){var t="millisecond",e="second",n="minute",r="hour",i="day",s="week",u="month",o="quarter",a="year",h=/^(\d{4})-?(\d{1,2})-?(\d{0,2})[^0-9]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?.?(\d{1,3})?$/,f=/\[([^\]]+)]|Y{2,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,c=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},d={s:c,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+c(r,2,"0")+":"+c(i,2,"0")},m:function(t,e){var n=12*(e.year()-t.year())+(e.month()-t.month()),r=t.clone().add(n,u),i=e-r<0,s=t.clone().add(n+(i?-1:1),u);return Number(-(n+(e-r)/(i?r-s:s-r))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(h){return {M:u,y:a,w:s,d:i,D:"date",h:r,m:n,s:e,ms:t,Q:o}[h]||String(h||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},$={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},l="en",m={};m[l]=$;var y=function(t){return t instanceof v},M=function(t,e,n){var r;if(!t)return l;if("string"==typeof t)m[t]&&(r=t),e&&(m[t]=e,r=t);else {var i=t.name;m[i]=t,r=i;}return !n&&r&&(l=r),r||!n&&l},g=function(t,e){if(y(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new v(n)},D=d;D.l=M,D.i=y,D.w=function(t,e){return g(t,{locale:e.$L,utc:e.$u,$offset:e.$offset})};var v=function(){function c(t){this.$L=this.$L||M(t.locale,null,!0),this.parse(t);}var d=c.prototype;return d.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(D.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(h);if(r)return n?new Date(Date.UTC(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)):new Date(r[1],r[2]-1,r[3]||1,r[4]||0,r[5]||0,r[6]||0,r[7]||0)}return new Date(e)}(t),this.init();},d.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},d.$utils=function(){return D},d.isValid=function(){return !("Invalid Date"===this.$d.toString())},d.isSame=function(t,e){var n=g(t);return this.startOf(e)<=n&&n<=this.endOf(e)},d.isAfter=function(t,e){return g(t)<this.startOf(e)},d.isBefore=function(t,e){return this.endOf(e)<g(t)},d.$g=function(t,e,n){return D.u(t)?this[e]:this.set(n,t)},d.year=function(t){return this.$g(t,"$y",a)},d.month=function(t){return this.$g(t,"$M",u)},d.day=function(t){return this.$g(t,"$W",i)},d.date=function(t){return this.$g(t,"$D","date")},d.hour=function(t){return this.$g(t,"$H",r)},d.minute=function(t){return this.$g(t,"$m",n)},d.second=function(t){return this.$g(t,"$s",e)},d.millisecond=function(e){return this.$g(e,"$ms",t)},d.unix=function(){return Math.floor(this.valueOf()/1e3)},d.valueOf=function(){return this.$d.getTime()},d.startOf=function(t,o){var h=this,f=!!D.u(o)||o,c=D.p(t),d=function(t,e){var n=D.w(h.$u?Date.UTC(h.$y,e,t):new Date(h.$y,e,t),h);return f?n:n.endOf(i)},$=function(t,e){return D.w(h.toDate()[t].apply(h.toDate("s"),(f?[0,0,0,0]:[23,59,59,999]).slice(e)),h)},l=this.$W,m=this.$M,y=this.$D,M="set"+(this.$u?"UTC":"");switch(c){case a:return f?d(1,0):d(31,11);case u:return f?d(1,m):d(0,m+1);case s:var g=this.$locale().weekStart||0,v=(l<g?l+7:l)-g;return d(f?y-v:y+(6-v),m);case i:case"date":return $(M+"Hours",0);case r:return $(M+"Minutes",1);case n:return $(M+"Seconds",2);case e:return $(M+"Milliseconds",3);default:return this.clone()}},d.endOf=function(t){return this.startOf(t,!1)},d.$set=function(s,o){var h,f=D.p(s),c="set"+(this.$u?"UTC":""),d=(h={},h[i]=c+"Date",h.date=c+"Date",h[u]=c+"Month",h[a]=c+"FullYear",h[r]=c+"Hours",h[n]=c+"Minutes",h[e]=c+"Seconds",h[t]=c+"Milliseconds",h)[f],$=f===i?this.$D+(o-this.$W):o;if(f===u||f===a){var l=this.clone().set("date",1);l.$d[d]($),l.init(),this.$d=l.set("date",Math.min(this.$D,l.daysInMonth())).toDate();}else d&&this.$d[d]($);return this.init(),this},d.set=function(t,e){return this.clone().$set(t,e)},d.get=function(t){return this[D.p(t)]()},d.add=function(t,o){var h,f=this;t=Number(t);var c=D.p(o),d=function(e){var n=g(f);return D.w(n.date(n.date()+Math.round(e*t)),f)};if(c===u)return this.set(u,this.$M+t);if(c===a)return this.set(a,this.$y+t);if(c===i)return d(1);if(c===s)return d(7);var $=(h={},h[n]=6e4,h[r]=36e5,h[e]=1e3,h)[c]||1,l=this.$d.getTime()+t*$;return D.w(l,this)},d.subtract=function(t,e){return this.add(-1*t,e)},d.format=function(t){var e=this;if(!this.isValid())return "Invalid Date";var n=t||"YYYY-MM-DDTHH:mm:ssZ",r=D.z(this),i=this.$locale(),s=this.$H,u=this.$m,o=this.$M,a=i.weekdays,h=i.months,c=function(t,r,i,s){return t&&(t[r]||t(e,n))||i[r].substr(0,s)},d=function(t){return D.s(s%12||12,t,"0")},$=i.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:o+1,MM:D.s(o+1,2,"0"),MMM:c(i.monthsShort,o,h,3),MMMM:c(h,o),D:this.$D,DD:D.s(this.$D,2,"0"),d:String(this.$W),dd:c(i.weekdaysMin,this.$W,a,2),ddd:c(i.weekdaysShort,this.$W,a,3),dddd:a[this.$W],H:String(s),HH:D.s(s,2,"0"),h:d(1),hh:d(2),a:$(s,u,!0),A:$(s,u,!1),m:String(u),mm:D.s(u,2,"0"),s:String(this.$s),ss:D.s(this.$s,2,"0"),SSS:D.s(this.$ms,3,"0"),Z:r};return n.replace(f,function(t,e){return e||l[t]||r.replace(":","")})},d.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},d.diff=function(t,h,f){var c,d=D.p(h),$=g(t),l=6e4*($.utcOffset()-this.utcOffset()),m=this-$,y=D.m(this,$);return y=(c={},c[a]=y/12,c[u]=y,c[o]=y/3,c[s]=(m-l)/6048e5,c[i]=(m-l)/864e5,c[r]=m/36e5,c[n]=m/6e4,c[e]=m/1e3,c)[d]||m,f?y:D.a(y)},d.daysInMonth=function(){return this.endOf(u).$D},d.$locale=function(){return m[this.$L]},d.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=M(t,e,!0);return r&&(n.$L=r),n},d.clone=function(){return D.w(this.$d,this)},d.toDate=function(){return new Date(this.valueOf())},d.toJSON=function(){return this.isValid()?this.toISOString():null},d.toISOString=function(){return this.$d.toISOString()},d.toString=function(){return this.$d.toUTCString()},c}();return g.prototype=v.prototype,g.extend=function(t,e){return t(e,v,g),g},g.locale=M,g.isDayjs=y,g.unix=function(t){return g(1e3*t)},g.en=m[l],g.Ls=m,g});
});

class TsGanttTask {
    constructor(id, parentId, name, localizedNames, progress, datePlannedStart = null, datePlannedEnd = null, dateActualStart = null, dateActualEnd = null, nestingLvl = 0, hasChildren = false, parentUuid = null, uuid = null) {
        this.externalId = id;
        this.parentExternalId = parentId;
        this.name = name;
        this.localizedNames = localizedNames;
        this.progress = progress < 0 ? 0 : progress > 100 ? 100 : progress;
        this.datePlannedStart = datePlannedStart ? dayjs_min(datePlannedStart) : null;
        this.datePlannedEnd = datePlannedEnd ? dayjs_min(datePlannedEnd) : null;
        this.dateActualStart = dateActualStart ? dayjs_min(dateActualStart) : null;
        this.dateActualEnd = dateActualEnd ? dayjs_min(dateActualEnd) : null;
        this.nestingLvl = nestingLvl;
        this.hasChildren = hasChildren;
        this.parentUuid = parentUuid;
        this.uuid = uuid || getRandomUuid();
        this.shown = !parentUuid;
        this.expanded = false;
    }
    static convertModelsToTasks(taskModels, idMap = new Map()) {
        const models = taskModels.slice();
        const allParentIds = new Set(models.map(x => x.parentId));
        const tasks = [];
        let currentLevelTasks = [];
        for (let i = models.length - 1; i >= 0; i--) {
            const model = models[i];
            if (!model.parentId) {
                const newTask = new TsGanttTask(model.id, model.parentId, model.name, model.localizedNames, model.progress, model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd, 0, allParentIds.has(model.id), null, idMap.get(model.id));
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
                        const newTask = new TsGanttTask(model.id, model.parentId, model.name, model.localizedNames, model.progress, model.datePlannedStart, model.datePlannedEnd, model.dateActualStart, model.dateActualEnd, currentNestingLvl, allParentIds.has(model.id), task.uuid, idMap.get(model.id));
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
        const oldUuids = oldTasks.map(x => x.uuid);
        const newUuids = newTasks.map(x => x.uuid);
        const deleted = oldTasks.filter(x => !newUuids.includes(x.uuid));
        const added = [];
        const changed = [];
        const all = [];
        for (const newTask of newTasks) {
            if (!oldUuids.includes(newTask.uuid)) {
                added.push(newTask);
                all.push(newTask);
                continue;
            }
            const oldTask = oldTasks.find(x => x.uuid === newTask.uuid);
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
            .sort((a, b) => a.compareTo(b));
        const sorted = [];
        for (const task of tasksFiltered) {
            sorted.push(task);
            sorted.push(...this.sortTasksRecursively(tasks, task.uuid));
        }
        return sorted;
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
        if (this.datePlannedEnd && this.datePlannedEnd.isBefore(dayjs_min().startOf("day"))) {
            return "overdue";
        }
        return "in-progress";
    }
    toModel() {
        var _a, _b, _c, _d;
        return {
            id: this.externalId,
            parentId: this.parentExternalId,
            name: this.name,
            progress: this.progress,
            datePlannedStart: ((_a = this.datePlannedStart) === null || _a === void 0 ? void 0 : _a.toDate()) || null,
            datePlannedEnd: ((_b = this.datePlannedEnd) === null || _b === void 0 ? void 0 : _b.toDate()) || null,
            dateActualStart: ((_c = this.dateActualStart) === null || _c === void 0 ? void 0 : _c.toDate()) || null,
            dateActualEnd: ((_d = this.dateActualEnd) === null || _d === void 0 ? void 0 : _d.toDate()) || null,
            localizedNames: this.localizedNames
        };
    }
}

class TsGanttTableColumn {
    constructor(minWidth, textAlign, header, valueGetter) {
        this._dragActive = false;
        this.onMouseDownOnResizer = (e) => {
            document.addEventListener("mousemove", this.onMouseMoveWhileResizing);
            document.addEventListener("mouseup", this.onMouseUpWhileResizing);
            document.addEventListener("touchmove", this.onMouseMoveWhileResizing, { passive: false });
            document.addEventListener("touchend", this.onMouseUpWhileResizing);
            this._dragActive = true;
        };
        this.onMouseMoveWhileResizing = (e) => {
            if (!this._dragActive) {
                return false;
            }
            const headerOffset = this.html.getBoundingClientRect().left;
            const userDefinedWidth = e instanceof MouseEvent
                ? e.clientX - headerOffset
                : e.touches[0].clientX - headerOffset;
            this.html.style.minWidth = Math.max(this.minWidth, userDefinedWidth) + "px";
            e.preventDefault();
        };
        this.onMouseUpWhileResizing = (e) => {
            document.removeEventListener("mousemove", this.onMouseMoveWhileResizing);
            document.removeEventListener("mouseup", this.onMouseUpWhileResizing);
            document.removeEventListener("touchmove", this.onMouseMoveWhileResizing, { passive: false });
            document.removeEventListener("touchend", this.onMouseUpWhileResizing);
            this._dragActive = false;
        };
        this.minWidth = minWidth;
        this.contentAlign = textAlign;
        this.header = header;
        this.valueGetter = valueGetter;
        this.html = this.createHeader();
        this.resizer = this.createResizer();
        this.resizer.addEventListener("mousedown", this.onMouseDownOnResizer);
        this.resizer.addEventListener("touchstart", this.onMouseDownOnResizer);
        this.html.append(this.resizer);
    }
    createHeader() {
        const headerCell = document.createElement("th");
        headerCell.style.minWidth = this.minWidth + "px";
        headerCell.innerHTML = this.header;
        return headerCell;
    }
    createResizer() {
        const resizer = document.createElement("div");
        resizer.classList.add(TsGanttConst.TABLE_COLUMN_RESIZER);
        return resizer;
    }
}
class TsGanttTableRow {
    constructor(task, columns, addStateClass) {
        this.task = task;
        this.expander = this.createExpander();
        this.html = this.createRow(columns, addStateClass);
    }
    createRow(columns, addStateClass) {
        const row = document.createElement("tr");
        row.setAttribute(TsGanttConst.ROW_UUID_ATTRIBUTE, this.task.uuid);
        row.addEventListener("click", (e) => {
            const target = e.target;
            if (!target.classList.contains(TsGanttConst.TABLE_CELL_EXPANDER_CLASS)) {
                row.dispatchEvent(new CustomEvent(TsGanttConst.ROW_CLICK, {
                    bubbles: true,
                    detail: { task: this.task, event: e },
                }));
            }
        });
        row.addEventListener("contextmenu", (e) => {
            const target = e.target;
            if (!target.classList.contains(TsGanttConst.TABLE_CELL_EXPANDER_CLASS)) {
                row.dispatchEvent(new CustomEvent(TsGanttConst.ROW_CONTEXT_MENU, {
                    bubbles: true,
                    detail: { task: this.task, event: e },
                }));
            }
        });
        if (addStateClass) {
            row.classList.add(this.task.getState());
        }
        columns.forEach((x, i) => {
            const cell = document.createElement("td");
            const cellInnerDiv = document.createElement("div");
            cellInnerDiv.classList.add(TsGanttConst.TABLE_CELL_TEXT_WRAPPER_CLASS, x.contentAlign);
            if (i === 0) {
                for (let j = 0; j < this.task.nestingLvl; j++) {
                    cellInnerDiv.append(this.createSimpleIndent());
                }
                cellInnerDiv.append(this.expander);
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
    createExpander() {
        const expander = document.createElement("p");
        expander.classList.add(TsGanttConst.TABLE_CELL_EXPANDER_CLASS);
        expander.setAttribute(TsGanttConst.ROW_UUID_ATTRIBUTE, this.task.uuid);
        if (this.task.hasChildren) {
            expander.addEventListener("click", (e) => {
                expander.dispatchEvent(new CustomEvent(TsGanttConst.TABLE_CELL_EXPANDER_CLICK, {
                    bubbles: true,
                    detail: { uuid: this.task.uuid },
                }));
            });
        }
        return expander;
    }
}

class TsGanttTable {
    constructor(options) {
        this._tableRows = new Map();
        this._activeUuids = [];
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
    update(updateColumns, data, uuids = null) {
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
        const { selected, deselected } = selectionResult;
        for (const uuid of deselected) {
            const row = this._tableRows.get(uuid);
            if (row) {
                row.html.classList.remove(TsGanttConst.ROW_SELECTED_CLASS);
            }
        }
        for (const uuid of selected) {
            const row = this._tableRows.get(uuid);
            if (row) {
                row.html.classList.add(TsGanttConst.ROW_SELECTED_CLASS);
            }
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
        this._tableColumns = columns;
    }
    updateRows(data) {
        const columns = this._tableColumns;
        const rows = this._tableRows;
        const addStateClass = this._options.highlightRowsDependingOnTaskState;
        data.deleted.forEach(x => rows.delete(x.uuid));
        data.changed.forEach(x => rows.set(x.uuid, new TsGanttTableRow(x, columns, addStateClass)));
        data.added.forEach(x => rows.set(x.uuid, new TsGanttTableRow(x, columns, addStateClass)));
    }
    redraw() {
        const headerRow = document.createElement("tr");
        this._tableColumns.forEach(x => headerRow.append(x.html));
        this._htmlHead.innerHTML = "";
        this._htmlHead.append(headerRow);
        this._htmlBody.innerHTML = "";
        this._htmlBody.append(...this._activeUuids.map(x => this.getRowHtml(x)));
    }
    getRowHtml(uuid) {
        const symbols = this._options.rowSymbols;
        const row = this._tableRows.get(uuid);
        if (!row.task.hasChildren) {
            row.expander.innerHTML = symbols.childless;
        }
        else if (row.task.expanded) {
            row.expander.innerHTML = symbols.expanded;
        }
        else {
            row.expander.innerHTML = symbols.collapsed;
        }
        return row.html;
    }
}

class TsGanttChartBarGroup {
    constructor(task, options) {
        const { mode, showProgress, dayWidth, rowHeight, barMinWidth, barHeight, barBorder, barCornerR, y0, y1 } = options;
        const { datePlannedStart, datePlannedEnd, dateActualStart, dateActualEnd } = task;
        const plannedDatesSet = datePlannedStart && datePlannedEnd;
        const actualDatesSet = dateActualStart && dateActualEnd;
        let minDate;
        let maxDate;
        let barSvg;
        if (mode === "both") {
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
                minDate = minDate.subtract(1, "day");
                barSvg = this.createSvg(minDate, maxDate, dayWidth, barMinWidth, rowHeight);
                if (plannedDatesSet) {
                    this.createBar(barSvg, minDate, datePlannedStart.subtract(1, "day"), datePlannedEnd, dayWidth, barMinWidth, barHeight, y0, barBorder, barCornerR, "planned", task.progress, showProgress);
                }
                if (actualDatesSet) {
                    this.createBar(barSvg, minDate, dateActualStart.subtract(1, "day"), dateActualEnd, dayWidth, barMinWidth, barHeight, y1, barBorder, barCornerR, "actual", task.progress, showProgress);
                }
            }
        }
        else if (mode === "planned" && plannedDatesSet) {
            minDate = datePlannedStart.subtract(1, "day");
            maxDate = datePlannedEnd;
            barSvg = this.createSvg(minDate, maxDate, dayWidth, barMinWidth, rowHeight);
            this.createBar(barSvg, minDate, minDate, maxDate, dayWidth, barMinWidth, barHeight, y0, barBorder, barCornerR, "planned", task.progress, showProgress);
        }
        else if (mode === "actual" && actualDatesSet) {
            minDate = dateActualStart.subtract(1, "day");
            maxDate = dateActualEnd;
            barSvg = this.createSvg(minDate, maxDate, dayWidth, barMinWidth, rowHeight);
            this.createBar(barSvg, minDate, minDate, maxDate, dayWidth, barMinWidth, barHeight, y0, barBorder, barCornerR, "actual", task.progress, showProgress);
        }
        this.minDate = minDate;
        this.maxDate = maxDate;
        this.barSvg = barSvg;
        this.task = task;
    }
    createSvg(minDate, maxDate, dayWidth, minWidth, rowHeight) {
        const widthDays = maxDate.diff(minDate, "day");
        const width = Math.max(widthDays * dayWidth + minWidth, minWidth);
        const barSvg = createSvgElement("svg", [TsGanttConst.CHART_BAR_GROUP_CLASS], [
            ["width", width + ""],
            ["height", rowHeight + ""],
        ]);
        return barSvg;
    }
    createBar(parent, minDate, start, end, dayWidth, minWrapperWidth, wrapperHeight, y, borderWidth, cornerRadius, barType, progress, showProgress) {
        const barClassList = barType === "planned"
            ? [TsGanttConst.CHART_BAR_PLANNED_CLASS]
            : [TsGanttConst.CHART_BAR_ACTUAL_CLASS];
        const progressBarClassList = barType === "planned"
            ? [TsGanttConst.CHART_BAR_PLANNED_PROGRESS_CLASS]
            : [TsGanttConst.CHART_BAR_ACTUAL_PROGRESS_CLASS];
        const offsetX = start.diff(minDate, "day") * dayWidth;
        const widthDays = end.diff(start, "day");
        const wrapperWidth = Math.max(widthDays * dayWidth, minWrapperWidth);
        const wrapper = createSvgElement("svg", [TsGanttConst.CHART_BAR_WRAPPER_CLASS], [
            ["x", offsetX + ""],
            ["y", y + ""],
            ["width", wrapperWidth + ""],
            ["height", wrapperHeight + ""],
        ], parent);
        const margin = borderWidth / 2;
        const width = wrapperWidth - borderWidth;
        const height = wrapperHeight - borderWidth;
        const bar = createSvgElement("rect", barClassList, [
            ["x", margin + ""],
            ["y", margin + ""],
            ["width", width + ""],
            ["height", height + ""],
            ["rx", cornerRadius + ""],
            ["ry", cornerRadius + ""],
        ], wrapper);
        if (showProgress) {
            const calculatedProgressWidth = width * progress / 100;
            const progressWidth = calculatedProgressWidth < minWrapperWidth - borderWidth
                ? 0
                : calculatedProgressWidth;
            const barProgress = createSvgElement("rect", progressBarClassList, [
                ["x", margin + ""],
                ["y", margin + ""],
                ["width", progressWidth + ""],
                ["height", height + ""],
                ["rx", cornerRadius + ""],
                ["ry", cornerRadius + ""],
            ], wrapper);
        }
    }
}

class TsGanttChart {
    constructor(options) {
        this._chartBarGroups = new Map();
        this._activeUuids = [];
        this._options = options;
        this._html = this.createChartDiv();
    }
    get html() {
        return this._html;
    }
    get htmlHeader() {
        return this._htmlHeader;
    }
    update(forceRedraw, data, uuids = null) {
        const datesCheckResult = data
            ? this.checkDates(data.all)
            : true;
        if (!datesCheckResult || forceRedraw) {
            this.refreshHeader();
        }
        if (data) {
            this.refreshBarGroups(data);
        }
        if (uuids) {
            this._activeUuids = uuids;
        }
        this.refreshBody();
        this.redraw();
    }
    applySelection(selectionResult) {
        const { selected, deselected } = selectionResult;
        for (const uuid of deselected) {
            const rowBg = this._chartRowBgs.get(uuid);
            if (rowBg) {
                rowBg.classList.remove(TsGanttConst.ROW_SELECTED_CLASS);
            }
            const rowWrapper = this._chartRowFgs.get(uuid);
            if (rowWrapper) {
                rowWrapper.classList.remove(TsGanttConst.ROW_SELECTED_CLASS);
            }
        }
        for (const uuid of selected) {
            const rowBg = this._chartRowBgs.get(uuid);
            if (rowBg) {
                rowBg.classList.add(TsGanttConst.ROW_SELECTED_CLASS);
            }
            const rowWrapper = this._chartRowFgs.get(uuid);
            if (rowWrapper) {
                rowWrapper.classList.add(TsGanttConst.ROW_SELECTED_CLASS);
            }
        }
    }
    getBarOffsetByTaskUuid(uuid) {
        return this._chartOffsetsX.get(uuid);
    }
    createChartDiv() {
        const svg = document.createElement("div");
        svg.classList.add(TsGanttConst.CHART_CLASS);
        return svg;
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
    getBarGroupOptions() {
        const mode = this._options.chartDisplayMode;
        const showProgress = this._options.chartShowProgress;
        const dayWidth = this._options.chartDayWidthPx[this._options.chartScale];
        const rowHeight = this._options.rowHeightPx;
        const border = this._options.borderWidthPx;
        const barMargin = this._options.barMarginPx;
        const barBorder = this._options.barStrokeWidthPx;
        const barCornerR = this._options.barCornerRadiusPx;
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
        return { mode, showProgress, dayWidth, rowHeight,
            barMinWidth, barHeight, barBorder, barCornerR, y0, y1 };
    }
    refreshBarGroups(data) {
        const barGroupOptions = this.getBarGroupOptions();
        data.deleted.forEach(x => this._chartBarGroups.delete(x.uuid));
        data.changed.forEach(x => this._chartBarGroups.set(x.uuid, new TsGanttChartBarGroup(x, barGroupOptions)));
        data.added.forEach(x => this._chartBarGroups.set(x.uuid, new TsGanttChartBarGroup(x, barGroupOptions)));
    }
    refreshHeader() {
        const scale = this._options.chartScale;
        const dayWidth = this._options.chartDayWidthPx[scale];
        const height = this._options.headerHeightPx;
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
        const dayWidth = this._options.chartDayWidthPx[scale];
        const rowHeight = this._options.rowHeightPx;
        const border = this._options.borderWidthPx;
        const barGroups = this._activeUuids.map(x => this._chartBarGroups.get(x));
        const minDate = this._dateMinOffset;
        const xCoords = this._verticalLinesXCoords;
        const width = this._width;
        const height = rowHeight * barGroups.length;
        const y0 = this._headerHeight;
        const drawTodayLine = this._options.drawTodayLine;
        const body = createSvgElement("svg", [TsGanttConst.CHART_BODY_CLASS], [
            ["y", y0 + ""],
            ["width", width + ""],
            ["height", height + ""],
        ]);
        const bodyBg = createSvgElement("rect", [TsGanttConst.CHART_BODY_BACKGROUND_CLASS], [
            ["width", width + ""],
            ["height", height + ""],
        ], body);
        const rowBgs = new Map();
        barGroups.forEach((x, i) => {
            rowBgs.set(x.task.uuid, createSvgElement("rect", [TsGanttConst.CHART_ROW_BACKGROUND_CLASS], [
                ["y", (i * rowHeight) + ""],
                ["width", width + ""],
                ["height", rowHeight + ""],
            ], body));
        });
        for (let i = 0; i < barGroups.length;) {
            const lineY = ++i * rowHeight - border / 2;
            const horizontalLine = createSvgElement("line", [TsGanttConst.CHART_BODY_GRIDLINES_CLASS], [
                ["x1", 0 + ""],
                ["y1", lineY + ""],
                ["x2", width + ""],
                ["y2", lineY + ""],
            ], body);
        }
        xCoords.forEach(x => {
            const verticalLine = createSvgElement("line", [TsGanttConst.CHART_BODY_GRIDLINES_CLASS], [
                ["x1", x + ""],
                ["y1", 0 + ""],
                ["x2", x + ""],
                ["y2", height + ""],
            ], body);
        });
        const todayX = dayjs_min().startOf("day").diff(minDate, "day") * dayWidth;
        const rowFgs = new Map();
        const offsetsX = new Map();
        barGroups.forEach((x, i) => {
            const offsetY = i * rowHeight;
            const rowWrapper = createSvgElement("svg", [TsGanttConst.CHART_ROW_WRAPPER_CLASS], [
                ["y", offsetY + ""],
                ["width", width + ""],
                ["height", rowHeight + ""],
                ["data-tsg-row-uuid", x.task.uuid],
            ], body);
            rowWrapper.addEventListener("click", (e) => {
                rowWrapper.dispatchEvent(new CustomEvent(TsGanttConst.ROW_CLICK, {
                    bubbles: true,
                    detail: { task: x.task, event: e },
                }));
            });
            rowWrapper.addEventListener("contextmenu", (e) => {
                rowWrapper.dispatchEvent(new CustomEvent(TsGanttConst.ROW_CONTEXT_MENU, {
                    bubbles: true,
                    detail: { task: x.task, event: e },
                }));
            });
            rowFgs.set(x.task.uuid, rowWrapper);
            const row = createSvgElement("rect", [TsGanttConst.CHART_ROW_CLASS], [
                ["width", width + ""],
                ["height", rowHeight + ""],
            ], rowWrapper);
            if (x.barSvg) {
                const offsetX = x.minDate.diff(minDate, "day") * dayWidth;
                offsetsX.set(x.task.uuid, offsetX);
                x.barSvg.setAttribute("x", offsetX + "");
                rowWrapper.append(x.barSvg);
            }
        });
        if (drawTodayLine) {
            const todayVerticalLine = createSvgElement("line", [TsGanttConst.CHART_BODY_GRIDLINES_CLASS, TsGanttConst.CHART_BODY_TODAY_LINE_CLASS], [
                ["x1", todayX + ""],
                ["y1", 0 + ""],
                ["x2", todayX + ""],
                ["y2", height + ""],
            ], body);
        }
        this._chartRowBgs = rowBgs;
        this._chartRowFgs = rowFgs;
        this._chartOffsetsX = offsetsX;
        this._htmlBody = body;
    }
    redraw() {
        const oldHtml = this._html;
        const newHtml = document.createElement("div");
        newHtml.classList.add(TsGanttConst.CHART_CLASS);
        newHtml.append(this._htmlHeader, this._htmlBody);
        oldHtml.replaceWith(newHtml);
        this._html = newHtml;
    }
}

class TsGantt {
    constructor(containerSelector, options = null) {
        this._separatorDragActive = false;
        this._ignoreNextScrollEvent = false;
        this._tasks = [];
        this._selectedTasks = [];
        this.onResize = (e) => {
            const wrapperWidth = this._htmlWrapper.getBoundingClientRect().width;
            const tableWrapperWidth = this._htmlTableWrapper.getBoundingClientRect().width;
            this._htmlChartWrapper.style.width =
                (wrapperWidth - tableWrapperWidth - this._options.separatorWidthPx) + "px";
        };
        this.onMouseDownOnPartsSeparator = (e) => {
            document.addEventListener("mousemove", this.onMouseMoveWhileResizingParts);
            document.addEventListener("mouseup", this.onMouseUpWhileResizingParts);
            document.addEventListener("touchmove", this.onMouseMoveWhileResizingParts);
            document.addEventListener("touchend", this.onMouseUpWhileResizingParts);
            this._separatorDragActive = true;
        };
        this.onMouseMoveWhileResizingParts = (e) => {
            if (!this._separatorDragActive) {
                return false;
            }
            const rect = this._htmlWrapper.getBoundingClientRect();
            const wrapperLeftOffset = rect.left;
            const wrapperWidth = rect.width;
            const userDefinedWidth = e instanceof MouseEvent
                ? e.clientX - wrapperLeftOffset
                : e.touches[0].clientX - wrapperLeftOffset;
            this._htmlTableWrapper.style.width = (userDefinedWidth - this._options.separatorWidthPx) + "px";
            this._htmlChartWrapper.style.width = (wrapperWidth - userDefinedWidth) + "px";
        };
        this.onMouseUpWhileResizingParts = (e) => {
            document.removeEventListener("mousemove", this.onMouseMoveWhileResizingParts);
            document.removeEventListener("mouseup", this.onMouseUpWhileResizingParts);
            document.removeEventListener("touchmove", this.onMouseMoveWhileResizingParts);
            document.removeEventListener("touchend", this.onMouseUpWhileResizingParts);
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
                this.changeSelection(task, event.ctrlKey);
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
            this.toggleTaskExpanded(e.detail.uuid);
        });
        this._options = options instanceof TsGanttOptions
            ? options
            : new TsGanttOptions(options);
        this.setCssVariables(this._options);
        this._htmlContainer = document.querySelector(containerSelector);
        if (!this._htmlContainer) {
            throw new Error("Container is null");
        }
        this.createLayout();
    }
    get tasks() {
        return this._tasks.map(x => x.toModel());
    }
    set tasks(models) {
        const changeDetectionResult = this.updateTasks(models);
        this.update(changeDetectionResult);
    }
    get selectedTasks() {
        return this._selectedTasks.map(x => x.toModel());
    }
    set selectedTasks(models) {
        const ids = models.map(x => x.id);
        const targetTasks = this._tasks.filter(x => ids.includes(x.externalId));
        this.selectTasks(targetTasks);
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
    destroy() {
        this.removeWindowEventListeners();
        this.removeDocumentEventListeners();
        this._htmlWrapper.remove();
    }
    expandAll(state) {
        for (const task of this._tasks) {
            task.expanded = state;
            if (task.parentUuid) {
                task.shown = state;
            }
        }
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
        wrapper.classList.add(TsGanttConst.WRAPPER_CLASS, TsGanttConst.TEXT_SELECTION_DISABLED);
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
        tableWrapper.addEventListener("scroll", this.onWrapperScroll);
        chartWrapper.addEventListener("scroll", this.onWrapperScroll);
        separator.addEventListener("mousedown", this.onMouseDownOnPartsSeparator);
        separator.addEventListener("touchstart", this.onMouseDownOnPartsSeparator);
        this._htmlContainer.append(wrapper);
        this._htmlWrapper = wrapper;
        this._htmlTableWrapper = tableWrapper;
        this._htmlChartWrapper = chartWrapper;
        window.addEventListener("resize", this.onResize);
        document.addEventListener(TsGanttConst.ROW_CLICK, this.onRowClick);
        document.addEventListener(TsGanttConst.ROW_CONTEXT_MENU, this.onRowContextMenu);
        document.addEventListener(TsGanttConst.TABLE_CELL_EXPANDER_CLICK, this.onRowExpanderClick);
    }
    removeWindowEventListeners() {
        window.removeEventListener("resize", this.onResize);
    }
    removeDocumentEventListeners() {
        document.removeEventListener(TsGanttConst.ROW_CLICK, this.onRowClick);
        document.removeEventListener(TsGanttConst.ROW_CONTEXT_MENU, this.onRowContextMenu);
        document.removeEventListener(TsGanttConst.TABLE_CELL_EXPANDER_CLICK, this.onRowExpanderClick);
    }
    updateTasks(taskModels) {
        const oldTasks = this._tasks;
        const oldTasksIdMap = TsGanttTask.createTasksIdMap(oldTasks);
        const newTasks = TsGanttTask.convertModelsToTasks(taskModels, oldTasksIdMap);
        const changes = TsGanttTask.detectTaskChanges({ oldTasks, newTasks });
        this._tasks = changes.all;
        return changes;
    }
    update(data) {
        const uuids = this.getShownUuidsRecursively();
        this._table.update(false, data, uuids);
        this._chart.update(false, data, uuids);
        this.refreshSelection();
    }
    toggleTaskExpanded(uuid) {
        let targetTask;
        for (const task of this._tasks) {
            if (!targetTask && task.uuid === uuid) {
                targetTask = task;
                targetTask.expanded = !targetTask.expanded;
            }
            else if (task.parentUuid === uuid) {
                task.shown = targetTask.expanded;
            }
        }
        if (!targetTask) {
            return;
        }
        this.update(null);
    }
    changeSelection(task, ctrl) {
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
        this.selectTasks(selectedTasks);
    }
    refreshSelection() {
        const tasks = this._selectedTasks.filter(x => !TsGanttTask
            .checkForCollapsedParent(this._tasks, x));
        this.selectTasks(tasks);
    }
    selectTasks(newSelectedTasks) {
        const oldSelectedTasks = this._selectedTasks;
        const selectionEmpty = oldSelectedTasks.length === 0 && newSelectedTasks.length === 0;
        if (selectionEmpty) {
            return;
        }
        const oldUuids = oldSelectedTasks.map(x => x.uuid);
        const newUuids = newSelectedTasks.map(x => x.uuid);
        const selectionNotChanged = compareTwoStringSets(new Set(oldUuids), new Set(newUuids));
        if (selectionNotChanged) {
            return;
        }
        const selected = newUuids;
        const deselected = oldUuids.filter(x => !newUuids.includes(x));
        this._selectedTasks = newSelectedTasks;
        const result = { selected, deselected };
        this._table.applySelection(result);
        this._chart.applySelection(result);
        if (newSelectedTasks) {
            this.scrollChartToTasks(newUuids);
        }
        if (this.onSelectionChangeCb) {
            this.onSelectionChangeCb(newSelectedTasks.map(x => x.toModel()));
        }
    }
    scrollChartToTasks(uuids) {
        const offset = Math.min(...uuids.map(x => this._chart.getBarOffsetByTaskUuid(x)));
        if (offset) {
            this._htmlChartWrapper.scrollLeft = offset - 20;
        }
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
        this.refreshSelection();
    }
    updateChartDisplayMode() {
        this._chart.update(false, {
            deleted: [],
            added: [],
            changed: this._tasks,
            all: this._tasks,
        });
        this.refreshSelection();
    }
    getShownUuidsRecursively(parentUuid = null) {
        const tasksFiltered = this._tasks.filter(x => x.parentUuid === parentUuid)
            .sort((a, b) => a.compareTo(b));
        const uuids = [];
        for (const task of tasksFiltered) {
            if (!task.shown) {
                continue;
            }
            uuids.push(task.uuid);
            if (task.expanded) {
                uuids.push(...this.getShownUuidsRecursively(task.uuid));
            }
        }
        return uuids;
    }
}

export { TsGantt, TsGanttOptions, TsGanttTask };
