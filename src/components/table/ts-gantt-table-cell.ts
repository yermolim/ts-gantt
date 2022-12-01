import { TsGanttConst } from "../../core/ts-gantt-const";
import { ColumnTextAlignment } from "../../core/ts-gantt-common";

import { TsGanttHtmlComponentBase } from "../abstract/ts-gantt-html-component-base";

import { TsGanttTableExpander } from "./ts-gantt-table-expander";

export class TsGanttTableCell extends TsGanttHtmlComponentBase {

  constructor(value: string, alignment: ColumnTextAlignment, expander: TsGanttTableExpander) {
    super();
    this._html = this.createElement(value, alignment, expander);
  }

  private createElement(value: string, alignment: ColumnTextAlignment, expander?: TsGanttTableExpander): HTMLTableCellElement {
    const cellElement = document.createElement("td");
    cellElement.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL);
    const cellInnerDiv = document.createElement("div");
    cellInnerDiv.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL_TEXT_WRAPPER, alignment);

    expander?.appendTo(cellInnerDiv);

    const cellText = document.createElement("p");
    cellText.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL_TEXT);
    cellText.innerHTML = value;
    cellInnerDiv.append(cellText);

    cellElement.append(cellInnerDiv);

    return cellElement;
  }
}
