import { TsGanttTask, TsGanttTaskChangesDetectionResult } from "./ts-gantt-task";
import { TsGanttOptions } from "./ts-gantt-options";

class TsGanttTableColumn {
  columnHtml: string;
  minWidth: number;
  header: string;
  valueGetter: (a: TsGanttTask) => string;

  constructor(minWidth: number, header: string, valueGetter: (a: TsGanttTask) => string) {
    this.minWidth = minWidth;
    this.header = header;
    this.valueGetter = valueGetter;
    this.columnHtml = `
      <th style='min-width:${this.minWidth}px;'>
        ${this.header}
      </th>`;
  }
}

class TsGanttTableRow {

  shown = false;

  private _htmlRow: HTMLTableRowElement;
  get htmlRow(): HTMLTableRowElement {
    return this._htmlRow;
  }

  constructor(task: TsGanttTask) {

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
  private _tableRows: TsGanttTableRow[];

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
    this._htmlTableBody.innerHTML = ` 
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'>
            <p style='width:20px;'></p>
            <p style='width:20px;'>⯁</p>
            <p style='width:20px;'>⯆</p>
            <p style='width:20px;'>⯅</p>
            <p class='tsg-cell-text'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>
        </div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='tsg-cell-text-wrapper'><p class='tsg-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>`;
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
    columns.forEach(x => headerRowHtml += x.columnHtml);
    headerRowHtml += "</tr>";

    this._tableColumns = columns;
    this._htmlTableHead.innerHTML = headerRowHtml;    
  }  

  updateRows(data: TsGanttTaskChangesDetectionResult) {
  }
}

export { TsGanttTable, TsGanttTableRow, TsGanttTableColumn };
