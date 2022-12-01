import { TsGanttDataChangeResult } from "../../core/ts-gantt-data";
import { TsGanttTaskSelectionChangeResult } from "../../core/ts-gantt-task";
import { AppendableComponent } from "./appendable-component";
import { DestroyableComponent } from "./destroyable-component";

export interface TsGanttBaseComponent extends AppendableComponent, DestroyableComponent {
  update(updateColumns: boolean, data: TsGanttDataChangeResult, uuids: string[]): void;
  applySelection(selectionResult: TsGanttTaskSelectionChangeResult): void;
}
