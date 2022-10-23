import { TsGanttTask } from "./ts-gantt-task";

class TsGanttOptions {

  // IMPLEMENT
  // enableChartEdit = false;
  // enablePlannedDatesEdit = true;
  // enableActualDatesEdit = true;
  // bindParentDatesToChild = true;
  // enableProgressEdit = true;

  useShadowDom: false;

  multilineSelection = true;
  useCtrlKeyForMultilineSelection = true;

  drawTodayLine = true;
  highlightRowsDependingOnTaskState = true;

  columnsMinWidthPx: number[] = [200, 100, 100, 100, 100, 100, 100, 100];
  columnsContentAlign: ("start" | "center" | "end")[] = ["start", "end", "center", "center", "center", "center", "center", "center"];

  separatorWidthPx = 5;
  headerHeightPx = 90;
  rowHeightPx = 40;
  borderWidthPx = 1;
  barStrokeWidthPx = 2;
  barMarginPx = 2;
  barCornerRadiusPx = 6;

  rowSymbols: TsGanttRowSymbols = {
    childless: "•",
    collapsed: "▾",
    expanded: "▴",
  };

  chartShowProgress = true;
  chartDisplayMode: "planned" | "actual" | "both" = "both";
  chartScale: "day" | "week" | "month" | "year" = "month";
  chartDateOffsetDays: {[key: string]: number} = {
    "day": 14,
    "week": 60,
    "month": 240,
    "year": 730,
  };
  chartDateOffsetDaysMin: {[key: string]: number} = {
    "day": 7,
    "week": 30,
    "month": 120,
    "year": 365,
  };
  chartDayWidthPx: {[key: string]: number} = {
    "day": 60,
    "week": 20,
    "month": 3,
    "year": 1,
  };

  locale = "en";
  localeDecimalSeparator: {[key: string]: string} = {
    en: ".",
    uk: ",",
    ru: ",",
    ja: ".",
  };
  localeDateFormat: {[key: string]: string} = { 
    en: "MM/DD/YYYY",
    uk: "DD.MM.YYYY",
    ru: "DD.MM.YYYY",
    ja: "YYYY/MM/DD",
  };
  localeFirstWeekDay: {[key: string]: number} = {
    en: 0,
    uk: 1,
    ru: 1,
    ja: 0,
  };
  localeDateMonths: {[key: string]: string[]} = {
    en: ["January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"],
    uk: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", 
      "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
    ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    ja: ["1月", "2月", "3月", "4月", "5月", "6月",
      "7月", "8月", "9月", "10月", "11月", "12月"],
  };
  localeDateDays: {[key: string]: string[]} = {
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    uk: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
    ru: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
    ja: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
  };
  localeDateDaysShort: {[key: string]: string[]} = {
    en: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    uk: ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    ru: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
    ja: ["日", "月", "火", "水", "木", "金", "土"],
  };
  localeDateScale: {[key: string]: string[]} = {
    en: ["Weeks", "Months", "Years"],
    uk: ["Тижні", "Місяці", "Роки"],
    ru: ["Недели", "Месяцы", "Годы"],
    ja: ["週間", "月間", "年間"],
  };
  localeFooters: {[key: string]: string[]} = {
    en: ["Total tasks", "Completed"],
    uk: ["Всього задач", "Завершено"],
    ru: ["Всего задач", "Завершено"],
    ja: ["総タスク", "完了"],
  };
  localeHeaders: {[key: string]: string[]} = {
    en: ["Name", "Progress", "Start date planned", "End date planned", 
      "Start date actual", "End date actual", "Duration planned", "Duration actual"],
    uk: ["Ім'я", "Прогрес", "Дата початку планована", "Дата завершення планована",
      "Дата початку фактична", "Дата завершення фактична", "Тривалість планована", "Тривалість фактична"],
    ru: ["Имя", "Прогресс", "Дата начала планируемая", "Дата окончания планируемая",
      "Дата начала фактическая", "Дата окончания фактическая", "Длительность планируемая", "Длительность фактическая"],
    ja: ["タイトル", "進捗", "予定開始日", "予定終了日", 
      "実績開始日", "実績終了日", "予定日数", "実績日数"],
  };
  localeDurationFormatters: {[key: string]: (duration: number) => string} = {
    en: (duration: number) => duration === 1 ? "1 day" : duration + " days",
    uk: (duration: number) => {     
      let d = duration % 100;
      if (d > 10 && d < 20) {
        return duration + " днів";
      } else {
        d = d % 10;
        if (d === 1) {
          return duration + " день";
        } else if (d < 5 && d > 0) {
          return duration + " дні";
        } else {
          return duration + " днів";
        }
      }
    },
    ru: (duration: number) => {      
      let d = duration % 100;
      if (d > 10 && d < 20) {
        return duration + " дней";
      } else {
        d = d % 10;
        if (d === 1) {
          return duration + " день";
        } else if (d < 5 && d > 0) {
          return duration + " дня";
        } else {
          return duration + " дней";
        }
      }
    },
    ja: (duration: number) => duration === 1 ? "1 日" : duration + " 日間",
  };

  columnValueGetters: ((a: TsGanttTask) => string)[] = [
    (task: TsGanttTask) => task.localizedNames && task.localizedNames[this.locale] || task.name,
    (task: TsGanttTask) => (+task.progress.toFixed(2)).toLocaleString("en-US")
      .replace(".", this.localeDecimalSeparator[this.locale] || ".") + " %",
    (task: TsGanttTask) => task.datePlannedStart 
      ? task.datePlannedStart.format(this.localeDateFormat[this.locale] || "L")
      : "",
    (task: TsGanttTask) => task.datePlannedEnd 
      ? task.datePlannedEnd.format(this.localeDateFormat[this.locale] || "L")
      : "",
    (task: TsGanttTask) => task.dateActualStart 
      ? task.dateActualStart.format(this.localeDateFormat[this.locale] || "L")
      : "",
    (task: TsGanttTask) => task.dateActualEnd 
      ? task.dateActualEnd.format(this.localeDateFormat[this.locale] || "L")
      : "",
    (task: TsGanttTask) => {
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
    (task: TsGanttTask) => {
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

  taskComparer: (taskA: TsGanttTask, taskB: TsGanttTask) => number;
  
  constructor(item: object = null) {
    if (item != null) {
      Object.assign(this, item);
    }
  }
}

interface TsGanttRowSymbols {
  expanded: string; 
  collapsed: string; 
  childless: string;
}

export { TsGanttOptions, TsGanttRowSymbols };
