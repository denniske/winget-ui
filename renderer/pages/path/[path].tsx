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
import Breadcrumb from "../../components/breadcrumb";


export default function Path() {
    const router = useRouter();
    const {path} = router.query;

    const [localApps, setLocalApps] = useState<IApp[]>([]);
    const allLocalApps = useSelector(selectLocalApps);

    useEffect(() => {
        loadApps();
    }, []);

    useEffect(() => {
        setLocalApps(allLocalApps.filter(a => a.packageIdentifier.startsWith(path as string)));
        // setLocalApps(allLocalApps.filter(a => a.packageName.toLowerCase().includes(search.toLowerCase())));
        // console.log(localApps);
    }, [path, allLocalApps]);

    if (localApps.length === 0 || !path) {
        return <div>Empty</div>;
    }

    const parts = (path as string).split('.');

    return (
        <React.Fragment>
            <Head>
                <title>{path} | Winget</title>
            </Head>

            <div className="flex flex-col flex-1 overflow-auto px-12 py-8 space-y-4">

                <Breadcrumb publisher={localApps[0].publisher} parts={parts} />

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
