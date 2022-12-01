import { ColumnTextAlignment } from "../../core/ts-gantt-common";
import { ColumnValueGetter } from "../../core/ts-gantt-options";

export interface TsGanttTableColumnOptions {
  minWidth: number;
  order: number;
  header: string;
  textAlign: ColumnTextAlignment;
  valueGetter: ColumnValueGetter;
}
