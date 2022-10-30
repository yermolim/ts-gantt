import { TsGanttTaskChangeResult, TsGanttTaskSelectionChangeResult } from "../../core/ts-gantt-task";

export interface TsGanttBaseComponent {
  destroy(): void;
  appendTo(parent: HTMLElement): void;
  update(updateColumns: boolean, data: TsGanttTaskChangeResult, uuids: string[]): void;
  applySelection(selectionResult: TsGanttTaskSelectionChangeResult): void;
}
