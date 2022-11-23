import { TsGanttTask } from "../../core/ts-gantt-task";
import { TsGanttConst } from "../../core/ts-gantt-const";
import { TsGanttTableColumn } from "./ts-gantt-table-column";

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
    row.classList.add(TsGanttConst.CLASSES.TABLE.BODY_ROW);
    row.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains(TsGanttConst.CLASSES.TABLE.BODY_CELL_EXPANDER)) {
        row.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.ROW_CLICK, {
          bubbles: true,
          composed: true,
          detail: {task: this.task, event: e},
        }));
      }
    });
    row.addEventListener("contextmenu", (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.classList.contains(TsGanttConst.CLASSES.TABLE.BODY_CELL_EXPANDER)) {
        row.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.ROW_CONTEXT_MENU, {
          bubbles: true,
          composed: true,
          detail: {task: this.task, event: e},
        }));
      }
    });
    if (addStateClass) {
      row.classList.add(this.task.getState());
    }

    columns.forEach((x, i) => {
      const cell = document.createElement("td");
      cell.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL);
      const cellInnerDiv = document.createElement("div");
      cellInnerDiv.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL_TEXT_WRAPPER, x.contentAlign);

      if (i === 0) {
        cellInnerDiv.append(this.expander);
      }

      const cellText = document.createElement("p");
      cellText.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL_TEXT);
      cellText.innerHTML = x.valueGetter(this.task);
      cellInnerDiv.append(cellText);
        
      cell.append(cellInnerDiv);
      row.append(cell);
    });

    return row;
  }

  private createExpander() {
    const expander = document.createElement("p");
    expander.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL_EXPANDER);
    const lvl = this.task.nestingLvl;
    if (lvl) {
      expander.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL_EXPANDER_NESTING_PREFIX + 
        (lvl < 10 ? lvl : 10));
    }
    if (this.task.hasChildren) {
      expander.addEventListener("click", (e: Event) => {
        expander.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.TABLE_BODY_CELL_EXPANDER_CLICK, {
          bubbles: true,
          composed: true,
          detail: {task: this.task, event: e},
        }));
      });
    }
    return expander;
  }
}

export { TsGanttTableRow };
