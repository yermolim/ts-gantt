import { AppendableComponent } from "./appendable-component";
import { DestroyableComponent } from "./destroyable-component";

export abstract class TsGanttHtmlComponentBase 
implements AppendableComponent, DestroyableComponent {
  protected _html: HTMLElement;

  destroy() {
    this._html.remove();
  }

  appendTo(parent: Element) {
    parent.append(this._html);
  }
}
