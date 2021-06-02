import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {IApp} from "../helper/types";
import {useSelector} from "../state/store";
import {loadApps} from "../helper/executor";
import AppItem from "../components/app-item";
import {selectLocalInstalledApps} from "../state/action";


export default function Updates() {
    const [localApps, setLocalApps] = useState<IApp[]>([]);
    const allLocalApps = useSelector(selectLocalInstalledApps);

    useEffect(() => {
        loadApps();
    }, []);

    useEffect(() => {
        setLocalApps(allLocalApps.filter(a => a.installedVersion != a.packageVersion));
        // console.log(localApps);
    }, [allLocalApps]);

    return (
        <React.Fragment>
            <Head>
                <title>Updates | Winget</title>
            </Head>

            <div className="flex flex-col flex-1 overflow-auto px-12 py-8 space-y-4">

                <div className="flex items-center mt-1 mb-2 space-x-4">
                    <div className="text-sm bg-gray-800 p-2 rounded">Updates</div>
                </div>

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
