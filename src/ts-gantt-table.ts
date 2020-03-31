class TsGanttTable {
  private readonly _minWidth: number;

  private _tableColumns: TsGanttTableColumn[];
  private _tableRows: TsGanttTableRow[];
  
  private _htmlTable: HTMLTableElement;
  get htmlTable(): HTMLTableElement {
    return this._htmlTable;
  }

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

}

export { TsGanttTable, TsGanttTableRow, TsGanttTableColumn };
