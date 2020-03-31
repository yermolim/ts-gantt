import { TsGanttTask, TsGanttTaskModel } from "../src/ts-gantt";

const models = [
  new TsGanttTaskModel("jjgt56d", null, "Root1", 55, new Date(2020, 5, 1), new Date(2020, 5, 30)),
  new TsGanttTaskModel("jddd56d", null, "Root2", 75, new Date(2020, 5, 6), new Date(2020, 5, 26), new Date(2020, 7, 2)),
  new TsGanttTaskModel("jeee56d", null, "Root3", -5, new Date(2020, 6, 5), new Date(2020, 6, 20), new Date(2020, 7, 2), new Date(2020, 7, 28)),
  new TsGanttTaskModel("jdsdt5d", "jjgt56d", "Root1child1", 120, new Date(2020, 5, 1), new Date(2020, 5, 15)),
  new TsGanttTaskModel("jjdsdsd", "jjgt56d", "Root1child2", 0, new Date(2020, 5, 16), new Date(2020, 5, 30)),
  new TsGanttTaskModel("sdddddd", "jdsdt5d", "Root1child1child1", 100, new Date(2020, 5, 1), new Date(2020, 5, 10)),
  new TsGanttTaskModel("ssss678", "jddd56d", "Root2child1", 15, new Date(2020, 5, 6), new Date(2020, 5, 16)),
];

describe("TsGanttTask", () => {

  it("should instantiate", () => {
    expect(new TsGanttTask("0865g", "a", 50, 
      new Date(), new Date(), new Date(), new Date()))
      .toBeTruthy();
  });  
  
  const tasks = TsGanttTask.initTasksFromModels(models);
  it("should initiate from models", () => {
    expect(tasks)
      .toBeTruthy();
  });
  it("should have correct length", () => {
    expect(tasks.length)
      .toEqual(7);
  });
  it("should have correct nesting levels", () => {
    expect(tasks.filter(x => x.nestingLvl === 0).length)
      .toEqual(3);
    expect(tasks.filter(x => x.nestingLvl === 1).length)
      .toEqual(3);
    expect(tasks.filter(x => x.nestingLvl === 2).length)
      .toEqual(1);
  });
  it("should have correct uuid inheritance", () => {
    expect(tasks.find(x => x.externalId === "jjgt56d").parentUuid)
      .toEqual(null);
    expect(tasks.find(x => x.externalId === "jdsdt5d").parentUuid)
      .toEqual(tasks.find(x => x.externalId === "jjgt56d").uuid);
    expect(tasks.find(x => x.externalId === "sdddddd").parentUuid)
      .toEqual(tasks.find(x => x.externalId === "jdsdt5d").uuid);
  });  
  it("should have correct progress", () => {
    expect(tasks.find(x => x.externalId === "jeee56d").progress)
      .toEqual(0);
    expect(tasks.find(x => x.externalId === "jdsdt5d").progress)
      .toEqual(100);
    expect(tasks.find(x => x.externalId === "ssss678").progress)
      .toEqual(15);
  });   
  it("should have correct duration", () => {
    expect(tasks.find(x => x.externalId === "jddd56d").durationPlanned)
      .toEqual(1.728e9);
    expect(tasks.find(x => x.externalId === "jddd56d").durationActual)
      .toEqual(0);
    expect(tasks.find(x => x.externalId === "jeee56d").durationActual)
      .toEqual(2.2464e9);
  });
});
