import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {ipcRenderer} from 'electron';
import {IApp, IInstalledApps, ITask} from "../helper/types";
import {sortBy, uniq} from 'lodash';
import {toCamelCase} from "../helper/util";
import {useMutate, useSelector} from "../state/store";
import {selectLocalApps, setAvailableApps, setInstalledApps} from "../state/action";
import {addTaskToQueue, getTaskId, loadApps, loadAvailableApps, loadInstalledApps} from "../helper/executor";
import ProgressBar from "../components/progress-bar";


function Home() {
    const [localApps, setLocalApps] = useState<IApp[]>([]);
    const [cmdProgress, setCmdProgress] = useState(-1);
    const [terminalBuffer, setTerminalBuffer] = useState([]);
    const [search, setSearch] = useState('Vivaldi');
    const allLocalApps = useSelector(selectLocalApps);
    const queue = useSelector(state => state.queue);
    const tasks = useSelector(state => state.tasks);
    const mutate = useMutate();

    const currentTask = tasks.length > 0 ? tasks[tasks.length - 1] : null;

    const updateApp = async (app: IApp) => {
        const task: ITask = {
            id: getTaskId(),
            packageIdentifier: app.packageIdentifier,
            packageVersion: app.packageVersion,
        };
        addTaskToQueue(task);
    };

    useEffect(() => {
        loadApps();
    }, []);

    useEffect(() => {
        setLocalApps(allLocalApps.filter(a => a.packageName.toLowerCase().includes(search.toLowerCase())));
    }, [search, allLocalApps]);

    const xtermRef = React.useRef(null);

    useEffect(() => {
        if (!xtermRef.current) return;
        if (!currentTask.buffer) return;

        const sameBuffer = terminalBuffer.length <= currentTask.buffer.length && terminalBuffer.every((data, i) => currentTask.buffer.length > i && currentTask.buffer[i] === data);

        if (sameBuffer) {
            currentTask.buffer.forEach((data, i) => {
                if (terminalBuffer.length > i && terminalBuffer[i] === data) return; // continue
                xtermRef.current.terminal.write(data);
            });
        } else {
            xtermRef.current.terminal.clear();
            currentTask.buffer.forEach(data => xtermRef.current.terminal.write(data));
        }
        setTerminalBuffer([...currentTask.buffer]);
    }, [currentTask, xtermRef.current]);

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

                                {
                                    // true &&
                                    app.task && app.task.exitCode != 0 &&
                                    <div className="flex flex-row items-center space-x-2 mt-1">
                                        {
                                            app.task.progressTask == 'installing' &&
                                            <>
                                                <ProgressBar progress={1} width={50} />
                                                <div className="text-sm">
                                                    Installing...
                                                </div>
                                            </>
                                        }
                                        {
                                            app.task.progressTask == 'downloading' &&
                                            <>
                                                <ProgressBar progress={app.task.progressReal} width={50} />
                                                <div className="text-sm">
                                                    Downloading...
                                                </div>
                                                {/*<div className="text-sm">*/}
                                                {/*    Downloading... {app.task.progress}*/}
                                                {/*</div>*/}
                                            </>
                                        }
                                        {/*<ProgressBar progress={0.5} width={50} />*/}
                                        {/*<div className="text-sm">*/}
                                        {/*    {app.task.packageVersion}*/}
                                        {/*</div>*/}
                                    </div>
                                }

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

                <div className="p-4">
                    {
                        queue.map(item => (
                            <div key={`${item.packageIdentifier}-${item.packageVersion}`}>
                                {item.packageIdentifier} {item.packageVersion}
                            </div>
                        ))
                    }
                </div>

                {
                    currentTask &&
                    <>
                        <div className="p-4">
                            <div>Current Task</div>
                            <div>
                                {currentTask.packageIdentifier} {currentTask.packageVersion}
                            </div>
                        </div>

                        <div className="border-t-2 border-gray-700">
                            {ImportedComponent}
                        </div>
                    </>
                }

            </div>
        </React.Fragment>
    );
}

export default Home;
function deepClone(buffer: any[]): React.SetStateAction<any[]> {
    throw new Error('Function not implemented.');
}

