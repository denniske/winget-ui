import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {IApp} from "../helper/types";
import {useSelector} from "../state/store";
import {loadApps} from "../helper/executor";
import AppItem from "../components/app-item";
import {selectLocalInstalledApps} from "../state/action";


export default function Installed() {
    const [localApps, setLocalApps] = useState<IApp[]>([]);
    const allLocalApps = useSelector(selectLocalInstalledApps);

    useEffect(() => {
        loadApps();
    }, []);

    useEffect(() => {
        setLocalApps(allLocalApps);
        // setLocalApps(allLocalApps.filter(a => a.packageName.toLowerCase().includes(search.toLowerCase())));
        // console.log(localApps);
    }, [allLocalApps]);

    return (
        <React.Fragment>
            <Head>
                <title>Installed | Winget</title>
            </Head>

            <div className="flex flex-col flex-1 overflow-auto px-12 py-8 space-y-4">

                <div className="flex items-center mt-1 mb-2 space-x-4">
                    <div className="text-sm bg-gray-800 p-2 rounded">Installed</div>
                </div>

                {
                    localApps.map(app => (
                        <AppItem
                            key={`${app.packageIdentifier}-${app.installedVersion}`}
                            app={app}
                            uninstall={true}
                        />
                    ))
                }
            </div>
        </React.Fragment>
    );
}
