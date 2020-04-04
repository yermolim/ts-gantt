import { TsGanttTask, TsGanttTaskChangesDetectionResult } from "./ts-gantt-task";
import { TsGanttOptions } from "./ts-gantt-options";

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

    this._htmlTableHead.innerHTML = `
      <tr>      
        <th>Lorem ipsum</th>
        <th>Lorem ipsum dolor sit amet</th>
      </tr>`;
    
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
    
  }

  updateRows(data: TsGanttTaskChangesDetectionResult) {
    
  }
}

class TsGanttTableColumn {
  minWidth = 100;
  

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

export { TsGanttTable, TsGanttTableRow, TsGanttTableColumn };
