import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {IApp, ITask} from "../helper/types";
import {fixPackageIcon} from "../helper/util";
import {useMutate, useSelector} from "../state/store";
import {selectLocalApps} from "../state/action";
import {addTaskToQueue, getTaskId, loadApps} from "../helper/executor";
import ProgressBar from "../components/progress-bar";
import Link from 'next/link';
import ProgressBarFull from "../components/progress-bar-full";
import AppItem from "../components/app-item";
import {orderBy} from "lodash";

export default function Home() {
    const [localApps, setLocalApps] = useState<IApp[]>([]);
    const [cmdProgress, setCmdProgress] = useState(-1);
    const [terminalBuffer, setTerminalBuffer] = useState([]);
    const allLocalApps = useSelector(selectLocalApps);
    const search = useSelector(state => state.search);
    const queue = useSelector(state => state.queue);
    const tasks = useSelector(state => state.tasks);
    const mutate = useMutate();

    const currentTask = tasks.length > 0 ? tasks[tasks.length - 1] : null;

    useEffect(() => {
        loadApps();
    }, []);

    useEffect(() => {
        setLocalApps(
            orderBy(
                allLocalApps
                    .filter(a => a.packageName.toLowerCase().includes(search.toLowerCase()))
                ,
                a => a.views, 'desc'
            )
                .filter((x, i) => i < 100)
        );
        // console.log(localApps);
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
    // if (global?.window && window !== undefined) {
    // if (global?.window && window !== undefined) {
    // const importing = require("insert path here");
    const importing = require('../helper/XTerm');
    const MyComponent = importing.default //can also be a different export
    // @ts-ignore
    ImportedComponent = <MyComponent ref={xtermRef} onData={doData}/>
    // } else { //for build purposes only
    //     ImportedComponent = <div><p>Component not available.</p></div>;
    // }

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

            <div className="flex flex-col flex-1 overflow-auto px-12 py-8 space-y-4">
                {
                    localApps.map(app => (
                        <AppItem
                            key={`${app.packageIdentifier}-${app.installedVersion}`}
                            app={app}
                        />
                    ))
                }
                {
                    localApps.length === 0 &&
                    <div>
                        No results found.
                    </div>
                }
            </div>

            {
                currentTask &&
                <div className="p-4">
                    {cmdProgressStr}
                </div>
            }

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
        </React.Fragment>
    );
}
