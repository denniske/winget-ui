import ProgressBar from "./progress-bar";
import React from "react";
import {ITask} from "../helper/types";


interface Props {
    task: ITask;
}

export default function ProgressBarFull(props: Props) {
    const { task } = props;

    if (task && task.exitCode != 0) {

        return (
            <div className="flex flex-row items-center space-x-2 mt-1">
                {
                    task.progressTask == 'installing' &&
                    <>
                        <ProgressBar progress={1} width={50}/>
                        <div className="text-sm">
                            Installing...
                        </div>
                    </>
                }
                {
                    task.progressTask == 'downloading' &&
                    <>
                        <ProgressBar progress={task.progressReal} width={50}/>
                        <div className="text-sm">
                            Downloading...
                        </div>
                    </>
                }
            </div>
        );
    }

    return (<div/>);
}
