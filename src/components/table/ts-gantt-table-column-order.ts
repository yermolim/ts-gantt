export class TsGanttTableColumnOrder {
  private readonly _columnOrder: number[];

  constructor(length: number) {
    this._columnOrder = Array.from(new Array(length).keys());
  }

  move(from: number, to: number) {
    this._columnOrder.splice(to, 0, this._columnOrder.splice(from, 1)[0]);
  }

  *[Symbol.iterator](): Iterator<number> {
    for (const columnIndex of this._columnOrder) {
      yield columnIndex;
    }
  }
}
