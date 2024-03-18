import { getNextId } from "./utils/utils";

export enum TaskStatus {
  ADDED = "added",
  PENDING = "run",
  STARTED = "started",
  RUNNING = "running",
  FINISHED = "completed",
  ERROR = "failed",
  DISABLED = "disabled",
}

export interface Task {
  id: number;
  name: string;
  concurrency: number;
  parentId: number | null;
  retries: number,
  status: string;
  childrenIds: number[];
}

export interface updateLogWithConcurrency {
  setLogs: () => void;
  setTasks: () => void;
  task: Task;
  status: TaskStatus;
}

export interface logs {
  timeStamp: string;
  screenshot?: string;
  log?: string;
}

export interface Response {
  message: string;
  data: logs[] | [];
}