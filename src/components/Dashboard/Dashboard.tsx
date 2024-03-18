import { useState, useEffect } from "react";
import TaskView from "../TasksView/TasksView";
import TerminalView from "../TerminalView/TerminalView";
import "./Dashboard.css";
import { logs as LogType } from "../types";
import { v4 as uuidv4 } from "uuid";

const Dashboard = () => {
  const defaultLogs: LogType[] = [];
  const [logs, setLogs] = useState(defaultLogs);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    setSessionId(uuidv4());
  }, []);

  return (
    <>
      <div className="header">
        <span className="text">
          <h2>Task Runner</h2>
        </span>
      </div>
      <div className="dashboard">
        <TaskView setLogs={setLogs} sessionId={sessionId} />
        <TerminalView logs={logs} />
      </div>
    </>
  );
};

export default Dashboard;
