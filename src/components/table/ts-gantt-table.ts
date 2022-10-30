import { TsGanttConst } from "../../core/ts-gantt-const";
import { TsGanttOptions } from "../../core/ts-gantt-options";
import { TsGanttTask, TsGanttTaskChangeResult, TsGanttTaskSelectionChangeResult } from "../../core/ts-gantt-task";

import { TsGanttBaseComponent } from "../abstract/ts-gantt-base-component";

import { TsGanttTableColumnOrder } from "./ts-gantt-table-column-order";
import { TsGanttTableColumn } from "./ts-gantt-table-column";
import { TsGanttTableRow } from "./ts-gantt-table-row";

class TsGanttTable implements TsGanttBaseComponent {
  private _options: TsGanttOptions;

  private _html: HTMLTableElement;
  private _htmlHead: HTMLTableSectionElement;
  private _htmlBody: HTMLTableSectionElement;

  private _columnOrder: TsGanttTableColumnOrder;
  private _tableColumns: TsGanttTableColumn[];
  private _tableRows: Map<string, TsGanttTableRow> = new Map<string, TsGanttTableRow>();

  private _activeUuids: string[] = [];
  private _currentTasks: TsGanttTask[] = [];

  constructor(options: TsGanttOptions) {    
    this._options = options;

    this.initBaseHtml();
    this.initColumns();

    document.addEventListener(TsGanttConst.TABLE_COLUMN_REORDER_EVENT, this.onColumnReorder);
  }

  destroy() {
    this._html.remove();
    document.removeEventListener(TsGanttConst.TABLE_COLUMN_REORDER_EVENT, this.onColumnReorder);
  }

  appendTo(parent: HTMLElement) {
    parent.append(this._html);
  }

  update(updateColumns: boolean, data: TsGanttTaskChangeResult, uuids: string[] = null) {
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

  applySelection(selectionResult: TsGanttTaskSelectionChangeResult) {
    const {selected, deselected} = selectionResult;
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

  private initBaseHtml() {
    const table = document.createElement("table");
    table.classList.add(TsGanttConst.TABLE_CLASS);
    const tableHead = table.createTHead();
    const tableBody = table.createTBody();

    this._htmlHead = tableHead;
    this._htmlBody = tableBody;
    this._html = table;
  }

  private initColumns() {
    this._columnOrder = new TsGanttTableColumnOrder(this._options.columnsMinWidthPx.length);
    this.updateColumns();
  }

  private updateColumns() {
    const columns: TsGanttTableColumn[] = [];
    let currentOrder = 0;
    for (const i of this._columnOrder) {
      const minColumnWidth = this._options.columnsMinWidthPx[i];
      if (!minColumnWidth) {
        continue;
      }
      columns.push(new TsGanttTableColumn(minColumnWidth, currentOrder++,
        this._options.localeHeaders[this._options.locale][i] || "",
        this._options.columnsContentAlign[i],
        this._options.columnValueGetters[i] || ((task: TsGanttTask) => "")));
    }
    this._tableColumns = columns;
  }

  private changeColumnIndex(oldIndex: number, newIndex: number) {
    this._columnOrder.move(oldIndex, newIndex);
    this.updateColumns();
    this.updateRows({
      added: [],
      deleted: [],
      changed: this._currentTasks,
      all: this._currentTasks,
    });
    this.redraw();
  }

  private updateRows(data: TsGanttTaskChangeResult) {
    const columns = this._tableColumns;
    const rows = this._tableRows;
    const addStateClass = this._options.highlightRowsDependingOnTaskState;

    data.deleted.forEach(x => rows.delete(x.uuid));
    data.changed.forEach(x => rows.set(x.uuid, new TsGanttTableRow(x, columns, addStateClass)));
    data.added.forEach(x => rows.set(x.uuid, new TsGanttTableRow(x, columns, addStateClass)));

    this._currentTasks = data.all;
  }

  private redraw() {
    const headerRow = document.createElement("tr");
    this._tableColumns.forEach(x => headerRow.append(x.html));

    this._htmlHead.innerHTML = "";
    this._htmlHead.append(headerRow);

    this._htmlBody.innerHTML = "";
    this._htmlBody.append(...this._activeUuids.map(x => this.getRowHtml(x)));
  }

  private getRowHtml(uuid: string): HTMLTableRowElement {    
    const symbols = this._options.rowSymbols;
    const row = this._tableRows.get(uuid);
    if (!row.task.hasChildren) {
      row.expander.innerHTML = symbols.childless;
    } else if (row.task.expanded) {
      row.expander.innerHTML = symbols.expanded;
    } else {
      row.expander.innerHTML = symbols.collapsed;
    }
    return row.html;
  }

  private onColumnReorder = <EventListener>((e: CustomEvent) => {
    const detail: {orderFrom: number; orderTo: number; event: DragEvent} = e.detail;
    if (!detail) {
      return;
    }

    this.changeColumnIndex(detail.orderFrom, detail.orderTo);  
  });
}

export { TsGanttTable };
