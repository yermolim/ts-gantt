import { TsGanttTask } from "../../core/ts-gantt-task";
import { TsGanttConst } from "../../core/ts-gantt-const";
import { TsGanttOptions } from "../../ts-gantt";

import { TsGanttHtmlComponentBase } from "../abstract/ts-gantt-html-component-base";

export class TsGanttTableExpander extends TsGanttHtmlComponentBase {
  private readonly _options: TsGanttOptions;
  private readonly _task: TsGanttTask;

  constructor(options: TsGanttOptions, task: TsGanttTask) {
    super();
    this._options = options;
    this._task = task;
    this._html = this.createElement();
  }

  updateSymbol() {
    const task = this._task;
    const symbols = this._options.rowSymbols;

    if (!task.hasChildren) {
      this._html.innerHTML = symbols.childless;
    } else if (task.expanded) {
      this._html.innerHTML = symbols.expanded;
    } else {
      this._html.innerHTML = symbols.collapsed;
    }
  }

  private createElement(): HTMLParagraphElement {
    const task = this._task;

    const expanderElement = document.createElement("p");
    expanderElement.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL_EXPANDER);
    const lvl = task.nestingLvl;
    if (lvl) {
      expanderElement.classList.add(TsGanttConst.CLASSES.TABLE.BODY_CELL_EXPANDER_NESTING_PREFIX + 
        (lvl < 10 ? lvl : 10));
    }
    if (task.hasChildren) {
      expanderElement.addEventListener("click", (e: Event) => {
        expanderElement.dispatchEvent(new CustomEvent(TsGanttConst.EVENTS.TABLE_BODY_CELL_EXPANDER_CLICK, {
          bubbles: true,
          composed: true,
          detail: {task, event: e},
        }));
      });
    }
    return expanderElement;
  }
}
