import { TsGanttConst } from "../../../../core/ts-gantt-const";
import { ChartBarHandleType, ChartBarType, Coords } from "../../../../core/ts-gantt-common";

export interface HandleMoveEventDetail {
  handleType: ChartBarHandleType;
  barType: ChartBarType;
  displacement: Coords;
  taskUuid: string;
}

export class HandleMoveEvent extends CustomEvent<HandleMoveEventDetail> {
  constructor(detail: HandleMoveEventDetail) {
    super(TsGanttConst.EVENTS.HANDLE_MOVE, {detail});
  }
}

export class HandleMoveEndEvent extends CustomEvent<HandleMoveEventDetail> {
  constructor(detail: HandleMoveEventDetail) {
    super(TsGanttConst.EVENTS.HANDLE_MOVE_END, {detail});
  }
}

declare global {
  interface DocumentEventMap {
    [TsGanttConst.EVENTS.HANDLE_MOVE]: HandleMoveEvent;
    [TsGanttConst.EVENTS.HANDLE_MOVE_END]: HandleMoveEndEvent;
  }
}
