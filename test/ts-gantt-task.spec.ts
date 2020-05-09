import { TsGanttTaskModel, TsGanttTask } from "../src/ts-gantt-task";

const inputModels = [
  {
    id: "root1id", 
    name: "Root1", 
    progress: 55, 
    datePlannedStart: new Date(2020, 4, 1), 
    datePlannedEnd: new Date(2021, 4, 30), 
    localizedNames: {en: "Root one", uk: "Корінь один", ru: "Корень один"},
  },
  {
    id: "root2id", 
    name: "Root2", 
    progress: 75, 
    datePlannedStart: new Date(2020, 4, 6), 
    datePlannedEnd: new Date(2020, 4, 7), 
  },
  {
    id: "root3id", 
    name: "Root3", 
    progress: -5, 
    datePlannedStart: new Date(2020, 6, 5), 
    datePlannedEnd: new Date(2020, 6, 20), 
    dateActualStart: new Date(2020, 7, 2), 
    dateActualEnd: new Date(2020, 7, 28), 
  },
  {
    id: "root1child1id", 
    parentId: "root1id", 
    name: "Root1child1", 
    progress: 120, 
    datePlannedStart: new Date(2020, 5, 1), 
    datePlannedEnd: new Date(2020, 5, 15), 
  },
  {
    id: "root1child2id", 
    parentId: "root1id", 
    name: "Root1child2", 
    progress: 0, 
    datePlannedStart: new Date(2020, 5, 16), 
    datePlannedEnd: new Date(2020, 5, 30), 
    dateActualStart: new Date(2020, 5, 30), 
  },
  {
    id: "root1child1child1id", 
    parentId: "root1child1id", 
    name: "Root1child1child1", 
    progress: 100, 
    datePlannedStart: new Date(2020, 5, 1), 
    datePlannedEnd: new Date(2020, 5, 10), 
  },
  {
    id: "root2child1id", 
    parentId: "root2id", 
    name: "Root2child1", 
    progress: 100, 
    datePlannedStart: new Date(2020, 5, 6), 
    datePlannedEnd: new Date(2020, 5, 16), 
    dateActualStart: new Date(2020, 5, 6), 
    dateActualEnd: new Date(2020, 5, 26), 
  },
];

const inputModelsUpdated = [
  <TsGanttTaskModel>{
    id: "root1id", 
    name: "Root1", 
    progress: 95, 
    datePlannedStart: new Date(2020, 4, 1), 
    datePlannedEnd: new Date(2020, 4, 30), 
  },
  <TsGanttTaskModel>{
    id: "root2id", 
    name: "Root2", 
    progress: 75, 
    datePlannedStart: new Date(2020, 4, 6), 
    datePlannedEnd: new Date(2020, 4, 26), 
    dateActualStart: new Date(2020, 4, 2), 
  },
  <TsGanttTaskModel>{
    id: "root1child1id", 
    parentId: "root1id", 
    name: "Root1child1", 
    progress: 120, 
    datePlannedStart: new Date(2020, 5, 1), 
    datePlannedEnd: new Date(2020, 5, 15), 
  },
  <TsGanttTaskModel>{
    id: "root1child1child1id", 
    parentId: "root1child1id", 
    name: "Root1child1child1", 
    progress: 100, 
    datePlannedStart: new Date(2020, 5, 1), 
    datePlannedEnd: new Date(2020, 5, 10), 
  },
  <TsGanttTaskModel>{
    id: "root2child1id", 
    parentId: "root2id", 
    name: "Root2child1", 
    progress: 15, 
    datePlannedStart: new Date(2020, 5, 6), 
    datePlannedEnd: new Date(2020, 5, 16), 
  },
  <TsGanttTaskModel>{
    id: "root2child1child1id", 
    parentId: "root2child1id", 
    name: "Root2child1child1", 
    progress: 15, 
    datePlannedStart: new Date(2020, 5, 6), 
    datePlannedEnd: new Date(2020, 5, 16), 
  },
];

