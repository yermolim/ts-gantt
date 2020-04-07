import { TsGanttTask, TsGanttTaskChangesDetectionResult } from "./ts-gantt-task";
import { TsGanttOptions } from "./ts-gantt-options";

class TsGanttTableColumn {
  readonly html: HTMLTableHeaderCellElement;
  readonly minWidth: number;
  readonly header: string;
  readonly contentAlign: "start" | "center" | "end";
  valueGetter: (a: TsGanttTask) => string;

  constructor(minWidth: number, textAlign: "start" | "center" | "end", header: string, 
    valueGetter: (a: TsGanttTask) => string) {

    this.minWidth = minWidth;
    this.contentAlign = textAlign;
    this.header = header;
    this.valueGetter = valueGetter;

    const headerCell = document.createElement("th");
    headerCell.style.minWidth = this.minWidth + "px";
    headerCell.innerHTML = this.header;

    this.html = this.generateHtml();
  }

  private generateHtml(): HTMLTableHeaderCellElement {    
    const headerCell = document.createElement("th");
    headerCell.style.minWidth = this.minWidth + "px";
    headerCell.innerHTML = this.header;
    return headerCell;
  }
}

class TsGanttTableRow {
  private static readonly CELL_TEXT_WRAPPER_CLASS = "tsg-cell-text-wrapper";
  private static readonly CELL_TEXT_CLASS = "tsg-cell-text";
  private static readonly CELL_INDENT_CLASS = "tsg-cell-text-indent";
  private static readonly CELL_EXPANDER_CLASS = "tsg-cell-text-expander";

  readonly task: TsGanttTask;
  readonly html: HTMLTableRowElement;

  constructor(task: TsGanttTask, columns: TsGanttTableColumn[]) {
    this.task = task;
    this.html = this.generateHtml(columns);
  }

  private generateHtml(columns: TsGanttTableColumn[]): HTMLTableRowElement {
    const row = document.createElement("tr");
    row.setAttribute("data-tsg-row-uuid", this.task.uuid);
    row.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains(TsGanttTableRow.CELL_EXPANDER_CLASS)) {
        row.dispatchEvent(new Event("tsgrowclick", {bubbles: true}));
      }
    });
    if (this.task.selected) {
      row.classList.add("selected");
    }
    
    columns.forEach((x, i) => {
      const cell = document.createElement("td");
      const cellInnerDiv = document.createElement("div");
      cellInnerDiv.classList.add(TsGanttTableRow.CELL_TEXT_WRAPPER_CLASS, x.contentAlign);

      if (i === 0) {
        for (let j = 0; j < this.task.nestingLvl; j++) {
          cellInnerDiv.append(this.createEmptyIndent());
        }
        if (!this.task.hasChildren) {          
          cellInnerDiv.append(this.createEmptyIndent());
        } else {
          const expander = document.createElement("p");
          expander.classList.add(TsGanttTableRow.CELL_EXPANDER_CLASS);
          expander.setAttribute("data-tsg-row-uuid", this.task.uuid);
          expander.innerHTML = this.task.expanded ? "▴" : "▾";
          expander.addEventListener("click", (e: Event) => {
            expander.dispatchEvent(new Event("tsgexpanderclick", {bubbles: true}));
          });
          cellInnerDiv.append(expander);
        }
      }

      const cellText = document.createElement("p");
      cellText.classList.add(TsGanttTableRow.CELL_TEXT_CLASS);
      cellText.innerHTML = x.valueGetter(this.task);
      cellInnerDiv.append(cellText);
        
      cell.append(cellInnerDiv);
      row.append(cell);
    });

    return row;
  }

  private createEmptyIndent(): HTMLParagraphElement {
    const indent = document.createElement("p");
    indent.classList.add(TsGanttTableRow.CELL_INDENT_CLASS);
    return indent;
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
      const contentAlign = this._options.columnsContentAlign[i] === "center"
        ? "center"
        : this._options.columnsContentAlign[i] === "end"
          ? "end"
          : "start";
      if (minColumnWidth) {
        columns.push(new TsGanttTableColumn(minColumnWidth, contentAlign, this._options.localeHeaders[this._options.locale][i] || "",
          this._options.columnValueGetters[i] || ((task: TsGanttTask) => "")));
      }
    }

    const headerRow = document.createElement("tr");
    columns.forEach(x => headerRow.append(x.html));

    this._tableColumns = columns;
    this._htmlTableHead.innerHTML = "";    
    this._htmlTableHead.append(headerRow);    
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
      if (index !== -1) {
        this._tableRows[index] = new TsGanttTableRow(x, this._tableColumns);
      }
    });
    data.added.forEach(x => this._tableRows.push(new TsGanttTableRow(x, this._tableColumns)));

    this._htmlTableBody.innerHTML = "";
    this._htmlTableBody.append(...this.getRowsHtmlRecursively(this._tableRows, null));
  }

  private getRowsHtmlRecursively(rows: TsGanttTableRow[], parentUuid: string): HTMLTableRowElement[] {
    const rowsFiltered = rows.filter(x => x.task.parentUuid === parentUuid)
      .sort((a: TsGanttTableRow, b: TsGanttTableRow): number => a.task.compareTo(b.task));
    const rowsHtml: HTMLTableRowElement[] = [];
    for (const row of rowsFiltered) {
      if (!row.task.shown) {
        continue;
      }
      rowsHtml.push(row.html);
      if (row.task.expanded) {
        rowsHtml.push(...this.getRowsHtmlRecursively(rows, row.task.uuid));
      }
    }
    return rowsHtml;
  }
}

export { TsGanttTable, TsGanttTableRow, TsGanttTableColumn };
