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

    if (task.canceled) {
        return (
            <div className="flex flex-row items-center space-x-2 my-[4.5px]">
                <>
                    <ProgressBar progress={1} width={50} color="bg-yellow-500"/>
                    <div className="text-sm">
                        { task.action == 'install' && 'Installation canceled.'}
                        { task.action == 'update' && 'Update canceled.'}
                        { task.action == 'uninstall' && 'Uninstallation canceled.'}
                    </div>
                </>
            </div>
        );
    }

    if (task.started) {
        return (
            <div className="flex flex-row items-center space-x-2 my-[4.5px]">
                {
                    task.exitCode == null && task.progressTask == 'installing' &&
                    <>
                        <ProgressBar progress={1} width={50}/>
                        <div className="text-sm">
                            { task.action == 'install' && 'Installing...'}
                            { task.action == 'update' && 'Updating...'}
                            { task.action == 'uninstall' && 'Uninstalling...'}
                        </div>
                    </>
                }
                {
                    task.exitCode == null && task.progressTask == 'downloading' &&
                    <>
                        <ProgressBar progress={task.progressReal} width={50}/>
                        <div className="text-sm">
                            Downloading...
                        </div>
                    </>
                }
                {
                    task.exitCode > 0 &&
                    <>
                        <ProgressBar progress={1} width={50} color="bg-red-500"/>
                        <div className="text-sm">
                            { task.action == 'install' && 'Installation failed.'}
                            { task.action == 'update' && 'Update failed.'}
                            { task.action == 'uninstall' && 'Uninstallation failed.'}
                        </div>
                    </>
                }
                {
                    task.exitCode == 0 &&
                    <>
                        <ProgressBar progress={1} width={50} />
                        <div className="text-sm">
                            { task.action == 'install' && 'Installed.'}
                            { task.action == 'update' && 'Updated.'}
                            { task.action == 'uninstall' && 'Uninstalled.'}
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
                        { task.action == 'install' && 'Installation queued...'}
                        { task.action == 'update' && 'Update queued...'}
                        { task.action == 'uninstall' && 'Uninstallation queued...'}
                    </div>
                </>
            </div>
        );
    }

    return (<div/>);
}
