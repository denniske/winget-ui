import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {ipcRenderer} from 'electron';
import {IApp, IInstalledApps} from "../helper/types";
import {sortBy} from 'lodash';

function Home() {
    const [installedApps, setInstalledApps] = useState<IApp[]>([]);

    const updateApp = async (app: IApp) => {
        const resultStr = await ipcRenderer.invoke('winget-upgrade', app);
        // const installed = JSON.parse(resultStr) as IInstalledApps;
        // console.log('installed', installed);
        console.log('resultStr', resultStr);
        loadApps();
    };

    const loadApps = async () => {
        const installedStr = await ipcRenderer.invoke('get-installed');
        const installed = JSON.parse(installedStr) as IInstalledApps;
        console.log('installed', installed);

        const appsStr = await ipcRenderer.invoke('get-apps');
        const apps = JSON.parse(appsStr) as IApp[];
        console.log('apps', apps);

        const _installedApps = installed.Sources
            .flatMap(s => s.Packages)
            .map(p => {
                // if (!apps.find(a => a.PackageIdentifier === p.PackageIdentifier)) {
                //     console.log('not found', p.PackageIdentifier);
                // }
                const foundApp = apps.find(a => a.PackageIdentifier === p.PackageIdentifier);
                return {
                    ...foundApp,
                    InstalledVersion: p.Version,
                };
            })
            .filter(x => x)
            .filter(x => x.PackageName?.includes('Fire'))
        ;

        setInstalledApps(sortBy(_installedApps, a => a.PackageName));

        console.log(installedApps);
    };

    useEffect(() => {
        loadApps();
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>Winget</title>
            </Head>
            <div className='grid grid-col-1 w-full p-4 space-y-3'>

                {
                    installedApps.map(app => (
                        <div
                            key={`${app.PackageIdentifier}-${app.InstalledVersion}`}
                            className=""
                        >
                            <div className="flex flex-row items-end space-x-2">
                                <div className="font-bold">
                                    {app.PackageName}
                                </div>
                                <div className="text-sm">
                                    {app.InstalledVersion}
                                </div>
                            </div>

                            <div className="text-sm mt-1 mb-2">
                                {app.ShortDescription}
                            </div>

                            <div className="text-sm mt-1 mb-2">
                                {app.PackageIdentifier}
                            </div>

                            <div className="text-sm mt-1 mb-2">
                                {app.Versions?.join(' ')}
                            </div>

                            {/*{*/}
                            {/*    app.InstalledVersion !== app.PackageVersion &&*/}
                                <button className="bg-gray-600 rounded px-2 py-1 text-sm" onClick={() => updateApp(app)}>
                                    Update to {app.PackageVersion} ({app.PackageIdentifier})
                                </button>
                            {/*}*/}
                        </div>
                    ))
                }

            </div>

            {/*<button onClick={loadApps}>Load apps</button>*/}

            {/*<div className='mt-1 w-full flex-wrap flex justify-center'>*/}
            {/*    <Link href='/next'>*/}
            {/*        <a className='btn-blue'>Go to next page</a>*/}
            {/*    </Link>*/}
            {/*</div>*/}

        </React.Fragment>
    );
}

export default Home;
