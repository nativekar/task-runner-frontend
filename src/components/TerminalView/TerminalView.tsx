import "./TerminalView.css";
import { logs } from "../types";

interface TerminalViewProps {
	logs: logs[];
}

const TerminalView = ({ logs }: TerminalViewProps) => {
	return (
		<div className="terminal-view">
			{logs.map((log, i) => (
				<div key={i} className="log">
						<span className="log-index">Log {i + 1}</span>
						<span className="log-timestamp" style={{ color: 'lightgreen' }}>
							Time: {log.timeStamp} ms
						</span>
					
					{log.screenshot && (
						<div className="log-content" style={{ color: 'lightblue' }}>
							<span className="log-label">Downloaded Screenshot:</span>
							<span>{log.screenshot}</span>
						</div>
					)}
					{log.log && (
						<div className="log-content" style={{ color: 'white' }}>
							<span className="log-label">Log:</span>
							<span>{log.log}</span>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default TerminalView;
