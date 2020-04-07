import dayjs from "dayjs";
import { TsGanttTask } from "./ts-gantt-task";

class TsGanttOptions {

  enableChartEdit = true;
  tableMinWidth = 100;
  rowNestingMaxCount = 5;
  rowNestingIndentPx = 20;
  // 0 to disable column
  columnsMinWidthPx: number[] = [200, 100, 100, 100, 100, 100, 100, 100];
  // "start", "center", "end"
  columnsContentAlign: string[] = ["start", "end", "center", "center", "center", "center", "center", "center"];

  defaultScale: "day" | "week" | "month" | "year" = "day";

  locale = "en";
  localeDecimalSeparator: {[key: string]: string} = {
    en: ".",
    uk: ",",
    ru: ",",
  };
  localeDateFormat: {[key: string]: string} = { 
    en: "MM/DD/YYYY",
    uk: "DD.MM.YYYY",
    ru: "DD.MM.YYYY",
  };
  localeFirstWeekDay: {[key: string]: number} = {
    en: 0,
    uk: 1,
    ru: 1,
  };
  localeDateMonths: {[key: string]: string[]} = {
    en: ["January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"],
    uk: ["Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень", 
      "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"],
    ru: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
  };
  localeDateDays: {[key: string]: string[]} = {
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    uk: ["Неділя", "Понеділок", "Вівторок", "Середа", "Четвер", "П'ятниця", "Субота"],
    ru: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
  };
  localeDateScale: {[key: string]: string[]} = {
    en: ["Hours", "Days", "Weeks", "Months"],
    uk: ["Години", "Дні", "Тижні", "Місяці"],
    ru: ["Часы", "Дни", "Недели", "Месяцы"],
  };
  localeFooters: {[key: string]: string[]} = {
    en: ["Total tasks", "Completed"],
    uk: ["Всього задач", "Завершено"],
    ru: ["Всего задач", "Завершено"],
  };
  localeHeaders: {[key: string]: string[]} = {
    en: ["Name", "Progress", "Start date planned", "End date planned", 
      "Start date actual", "End date actual", "Duration planned", "Duration actual"],
    uk: ["Ім'я", "Прогрес", "Дата початку планована", "Дата завершення планована", 
      "Дата початку фактична", "Дата завершення фактична", "Тривалість планована", "Тривалість фактична"],
    ru: ["Имя", "Прогресс", "Дата начала планируемая", "Дата окончания планируемая", 
      "Дата начала фактическая", "Дата окончания фактическая", "Длительность планируемая", "Длительность фактическая"],
  };
  localeDurationFormatters: {[key: string]: (duration: number) => string} = {
    en: (duration: number) => duration === 1 ? "1 day" : duration + " days",
    uk: (duration: number) => {     
      let d = duration % 100;
      if (d > 10 && d < 20) {
        return d + " днів";
      } else {
        d = d % 10;
        if (d === 1) {
          return d + " день";
        } else if (d < 5) {
          return d + " дні";
        } else {
          return d + " днів";
        }
      }
    },
    ru: (duration: number) => {      
      let d = duration % 100;
      if (d > 10 && d < 20) {
        return d + " дней";
      } else {
        d = d % 10;
        if (d === 1) {
          return d + " день";
        } else if (d < 5) {
          return d + " дня";
        } else {
          return d + " дней";
        }
      }
    },
  };

  columnValueGetters: ((a: TsGanttTask) => string)[] = [
    ((task: TsGanttTask) => task.localizedNames[this.locale] || task.name).bind(this),
    ((task: TsGanttTask) => (+task.progress.toFixed(2)).toLocaleString("en-US")
      .replace(".", this.localeDecimalSeparator[this.locale] || ".")).bind(this),
    ((task: TsGanttTask) => dayjs(task.datePlannedStart)
      .format(this.localeDateFormat[this.locale] || "L")).bind(this),
    ((task: TsGanttTask) => dayjs(task.datePlannedEnd)
      .format(this.localeDateFormat[this.locale] || "L")).bind(this),
    ((task: TsGanttTask) => task.dateActualStart 
      ? dayjs(task.dateActualStart).format(this.localeDateFormat[this.locale] || "L")
      : "").bind(this),
    ((task: TsGanttTask) => task.dateActualEnd 
      ? dayjs(task.dateActualEnd).format(this.localeDateFormat[this.locale] || "L")
      : "").bind(this),
    ((task: TsGanttTask) => {
      const end = dayjs(task.datePlannedEnd);
      const start = dayjs(task.datePlannedStart);
      const duration = end.diff(start, "day") + 1;
      return this.localeDurationFormatters[this.locale]
        ? this.localeDurationFormatters[this.locale](duration) 
        : duration.toString();
    }).bind(this),
    ((task: TsGanttTask) => {
      if (!task.dateActualEnd || !task.dateActualStart) {
        return "";
      }
      const end = dayjs(task.dateActualEnd);
      const start = dayjs(task.dateActualStart);
      const duration = end.diff(start, "day") + 1;
      return this.localeDurationFormatters[this.locale]
        ? this.localeDurationFormatters[this.locale](duration) 
        : duration.toString();
    }).bind(this),
  ];
  
  constructor(item: object = null) {
    if (item != null) {
      Object.assign(this, item);
    }
  }
}

export { TsGanttOptions };
