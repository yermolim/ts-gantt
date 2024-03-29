import { TsGanttTask } from "../../core/ts-gantt-task";
import { TsGanttConst } from "../../core/ts-gantt-const";
import { TsGanttOptions } from "../../core/ts-gantt-options";

import { TsGanttHtmlComponentBase } from "../abstract/ts-gantt-html-component-base";

import { TsGanttTableDataCell } from "./ts-gantt-table-data-cell";
import { TsGanttTableExpander } from "./ts-gantt-table-expander";
import { TsGanttTableColumnDescriptor } from "./ts-gantt-table-column-descriptor";

export class TsGanttTableDataRow extends TsGanttHtmlComponentBase {
  private readonly _task: TsGanttTask;
  private readonly _expander: TsGanttTableExpander;

  constructor(options: TsGanttOptions, task: TsGanttTask, columns: TsGanttTableColumnDescriptor[]) {
    super();
    this._task = task;
    this._expander = new TsGanttTableExpander(options, task);
    this._html = this.createElement(columns, options.highlightRowsDependingOnTaskState);
  }

  override appendTo(parent: Element): void {
    this._expander.updateSymbol();
    super.appendTo(parent);
  }

  select() {
    this._html.classList.add(TsGanttConst.CLASSES.ROOT.ROW_SELECTED);
  }

  deselect() {
    this._html.classList.remove(TsGanttConst.CLASSES.ROOT.ROW_SELECTED);
  }

  private createElement(columns: TsGanttTableColumnDescriptor[], addStateClass: boolean): HTMLTableRowElement {
    const task = this._task;

    const row = document.createElement("tr");
    row.classList.add(TsGanttConst.CLASSES.TABLE.BODY_ROW);
    row.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains(TsGanttConst.CLASSES.TABLE.BODY_CELL_EXPANDER)) {
        row.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.ROW_CLICK, {
          bubbles: true,
          composed: true,
          detail: {task, event: e},
        }));
      }
    });
    row.addEventListener("contextmenu", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains(TsGanttConst.CLASSES.TABLE.BODY_CELL_EXPANDER)) {
        row.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.ROW_CONTEXT_MENU, {
          bubbles: true,
          composed: true,
          detail: {task, event: e},
        }));
      }
    });
    if (addStateClass) {
      row.classList.add(task.getState());
    }

    columns.forEach((column, i) => {
      const taskValue = column.valueGetter(task);
      const cell = new TsGanttTableDataCell(taskValue, column.textAlign, i === 0 ? this._expander: null);
      cell.appendTo(row);
    });

    return row;
  }
}
