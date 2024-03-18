import { useState } from "react";
import TaskItem from "../TaskItem/TaskItem";
import Button from "../Button/Button";
import NewTaskModal from "../NewTaskModal/NewTaskModal";
import "./TaskView.css";
import {
  runTasks,
  sortTasksAccordingToDependencies,
  getNextId,
  getTaskFromId,
  defaultTasks,
} from "../utils/utils";
import { Task, TaskStatus, logs } from "../types";

interface TaskViewProps {
  sessionId: string;
  setLogs: React.Dispatch<React.SetStateAction<logs[]>>;
}

const TaskView = ({ setLogs, sessionId }: TaskViewProps) => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [progress, setProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTaskNameFromId = (id: number | null): string => {
    const task = tasks.find((task) => task.id === id);
    return task?.name ? task.name : "No dependencies";
  };

  const updateTasks = (name: string, concurrency: number, parentId: number) => {
    const newTask = {
      id: getNextId(),
      name: name,
      concurrency: concurrency,
      parentId: parentId,
      childrenIds: [],
      status: TaskStatus.DISABLED,
    };
    const parent = getTaskFromId(parentId, tasks);
    if (parent) parent.childrenIds.push(newTask.id);
    setTasks((prev) => {
      const updatedTasks = [...prev, newTask];
      const sortedTasks = sortTasksAccordingToDependencies(updatedTasks);
      return sortedTasks || [];
    });
  };

  const closeModal = () => setIsModalOpen(false);

  const makeUrl = (route: string): string => {
    const url = `https://lc7nld-3000.csb.app/`;
    const batch = route === "screenshots" ? 10 : route === "logs" ? 5 : 1;
    const queryParams = `?id=${sessionId}&batch=${batch}`;
    return url + route + queryParams;
  };

  const runSelectedTask = async (name = "video") => {
    setProgress(true);
    const route = name.toLowerCase().includes("screenshot")
      ? "screenshots"
      : name.toLowerCase().includes("video")
        ? "logs"
        : name.toLowerCase().includes("video")
          ? "video"
          : null;
    if (!route) {
      throw new Error("We cannot run this yet!");
    }
    const url = makeUrl(route);
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="task-view">
      <div>
        <h2> Current tasks </h2>
      </div>
      {tasks.map((task) => (
        <TaskItem
          task={task}
          key={task.id}
          getTaskNameFromId={getTaskNameFromId}
          runSelectedTask={runSelectedTask}
        />
      ))}
      <div className="button-group">
        <div className="create-task">
          <Button
            name="Create task"
            onClick={() => setIsModalOpen(true)}
            disabled={progress}
          />
        </div>
        <div className="create-task">
          <Button name="Run all tasks" disabled={progress} />
        </div>
      </div>
      {isModalOpen && (
        <NewTaskModal
          tasks={tasks}
          closeModal={closeModal}
          updateTasks={updateTasks}
        />
      )}
    </div>
  );
};

export default TaskView;
