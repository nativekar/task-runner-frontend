import { Task, TaskStatus, logs } from '../types';
import { makeUrl, getTaskFromId, getNextId, sortTasksAccordingToDependencies, getRoute, fetchData, getRandomLogs } from '../utils/utils';

interface useTaskManagerProps {
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    setProgress: React.Dispatch<React.SetStateAction<boolean>>;
    setLogs: React.Dispatch<React.SetStateAction<logs[]>>;
    sessionId: string;
    tasks: Task[];
}

export const useTaskManager = ({ setTasks, setProgress, sessionId, tasks, setLogs }: useTaskManagerProps) => {


    const updateSelectiveLogs = (data: logs[]) => {
        const randomLogs = data ? getRandomLogs(data) : [];
        setLogs(randomLogs);
    }

    const runSelectedTask = async (task: Task) => {
        if (task.retries >= 3 && task.status === TaskStatus.ERROR) {
            updateTaskStatusAndRetries(task, TaskStatus.DISABLED);
            return;
        }
        updateTaskStatusAndRetries(task, TaskStatus.RUNNING);
        setProgress(true);
        const route = getRoute(task);
        const url = makeUrl(route, sessionId);
        try {
            const data = await fetchData(url);
            const status = data?.data?.length > 0 ? TaskStatus.FINISHED : TaskStatus.ERROR;
            updateTaskStatusAndRetries(task, status);
            data?.data?.length > 0 ? updateSelectiveLogs(data.data) : updateSelectiveLogs([]);
        } catch (error) {
            console.error(`Fetch failed: ${error}`);
            updateTaskStatusAndRetries(task, TaskStatus.ERROR);
        }

    };

    const updateTasks = (name: string, concurrency: number, parentId: number) => {
        const newTask = {
            id: getNextId(),
            name: name,
            concurrency: concurrency,
            retries: 0,
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

    const updateTaskStatusAndRetries = (task: Task, status: TaskStatus) => {
        setTasks((prevTasks) => {
            const updatedTasks = prevTasks.map((t) => {
                if (t.id === task.id) {
                    return { ...t, status: status, retries: t.retries + 1 };
                }
                return t;
            });
            return updatedTasks;
        });
    };


    return { updateTasks, runSelectedTask };
};