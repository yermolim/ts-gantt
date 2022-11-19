import dayjs from "dayjs";

import { TsGanttConst } from "../../core/ts-gantt-const";
import { createSvgElement, getAllDatesBetweenTwoDates } from "../../core/ts-gantt-common";
import { TsGanttOptions } from "../../core/ts-gantt-options";

class TsGanttChartHeader {
  private readonly _options: TsGanttOptions;

  private _svg: SVGElement;

  private _width: number;
  get width(): number {
    return this._width;
  }

  private _height: number;
  get height(): number {
    return this._height;
  }

  private _xCoords: number[];
  get xCoords(): readonly number[] {
    return this._xCoords;
  }

  constructor(options: TsGanttOptions, minDate: dayjs.Dayjs, maxDate: dayjs.Dayjs) {
    this._options = options;
    this.drawSvg(minDate, maxDate);
  }

  destroy() {
    this._svg.remove();
  }

  appendTo(parent: HTMLElement) {
    parent.append(this._svg);
  }

  private createWrapper(width: number, height: number): SVGElement {
    const header = createSvgElement("svg", [TsGanttConst.CHART_HEADER_CLASS], [
      ["width", width + ""],
      ["height", height + ""],
    ]);
    createSvgElement("rect", [TsGanttConst.CHART_HEADER_BACKGROUND_CLASS], [
      ["width", width + ""],
      ["height", height + ""],
    ], header);
    return header;
  }

  private drawSvg(minDate: dayjs.Dayjs, maxDate: dayjs.Dayjs) {
    const scale = this._options.chartScale;
    const dayWidth = this._options.chartDayWidthPx[scale];
    const height = this._options.headerHeightPx;

    const dates = getAllDatesBetweenTwoDates(minDate, maxDate);
    const width = dates.length * dayWidth;

    const header = this.createWrapper(width, height);

    const locale = this._options.locale;
    const months = this._options.localeDateMonths[locale];
    const daysShort = this._options.localeDateDaysShort[locale];

    let xCoords: number[];
    if (scale === "year") {
      xCoords = this.drawYearScaledHeaderContent(
        header, dates, maxDate, dayWidth, height);
    } else if (scale === "month") {
      xCoords = this.drawMonthScaledHeaderContent(
        header, months, dates, maxDate, height, width, dayWidth);
    } else if (scale === "week" || scale ==="day") {
      xCoords = this.drawWeekDayScaledHeaderContent(
        header, months, daysShort, dates, maxDate, height, width, dayWidth);
    }

    this._svg = header;
    this._width = width;
    this._height = height;
    this._xCoords = xCoords;
  }

  private drawHeaderElementWrapper(parent: SVGElement, left: number, top: number, width: number, height: number): SVGElement {
    return createSvgElement("svg", [], [
      ["x", left + ""],
      ["y", top + ""],
      ["width", width + ""],
      ["height", height + ""],
    ], parent);
  }

  private drawHorizontalBorder(header: SVGElement, top: number, width: number) {
    createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
      ["x1", 0 + ""],
      ["y1", top + ""],
      ["x2", width + ""],
      ["y2", top + ""],
    ], header);
  }

  private drawVerticalBorder(header: SVGElement, left: number, top: number, height: number) {
    createSvgElement("line", [TsGanttConst.CHART_HEADER_GRIDLINES_CLASS], [
      ["x1", left + ""],
      ["y1", top + ""],
      ["x2", left + ""],
      ["y2", top + height + ""],
    ], header);
  }

  private drawText(parent: SVGElement, text: string) {
    createSvgElement("text", [TsGanttConst.CHART_HEADER_TEXT_CLASS], [
      ["x", "50%"],
      ["y", "50%"],
      ["dominant-baseline", "middle"],
      ["text-anchor", "middle"],
    ], parent, text);
  }

  private drawYear(header: SVGElement, date: dayjs.Dayjs, 
    nextDayOffset: number, yearStartOffset: number, 
    top: number, rowHeight: number) {

    const yearWidth = nextDayOffset - yearStartOffset;
    const yearSvg = this.drawHeaderElementWrapper(header, yearStartOffset, top, yearWidth, rowHeight);
    if (yearWidth >= 60) {
      this.drawText(yearSvg, date.year() + "");
    }
    this.drawVerticalBorder(header, nextDayOffset, top, rowHeight);
  }

  private drawMonth(header: SVGElement, months: string[], date: dayjs.Dayjs, 
    nextDayOffset: number, monthStartOffset: number,
    top: number, rowHeight: number) {

    const monthWidth = nextDayOffset - monthStartOffset;
    const monthSvg =  this.drawHeaderElementWrapper(header, monthStartOffset, top, monthWidth, rowHeight);
    if (monthWidth >= 60) {
      const monthName = months[date.month()];
      this.drawText(monthSvg, monthName);
    }
    this.drawVerticalBorder(header, nextDayOffset, top, rowHeight);
  }

  private drawDay(header: SVGElement, daysShort: string[], date: dayjs.Dayjs, 
    currentDayOffset: number, nextDayOffset: number, dayWidth: number,
    top: number, rowHeight: number) {

    const daySvg =  this.drawHeaderElementWrapper(header, currentDayOffset, top, dayWidth, rowHeight);
    const dayName = dayWidth < 30
      ? date.date() + ""
      : daysShort[date.day()] + " " + date.date();
    this.drawText(daySvg, dayName);
    this.drawVerticalBorder(header, nextDayOffset, top, rowHeight);
  }

  private drawWeekDayScaledHeaderContent(header: SVGElement, months: string[], daysShort: string[], 
    dates: dayjs.Dayjs[], maxDate: dayjs.Dayjs, 
    height: number, width: number, dayWidth: number): number[] {

    const verticalLinesXCoords: number[] = [];

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

  private drawMonthScaledHeaderContent(header: SVGElement, months: string[], 
    dates: dayjs.Dayjs[], maxDate: dayjs.Dayjs, 
    height: number, width: number, dayWidth: number): number[] {

    const verticalLinesXCoords: number[] = [];

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

  private drawYearScaledHeaderContent(header: SVGElement, dates: dayjs.Dayjs[], 
    maxDate: dayjs.Dayjs, dayWidth: number, height: number): number[] {

    const verticalLinesXCoords: number[] = [];

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

export { TsGanttChartHeader };
