import { TsGanttTask, TsGanttTaskChangesDetectionResult } from "./ts-gantt-task";
import { TsGanttOptions } from "./ts-gantt-options";

class TsGanttTable {
  private _options: TsGanttOptions;
  
  private _htmlTable: HTMLTableElement;
  get htmlTable(): HTMLTableElement {
    return this._htmlTable;
  }  

  private _tableColumns: TsGanttTableColumn[];
  private _tableRows: TsGanttTableRow[];

  constructor(classList: string[], options: TsGanttOptions) {    
    this._options = options;
    
    const table = document.createElement("table");
    table.classList.add(...classList);
    this._htmlTable = table;
    
    table.innerHTML = `<tbody>      
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
      <tr>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
        <td><div class='ts-gantt-cell-text-wrapper'><p class='ts-gantt-cell-text'>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
        </p></div></td>
      </tr>
    </tbody>`;
  }

  updateRows(data: TsGanttTaskChangesDetectionResult) {
    
  }
}

class TsGanttTableColumn {

}

class TsGanttTableRow {
  private _htmlRow: HTMLTableRowElement;
  get htmlRow(): HTMLTableRowElement {
    return this._htmlRow;
  }

  constructor(task: TsGanttTask) {

  }
}

export { TsGanttTable, TsGanttTableRow, TsGanttTableColumn };
