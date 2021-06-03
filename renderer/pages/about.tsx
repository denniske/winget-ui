import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {IApp} from "../helper/types";
import {useMutate, useSelector} from "../state/store";
import {loadApps} from "../helper/executor";
import AppItem from "../components/app-item";
import {selectLocalInstalledApps, setInstalledFilter, setSearch} from "../state/action";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter, faSearch, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import {filterApps, openLink} from "../helper/util";


export default function About() {

    return (
        <React.Fragment>
            <Head>
                <title>About | Winget UI</title>
            </Head>

            <div className="flex flex-col justify-center text-center flex-1 overflow-auto px-12 py-8">

                <div className="p-2 rounded">Winget UI</div>

                <div className="text-sm p-1 font-bold mt-4">Created by</div>
                <div className="text-sm">Dennis Keil</div>

                <div className="text-sm p-1 font-bold mt-4">Version</div>
                <div className="text-sm">0.1</div>

                <div className="text-sm p-1 font-bold mt-4">Source</div>
                <div className="text-sm">
                    Stats from <button className="focus:outline-none text-blue-600 hover:underline" onClick={() => openLink("https://winget.run/")}>winget.run</button>
                </div>
                <div className="text-sm">
                    Icons made by <button className="focus:outline-none text-blue-600 hover:underline" onClick={() => openLink("https://www.flaticon.com/authors/good-ware")}>Good Ware</button> from <button className="focus:outline-none text-blue-600 hover:underline" onClick={() => openLink("https://www.flaticon.com/")}>www.flaticon.com</button>
                </div>

            </div>
        </React.Fragment>
    );
}
