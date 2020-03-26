import { TsGanttTask } from "../src/ts-gantt";

describe("TsGanttTask", () => {

  it("should instantiate", () => {

    expect(new TsGanttTask("a", 50, 
      new Date(), new Date(), new Date(), new Date(),
      []))
      .toBeTruthy();
  });
});
