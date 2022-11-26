import { createSvgElement } from "../../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../../core/ts-gantt-const";

import { TsGanttSvgComponentBase } from "../../../abstract/ts-gantt-svg-component-base";

import { TsGanttChartBarHandleOptions } from "./ts-gantt-chart-bar-handle-options";

export abstract class TsGanttChartBarHandle extends TsGanttSvgComponentBase {  
  protected readonly _options: TsGanttChartBarHandleOptions;
  protected readonly _callbackOnMoveUpdate: () => {};

  constructor(options: TsGanttChartBarHandleOptions, callbackOnMove: () => {}) {
    super();

    this._options = options;
    this._callbackOnMoveUpdate = callbackOnMove;

    this.draw();
  }

  protected draw() {
    const wrapper = this.createWrapper();
    this.drawHandle(wrapper);
    this._svg = wrapper;
  }  

  protected createWrapper(): SVGElement {
    const { width, height } = this._options;

    const wrapper = createSvgElement("svg", [TsGanttConst.CLASSES.CHART.BAR.HANDLE_WRAPPER], [
      ["x", "0"],
      ["y", "0"],
      ["viewBox", "0 0 100 100"],
      ["width", width + ""],
      ["height", height + ""],
    ]);

    return wrapper;
  }

  protected abstract drawHandle(wrapper: SVGElement): void;
}
