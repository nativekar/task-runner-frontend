import { TaskStatus, Task, logs } from "../types";

export const makeUrl = (route: string, sessionId: string): string => {
  const url = `https://lc7nld-3000.csb.app/`;
  const batch = route === "screenshots" ? 10 : route === "logs" ? 5 : 1;
  const queryParams = `?id=${sessionId}&batch=${batch}`;
  return url + route + queryParams;
};


export const getRoute = (task: Task) => {
  const route = task.name.toLowerCase().includes("screenshot")
    ? "screenshots"
    : task.name.toLowerCase().includes("log")
      ? "logs"
      : task.name.toLowerCase().includes("video")
        ? "video"
        : null;
  if (!route) {
    throw new Error("We cannot run this yet!");
  }
  return route;
};

export const fetchData = async (url: string): Promise<{ message: string, data: logs[] }> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Fetch failed: ${error}`);
  }
};

export const getRandomLogs = (data: any, min = 50, max = 100) => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const randomIndices = new Set<number>();
  while (randomIndices.size < count) {
    randomIndices.add(Math.floor(Math.random() * data.length));
  }
  return Array.from(randomIndices).map(index => data[index]);
};

const createGetIdCallBack = () => {
  let id = 0;
  return function () {
    return id++;
  };
};

export const getNextId = createGetIdCallBack();

export const defaultTasks: Task[] = [
  {
    id: getNextId(),
    name: "Download Screenshots",
    concurrency: 10,
    retries: 0,
    parentId: null,
    status: TaskStatus.PENDING,
    childrenIds: [1],
  },
  {
    id: getNextId(),
    name: "Download logs",
    concurrency: 5,
    retries: 0,
    parentId: 0,
    status: TaskStatus.PENDING,
    childrenIds: [2],
  },
  {
    id: getNextId(),
    name: "Create Video",
    concurrency: 1,
    retries: 0,
    parentId: 1,
    status: TaskStatus.PENDING,
    childrenIds: [],
  },
];

export const getTask = (tasks: Task[], id: number): Task | undefined => {
  const task = tasks.filter((task) => task.id === id);
  if (task.length > 0) return task[0];
};



const getRootTask = (tasks: Task[]): Task => {
  const tasksWithNoParent = tasks.filter((task) => task.parentId == null);
  return tasksWithNoParent[0];
};

export const getTaskFromId = (
  id: number | null,
  tasks: Task[],
): Task | undefined => {
  const task = tasks.find((task) => task.id === id);
  return task;
};

export const sortTasksAccordingToDependencies = (tasks: Task[]) => {
  const finalTasks = [];
  const queue = [getRootTask(tasks)];
  while (queue.length !== 0) {
    const currentTask = queue.pop();
    if (!currentTask) return;
    finalTasks.push(currentTask);
    console.log(currentTask);
    for (let i = 0; i < currentTask.childrenIds.length; i++) {
      const currentChildTaskId = currentTask.childrenIds[i];
      const childTask = getTaskFromId(currentChildTaskId, tasks);
      childTask && queue.push(childTask);
    }
  }
  return finalTasks;
};
