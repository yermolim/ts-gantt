import { Coords, createSvgElement } from "../../../../core/ts-gantt-common";
import { TsGanttConst } from "../../../../core/ts-gantt-const";

import { TsGanttSvgComponentBase } from "../../../abstract/ts-gantt-svg-component-base";

import { TsGanttChartBarHandleOptions } from "./ts-gantt-chart-bar-handle-options";

export abstract class TsGanttChartBarHandle extends TsGanttSvgComponentBase {  
  protected readonly _options: TsGanttChartBarHandleOptions;
  protected readonly _callbackOnMove: (displacement: Coords) => void;
  protected readonly _callbackOnMoveEnd: (displacement: Coords) => void;
  
  protected _moveStartCoords: Coords;
  protected _lastMoveCoords: Coords;
  protected _currentDisplacement: Coords;

  constructor(options: TsGanttChartBarHandleOptions, 
    callbackOnMove: (displacement: Coords) => void, 
    callbackOnMoveEnd: (displacement: Coords) => void) {

    super();

    this._options = options;

    this._callbackOnMove = callbackOnMove;
    this._callbackOnMoveEnd = callbackOnMoveEnd;

    this.draw();
  }

  protected draw() {
    const wrapper = this.createWrapper();

    const handle = this.drawHandle(wrapper);
    handle.addEventListener("pointerdown", this.onPointerDown);

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

  protected abstract drawHandle(wrapper: SVGElement): SVGElement;

  protected onPointerDown = (e: PointerEvent) => {
    if (!e.isPrimary || e.button === 2) {
      return;
    }

    const target = e.target as HTMLElement;
    target.addEventListener("pointermove", this.onPointerMove);
    target.addEventListener("pointerup", this.onPointerUp);
    target.addEventListener("pointerout", this.onPointerUp);
    target.setPointerCapture(e.pointerId);

    this._moveStartCoords = {x: e.x, y: e.y};
  };

  protected onPointerMove = (e: PointerEvent) => {
    if (!this._moveStartCoords || !e.isPrimary) {
      return;
    }

    const displacement: Coords = {
      x: e.x - this._moveStartCoords.x,
      y: e.y - this._moveStartCoords.y,
    };

    const displacementSinceLastEvent = this._lastMoveCoords
      ? Math.abs(e.x - this._lastMoveCoords.x)
      : Math.abs(displacement.x);
    const displacementThresholdExceeded = displacementSinceLastEvent > this._options.displacementThreshold;

    if (displacementThresholdExceeded) {
      this._lastMoveCoords = {x: e.x, y: e.y};
      this._currentDisplacement = displacement;
      this._callbackOnMove(displacement);
    }
  };

  protected onPointerUp = (e: PointerEvent) => {
    if (!e.isPrimary) {
      return;
    }

    const target = e.target as HTMLElement;
    target.removeEventListener("pointermove", this.onPointerMove);
    target.removeEventListener("pointerup", this.onPointerUp);    
    target.removeEventListener("pointerout", this.onPointerUp);
    target.releasePointerCapture(e.pointerId);
    
    const displacement: Coords = {
      x: e.x - this._moveStartCoords.x,
      y: e.y - this._moveStartCoords.y,
    };

    this._moveStartCoords = null;
    this._lastMoveCoords = null;
    this._currentDisplacement = displacement;
    this._callbackOnMoveEnd(this._currentDisplacement);
  };
}
