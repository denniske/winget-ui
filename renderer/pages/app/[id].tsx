import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {IApp, ITask} from "../../helper/types";
import {fixPackageIcon} from "../../helper/util";
import {useMutate, useSelector} from "../../state/store";
import {selectLocalApps} from "../../state/action";
import {addTaskToQueue, getTaskId, loadApps} from "../../helper/executor";
import ProgressBar from "../../components/progress-bar";
import {useRouter} from "next/router";
import Link from "next/link";


export default function App() {
    const router = useRouter();
    const {id} = router.query;

    const [app, setApp] = useState<IApp>(null);
    const [cmdProgress, setCmdProgress] = useState(-1);
    const [terminalBuffer, setTerminalBuffer] = useState([]);
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
        setApp(allLocalApps.find(a => a.packageIdentifier === id));
        console.log(app);
    }, [allLocalApps]);

    if (!app) {
        return (
            <div/>
        );
    }

    const parts = app.packageIdentifier.split('.').filter((x, i, arr) => i < arr.length-1);

    const breadcrumbParts = parts.map((part, i) => ({
        path: parts.slice(0, i+1).join('.'),
        name: i === 0 ? app.publisher : part,
        last: i === parts.length - 1,
    }));

    return (
        <React.Fragment>
            <Head>
                <title>{app.packageName} | Winget</title>
            </Head>

            <div className="flex flex-col flex-1 overflow-auto px-12 py-4 space-y-4">


                <div className="flex space-x-3">
                    {
                        breadcrumbParts.map(part => (
                            <>
                                <Link href={`/path/${encodeURIComponent(part.path)}`}>
                                    <a className="text-sm hover:underline">{part.name}</a>
                                </Link>
                                {
                                    !part.last &&
                                    <div className="text-sm">
                                        {'>'}
                                    </div>
                                }
                            </>
                        ))
                    }
                </div>

                <div className="flex space-x-8">
                    {/*<div className="">*/}
                        <img src={fixPackageIcon(app.packageIcon)} className="w-32 h-32 mt-1 mb-2"/>
                    {/*</div>*/}

                    <div className="flex flex-col pt-4">
                        <div className="text-2xl font-bold">
                            {app.packageName}
                        </div>

                        <div className="text-sm mt-1 mb-2">
                            {app.shortDescription}
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="bg-blue-600 text-white rounded px-2 py-1 text-sm"
                                    onClick={() => updateApp(app)}>
                                Install
                            </button>
                            <div className="text-sm">
                                Version {app.packageVersion}
                            </div>
                        </div>
                    </div>


                </div>

                <div className="text-sm mt-1 mb-2">
                    Website: <a className="text-blue-600 hover:underline" href={app.packageUrl}>{app.packageUrl}</a>
                </div>

                <div className="text-sm mt-1 mb-2">
                    <img src={app.packageImage} className="max-h-[250px] rounded-lg bg-gray-300"/>
                </div>

                <div className="flex items-center mt-1 mb-2 space-x-4">
                    {
                        app.tags.map(tag => (
                            <Link href={`/tag/${encodeURIComponent(tag)}`}>
                                <a className="text-sm bg-gray-300 p-2 rounded">{tag}</a>
                            </Link>
                        ))
                    }
                </div>

                <div className="text-sm mt-1 mb-2">
                    {app.Description}
                </div>
            </div>
        </React.Fragment>
    );
}