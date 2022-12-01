import { TsGanttConst } from "../../core/ts-gantt-const";
import { ColumnTextAlignment } from "../../core/ts-gantt-common";
import { ColumnValueGetter } from "../../core/ts-gantt-options";

import { TsGanttHtmlComponentBase } from "../abstract/ts-gantt-html-component-base";
import { TsGanttTableColumnOptions } from "./ts-gantt-table-column-options";

const TABLE_COLUMN_DATA_ORDER = "tsgColOrder";
const TABLE_COLUMN_REORDER_DATA = "application/tsg-col-order";

class TsGanttTableColumn extends TsGanttHtmlComponentBase {
  readonly options: TsGanttTableColumnOptions;

  private _dragActive = false;

  constructor(options: TsGanttTableColumnOptions) {
    super();
    this.options = options;
    this._html = this.createHeaderCell();
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
    const headerOffset = this._html.getBoundingClientRect().left;
    const userDefinedWidth = e instanceof MouseEvent
      ? e.clientX - headerOffset
      : e.touches[0].clientX - headerOffset;

    this._html.style.width = Math.max(this.options.minWidth, userDefinedWidth) + "px";

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

  private createHeaderCell(): HTMLTableCellElement {
    const { header, order, minWidth } = this.options;

    const headerCell = document.createElement("th");
    headerCell.classList.add(TsGanttConst.CLASSES.TABLE.HEADER);
    headerCell.dataset[TABLE_COLUMN_DATA_ORDER] = order + "";
    headerCell.style.minWidth = minWidth + "px";
    headerCell.style.width = minWidth + "px";
    headerCell.draggable = true;
    headerCell.innerHTML = header;
    headerCell.addEventListener("dragstart", (e: DragEvent) => {
      e.dataTransfer.setData(TABLE_COLUMN_REORDER_DATA, order + "");
    });
    headerCell.addEventListener("dragover", (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });
    headerCell.addEventListener("drop", (e: DragEvent) => {
      e.preventDefault();
      const orderFrom = e.dataTransfer.getData(TABLE_COLUMN_REORDER_DATA);
      if (!orderFrom && orderFrom !== "0") {
        return;
      }
      headerCell.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.TABLE_COLUMN_REORDER, {
        bubbles: true,
        composed: true,
        detail: {orderFrom: +orderFrom, orderTo: order, event: e},
      }));
    });

    headerCell.append(this.createResizer());

    return headerCell;
  }

  private createResizer(): HTMLDivElement {
    const resizer = document.createElement("div");
    resizer.classList.add(TsGanttConst.CLASSES.TABLE.COLUMN_RESIZER);
    resizer.addEventListener("mousedown", this.onMouseDownOnResizer);
    resizer.addEventListener("touchstart", this.onMouseDownOnResizer);
    return resizer;
  }
}

export { TsGanttTableColumn };
