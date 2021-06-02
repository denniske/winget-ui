import ProgressBar from "./progress-bar";
import React from "react";
import {ITask} from "../helper/types";


interface Props {
    task: ITask;
}

export default function ProgressBarFull(props: Props) {
    const {task} = props;

    if (!task) {
        return (<div/>);
    }

    if (task.started && task.exitCode != 0) {
        return (
            <div className="flex flex-row items-center space-x-2 my-[4.5px]">
                {
                    !task.exitCode && task.progressTask == 'installing' &&
                    <>
                        <ProgressBar progress={1} width={50}/>
                        <div className="text-sm">
                            Installing...
                        </div>
                    </>
                }
                {
                    !task.exitCode && task.progressTask == 'downloading' &&
                    <>
                        <ProgressBar progress={task.progressReal} width={50}/>
                        <div className="text-sm">
                            Downloading...
                        </div>
                    </>
                }
                {
                    task.exitCode &&
                    <>
                        <ProgressBar progress={task.progressReal} width={50} color="bg-red-500"/>
                        <div className="text-sm">
                            Installation failed.
                        </div>
                    </>
                }
            </div>
        );
    }

    if (!task.started) {
        return (
            <div className="flex flex-row items-center space-x-2 my-[4.5px]">
                <>
                    <ProgressBar progress={0} width={50}/>
                    <div className="text-sm">
                        Waiting...
                    </div>
                </>
            </div>
        );
    }

    return (<div/>);
}
