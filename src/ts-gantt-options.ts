import { TsGanttTask } from "./ts-gantt-task";

class TsGanttOptions {

  enableChartEdit = true;
  tableMinWidth = 100;
  rowNestingMaxCount = 5;
  rowNestingIndentPx = 20;

  defaultScale: "hour" | "day" | "week" | "month" = "day";
  localeLang = "en";
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
  localeHeaders: {[key: string]: string[]} = {
    en: ["Name", "Progress", "Start date planned", "End date planned", 
      "Start date actual", "End date actual"],
    uk: ["Ім'я", "Прогрес", "Дата початку планована", "Дата завершення планована", 
      "Дата початку фактична", "Дата завершення фактична"],
    ru: ["Имя", "Прогресс", "Дата начала планируемая", "Дата окончания планируемая", 
      "Дата начала фактическая", "Дата окончания фактическая"],
  };
  localeFooters: {[key: string]: string[]} = {
    en: ["Total tasks", "Completed"],
    uk: ["Всього задач", "Завершено"],
    ru: ["Всего задач", "Завершено"],
  };
  
  constructor(item: object = null) {
    if (item != null) {
      Object.assign(this, item);
    }
  }
  
  barHeaderGetter = (a: TsGanttTask) => a.name;
  tooltipHeaderGetter = (a: TsGanttTask) => a.name;
  tooltipPlannedPeriodGetter = (a: TsGanttTask) => `${a.datePlannedStart}-${a.datePlannedEnd}`;
  tooltipActualPeriodGetter = (a: TsGanttTask) => `${a.dateActualStart}-${a.dateActualEnd}`;
  tooltipPlannedDurationGetter = (a: TsGanttTask) => a.durationPlanned;
  tooltipActualDurationGetter = (a: TsGanttTask) => a.durationActual;
  tooltipProgressGetter = (a: TsGanttTask) => a.progress;
}

export { TsGanttOptions };
