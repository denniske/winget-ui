import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBox, faChevronLeft, faDownload, faSearch, faStar, faWindowMaximize} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {useMutate, useSelector} from "../state/store";
import {setSearch} from "../state/action";
import Link from "next/link";
import {IApp, ITask} from "../helper/types";
import {fixPackageIcon} from "../helper/util";
import ProgressBarFull from "./progress-bar-full";
import {addTaskToQueue, getTaskId} from "../helper/executor";
import AppIcon from "./app-icon";

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

    if (!app) {
        return (
            <div>No app</div>
        );
    }

    return (
        <div className="flex space-x-8">
            <AppIcon app={app} className="w-11 h-11"/>

            <div className="flex flex-col flex-1">
                <Link href={`/app/${encodeURIComponent(app.packageIdentifier)}`}>
                    <a className="font-bold text-white">{app.packageName}</a>
                </Link>

                {/*<div className="text-2xl font-bold">*/}
                {/*    {app.packageName}*/}
                {/*</div>*/}

                <div className="text-sm mt-1 mb-2">
                    {app.shortDescription}
                </div>

                <div className="flex items-center space-x-4">
                    <button className="bg-[#1F6FFF] text-[14px] text-white rounded px-8 py-1"
                            onClick={() => updateApp(app)}>
                        Install
                    </button>
                    <div className="text-sm">
                        Version {app.packageVersion}
                    </div>
                </div>
            </div>
        </div>
    );

    // return (
    //     <div
    //         className=""
    //     >
    //         <div className="text-sm mt-1 mb-2">
    //             <img src={fixPackageIcon(app.packageIcon)} className="w-6 h-6"/>
    //         </div>
    //
    //         <div className="flex flex-row items-end space-x-2">
    //             <Link href={`/app/${encodeURIComponent(app.packageIdentifier)}`}>
    //                 <a className="font-bold">{app.packageName}</a>
    //             </Link>
    //             <div className="text-sm">
    //                 {app.installedVersion}
    //             </div>
    //         </div>
    //
    //         <ProgressBarFull task={app.task}/>
    //
    //         <div className="text-sm mt-1 mb-2">
    //             {app.shortDescription}
    //         </div>
    //
    //         <div className="text-sm mt-1 mb-2">
    //             {app.packageIdentifier}
    //         </div>
    //
    //         <div className="text-sm mt-1 mb-2">
    //             {app.versions?.join(' ')}
    //         </div>
    //
    //         {/*{*/}
    //         {/*    app.InstalledVersion !== app.packageVersion &&*/}
    //         <button className="bg-blue-600 text-white rounded px-2 py-1 text-sm"
    //                 onClick={() => updateApp(app)}>
    //             Update to {app.packageVersion} ({app.packageIdentifier})
    //         </button>
    //         {/*}*/}
    //     </div>
    // );
}
