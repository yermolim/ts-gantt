import moment from "moment";
import { TsGanttTask } from "./ts-gantt-task";

class TsGanttOptions {

  enableChartEdit = true;
  tableMinWidth = 100;
  rowNestingMaxCount = 5;
  rowNestingIndentPx = 20;
  columnsMinWidthPx: number[] = [200, 100, 100, 100, 100, 100, 100, 100]; // 0 to disable column

  defaultScale: "day" | "week" | "month" | "year" = "day";
  localeLang = "en";
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
  columnValueGetters: ((a: TsGanttTask) => string)[] = [
    ((task: TsGanttTask) => task.localizedNames[this.localeLang] || name).bind(this),
    ((task: TsGanttTask) => (+task.progress.toFixed(2)).toLocaleString("en-US")
      .replace(".", this.localeDecimalSeparator[this.localeLang] || ".")).bind(this),
    ((task: TsGanttTask) => moment(task.datePlannedStart)
      .format(this.localeDateFormat[this.localeLang] || "L")).bind(this),
    ((task: TsGanttTask) => moment(task.datePlannedEnd)
      .format(this.localeDateFormat[this.localeLang] || "L")).bind(this),
    ((task: TsGanttTask) => task.dateActualStart 
      ? moment(task.dateActualStart).format(this.localeDateFormat[this.localeLang] || "L")
      : "").bind(this),
    ((task: TsGanttTask) => task.dateActualEnd 
      ? moment(task.dateActualEnd).format(this.localeDateFormat[this.localeLang] || "L")
      : "").bind(this),
    ((task: TsGanttTask) => task.dateActualEnd 
      ? moment(task.dateActualEnd).format(this.localeDateFormat[this.localeLang] || "L")
      : "").bind(this),
  ];
  
  constructor(item: object = null) {
    if (item != null) {
      Object.assign(this, item);
    }
  }
}

export { TsGanttOptions };
