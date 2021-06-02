import React from "react";
import Link from "next/link";
import {IApp} from "../helper/types";
import AppIcon from "./app-icon";
import AppStatus from "./app-status";

interface Props {
    app: IApp;
    uninstall?: boolean;
}

export default function AppItem(props: Props) {
    const {app, uninstall} = props;

    if (!app) {
        return (
            <div>No app</div>
        );
    }

    // console.log(app);

    return (
        <div className="flex max-w-[500px] w-[500px] space-x-8">
            <AppIcon app={app} className="w-11 h-11"/>

            <div className="flex flex-col flex-1">
                <Link href={`/app/${encodeURIComponent(app.packageIdentifier)}`}>
                    <a className="font-bold text-white">{app.packageName}</a>
                </Link>

                {/*<div className="text-sm mt-1 mb-2 truncate max-w-[400px]">*/}
                <div className="text-sm mt-1 mb-2">
                    {app.shortDescription}
                </div>

                {/*<div className="h-2"></div>*/}

                <div className="flex items-center space-x-4">
                    <AppStatus app={app} uninstall={uninstall} />

                    <div className="text-sm">
                        Version {uninstall ? app.installedVersion : app.packageVersion}
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
