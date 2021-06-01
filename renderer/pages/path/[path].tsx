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


export default function Path() {
    const router = useRouter();
    const {path} = router.query;

    const [localApps, setLocalApps] = useState<IApp[]>([]);
    const allLocalApps = useSelector(selectLocalApps);
    const search = useSelector(state => state.search);

    useEffect(() => {
        loadApps();
    }, []);

    useEffect(() => {
        setLocalApps(allLocalApps.filter(a => a.packageIdentifier.startsWith(path as string)));
        // setLocalApps(allLocalApps.filter(a => a.packageName.toLowerCase().includes(search.toLowerCase())));
        // console.log(localApps);
    }, [search, allLocalApps]);

    return (
        <React.Fragment>
            <Head>
                <title>{path} | Winget</title>
            </Head>

            <div className="flex flex-col flex-1 overflow-auto p-4 space-y-4">
                {
                    localApps.map(app => (
                        <AppItem
                            key={`${app.packageIdentifier}-${app.installedVersion}`}
                            app={app}
                        />
                    ))
                }
            </div>
        </React.Fragment>
    );
}
