import { TsGanttConst } from "../../core/ts-gantt-const";
import { TsGanttTask, TsGanttTaskSelectionChangeResult } from "../../core/ts-gantt-task";
import { TsGanttData, TsGanttDataChangeResult } from "../../core/ts-gantt-data";

import { TsGanttBaseComponent } from "../abstract/ts-gantt-base-component";

import { TsGanttTableColumnOrder } from "./ts-gantt-table-column-order";
import { TsGanttTableColumn } from "./ts-gantt-table-column";
import { TsGanttTableRow } from "./ts-gantt-table-row";
import { TsGanttTableColumnOptions } from "./ts-gantt-table-column-options";

class TsGanttTable implements TsGanttBaseComponent {
  private _data: TsGanttData;
  
  private _activeUuids: string[] = [];

  private _html: HTMLTableElement;
  private _htmlHead: HTMLTableSectionElement;
  private _htmlBody: HTMLTableSectionElement;

  private _columnOrder: TsGanttTableColumnOrder;
  private _tableColumns: TsGanttTableColumn[];
  private _tableRows: Map<string, TsGanttTableRow> = new Map<string, TsGanttTableRow>();

  constructor(data: TsGanttData) {
    this._data = data;

    this.initBaseHtml();
    this.initColumns();

    document.addEventListener(TsGanttConst.EVENTS.TABLE_COLUMN_REORDER, this.onColumnReorder);
  }

  destroy() {
    this._html.remove();
    document.removeEventListener(TsGanttConst.EVENTS.TABLE_COLUMN_REORDER, this.onColumnReorder);
  }

  appendTo(parent: HTMLElement) {
    parent.append(this._html);
  }

  update(updateColumns: boolean, data: TsGanttDataChangeResult, uuids: string[]) {
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
      this._tableRows.get(uuid)?.deselect();
    }
    for (const uuid of selected) {
      this._tableRows.get(uuid)?.select();
    }
  }

  private initBaseHtml() {
    const table = document.createElement("table");
    table.classList.add(TsGanttConst.CLASSES.TABLE.MAIN_ELEMENT);
    const tableHead = table.createTHead();
    const tableBody = table.createTBody();

    this._htmlHead = tableHead;
    this._htmlBody = tableBody;
    this._html = table;
  }

  private initColumns() {
    this._columnOrder = new TsGanttTableColumnOrder(this._data.options.columnsMinWidthPx.length);
    this.updateColumns();
  }

  private updateColumns() {
    const options = this._data.options;

    const columns: TsGanttTableColumn[] = [];
    let currentOrder = 0;
    for (const i of this._columnOrder) {
      const minColumnWidth = options.columnsMinWidthPx[i];
      if (!minColumnWidth) {
        continue;
      }
      const columnOptions: TsGanttTableColumnOptions = {
        minWidth: minColumnWidth,
        order: currentOrder++,
        header: options.localeHeaders[options.locale][i] || "",
        textAlign: options.columnsContentAlign[i],
        valueGetter: options.columnValueGetters[i] || ((task: TsGanttTask) => ""),
      };
      columns.push(new TsGanttTableColumn(columnOptions));
    }
    this._tableColumns = columns;
  }

  private changeColumnIndex(oldIndex: number, newIndex: number) {
    this._columnOrder.move(oldIndex, newIndex);
    this.updateColumns();
    this.updateRows(this._data.getAllTasksAsChanged());
    this.redraw();
  }

  private updateRows(data: TsGanttDataChangeResult) {
    const columns = this._tableColumns;
    const rows = this._tableRows;

    data.deleted.forEach(task => rows.delete(task.uuid));
    data.changed.forEach(task => rows.set(task.uuid, new TsGanttTableRow(this._data.options, task, columns.map(col => col.options))));
    data.added.forEach(task => rows.set(task.uuid, new TsGanttTableRow(this._data.options, task, columns.map(col => col.options))));
  }

  private redraw() {
    const headerRow = document.createElement("tr");
    this._tableColumns.forEach(col => col.appendTo(headerRow));

    this._htmlHead.innerHTML = "";
    this._htmlHead.append(headerRow);

    this._htmlBody.innerHTML = "";
    this._activeUuids.forEach(uuid => this._tableRows.get(uuid)?.appendTo(this._htmlBody));
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
