import React from "react";
import {IApp, ITask} from "../helper/types";
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

    const updateApp = async (app: IApp) => {
        const task: ITask = {
            id: getTaskId(),
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

    return (
        <>
            {
                !task && !queuedtask && installed?.version &&
                <button className="bg-[#c21717] text-[14px] w-[120px] text-white rounded px-8 py-1"
                        onClick={() => updateApp(app)}>
                    Uninstall
                </button>
            }
            {
                !task && !queuedtask && installed?.version != app.packageVersion &&
                <button className="bg-[#1F6FFF] text-[14px] w-[120px] text-white rounded px-8 py-1"
                        onClick={() => updateApp(app)}>
                    {app.installedVersion ? 'Update' : 'Install'}
                </button>
            }

            <ProgressBarFull task={task && task.exitCode != 0 ? task : queuedtask} />
        </>
    );
}
