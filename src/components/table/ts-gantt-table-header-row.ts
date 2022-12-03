import { TsGanttHtmlComponentBase } from "../abstract/ts-gantt-html-component-base";

import { TsGanttTableColumnDescriptor } from "./ts-gantt-table-column-descriptor";
import { TsGanttTableHeaderCell } from "./ts-gantt-table-header-cell";

export class TsGanttTableHeaderRow extends TsGanttHtmlComponentBase {

  constructor(options: TsGanttTableColumnDescriptor[]) {
    super();
    this._html = this.createElement(options);
  }

  private createElement(columnDescriptors: TsGanttTableColumnDescriptor[]): HTMLTableRowElement {
    const row = document.createElement("tr");

    for (const columnDescriptor of columnDescriptors) {
      new TsGanttTableHeaderCell(columnDescriptor).appendTo(row);
    }

    return row;
  }
}
