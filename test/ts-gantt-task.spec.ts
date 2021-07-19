import { TsGanttTaskModel, TsGanttTask } from "../src/ts-gantt-task";
import dayjs from "dayjs";

const inputModels = [
  {
    id: "root1id", 
    name: "Root1", 
    progress: 55, 
    datePlannedStart: new Date(2020, 4, 1), 
    datePlannedEnd: new Date(2021, 4, 30), 
    localizedNames: {en: "Root one", uk: "Корінь один", ru: "Корень один", ja: "1個目"},
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

  const taskForStateCheckNotStarted =  new TsGanttTask("id", null, "name", null, 0);
  const taskForStateCheckInProgress =  new TsGanttTask("id", null, "name", null, 20);
  const taskForStateCheckCompletedNoPlannedEndDate =  new TsGanttTask("id", 
    null, "name", null, 100,
    new  Date("2020-01-01"));
  const taskForStateCheckCompletedActualEndNotAfterPlanned =  new TsGanttTask("id", null, "name", null, 100,
    new  Date("2020-01-01"),
    new  Date("2020-02-02"),
    new  Date("2020-02-02"),
    new  Date("2020-02-02"));
    
  it("getState should return correct state", () => {
    expect(tasks.find(x => x.externalId === "root1id").getState()).toEqual("in-progress");
    expect(tasks.find(x => x.externalId === "root2id").getState()).toEqual("overdue");
    expect(tasks.find(x => x.externalId === "root3id").getState()).toEqual("not-started");
    expect(tasks.find(x => x.externalId === "root1child1id").getState()).toEqual("completed");
    expect(tasks.find(x => x.externalId === "root1child2id").getState()).toEqual("not-started");
    expect(tasks.find(x => x.externalId === "root1child1child1id").getState()).toEqual("completed");
    expect(tasks.find(x => x.externalId === "root2child1id").getState()).toEqual("completed-late");
    expect(taskForStateCheckNotStarted.getState()).toEqual("not-started");
    expect(taskForStateCheckInProgress.getState()).toEqual("in-progress");
    expect(taskForStateCheckCompletedNoPlannedEndDate.getState()).toEqual("completed");
    expect(taskForStateCheckCompletedActualEndNotAfterPlanned.getState()).toEqual("completed");
  });
  
  it("equality test should return correct results", () => {
    expect(tasks[0].equals(tasks[0])).toBeTruthy();
    expect(tasks[0].equals(tasks[1])).toBeFalsy();
    expect(tasks[0].equals(tasks[2])).toBeFalsy();
    expect(tasks[0].equals(tasks[3])).toBeFalsy();
    expect(tasks[0].equals(tasks[4])).toBeFalsy();
    expect(tasks[0].equals(tasks[5])).toBeFalsy();
    expect(tasks[0].equals(tasks[6])).toBeFalsy();
  });
    
  const taskForCompare =  tasks.find(x => x.externalId === "root2child1id");
  const taskForCompareNoPlannedStartDate =  new TsGanttTask(taskForCompare.externalId, 
    taskForCompare.parentExternalId,
    taskForCompare.name, null, 100,
    null);
  const taskForCompareNoPlannedEndDate =  new TsGanttTask(taskForCompare.externalId, 
    taskForCompare.parentExternalId,
    taskForCompare.name, null, 100,
    taskForCompare.datePlannedStart.toDate(), 
    null);
  const taskForCompareNoActualStartDate =  new TsGanttTask(taskForCompare.externalId, 
    taskForCompare.parentExternalId,
    taskForCompare.name, null, 100,
    taskForCompare.datePlannedStart.toDate(), 
    taskForCompare.datePlannedEnd.toDate(), 
    null);
  const taskForCompareNoActualEndDate =  new TsGanttTask(taskForCompare.externalId, 
    taskForCompare.parentExternalId,
    taskForCompare.name, null, 100,
    taskForCompare.datePlannedStart.toDate(), 
    taskForCompare.datePlannedEnd.toDate(), 
    taskForCompare.dateActualStart.toDate(), 
    null);

  it("compareTo should return correct results", () => {
    expect(taskForCompare.compareTo(taskForCompare)).toEqual(0);
    expect(taskForCompareNoPlannedStartDate.compareTo(taskForCompareNoPlannedStartDate)).toEqual(0);
    expect(taskForCompareNoPlannedEndDate.compareTo(taskForCompareNoPlannedEndDate)).toEqual(0);
    expect(taskForCompareNoActualStartDate.compareTo(taskForCompareNoActualStartDate)).toEqual(0);
    expect(taskForCompareNoActualEndDate.compareTo(taskForCompareNoActualEndDate)).toEqual(0);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 0,
    })).toEqual(1);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: dayjs("2020-5-6"),
    })).toEqual(1);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: null,
    })).toEqual(1);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: dayjs("2020-6-6"),
      datePlannedEnd: dayjs("2020-5-16"),
    })).toEqual(1);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: dayjs("2020-6-6"),
      datePlannedEnd: null,
    })).toEqual(1);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: dayjs("2020-6-6"),
      datePlannedEnd: dayjs("2020-6-16"),
      dateActualStart: dayjs("2020-5-6"),
    })).toEqual(1);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: dayjs("2020-6-6"),
      datePlannedEnd: dayjs("2020-6-16"),
      dateActualStart: null,
    })).toEqual(1);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: dayjs("2020-6-6"),
      datePlannedEnd: dayjs("2020-6-16"),
      dateActualStart: dayjs("2020-6-6"),
      dateActualEnd: dayjs("2020-5-26"),
    })).toEqual(1);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: dayjs("2020-6-6"),
      datePlannedEnd: dayjs("2020-6-16"),
      dateActualStart: dayjs("2020-6-6"),
      dateActualEnd: null,
    })).toEqual(1);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 2,
    })).toEqual(-1);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: dayjs("2020-7-6"),
    })).toEqual(-1);
    expect(taskForCompareNoPlannedStartDate.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: dayjs("2020-7-6"),
    })).toEqual(-1);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 1,
      datePlannedStart: dayjs("2020-6-6"),
      datePlannedEnd: dayjs("2020-7-16"),
    })).toEqual(-1);
    expect(taskForCompareNoPlannedEndDate.compareTo(<TsGanttTask>{
      nestingLvl: 1,
      datePlannedStart: dayjs("2020-6-6"),
      datePlannedEnd: dayjs("2020-7-16"),
    })).toEqual(-1);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: dayjs("2020-6-6"),
      datePlannedEnd: dayjs("2020-6-16"),
      dateActualStart: dayjs("2020-7-6"),
    })).toEqual(-1);
    expect(taskForCompareNoActualStartDate.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: dayjs("2020-6-6"),
      datePlannedEnd: dayjs("2020-6-16"),
      dateActualStart: dayjs("2020-7-6"),
    })).toEqual(-1);
    expect(taskForCompare.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: dayjs("2020-6-6"),
      datePlannedEnd: dayjs("2020-6-16"),
      dateActualStart: dayjs("2020-6-6"),
      dateActualEnd: dayjs("2020-7-26"),
    })).toEqual(-1);   
    expect(taskForCompareNoActualEndDate.compareTo(<TsGanttTask>{
      nestingLvl: 1, 
      datePlannedStart: dayjs("2020-6-6"),
      datePlannedEnd: dayjs("2020-6-16"),
      dateActualStart: dayjs("2020-6-6"),
      dateActualEnd: dayjs("2020-7-26"),
    })).toEqual(-1);   
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
    expect(TsGanttTask.checkPaternity(tasks,
      tasks.find(x => x.externalId === "root1id"),
      <TsGanttTask>{parentUuid: "test"})).toBeFalsy();
  });

  tasks.find(x => x.externalId === "root1child1id").expanded = true;
  
  it("search for collapsed parent should return correct results", () => {
    expect(TsGanttTask.checkForCollapsedParent(tasks, 
      tasks.find(x => x.externalId === "root1id"))).toBeFalsy();
    expect(TsGanttTask.checkForCollapsedParent(tasks, 
      tasks.find(x => x.externalId === "root2child1id"))).toBeTruthy();
    expect(TsGanttTask.checkForCollapsedParent(tasks, 
      tasks.find(x => x.externalId === "root1child1child1id"))).toBeTruthy();      
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

  const models = tasks.map(x => x.toModel());

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
  
  const oldTasksIdMap = TsGanttTask.createTasksIdMap([...tasks, <TsGanttTask>{externalId: "root1id"}]); 

  it("tasks id map should have correct length", () => {
    expect(oldTasksIdMap.size).toEqual(7);
  });  
  it("tasks id map should have correct pairs", () => {
    expect(oldTasksIdMap.get("root1id")).toEqual(tasks.find(x => x.externalId === "root1id").uuid);
  });  

  const tasksUpdated = TsGanttTask.convertModelsToTasks(inputModelsUpdated, oldTasksIdMap);
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
