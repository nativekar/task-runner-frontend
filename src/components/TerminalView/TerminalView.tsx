import "./TerminalView.css";
import { logs } from "../types";

interface TerminalViewProps {
	logs: logs[];
}

const TerminalView = ({ logs }: TerminalViewProps) => {
	function getHumanReadableTime(date: Date) {
		const hours = date.getHours();
		const minutes = date.getMinutes().toString();
		let timeString = `${hours}:${minutes}`;
		const isAM = hours < 12;
		timeString += isAM ? " AM" : " PM";
		return timeString;
	}

	return (
		<div className="terminal-view">
			{logs?.length > 0 ? (
				logs.map((log) => (
					<div className="terminal-log" key={log.key}>
						<span className="date-color">{getHumanReadableTime(log.timeStamp)}</span>:
						<span className="name-color">{log.taskName}</span>:
						<span className="status-color">{log.status}</span>
					</div>
				))
			) : (
				<section>Run one or many tasks to see resulting logs here.</section>
			)}
		</div>
	);
};

export default TerminalView;
