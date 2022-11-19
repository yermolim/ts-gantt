import { TsGanttDataChangeResult } from "../../core/ts-gantt-data";
import { TsGanttTaskSelectionChangeResult } from "../../core/ts-gantt-task";

export interface TsGanttBaseComponent {
  destroy(): void;
  appendTo(parent: HTMLElement): void;
  update(updateColumns: boolean, data: TsGanttDataChangeResult, uuids: string[]): void;
  applySelection(selectionResult: TsGanttTaskSelectionChangeResult): void;
}
