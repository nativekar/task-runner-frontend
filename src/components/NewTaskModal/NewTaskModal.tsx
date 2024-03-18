import { useState } from "react";
import { Task } from "../types";

import "./NewTaskModal.css";

interface NewTaskModalProps {
	tasks: Task[];
	closeModal: () => void;
	updateTasks: (name: string, concurrency: number, parent: number) => void;
}

const NewTaskModal = ({
	tasks,
	closeModal,
	updateTasks,
}: NewTaskModalProps) => {
	const [name, setName] = useState("");
	const [concurrency, setConcurrency] = useState("");
	const [parent, setParent] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	/**
	 * auto-capitalises the first letter of each word
	 * needs a helper since auto-capitalize attribute is not widely supported
	 */
	const formatInput = (input: string) => {
		return input
			.toLowerCase()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	const setUserInput = (id: string, event: any) => {
		if (id === "name") {
			setName(formatInput(event.target.value));
		} else if (id === "concurrency") {
			setConcurrency(event.target.value);
		} else if (id === "dependencies") {
			setParent(event.target.value);
		}
	};

	const createTask = (e: any) => {
		if (!name || name === "" || concurrency === "0") {
			setErrorMessage(
				"Please check input to make sure the Name field is not empty or Concurrency is not set to 0"
			);
			return;
		}
		e.preventDefault();
		updateTasks(name, Number(concurrency), Number(parent));
		closeModal();
	};

	return (
		<div className="create-task-modal">
			<div className="container">
				<span className="close" onClick={closeModal}>
					&times;
				</span>
				<h4>Create Task</h4>
				<div className="form-group">
					<label htmlFor="name">Name:</label>
					<input
						type="text"
						id="name"
						autoComplete="off"
						onChange={(e) => setUserInput("name", e)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="concurrency">Concurrency:</label>
					<input
						type="number"
						id="concurrency"
						autoComplete="off"
						onChange={(e) => setUserInput("concurrency", e)}
					/>
				</div>
				<div className="form-group">
					<label htmlFor="dependencies">Dependencies:</label>
					<select
						name="Depends on"
						id="dependencies"
						autoComplete="off"
						onChange={(e) => setUserInput("dependencies", e)}
					>
						<option value="" disabled selected>
							Select your dependency
						</option>
						{tasks.map((task) => (
							<option value={task.id} key={task.id}>
								{task.name}
							</option>
						))}
					</select>
				</div>
				<button type="submit" onClick={(e) => createTask(e)}>
					Create
				</button>
				{errorMessage && <p className="error-message">{errorMessage}</p>}
			</div>
		</div>
	);
};

export default NewTaskModal;
