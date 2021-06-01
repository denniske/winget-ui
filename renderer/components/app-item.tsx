import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBox, faDownload, faSearch, faStar} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {useMutate, useSelector} from "../state/store";
import {setSearch} from "../state/action";
import Link from "next/link";
import {IApp, ITask} from "../helper/types";
import {fixPackageIcon} from "../helper/util";
import ProgressBarFull from "./progress-bar-full";
import {addTaskToQueue, getTaskId} from "../helper/executor";

interface Props {
    app: IApp;
}

export default function AppItem(props: Props) {
    const {app} = props;

    const updateApp = async (app: IApp) => {
        const task: ITask = {
            id: getTaskId(),
            packageIdentifier: app.packageIdentifier,
            packageVersion: app.packageVersion,
        };
        addTaskToQueue(task);
    };

    return (
        <div
            className=""
        >
            <div className="text-sm mt-1 mb-2">
                <img src={fixPackageIcon(app.packageIcon)} className="w-6 h-6"/>
            </div>

            <div className="flex flex-row items-end space-x-2">
                <Link href={`/app/${encodeURIComponent(app.packageIdentifier)}`}>
                    <a className="font-bold">{app.packageName}</a>
                </Link>
                <div className="text-sm">
                    {app.installedVersion}
                </div>
            </div>

            <ProgressBarFull task={app.task}/>

            <div className="text-sm mt-1 mb-2">
                {app.shortDescription}
            </div>

            <div className="text-sm mt-1 mb-2">
                {app.packageIdentifier}
            </div>

            <div className="text-sm mt-1 mb-2">
                {app.versions?.join(' ')}
            </div>

            {/*{*/}
            {/*    app.InstalledVersion !== app.packageVersion &&*/}
            <button className="bg-blue-600 text-white rounded px-2 py-1 text-sm"
                    onClick={() => updateApp(app)}>
                Update to {app.packageVersion} ({app.packageIdentifier})
            </button>
            {/*}*/}
        </div>
    );
}
