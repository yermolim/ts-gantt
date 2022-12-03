import { TsGanttConst } from "../../core/ts-gantt-const";
import { TsGanttTaskSelectionChangeResult } from "../../core/ts-gantt-task";
import { TsGanttData, TsGanttDataChangeResult } from "../../core/ts-gantt-data";

import { TsGanttBaseComponent } from "../abstract/ts-gantt-base-component";

import { TsGanttTableColumnDescriptor } from "./ts-gantt-table-column-descriptor";
import { TsGanttTableColumnOrder } from "./ts-gantt-table-column-order";
import { TsGanttTableDataRow } from "./ts-gantt-table-data-row";
import { TsGanttTableHeaderRow } from "./ts-gantt-table-header-row";

class TsGanttTable implements TsGanttBaseComponent {
  private _data: TsGanttData;
  
  private _activeUuids: string[] = [];

  private _html: HTMLTableElement;
  private _htmlHead: HTMLTableSectionElement;
  private _htmlBody: HTMLTableSectionElement;

  private _columnOrder: TsGanttTableColumnOrder;
  private _columnDescriptors: TsGanttTableColumnDescriptor[];

  private _headerRow: TsGanttTableHeaderRow;
  private _dataRowByTaskUuid: Map<string, TsGanttTableDataRow> = new Map<string, TsGanttTableDataRow>();

  private _lastSelectionResult: TsGanttTaskSelectionChangeResult;

  constructor(data: TsGanttData) {
    this._data = data;

    this.initBaseHtml();
    this.updateColumns();

    this._html.addEventListener(TsGanttConst.EVENTS.TABLE_COLUMN_REORDER, this.onColumnReorder);
  }

  destroy() {
    this._html.removeEventListener(TsGanttConst.EVENTS.TABLE_COLUMN_REORDER, this.onColumnReorder);
    this._html.remove();
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
      this._dataRowByTaskUuid.get(uuid)?.deselect();
    }
    for (const uuid of selected) {
      this._dataRowByTaskUuid.get(uuid)?.select();
    }
    
    this._lastSelectionResult = selectionResult;
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

  private updateColumns() {
    if (!this._columnOrder) {
      this._columnOrder = new TsGanttTableColumnOrder(this._data.options.columnsMinWidthPx.length);
    }
    this._columnDescriptors = TsGanttTableColumnDescriptor.buildFromGanttOptions(this._data.options, this._columnOrder);
    this._headerRow = new TsGanttTableHeaderRow(this._columnDescriptors);
  }

  private updateRows(data: TsGanttDataChangeResult) {
    const columnOptions = this._columnDescriptors;
    const rows = this._dataRowByTaskUuid;

    data.deleted.forEach(task => rows.delete(task.uuid));
    for (const task of data.changed.concat(data.added)) {
      rows.set(task.uuid, new TsGanttTableDataRow(this._data.options, task, columnOptions));
    }
  }

  private changeColumnIndex(oldIndex: number, newIndex: number) {
    this._columnOrder.move(oldIndex, newIndex);
    this.updateColumns();
    this.updateRows(this._data.getAllTasksAsChanged());
    this.redraw();
    this.applySelection(this._lastSelectionResult);
  }

  private redraw() {
    this._htmlHead.innerHTML = "";
    this._headerRow.appendTo(this._htmlHead);

    this._htmlBody.innerHTML = "";
    this._activeUuids.forEach(uuid => this._dataRowByTaskUuid.get(uuid)?.appendTo(this._htmlBody));
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
