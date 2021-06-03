import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {IApp} from "../helper/types";
import {useMutate, useSelector} from "../state/store";
import {loadApps} from "../helper/executor";
import AppItem from "../components/app-item";
import {selectLocalInstalledApps, setInstalledFilter, setUpdatesFilter} from "../state/action";
import {filterApps} from "../helper/util";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter, faTimesCircle} from "@fortawesome/free-solid-svg-icons";


export default function Updates() {
    const [apps, setApps] = useState<IApp[]>([]);
    const allLocalInstalledApps = useSelector(selectLocalInstalledApps);
    const filter = useSelector(state => state.updatesFilter);
    const mutate = useMutate();

    useEffect(() => {
        loadApps();
    }, []);

    useEffect(() => {
        setApps(filterApps(allLocalInstalledApps, filter).filter(a => a.installedVersion != a.packageVersion));
    }, [allLocalInstalledApps]);

    const clearFilter = () => {
        mutate(setUpdatesFilter(''));
    };

    return (
        <React.Fragment>
            <Head>
                <title>Updates | Winget</title>
            </Head>

            <div className="flex flex-col flex-1 overflow-auto px-12 py-8 space-y-4">

                <div className="flex items-center mt-1 mb-2 space-x-8">
                    <div className="text-sm bg-gray-800 p-2 rounded">Updates</div>

                    <div
                        className="flex items-center space-x-4 text-[#98979A] focus-within:text-[#C9C9C9] transition-color">
                        <FontAwesomeIcon icon={faFilter} className=""/>
                        <input
                            placeholder="Find in updates..."
                            className="px-2 py-1 flex-1 rounded focus:outline-none bg-transparent"
                            type="text"
                            value={filter}
                            onChange={e => mutate(setUpdatesFilter(e.target.value))}
                        />
                        {
                            filter.length > 0 &&
                            <button className="focus:outline-none" onClick={clearFilter}>
                                <FontAwesomeIcon icon={faTimesCircle} className=""/>
                            </button>
                        }
                    </div>
                </div>

                {
                    apps.map(app => (
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
