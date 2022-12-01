import { TsGanttConst } from "../../../../core/ts-gantt-const";
import { Coords } from "../../../../core/ts-gantt-common";

export interface HandleMoveEventDetail {
  handleType: "start" | "end" | "progress";
  displacement: Coords;
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
