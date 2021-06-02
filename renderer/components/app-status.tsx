import React from "react";
import {IApp, ITask} from "../helper/types";
import {fixPackageIcon} from "../helper/util";
import ProgressBarFull from "./progress-bar-full";
import {addTaskToQueue, getTaskId} from "../helper/executor";

interface Props {
    app: IApp;
    uninstall?: boolean;
}

export default function AppStatus(props: Props) {
    const {app, uninstall} = props;

    const updateApp = async (app: IApp) => {
        const task: ITask = {
            id: getTaskId(),
            packageIdentifier: app.packageIdentifier,
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
                !app.task && !app.queuedtask && !uninstall &&
                <button className="bg-[#1F6FFF] text-[14px] text-white rounded px-8 py-1"
                        onClick={() => updateApp(app)}>
                    {app.installedVersion ? 'Update' : 'Install'}
                </button>
            }
            {
                !app.task && !app.queuedtask && uninstall &&
                <button className="bg-[#c21717] text-[14px] text-white rounded px-8 py-1"
                        onClick={() => updateApp(app)}>
                    Uninstall
                </button>
            }

            <ProgressBarFull task={app.task} queuedTask={app.queuedtask} />
        </>
    );
}
