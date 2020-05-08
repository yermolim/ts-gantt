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
  private _tableRows: TsGanttTableRow[] = [];

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

  update(updateColumns: boolean, data: TsGanttTaskChangeResult ) {
    if (updateColumns) {
      this.updateColumns();
    }
    if (data) {
      this.updateRows(data);
    }
    this.redraw();
  }
  
  applySelection(selectionResult: TsGanttTaskSelectionChangeResult) {
    const {selected, deselected} = selectionResult;
    if (deselected) {
      const row = this._tableRows.find(x => x.task.uuid === deselected.uuid);
      if (row) {
        row.html.classList.remove(TsGanttConst.ROW_SELECTED_CLASS);
      }
    }
    if (selected) {      
      const row = this._tableRows.find(x => x.task.uuid === selected.uuid);
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
    data.deleted.forEach(x => {
      const index = this._tableRows.findIndex(y => y.task.uuid === x.uuid);
      if (index !== 1) {
        this._tableRows.splice(index, 1);
      }
    });
    data.changed.forEach(x => {      
      const index = this._tableRows.findIndex(y => y.task.uuid === x.uuid);
      if (index !== -1) {
        this._tableRows[index] = new TsGanttTableRow(x, this._tableColumns);
      }
    });
    data.added.forEach(x => this._tableRows.push(new TsGanttTableRow(x, this._tableColumns)));
  }

  private redraw() {    
    const headerRow = document.createElement("tr");
    this._tableColumns.forEach(x => headerRow.append(x.html));

    this._htmlHead.innerHTML = "";    
    this._htmlHead.append(headerRow);  

    this._htmlBody.innerHTML = "";
    this._htmlBody.append(...this.getRowsHtmlRecursively(this._tableRows, null));
  }

  private getRowsHtmlRecursively(rows: TsGanttTableRow[], parentUuid: string): HTMLTableRowElement[] {
    const symbols = this._options.rowSymbols;
    const rowsFiltered = rows.filter(x => x.task.parentUuid === parentUuid)
      .sort((a: TsGanttTableRow, b: TsGanttTableRow): number => a.task.compareTo(b.task));
    const rowsHtml: HTMLTableRowElement[] = [];
    for (const row of rowsFiltered) {
      if (!row.task.shown) {
        continue;
      }
      rowsHtml.push(row.html);
      if (!row.task.hasChildren) {
        row.expander.innerHTML = symbols.childless;
      } else if (row.task.expanded) {
        row.expander.innerHTML = symbols.expanded;
        rowsHtml.push(...this.getRowsHtmlRecursively(rows, row.task.uuid));
      } else {
        row.expander.innerHTML = symbols.collapsed;
      }
    }
    return rowsHtml;
  }
}

export { TsGanttTable };
