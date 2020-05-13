import { TsGanttConst } from "./ts-gantt-const";
import { TsGanttOptions } from "./ts-gantt-options";
import { TsGanttTask, TsGanttTaskChangeResult, TsGanttTaskSelectionChangeResult } from "./ts-gantt-task";
import { TsGanttTableColumn, TsGanttTableRow } from "./ts-gantt-table-parts";

class TsGanttTable {
  private _options: TsGanttOptions;
  
  private _html: HTMLTableElement;
  get html(): HTMLTableElement {
    return this._html;
  }  

  private _htmlHead: HTMLTableSectionElement;
  private _htmlBody: HTMLTableSectionElement;

  private _tableColumns: TsGanttTableColumn[];
  private _tableRows: Map<string, TsGanttTableRow> = new Map<string, TsGanttTableRow>();

  private _activeUuids: string[] = [];

  constructor(options: TsGanttOptions) {    
    this._options = options;
    
    const table = document.createElement("table");
    table.classList.add(TsGanttConst.TABLE_CLASS);
    const tableHead = table.createTHead();
    const tableBody = table.createTBody();

    this._htmlHead = tableHead;
    this._htmlBody = tableBody;
    this._html = table;
    
    this.updateColumns();
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

  private updateColumns() {
    const columns: TsGanttTableColumn[] = [];
    for (let i = 0; i < 9; i++) {
      const minColumnWidth = this._options.columnsMinWidthPx[i];
      const contentAlign = this._options.columnsContentAlign[i];
      if (minColumnWidth) {
        columns.push(new TsGanttTableColumn(minColumnWidth, contentAlign, this._options.localeHeaders[this._options.locale][i] || "",
          this._options.columnValueGetters[i] || ((task: TsGanttTask) => "")));
      }
    }
    this._tableColumns = columns;  
  }  

  private updateRows(data: TsGanttTaskChangeResult) {
    const columns = this._tableColumns;
    const rows = this._tableRows;
    const addStateClass = this._options.highlightRowsDependingOnTaskState;

    data.deleted.forEach(x => rows.delete(x.uuid));
    data.changed.forEach(x => rows.set(x.uuid, new TsGanttTableRow(x, columns, addStateClass)));
    data.added.forEach(x => rows.set(x.uuid, new TsGanttTableRow(x, columns, addStateClass)));
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
}

export { TsGanttTable };
