import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {IApp, ITask} from "../../helper/types";
import {fixPackageIcon} from "../../helper/util";
import {useMutate, useSelector} from "../../state/store";
import {selectLocalApps} from "../../state/action";
import {addTaskToQueue, getTaskId, loadApps} from "../../helper/executor";
import ProgressBar from "../../components/progress-bar";
import Link from 'next/link';
import ProgressBarFull from "../../components/progress-bar-full";
import AppItem from "../../components/app-item";
import {useRouter} from "next/router";


export default function Tag() {
    const router = useRouter();
    const {tag} = router.query;

    const [localApps, setLocalApps] = useState<IApp[]>([]);
    const allLocalApps = useSelector(selectLocalApps);

    useEffect(() => {
        loadApps();
    }, []);

    useEffect(() => {
        setLocalApps(allLocalApps.filter(a => a.tags?.includes(tag as string)));
        // setLocalApps(allLocalApps.filter(a => a.packageName.toLowerCase().includes(search.toLowerCase())));
        // console.log(localApps);
    }, [tag, allLocalApps]);

    return (
        <React.Fragment>
            <Head>
                <title>{tag} | Winget</title>
            </Head>

            <div className="flex flex-col flex-1 overflow-auto px-12 py-4 space-y-4">

                <div className="flex items-center mt-1 mb-2 space-x-4">
                    <div className="text-sm bg-gray-300 p-2 rounded">{tag}</div>
                </div>

                {
                    localApps.map(app => (
                        <AppItem
                            key={`${app.packageIdentifier}-${app.packageVersion}`}
                            app={app}
                        />
                    ))
                }
            </div>
        </React.Fragment>
    );
}
