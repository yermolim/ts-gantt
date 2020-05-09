import { TsGanttTask } from "./ts-gantt-task";
import { TsGanttConst } from "./ts-gantt-const";
import { TsGanttRowSymbols } from "./ts-gantt-options";

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
  readonly expander: HTMLParagraphElement;

  constructor(task: TsGanttTask, columns: TsGanttTableColumn[], addStateClass: boolean) {
    this.task = task;
    this.expander = this.createExpander();
    this.html = this.createRow(columns, addStateClass);
  }

  private createRow(columns: TsGanttTableColumn[], addStateClass: boolean): HTMLTableRowElement {

    const row = document.createElement("tr");
    row.setAttribute(TsGanttConst.ROW_UUID_ATTRIBUTE, this.task.uuid);
    row.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains(TsGanttConst.TABLE_CELL_EXPANDER_CLASS)) {
        row.dispatchEvent(new CustomEvent(TsGanttConst.ROW_CLICK, {
          bubbles: true,
          detail: {uuid: this.task.uuid, ctrl: e.ctrlKey},
        }));
      }
    });
    if (addStateClass) {
      row.classList.add(this.task.getState());
    }
    
    columns.forEach((x, i) => {
      const cell = document.createElement("td");
      const cellInnerDiv = document.createElement("div");
      cellInnerDiv.classList.add(TsGanttConst.TABLE_CELL_TEXT_WRAPPER_CLASS, x.contentAlign);

      if (i === 0) {
        for (let j = 0; j < this.task.nestingLvl; j++) {
          cellInnerDiv.append(this.createSimpleIndent());
        }  
        cellInnerDiv.append(this.expander);
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

  private createExpander() {
    const expander = document.createElement("p");
    expander.classList.add(TsGanttConst.TABLE_CELL_EXPANDER_CLASS);
    expander.setAttribute(TsGanttConst.ROW_UUID_ATTRIBUTE, this.task.uuid);
    if (this.task.hasChildren) {          
      expander.addEventListener("click", (e: Event) => {
        expander.dispatchEvent(new CustomEvent(TsGanttConst.CELL_EXPANDER_CLICK, {
          bubbles: true,
          detail: {uuid: this.task.uuid},
        }));
      });
    }
    return expander;
  }

}

export { TsGanttTableColumn, TsGanttTableRow };
