import { TsGanttTask, TsGanttTaskModel, TsGantt } from "../src/ts-gantt";

const inputModels = [
  new TsGanttTaskModel("root1id", null, "Root1", 55, 
    new Date(2020, 5, 1), new Date(2020, 5, 30)),
  new TsGanttTaskModel("root2id", null, "Root2", 75, 
    new Date(2020, 5, 6), new Date(2020, 5, 26), new Date(2020, 7, 2)),
  new TsGanttTaskModel("root3id", null, "Root3", -5, 
    new Date(2020, 6, 5), new Date(2020, 6, 20), new Date(2020, 7, 2), new Date(2020, 7, 28)),
  new TsGanttTaskModel("root1child1id", "root1id", "Root1child1", 120, 
    new Date(2020, 5, 1), new Date(2020, 5, 15)),
  new TsGanttTaskModel("root1child2id", "root1id", "Root1child2", 0, 
    new Date(2020, 5, 16), new Date(2020, 5, 30)),
  new TsGanttTaskModel("root1child1child1id", "root1child1id", "Root1child1child1", 100, 
    new Date(2020, 5, 1), new Date(2020, 5, 10)),
  new TsGanttTaskModel("root2child1id", "root2id", "Root2child1", 15, 
    new Date(2020, 5, 6), new Date(2020, 5, 16)),
];

const inputModelUpdated = [
  new TsGanttTaskModel("root1id", null, "Root1", 95, 
    new Date(2020, 5, 1), new Date(2020, 5, 30)),
  new TsGanttTaskModel("root2id", null, "Root2", 75, 
    new Date(2020, 5, 6), new Date(2020, 5, 26), new Date(2020, 10, 2)),
  new TsGanttTaskModel("root1child1id", "root1id", "Root1child1", 120, 
    new Date(2020, 5, 1), new Date(2020, 5, 15)),
  new TsGanttTaskModel("root1child1child1id", "root1child1id", "Root1child1child1", 100, 
    new Date(2020, 5, 1), new Date(2020, 5, 10)),
  new TsGanttTaskModel("root2child1id", "root2id", "Root2child1", 65, 
    new Date(2020, 5, 6), new Date(2020, 5, 26)),
  new TsGanttTaskModel("root2child2id", "root2id", "Root2child2", 15, 
    new Date(2020, 5, 6), new Date(2020, 5, 16)),
];

describe("TsGanttTask", () => {
  
  const tasks = TsGanttTask.convertModelsToTasks(inputModels, 
    new Map<string, string>([["root1id", "some-generated-id"]]));

  it("converted tasks should be instanciated from models", () => {
    expect(tasks).toBeTruthy();
  });
  it("converted tasks should have correct length", () => {
    expect(tasks.length).toEqual(7);
  });
  it("converted tasks should preserve predefined uuids", () => {
    expect(tasks.find(x => x.externalId === "root1id").uuid)
      .toEqual("some-generated-id");
  });
  it("converted tasks should have correct nesting levels", () => {
    expect(tasks.filter(x => x.nestingLvl === 0).length).toEqual(3);
    expect(tasks.filter(x => x.nestingLvl === 1).length).toEqual(3);
    expect(tasks.filter(x => x.nestingLvl === 2).length).toEqual(1);
  });
  it("converted tasks should have correct uuid inheritance", () => {
    expect(tasks.find(x => x.externalId === "root1id").parentUuid)
      .toEqual(null);
    expect(tasks.find(x => x.externalId === "root1child1id").parentUuid)
      .toEqual(tasks.find(x => x.externalId === "root1id").uuid);
    expect(tasks.find(x => x.externalId === "root1child1child1id").parentUuid)
      .toEqual(tasks.find(x => x.externalId === "root1child1id").uuid);
  });  
  it("converted tasks should have correct progress", () => {
    expect(tasks.find(x => x.externalId === "root3id").progress)
      .toEqual(0);
    expect(tasks.find(x => x.externalId === "root1child1id").progress)
      .toEqual(100);
    expect(tasks.find(x => x.externalId === "root2child1id").progress)
      .toEqual(15);
  });   
  it("converted tasks should have correct duration", () => {
    expect(tasks.find(x => x.externalId === "root2id").durationPlanned)
      .toEqual(1.728e9);
    expect(tasks.find(x => x.externalId === "root2id").durationActual)
      .toEqual(0);
    expect(tasks.find(x => x.externalId === "root3id").durationActual)
      .toEqual(2.2464e9);
  });

  const models = TsGanttTask.convertTasksToModels(tasks);

  it("converted models should be instanciated from tasks", () => {
    expect(models).toBeTruthy();
  });
  it("converted models should have correct length", () => {
    expect(models.length).toEqual(7);
  });
  it("converted models should be equal to source ones", () => {
    const firstModelIn = inputModels.find(x => x.id === "root1id");
    const firstModelOut = models.find(x => x.id === "root1id");
    expect(firstModelOut).toBeTruthy();
    expect(firstModelOut.id).toEqual(firstModelIn.id);
    expect(firstModelOut.parentId).toEqual(firstModelIn.parentId);
    expect(firstModelOut.name).toEqual(firstModelIn.name);
    expect(firstModelOut.progress).toEqual(firstModelIn.progress);
    expect(firstModelOut.datePlannedStart).toEqual(firstModelIn.datePlannedStart);
    expect(firstModelOut.datePlannedEnd).toEqual(firstModelIn.datePlannedEnd);
    expect(firstModelOut.dateActualStart).toEqual(firstModelIn.dateActualStart);
    expect(firstModelOut.dateActualEnd).toEqual(firstModelIn.dateActualEnd);
  });

  const taskIdsMap = TsGanttTask.getTasksIdsMap(tasks);
  
  it("task ids map should be instanciated from tasks", () => {
    expect(taskIdsMap).toBeTruthy();
  });  
  it("task ids map should have correct length", () => {
    expect(taskIdsMap.size).toEqual(7);
  }); 
  it("task ids map should have correct matching", () => {
    expect(taskIdsMap.get("root1id")).toEqual("some-generated-id");
  });
  
  const tasksUpdated = TsGanttTask.convertModelsToTasks(inputModelUpdated, taskIdsMap);
  const changes = TsGanttTask.detectTaskChanges({oldTasks: tasks, newTasks: tasksUpdated});

  it("change detection should instanciate object", () => {
    expect(changes).toBeTruthy();
  });  
  it("change detection results should have correct length", () => {
    expect(changes.deleted.length).toEqual(2);
    expect(changes.added.length).toEqual(1);
    expect(changes.changed.length).toEqual(3);
    expect(changes.unchanged.length).toEqual(2);
    expect(tasks.length - changes.deleted.length 
      - changes.changed.length - changes.unchanged.length).toEqual(0);
    expect(changes.added.length + changes.changed.length 
      + changes.unchanged.length).toEqual(tasksUpdated.length);
  });
});
