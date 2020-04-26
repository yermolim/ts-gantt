import { TsGanttTask, TsGanttTaskModel, TsGantt } from "../src/ts-gantt";

const inputModels = [
  new TsGanttTaskModel("root1id", null, "Root1", 55, 
    new Date(2020, 5, 1), new Date(2020, 5, 30), null, null, {en: "Root one", uk: "Корінь один", ru: "Корень один"}),
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
  new TsGanttTaskModel("root2child1id", "root2id", "Root2child1", 15, 
    new Date(2020, 5, 6), new Date(2020, 5, 16)),
  new TsGanttTaskModel("root2child1child1id", "root2child1id", "Root2child1child1", 15, 
    new Date(2020, 5, 6), new Date(2020, 5, 16)),
];

describe("TsGanttTask", () => {
  
  const tasks = TsGanttTask.convertModelsToTasks(inputModels, 
    new Map<string, string>([["root1id", "some-generated-id"]]));

  it("converted tasks should be instanciated from models", () => {
    expect(tasks).toBeTruthy();
  });
  it("converted task list should have correct length", () => {
    expect(tasks.length).toEqual(7);
  });
  it("converted tasks should have correct names", () => {
    expect(tasks.find(x => x.externalId === "root1id").name).toEqual("Root1");
    expect(tasks.find(x => x.externalId === "root1id").localizedNames["en"]).toEqual("Root one");
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
  it("converted tasks should have correct parent uuid inheritance", () => {
    expect(tasks.find(x => x.externalId === "root1id").parentUuid)
      .toEqual(null);
    expect(tasks.find(x => x.externalId === "root1child1id").parentUuid)
      .toEqual(tasks.find(x => x.externalId === "root1id").uuid);
    expect(tasks.find(x => x.externalId === "root1child1child1id").parentUuid)
      .toEqual(tasks.find(x => x.externalId === "root1child1id").uuid);
  });  
  it("converted tasks should have correct progress value", () => {
    expect(tasks.find(x => x.externalId === "root3id").progress)
      .toEqual(0);
    expect(tasks.find(x => x.externalId === "root1child1id").progress)
      .toEqual(100);
    expect(tasks.find(x => x.externalId === "root2child1id").progress)
      .toEqual(15);
  });  
  it("converted tasks should have correct value of 'hasChildren' property", () => {
    expect(tasks.find(x => x.externalId === "root2id").hasChildren)
      .toEqual(true);
    expect(tasks.find(x => x.externalId === "root3id").hasChildren)
      .toEqual(false);
    expect(tasks.find(x => x.externalId === "root1child1child1id").hasChildren)
      .toEqual(false);
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
    expect(changes.all.length).toEqual(6);
  });

  const sortedTasks = TsGanttTask.sortTasksRecursively(tasks, null);

  it("sorted array should have same length (for correct tree)", () => {
    expect(sortedTasks.length).toEqual(tasks.length);
  });
  it("sorted array elements should have correct order", () => {
    expect(sortedTasks[0].externalId).toEqual("root1id");
    expect(sortedTasks[1].externalId).toEqual("root1child1id");
    expect(sortedTasks[2].externalId).toEqual("root1child1child1id");
    expect(sortedTasks[3].externalId).toEqual("root1child2id");
    expect(sortedTasks[4].externalId).toEqual("root2id");
    expect(sortedTasks[5].externalId).toEqual("root2child1id");
    expect(sortedTasks[6].externalId).toEqual("root3id");
  });

  const equalityTest1 = tasks[0].equals(tasks[0]);
  const equalityTest2 = tasks[0].equals(tasks[1]);
  const equalityTest3 = tasks[0].equals(tasks[2]);
  const equalityTest4 = tasks[0].equals(tasks[3]);
  const equalityTest5 = tasks[0].equals(tasks[4]);
  const equalityTest6 = tasks[0].equals(tasks[5]);
  const equalityTest7 = tasks[0].equals(tasks[6]);
  
  it("equality test should show correct result", () => {
    expect(equalityTest1).toBeTruthy();
    expect(equalityTest2).toBeFalsy();
    expect(equalityTest3).toBeFalsy();
    expect(equalityTest4).toBeFalsy();
    expect(equalityTest5).toBeFalsy();
    expect(equalityTest6).toBeFalsy();
    expect(equalityTest7).toBeFalsy();
  });
});
