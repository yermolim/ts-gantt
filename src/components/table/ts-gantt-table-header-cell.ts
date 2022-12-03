import { TsGanttConst } from "../../core/ts-gantt-const";

import { TsGanttHtmlComponentBase } from "../abstract/ts-gantt-html-component-base";
import { TsGanttTableColumnDescriptor } from "./ts-gantt-table-column-descriptor";

const TABLE_COLUMN_DATA_ORDER = "tsgColOrder";
const TABLE_COLUMN_REORDER_DATA = "application/tsg-col-order";

export class TsGanttTableHeaderCell extends TsGanttHtmlComponentBase {
  private readonly _columnDescriptor: TsGanttTableColumnDescriptor;

  private _dragActive = false;

  constructor(columnDescriptor: TsGanttTableColumnDescriptor) {
    super();
    this._columnDescriptor = columnDescriptor;
    this._html = this.createElement();
  }

  onPointerDownOnResizer = (e: PointerEvent) => {
    if (!e.isPrimary || e.button === 2) {
      return;
    }

    const target = e.target as HTMLElement;
    target.addEventListener("pointermove", this.onPointerMoveWhileResizing);
    target.addEventListener("pointerup", this.onPointerUpWhileResizing);
    target.addEventListener("pointerout", this.onPointerUpWhileResizing);
    target.setPointerCapture(e.pointerId);

    this._dragActive = true;
  };
  onPointerMoveWhileResizing = (e: PointerEvent) => {
    if (!e.isPrimary || !this._dragActive) {
      return false;
    }

    const headerOffset = this._html.getBoundingClientRect().left;
    const userDefinedWidth = e.clientX - headerOffset;

    this._html.style.width = Math.max(this._columnDescriptor.minWidth, userDefinedWidth) + "px";

    e.preventDefault();
  };
  onPointerUpWhileResizing = (e: PointerEvent) => {
    if (!e.isPrimary) {
      return;
    }

    const target = e.target as HTMLElement;
    target.removeEventListener("pointermove", this.onPointerMoveWhileResizing);
    target.removeEventListener("pointerup", this.onPointerUpWhileResizing);
    target.removeEventListener("pointerout", this.onPointerUpWhileResizing);
    target.releasePointerCapture(e.pointerId);

    this._dragActive = false;
  }; 

  private createElement(): HTMLTableCellElement {
    const { header, order, minWidth } = this._columnDescriptor;

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
    resizer.addEventListener("pointerdown", this.onPointerDownOnResizer);
    return resizer;
  }
}
