class TsGanttTable {
  private readonly _minWidth: number;
  
  private _htmlTable: HTMLTableElement;
  get htmlTable(): HTMLTableElement {
    return this._htmlTable;
  }  

  private _tableColumns: TsGanttTableColumn[];
  private _tableRows: TsGanttTableRow[];

  constructor(classList: string[], minWidth: number) {
    
    const table = document.createElement("table");
    table.classList.add(...classList);
    this._htmlTable = table;

    this._minWidth = minWidth;
  }

  setWidth(width: number) {    
    this._htmlTable.style.width = (Math.max(this._minWidth, width)) + "px";
    this._htmlTable.style.flexGrow = "0";
  }
}

class TsGanttTableColumn {

}

class TsGanttTableRow {
  private _htmlRow: HTMLTableRowElement;
  get htmlRow(): HTMLTableRowElement {
    return this._htmlRow;
  }

}

export { TsGanttTable, TsGanttTableRow, TsGanttTableColumn };
