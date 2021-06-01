import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {ipcRenderer} from 'electron';
import {IApp, IInstalledApps} from "../helper/types";
import {sortBy, uniq} from 'lodash';
import {type} from "os";
import {toCamelCase} from "../helper/util";
import {useMutate, useSelector} from "../state/store";
import {selectLocalApps, setAvailableApps, setInstalledApps} from "../state/action";
// import XTerm from '../helper/XTerm';
// import { XTerm } from 'react-xterm';
// import {XTerm} from "xterm-for-react";

// import dynamic from 'next/dynamic'
//
// const TerminalComponent = dynamic(() => import('../helper/XTerm'), {
//     ssr: false
// });

function Home() {
    const [localApps, setLocalApps] = useState<IApp[]>([]);
    const [cmdProgress, setCmdProgress] = useState(-1);
    const [search, setSearch] = useState('Vivaldi');
    const allLocalApps = useSelector(selectLocalApps);
    const mutate = useMutate();

    const updateApp = async (app: IApp) => {
        const resultStr = await ipcRenderer.invoke('winget-upgrade', app);
        // const installed = JSON.parse(resultStr) as IInstalledApps;
        // console.log('installed', installed);
        console.log('resultStr', resultStr);
        loadApps();
    };

    const loadApps = async () => {
        const appsStr = await ipcRenderer.invoke('get-apps');
        const apps = JSON.parse(appsStr, toCamelCase) as IApp[];
        console.log('apps', apps);
        mutate(setAvailableApps(apps));

        const installedStr = await ipcRenderer.invoke('get-installed');
        const installed = JSON.parse(installedStr, toCamelCase) as IInstalledApps;
        console.log('installed', installed);

        const _installedApps = installed.sources
                .flatMap(s => s.packages)
                .filter(p => apps.find(a => a.packageIdentifier === p.packageIdentifier))
            // .filter(x => x.packageName?.includes('Fire'))
            // .filter(x => x.packageName?.includes('Vivaldi'))
        ;

        mutate(setInstalledApps(_installedApps));

        // console.log(apps.length, uniq(apps.map(a => a.packageIdentifier)).length);

        // const _installedApps2 = installed.sources
        //     .flatMap(s => s.packages)
        //     .map(p => {
        //         // if (!apps.find(a => a.packageIdentifier === p.packageIdentifier)) {
        //         //     console.log('not found', p.packageIdentifier);
        //         // }
        //         const foundApp = apps.find(a => a.packageIdentifier === p.packageIdentifier);
        //         return {
        //             ...foundApp,
        //             InstalledVersion: p.version,
        //         };
        //     })
        //     .filter(x => x)
        //     // .filter(x => x.packageName?.includes('Fire'))
        //     .filter(x => x.packageName?.includes('Vivaldi'))
        // ;
        //
        // setLocalApps(sortBy(_installedApps2, a => a.packageName));

        console.log(localApps);
    };

    useEffect(() => {
        loadApps();
    }, []);

    useEffect(() => {
        setLocalApps(allLocalApps.filter(a => a.packageName.toLowerCase().includes(search.toLowerCase())));
    }, [search, allLocalApps]);

    // const inputRef = React.useRef(null)

    const xtermRef = React.useRef(null)

    useEffect(() => {

        ipcRenderer.on('terminal', (event, args) => {
            console.log('client terminal', args);
            xtermRef.current.terminal.write(args);

            const progressRegex = /9;4;1;(\d+)/;
            if (progressRegex.test(args)) {
                const match = progressRegex.exec(args);
                const progress = parseInt(match[1]);
                console.log('==> progress', progress);
                setCmdProgress(progress / 100);
            }
            const progressIndRegex = /9;4;3;0/;
            if (progressIndRegex.test(args)) {
                console.log('==> progress indetermined');
                setCmdProgress(2);
            }
            const progressFinRegex = /9;4;0;0/;
            if (progressFinRegex.test(args)) {
                console.log('==> progress finished');
                setCmdProgress(-1);
            }
        });
        console.log('xterm', xtermRef.current);
        // xtermRef.current.terminal.writeln("Hello, World!")
    }, []);

    const doData = async (x: any) => {
        // console.log('doData', x);
        // await ipcRenderer.invoke('pty', x);
    };

    let ImportedComponent = null
    if (global?.window && window !== undefined) {
        // const importing = require("insert path here");
        const importing = require('../helper/XTerm');
        const MyComponent = importing.default //can also be a different export
        // @ts-ignore
        ImportedComponent = <MyComponent ref={xtermRef} onData={doData}/>
    } else { //for build purposes only
        ImportedComponent = <div><p>Component not available.</p></div>;
    }

    let cmdProgressStr = 'Idle';
    if (cmdProgress > 1) {
        cmdProgressStr = 'Working...';
    }
    if (cmdProgress >= 0 && cmdProgress <= 1) {
        cmdProgressStr = `Working ${cmdProgress * 100}%`;
    }

    return (
        <React.Fragment>
            <Head>
                <title>Winget</title>
            </Head>
            <div className='flex flex-col w-full h-full space-y-3'>

                <div className="p-4">
                    <input
                        className="text-black px-2 py-1 rounded"
                        type="text" value={search} onChange={e => setSearch(e.target.value)}/>
                </div>

                <div className="flex flex-col flex-1 overflow-auto p-4 space-y-4">
                    {
                        localApps.map(app => (
                            <div
                                key={`${app.packageIdentifier}-${app.installedVersion}`}
                                className=""
                            >
                                <div className="flex flex-row items-end space-x-2">
                                    <div className="font-bold">
                                        {app.packageName}
                                    </div>
                                    <div className="text-sm">
                                        {app.installedVersion}
                                    </div>
                                </div>

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
                                <button className="bg-gray-600 rounded px-2 py-1 text-sm"
                                        onClick={() => updateApp(app)}>
                                    Update to {app.packageVersion} ({app.packageIdentifier})
                                </button>
                                {/*}*/}
                            </div>
                        ))
                    }
                </div>

                <div className="p-4">
                    {cmdProgressStr}
                </div>

                <div className="border-t-2 border-gray-700">
                    {ImportedComponent}
                </div>

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
