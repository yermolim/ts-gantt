import { TsGanttConst } from "./ts-gantt-const";
import { TsGanttTask, TsGanttTaskChangeResult, TsGanttTaskSelectionChangeResult } from "./ts-gantt-task";
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

  readonly task: TsGanttTask;
  readonly html: HTMLTableRowElement;

  constructor(task: TsGanttTask, columns: TsGanttTableColumn[]) {
    this.task = task;
    this.html = this.generateHtml(columns);
  }

  private generateHtml(columns: TsGanttTableColumn[]): HTMLTableRowElement {
    const row = document.createElement("tr");
    row.setAttribute(TsGanttConst.ROW_UUID_ATTRIBUTE, this.task.uuid);
    row.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains(TsGanttConst.TABLE_CELL_EXPANDER_CLASS)) {
        row.dispatchEvent(new CustomEvent(TsGanttConst.ROW_CLICK, {
          bubbles: true,
          detail: this.task.uuid,
        }));
      }
    });
    
    columns.forEach((x, i) => {
      const cell = document.createElement("td");
      const cellInnerDiv = document.createElement("div");
      cellInnerDiv.classList.add(TsGanttConst.TABLE_CELL_TEXT_WRAPPER_CLASS, x.contentAlign);

      if (i === 0) {
        for (let j = 0; j < this.task.nestingLvl; j++) {
          cellInnerDiv.append(this.createSimpleIndent());
        }
        if (!this.task.hasChildren) {          
          cellInnerDiv.append(this.createSimpleIndent(TsGanttConst.CELL_EXPANDER_SYMBOL));
        } else {
          const expander = document.createElement("p");
          expander.classList.add(TsGanttConst.TABLE_CELL_EXPANDER_CLASS);
          expander.setAttribute(TsGanttConst.ROW_UUID_ATTRIBUTE, this.task.uuid);
          expander.innerHTML = this.task.expanded 
            ? TsGanttConst.CELL_EXPANDER_EXPANDED_SYMBOL 
            : TsGanttConst.CELL_EXPANDER_EXPANDABLE_SYMBOL;
          expander.addEventListener("click", (e: Event) => {
            expander.dispatchEvent(new CustomEvent(TsGanttConst.CELL_EXPANDER_CLICK, {
              bubbles: true,
              detail: this.task.uuid,
            }));
          });
          cellInnerDiv.append(expander);
        }
      }

      const cellText = document.createElement("p");
      cellText.classList.add(TsGanttConst.TABLE_CELL_TEXT_CLASS);
      cellText.innerHTML = x.valueGetter(this.task);
      cellInnerDiv.append(cellText);
        
      cell.append(cellInnerDiv);
      row.append(cell);
    });

    return row;
  }

  private createSimpleIndent(innerHtml = ""): HTMLParagraphElement {
    const indent = document.createElement("p");
    indent.classList.add(TsGanttConst.TABLE_CELL_INDENT_CLASS);
    indent.innerHTML = innerHtml;
    return indent;
  }
}

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

export { TsGanttTable };
