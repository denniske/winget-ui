import React from "react";
import {IApp, ITask, TaskAction} from "../helper/types";
import {fixPackageIcon} from "../helper/util";
import ProgressBarFull from "./progress-bar-full";
import {addTaskToQueue, getTaskId} from "../helper/executor";
import {useSelector} from "../state/store";
import {selectInstalledForApp, selectQueuedTaskForApp, selectTaskForApp} from "../state/action";

interface Props {
    app: IApp;
    uninstall?: boolean;
}

export default function AppStatus(props: Props) {
    const {app, uninstall} = props;
    const task = useSelector(selectTaskForApp(app));
    const queuedtask = useSelector(selectQueuedTaskForApp(app));
    const installed = useSelector(selectInstalledForApp(app));

    const updateApp = async (app: IApp, action: TaskAction) => {
        const task: ITask = {
            id: getTaskId(),
            action,
            packageIdentifier: app.packageIdentifier,
            packageName: app.packageName,
            packageVersion: app.packageVersion,
        };
        addTaskToQueue(task);
    };

    if (!app) {
        return (
            <div/>
        );
    }

    const currentTask = task && task.exitCode == null && !task.canceled ? task : queuedtask;

    return (
        <>
            {
                !currentTask && installed?.version &&
                <button className="bg-[#c21717] text-[14px] w-[120px] text-white rounded px-8 py-1"
                        onClick={() => updateApp(app, 'uninstall')}>
                    Uninstall
                </button>
            }
            {
                !currentTask && installed?.version != app.packageVersion &&
                <button className="bg-[#1F6FFF] text-[14px] w-[120px] text-white rounded px-8 py-1"
                        onClick={() => updateApp(app, app.installedVersion ? 'update' : 'install')}>
                    {app.installedVersion ? 'Update' : 'Install'}
                </button>
            }

            <ProgressBarFull task={currentTask} />
        </>
    );
}
