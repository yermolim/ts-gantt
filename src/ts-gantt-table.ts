import { TsGanttTask, TsGanttTaskChangesDetectionResult } from "./ts-gantt-task";
import { TsGanttOptions } from "./ts-gantt-options";

class TsGanttTableColumn {
  html: string;
  minWidth: number;
  header: string;
  valueGetter: (a: TsGanttTask) => string;

  constructor(minWidth: number, header: string, valueGetter: (a: TsGanttTask) => string) {
    this.minWidth = minWidth;
    this.header = header;
    this.valueGetter = valueGetter;
    this.html = `
      <th style='min-width:${this.minWidth}px;'>
        ${this.header}
      </th>`;
  }
}

class TsGanttTableRow {
  private static readonly INDENT_TEMPLATE_EMPTY = "<p class='tsg-cell-text-indent' style='width:20px;'></p>";
  private static readonly INDENT_TEMPLATE_NON_EXPANDABLE = "<p class='tsg-cell-text-indent' style='width:20px;'>⯁</p>";
  private static readonly INDENT_TEMPLATE_EXPANDABLE = "<p class='tsg-cell-text-indent' style='width:20px;'>⯆</p>";
  private static readonly INDENT_TEMPLATE_EXPANDED = "<p class='tsg-cell-text-indent' style='width:20px;'>⯅</p>";
  private static readonly CELL_TEXT_WRAPPER_CLASS = "tsg-cell-text-wrapper";
  private static readonly CELL_TEXT_CLASS = "tsg-cell-text";

  readonly task: TsGanttTask;
  readonly html: string;
  expanded = true; // false;
  shown = false;

  constructor(task: TsGanttTask, columns: TsGanttTableColumn[]) {
    this.task = task;
    this.shown = true; // !task.parentUuid;
    this.html = this.generateHtml(columns);
  }

  generateHtml(columns: TsGanttTableColumn[]): string {
    let html = "<tr>";
    columns.forEach((x, i) => {
      html += `<td><div class='${TsGanttTableRow.CELL_TEXT_WRAPPER_CLASS}'>`;   
    
      if (i === 0) {
        for (let j = 0; j < this.task.nestingLvl; j++) {
          html += TsGanttTableRow.INDENT_TEMPLATE_EMPTY;
        }
        html += !this.task.hasChildren 
          ? TsGanttTableRow.INDENT_TEMPLATE_NON_EXPANDABLE 
          : this.expanded
            ? TsGanttTableRow.INDENT_TEMPLATE_EXPANDED
            : TsGanttTableRow.INDENT_TEMPLATE_EXPANDABLE;
      }
  
      html += `<p class='${TsGanttTableRow.CELL_TEXT_CLASS}'>
        ${x.valueGetter(this.task)}
      </p>`;
        
      html += "</div></td>";
    });
    html += "</tr>";
    return html;
  }
}

class TsGanttTable {
  private _options: TsGanttOptions;
  
  private _htmlTable: HTMLTableElement;
  get htmlTable(): HTMLTableElement {
    return this._htmlTable;
  }  

  private _htmlTableHead: HTMLTableSectionElement;
  private _htmlTableBody: HTMLTableSectionElement;

  private _tableColumns: TsGanttTableColumn[];
  private _tableRows: TsGanttTableRow[] = [];

  constructor(classList: string[], options: TsGanttOptions) {    
    this._options = options;
    
    const table = document.createElement("table");
    table.classList.add(...classList);
    const tableHead = table.createTHead();
    const tableBody = table.createTBody();

    this._htmlTableHead = tableHead;
    this._htmlTableBody = tableBody;
    this._htmlTable = table;
    
    this.updateColumns();
  }

  updateColumns() {
    const columns: TsGanttTableColumn[] = [];
    for (let i = 0; i < 9; i++) {
      const minColumnWidth = this._options.columnsMinWidthPx[i];
      if (minColumnWidth) {
        columns.push(new TsGanttTableColumn(minColumnWidth, this._options.localeHeaders[this._options.locale][i] || "",
          this._options.columnValueGetters[i] || ((task: TsGanttTask) => "")));
      }
    }

    let headerRowHtml = "<tr>";
    columns.forEach(x => headerRowHtml += x.html);
    headerRowHtml += "</tr>";

    this._tableColumns = columns;
    this._htmlTableHead.innerHTML = headerRowHtml;    
  }  

  updateRows(data: TsGanttTaskChangesDetectionResult) {
    data.deleted.forEach(x => {
      const index = this._tableRows.findIndex(y => y.task.uuid === x.uuid);
      if (index !== 1) {
        this._tableRows.splice(index, 1);
      }
    });
    data.changed.forEach(x => {      
      const index = this._tableRows.findIndex(y => y.task.uuid === x.uuid);
      if (index !== 1) {
        this._tableRows[index] = new TsGanttTableRow(x, this._tableColumns);
      }
    });
    data.added.forEach(x => this._tableRows.push(new TsGanttTableRow(x, this._tableColumns)));
    
    // const expandedByUuid = this._tableRows.filter(x => x.expandable).map(x => ({ [x.uuid]: x.expanded }));
    // this._tableRows.filter(x => x.parentUuid).forEach(x => {
    //   x.shown = expandedByUuid[x.uuid] || false;
    // });

    this._htmlTableBody.innerHTML = this.getRowsHtmlRecursively(this._tableRows, null);
  }

  getRowsHtmlRecursively(rows: TsGanttTableRow[], parentUuid: string): string {
    const rowsFiltered = rows.filter(x => x.task.parentUuid === parentUuid)
      .sort((a: TsGanttTableRow, b: TsGanttTableRow): number => a.task.compareTo(b.task));
    let html = "";
    for (const row of rowsFiltered) {
      if (!row.shown) {
        continue;
      }
      html += row.html;
      if (row.expanded) {
        html += this.getRowsHtmlRecursively(rows, row.task.uuid);
      }
    }
    return html;
  }
}

export { TsGanttTable, TsGanttTableRow, TsGanttTableColumn };