describe("TsGanttTask", () => {
  
  const tasks = TsGanttTask.convertModelsToTasks(<TsGanttTaskModel[]>inputModels);    

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
  it("converted tasks should have correct nesting levels", () => {
    expect(tasks.filter(x => x.nestingLvl === 0).length).toEqual(3);
    expect(tasks.filter(x => x.nestingLvl === 1).length).toEqual(3);
    expect(tasks.filter(x => x.nestingLvl === 2).length).toEqual(1);
  });
  it("converted tasks should have correct parent uuid inheritance", () => {
    expect(tasks.find(x => x.externalId === "root1id").parentUuid).toEqual(null);
    expect(tasks.find(x => x.externalId === "root1child1id").parentUuid)
      .toEqual(tasks.find(x => x.externalId === "root1id").uuid);
    expect(tasks.find(x => x.externalId === "root1child1child1id").parentUuid)
      .toEqual(tasks.find(x => x.externalId === "root1child1id").uuid);
  });  
  it("converted tasks should have correct progress value", () => {
    expect(tasks.find(x => x.externalId === "root3id").progress).toEqual(0);
    expect(tasks.find(x => x.externalId === "root1child1id").progress).toEqual(100);
    expect(tasks.find(x => x.externalId === "root2child1id").progress).toEqual(100);
  });  
  it("converted tasks should have correct value of 'hasChildren' property", () => {
    expect(tasks.find(x => x.externalId === "root2id").hasChildren).toEqual(true);
    expect(tasks.find(x => x.externalId === "root3id").hasChildren).toEqual(false);
    expect(tasks.find(x => x.externalId === "root1child1child1id").hasChildren).toEqual(false);
  });
    
  it("getState should return correct state", () => {
    expect(tasks.find(x => x.externalId === "root1id").getState()).toEqual("in-progress");
    expect(tasks.find(x => x.externalId === "root2id").getState()).toEqual("overdue");
    expect(tasks.find(x => x.externalId === "root3id").getState()).toEqual("not-started");
    expect(tasks.find(x => x.externalId === "root1child1id").getState()).toEqual("completed");
    expect(tasks.find(x => x.externalId === "root1child2id").getState()).toEqual("not-started");
    expect(tasks.find(x => x.externalId === "root1child1child1id").getState()).toEqual("completed");
    expect(tasks.find(x => x.externalId === "root2child1id").getState()).toEqual("completed-late");
  });
  
  it("equality test should return correct result", () => {
    expect(tasks[0].equals(tasks[0])).toBeTruthy();
    expect(tasks[0].equals(tasks[1])).toBeFalsy();
    expect(tasks[0].equals(tasks[2])).toBeFalsy();
    expect(tasks[0].equals(tasks[3])).toBeFalsy();
    expect(tasks[0].equals(tasks[4])).toBeFalsy();
    expect(tasks[0].equals(tasks[5])).toBeFalsy();
    expect(tasks[0].equals(tasks[6])).toBeFalsy();
  });
  
  it("paternity check should return correct results", () => {
    expect(TsGanttTask.checkPaternity(tasks,
      tasks.find(x => x.externalId === "root1id"),
      tasks.find(x => x.externalId === "root1id"))).toBeFalsy();
    expect(TsGanttTask.checkPaternity(tasks,
      tasks.find(x => x.externalId === "root1id"),
      tasks.find(x => x.externalId === "root2id"))).toBeFalsy();
    expect(TsGanttTask.checkPaternity(tasks,
      tasks.find(x => x.externalId === "root1id"),
      tasks.find(x => x.externalId === "root2child1id"))).toBeFalsy();
    expect(TsGanttTask.checkPaternity(tasks,
      tasks.find(x => x.externalId === "root1id"),
      tasks.find(x => x.externalId === "root1child1id"))).toBeTruthy();
    expect(TsGanttTask.checkPaternity(tasks,
      tasks.find(x => x.externalId === "root1id"),
      tasks.find(x => x.externalId === "root1child1child1id"))).toBeTruthy();
  });
  
  it("search for collapsed parent should return correct results", () => {
    expect(TsGanttTask.checkForCollapsedParent(tasks, 
      tasks.find(x => x.externalId === "root1id"))).toBeFalsy();
    expect(TsGanttTask.checkForCollapsedParent(tasks, 
      tasks.find(x => x.externalId === "root2child1id"))).toBeTruthy();
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

  const models = tasks.map(x => x.convertToModel());

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
    expect(firstModelOut.name).toEqual(firstModelIn.name);
    expect(firstModelOut.progress).toEqual(firstModelIn.progress);
    expect(firstModelOut.parentId || null).toEqual(firstModelIn.parentId || null);
    expect(firstModelOut.datePlannedStart || null).toEqual(firstModelIn.datePlannedStart || null);
    expect(firstModelOut.datePlannedEnd || null).toEqual(firstModelIn.datePlannedEnd || null);
    expect(firstModelOut.dateActualStart || null).toEqual(firstModelIn.dateActualStart || null);
    expect(firstModelOut.dateActualEnd || null).toEqual(firstModelIn.dateActualEnd || null);
  });
  
  const tasksUpdated = TsGanttTask.convertModelsToTasks(inputModelsUpdated);
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
});
