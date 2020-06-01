import { TsGanttTask } from "./ts-gantt-task";
import { TsGanttConst } from "./ts-gantt-const";

class TsGanttTableColumn {
  readonly html: HTMLTableHeaderCellElement;
  readonly resizer: HTMLDivElement;

  readonly minWidth: number;
  readonly header: string;
  readonly contentAlign: "start" | "center" | "end";

  readonly valueGetter: (a: TsGanttTask) => string;

  private _dragActive = false;

  constructor(minWidth: number, textAlign: "start" | "center" | "end", header: string, 
    valueGetter: (a: TsGanttTask) => string) {

    this.minWidth = minWidth;
    this.contentAlign = textAlign;
    this.header = header;
    this.valueGetter = valueGetter;

    this.html = this.createHeader();

    this.resizer = this.createResizer();
    this.resizer.addEventListener("mousedown", this.onMouseDownOnResizer);
    this.resizer.addEventListener("touchstart", this.onMouseDownOnResizer);
    this.html.append(this.resizer);    
  }

  onMouseDownOnResizer = (e: MouseEvent | TouchEvent) => {
    document.addEventListener("mousemove", this.onMouseMoveWhileResizing);
    document.addEventListener("mouseup", this.onMouseUpWhileResizing);
    document.addEventListener("touchmove", this.onMouseMoveWhileResizing, 
      <EventListenerOptions>{passive: false});
    document.addEventListener("touchend", this.onMouseUpWhileResizing);
    this._dragActive = true;
  };         
  onMouseMoveWhileResizing = (e: MouseEvent | TouchEvent) => {
    if (!this._dragActive) {
      return false;
    }  
    const headerOffset = this.html.getBoundingClientRect().left;
    const userDefinedWidth = e instanceof MouseEvent
      ? e.clientX - headerOffset
      : e.touches[0].clientX - headerOffset;

    this.html.style.width = Math.max(this.minWidth, userDefinedWidth) + "px";

    e.preventDefault();
  };        
  onMouseUpWhileResizing = (e: MouseEvent | TouchEvent) => {
    document.removeEventListener("mousemove", this.onMouseMoveWhileResizing);
    document.removeEventListener("mouseup", this.onMouseUpWhileResizing);
    document.removeEventListener("touchmove", this.onMouseMoveWhileResizing, 
      <EventListenerOptions>{passive: false});
    document.removeEventListener("touchend", this.onMouseUpWhileResizing);
    this._dragActive = false;
  }; 

  private createHeader(): HTMLTableHeaderCellElement {    
    const headerCell = document.createElement("th");
    headerCell.classList.add(TsGanttConst.TABLE_HEADER_CLASS);
    headerCell.style.minWidth = this.minWidth + "px";
    headerCell.style.width = this.minWidth + "px";
    headerCell.innerHTML = this.header;
    return headerCell;
  }

  private createResizer(): HTMLDivElement {
    const resizer = document.createElement("div");
    resizer.classList.add(TsGanttConst.TABLE_COLUMN_RESIZER_CLASS);
    return resizer;
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
    row.classList.add(TsGanttConst.TABLE_BODY_ROW_CLASS);
    row.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains(TsGanttConst.TABLE_BODY_CELL_EXPANDER_CLASS)) {
        row.dispatchEvent(new CustomEvent(TsGanttConst.ROW_CLICK_EVENT, {
          bubbles: true,
          detail: {task: this.task, event: e},
        }));
      }
    });
    row.addEventListener("contextmenu", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains(TsGanttConst.TABLE_BODY_CELL_EXPANDER_CLASS)) {
        row.dispatchEvent(new CustomEvent(TsGanttConst.ROW_CONTEXT_MENU_EVENT, {
          bubbles: true,
          detail: {task: this.task, event: e},
        }));
      }
    });
    if (addStateClass) {
      row.classList.add(this.task.getState());
    }
    
    columns.forEach((x, i) => {
      const cell = document.createElement("td");
      cell.classList.add(TsGanttConst.TABLE_BODY_CELL_CLASS);
      const cellInnerDiv = document.createElement("div");
      cellInnerDiv.classList.add(TsGanttConst.TABLE_BODY_CELL_TEXT_WRAPPER_CLASS, x.contentAlign);

      if (i === 0) {
        cellInnerDiv.append(this.expander);
      }

      const cellText = document.createElement("p");
      cellText.classList.add(TsGanttConst.TABLE_BODY_CELL_TEXT_CLASS);
      cellText.innerHTML = x.valueGetter(this.task);
      cellInnerDiv.append(cellText);
        
      cell.append(cellInnerDiv);
      row.append(cell);
    });

    return row;
  }

  private createExpander() {
    const expander = document.createElement("p");
    expander.classList.add(TsGanttConst.TABLE_BODY_CELL_EXPANDER_CLASS);
    const lvl = this.task.nestingLvl;
    if (lvl) {
      expander.classList.add(TsGanttConst.TABLE_BODY_CELL_EXPANDER_NESTING_PREFIX + 
        (lvl < 10 ? lvl : 10));
    }
    if (this.task.hasChildren) {          
      expander.addEventListener("click", (e: Event) => {
        expander.dispatchEvent(new CustomEvent(TsGanttConst.TABLE_BODY_CELL_EXPANDER_CLICK_EVENT, {
          bubbles: true,
          detail: {task: this.task, event: e},
        }));
      });
    }
    return expander;
  }

}

export { TsGanttTableColumn, TsGanttTableRow };
