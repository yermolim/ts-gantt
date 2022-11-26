import { AppendableComponent } from "./appendable-component";

export abstract class TsGanttSvgComponentBase implements AppendableComponent {
  protected _svg: SVGElement;

  destroy() {
    this._svg.remove();
  }

  appendTo(parent: Element) {
    parent.append(this._svg);
  }

  appendToWithOffset(parent: Element, offsetX: number) {
    if (!this._svg || (!offsetX && offsetX !== 0)) {
      return;
    }
    const currentOffsetX = +this._svg.getAttribute("x") || 0;
    this._svg.setAttribute("x", currentOffsetX + offsetX + "");
    parent.append(this._svg);
  }
}
