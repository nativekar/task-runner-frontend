import "./TaskItem.css";
import { Task, TaskStatus } from "../types";

interface TaskItemProps {
  task: Task;
  getTaskNameFromId: (value: number | null) => string;
  runSelectedTask: () => void;
}

const TaskItem = ({
  task,
  getTaskNameFromId,
  runSelectedTask,
}: TaskItemProps) => {
  const renderStatus = (status: string) => {
    if (status === TaskStatus.PENDING) {
      return (
        <div className="status-pending" onClick={() => runSelectedTask()}>
          Run
        </div>
      );
    } else if (status === TaskStatus.STARTED) {
      return <div className="status-started">Started</div>;
    } else if (status === TaskStatus.FINISHED) {
      return <div className="status-completed">Completed</div>;
    } else if (status === TaskStatus.RUNNING) {
      return <div className="status-running">Running</div>;
    } else if (status === TaskStatus.ERROR) {
      return <div className="status-failed">Rerun</div>;
    }
  };

  return (
    <div className="task-item-container">
      <div className="heading-row">
        <span className="heading-tag">Name</span>
        <span className="heading-tag">Parent</span>
        <span className="heading-tag">Concurrency</span>
        <span className="heading-tag">Status</span>
      </div>
      <div className="items">
        <span className="item">{task.name}</span>
        <span className="item">{getTaskNameFromId(task.parentId)}</span>
        <span className="item">{task.concurrency}</span>
        <span className="item">{renderStatus(task.status)}</span>
      </div>
    </div>
  );
};

export default TaskItem;
