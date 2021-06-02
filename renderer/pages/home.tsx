import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {IApp} from "../helper/types";
import {useMutate, useSelector} from "../state/store";
import {selectLocalApps} from "../state/action";
import {loadApps} from "../helper/executor";
import AppItem from "../components/app-item";
import {orderBy} from "lodash";

function filterApps(apps: IApp[], search: string) {
    const parts = search.toLowerCase().split(' ');
    return apps.filter(m => {
        return parts.every(part =>
            m.packageName.toLowerCase().indexOf(part) >= 0 ||
            m.publisher.toLowerCase().indexOf(part) >= 0);
    });
}

export default function Home() {
    const [localApps, setLocalApps] = useState<IApp[]>([]);
    const [total, setTotal] = useState(0);
    const [count, setCount] = useState(10);
    const allLocalApps = useSelector(selectLocalApps);
    const search = useSelector(state => state.search);

    useEffect(() => {
        loadApps();
    }, []);

    useEffect(() => {
        const filterAndSorted = orderBy(filterApps(allLocalApps, search), a => a.views, 'desc');
        setLocalApps(
            filterAndSorted
                .filter((x, i) => i < count)

        );
        setTotal(filterAndSorted.length);
        // console.log(localApps);
    }, [count, search, allLocalApps]);

    useEffect(() => {
        setCount(10);
    }, [search]);


    return (
        <React.Fragment>
            <Head>
                <title>Winget</title>
            </Head>

            <div className="flex flex-col gap-10 flex-1 overflow-auto px-12 py-8">
                <div className="flex flex-wrap gap-10 flex-1">
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
                    total > count &&
                    <button className="focus:outline-none p-1" onClick={() => setCount(c => c + 20)}>
                        Show more
                    </button>
                }
            </div>

        </React.Fragment>
    );
}
