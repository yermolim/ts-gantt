import { TsGanttTask } from "../../core/ts-gantt-task";
import { TsGanttConst } from "../../core/ts-gantt-const";

class TsGanttTableColumn {
  readonly html: HTMLTableCellElement;
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

  private createHeader(): HTMLTableCellElement {
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

export { TsGanttTableColumn };
