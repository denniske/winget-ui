import React, {useState} from "react";
import {IApp, ITask} from "../helper/types";
import {fixPackageIcon} from "../helper/util";
import ProgressBarFull from "./progress-bar-full";
import Terminal from "./terminal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import TaskItem from "./task-item";
import {useSelector} from "../state/store";

interface Props {
    // task: ITask;
}

export default function TaskList(props: Props) {
    const {} = props;
    const [visible, setVisible] = useState(false);

    const queuedTasks = useSelector(state => state.queue);
    const tasks = useSelector(state => state.tasks);

    const pendingTasks = [...tasks, ...queuedTasks].filter(t => t.exitCode == null && !t.canceled);

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#1B1B1B] border-t-[1px] border-[#4A4A4A]">

            <div className="px-4 py-4 cursor-pointer" onClick={() => setVisible(x => !x)}>
                Tasks {pendingTasks.length > 0 ? `(${pendingTasks.length} pending)` : ''}
            </div>

            {
                visible &&
                <div className="flex flex-col p-4 overflow-auto h-[200px] ">
                    {
                        tasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))
                    }
                    {
                        queuedTasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ))
                    }
                </div>
            }
        </div>
    );
}
