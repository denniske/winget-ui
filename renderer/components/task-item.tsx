import React, {useState} from "react";
import {IApp, ITask} from "../helper/types";
import {fixPackageIcon} from "../helper/util";
import ProgressBarFull from "./progress-bar-full";
import Terminal from "./terminal";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";

interface Props {
    task: ITask;
    opened?: boolean;
}

export default function TaskItem(props: Props) {
    const {task, opened} = props;
    const [visible, setVisible] = useState(opened);

    return (
        <div className="flex flex-col">
            <div className="flex items-center px-4 py-2 space-x-4 cursor-pointer" onClick={() => setVisible(x => !x)}>
                <div className="w-3">
                    <FontAwesomeIcon icon={visible ? faChevronDown : faChevronRight} className="text-[#98979A]" />
                </div>
                <ProgressBarFull task={task} />
                <div className="text-sm">
                    {task.packageName} ({task.packageVersion})
                </div>
            </div>
            {
                visible &&
                <div className="flex self-start">
                    <Terminal task={task} />
                </div>
            }
        </div>
    );
}
