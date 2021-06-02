import React, {useState} from "react";
import {IApp, ITask} from "../helper/types";
import {fixPackageIcon} from "../helper/util";
import ProgressBarFull from "./progress-bar-full";
import Terminal from "./terminal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";
import TaskItem from "./task-item";
import {useMutate, useSelector} from "../state/store";
import {hideModal, showTaskFailedModal} from "../state/action";

interface Props {
    // task: ITask;
}

export default function TaskFailedModal(props: Props) {
    const {} = props;
    const mutate = useMutate();

    const modal = useSelector(state => state.modal);

    const queuedTasks = useSelector(state => state.queue);
    const tasks = useSelector(state => state.tasks);
    const pendingTasks = [...tasks, ...queuedTasks].filter(t => t.exitCode == null && !t.canceled);

    if (modal?.type !== 'task-failed') return <div/>;

    const task = modal.task;

    return (
        <div className="fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 bg-gray-900 bg-opacity-40">
            <div className="bg-[#1B1B1B] border-[1px] border-[#4A4A4A]">

                <div className="px-8 pt-4">
                    The following task has failed:
                </div>

                <div className="flex flex-col p-4 overflow-auto">
                    <TaskItem key={task.id} task={task} opened={true}/>
                </div>

                {
                    pendingTasks.length > 0 &&
                    <div className="px-8 pt-4">
                        {pendingTasks.length} pending task(s) were canceled.
                        {/*Open the "Pending Tasks" pane to see them.*/}
                    </div>
                }

                <div className="flex p-4 space-x-4 justify-end">

                    <button className="bg-[#1F6FFF] text-[14px] w-[120px] text-white rounded px-8 py-1"
                            onClick={() => mutate(hideModal())}>
                        Close
                    </button>

                </div>

            </div>
        </div>
    );
}
