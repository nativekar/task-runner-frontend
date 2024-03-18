import { TaskStatus, Task, logs } from "../types";
import { v4 as uuidv4 } from "uuid";

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
    parentId: null,
    status: TaskStatus.PENDING,
    childrenIds: [1],
  },
  {
    id: getNextId(),
    name: "Download logs",
    concurrency: 5,
    parentId: 0,
    status: TaskStatus.PENDING,
    childrenIds: [2],
  },
  {
    id: getNextId(),
    name: "Create Video",
    concurrency: 1,
    parentId: 1,
    status: TaskStatus.PENDING,
    childrenIds: [],
  },
];

export const getTask = (tasks: Task[], id: number): Task | undefined => {
  const task = tasks.filter((task) => task.id === id);
  if (task.length > 0) return task[0];
};

const updateLogWithConcurrency = (
  setLogs: React.Dispatch<React.SetStateAction<logs[]>>,
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  task: Task,
  status: TaskStatus,
): void => {
  const newLogs = Array.from({ length: task.concurrency }, () => ({
    id: task.id,
    key: uuidv4(),
    taskName: task.name,
    status,
    timeStamp: new Date(),
  }));

  setLogs((prevLogs: logs[]) => [...prevLogs, ...newLogs]);

  task.status = status;
  setTasks((prevTasks: Task[]) =>
    prevTasks.map((t) => (t.id === task.id ? task : t)),
  );
};

export const runTasks = async (tasks: Task[], setTasks: any, setLogs: any) => {
  const boundUpdateLogWithConcurrency = updateLogWithConcurrency.bind(
    null,
    setLogs,
    setTasks,
  );
  const responses = [];
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    boundUpdateLogWithConcurrency(task, TaskStatus.STARTED);
    try {
      boundUpdateLogWithConcurrency(task, TaskStatus.RUNNING);
      const response = await Promise.all(
        new Array(task.concurrency).fill(runTask(task.id)),
      );
      boundUpdateLogWithConcurrency(task, TaskStatus.FINISHED);
      responses.push({
        currentTaskId: task.id,
        response,
      });
    } catch (e) {
      boundUpdateLogWithConcurrency(task, TaskStatus.ERROR);
      break;
    }
  }
  return responses;
};

const runTask = async (taskId: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(taskId);
    }, 3000);
  });
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
