import { ColumnTextAlignment } from "../../core/ts-gantt-common";
import { ColumnValueGetter, TsGanttOptions } from "../../core/ts-gantt-options";
import { TsGanttTask } from "../../ts-gantt";

import { TsGanttTableColumnOrder } from "./ts-gantt-table-column-order";

export class TsGanttTableColumnDescriptor {
  minWidth: number;
  order: number;
  header: string;
  textAlign: ColumnTextAlignment;
  valueGetter: ColumnValueGetter;

  static buildFromGanttOptions(options: TsGanttOptions, order: TsGanttTableColumnOrder): TsGanttTableColumnDescriptor[]{
    const descriptors: TsGanttTableColumnDescriptor[] = [];

    let currentOrder = 0;
    for (const i of order) {
      const minColumnWidth = options.columnsMinWidthPx[i];
      if (!minColumnWidth) {
        continue;
      }
      const columnOptions = Object.assign(new TsGanttTableColumnDescriptor(), {
        minWidth: minColumnWidth,
        order: currentOrder++,
        header: options.localeHeaders[options.locale][i] || "",
        textAlign: options.columnsContentAlign[i],
        valueGetter: options.columnValueGetters[i] || ((task: TsGanttTask) => ""),
      });
      descriptors.push(columnOptions);
    }
    
    return descriptors;
  }
}
