import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {ipcRenderer} from 'electron';
import {IApp, IInstalledApps} from "../helper/types";
import {sortBy} from 'lodash';
import {type} from "os";
// import XTerm from '../helper/XTerm';
// import { XTerm } from 'react-xterm';
// import {XTerm} from "xterm-for-react";

// import dynamic from 'next/dynamic'
//
// const TerminalComponent = dynamic(() => import('../helper/XTerm'), {
//     ssr: false
// });

function Home() {
    const [installedApps, setInstalledApps] = useState<IApp[]>([]);
    const [cmdProgress, setCmdProgress] = useState(-1);

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
        console.log('doData', x);
        await ipcRenderer.invoke('pty', x);
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
            <div className='grid grid-col-1 w-full p-4 space-y-3'>

                {ImportedComponent}

                <div>
                    {cmdProgressStr}
                </div>

                {/*<TerminalComponent />*/}
                {/*<TerminalComponent ref={xtermRef} />*/}
                {/*<XTerm ref={xtermRef} />*/}

                {/*<XTerm ref={inputRef}*/}
                {/*       addons={['fit', 'fullscreen', 'search']}*/}
                {/*       style={{*/}
                {/*           overflow: 'hidden',*/}
                {/*           position: 'relative',*/}
                {/*           width: '100%',*/}
                {/*           height: '100%'*/}
                {/*       }}/>*/}

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
