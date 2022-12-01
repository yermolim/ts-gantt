import { AppendableComponent } from "./appendable-component";
import { AppendableWithOffsetComponent } from "./appendable-with-offset-component";
import { DestroyableComponent } from "./destroyable-component";

export abstract class TsGanttSvgComponentBase 
implements AppendableComponent, AppendableWithOffsetComponent, DestroyableComponent {
  protected _svg: SVGElement;

  destroy() {
    this._svg.remove();
  }

  appendTo(parent: Element) {
    parent.append(this._svg);
  }

  appendToWithOffset(parent: Element, offsetX: number, addOffsetToCurrent = false) {
    if (!this._svg || (!offsetX && offsetX !== 0)) {
      return;
    }

    if (addOffsetToCurrent) {
      const currentOffsetX = +this._svg.getAttribute("x") || 0;
      offsetX = currentOffsetX + offsetX;
    }
    this._svg.setAttribute("x", offsetX + "");
    parent.append(this._svg);
  }
}
