import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBox,
    faChevronLeft,
    faChevronRight,
    faDownload,
    faSearch,
    faStar,
    faTimesCircle
} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {useMutate, useSelector} from "../state/store";
import {setSearch} from "../state/action";
import Link from "next/link";
import {useRouter} from "next/router";
import {ipcRenderer} from "../helper/bridge";
import TaskItem from "./task-item";
import TaskList from "./task-list";

export default function Layout(props: any) {
    const {children} = props;
    const router = useRouter();
    const mutate = useMutate();
    const search = useSelector(state => state.search);
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [searching, setSearching] = useState(false);

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            router.push('/home');
        }
    };

    const handleFocus = () => {
        setSearching(true);
    };

    const handleBlur = () => {
        setSearching(false);
    };

    useEffect(() => {
        if (search.length >= 1) {
            router.push('/home');
        }
    }, [search]);

    useEffect(() => {
       // console.log(router.route);
       ipcRenderer.invoke('browser-can-go-back').then(x => setCanGoBack(x));
       ipcRenderer.invoke('browser-can-go-forward').then(x => setCanGoForward(x));
    }, [router.route]);

    const goBack = () => {
        history.back();
    };

    const clearSearch = () => {
        mutate(setSearch(''));
    };

    const goForward = () => {
        history.forward();
    };

    const isActive = (route: string) => {
        return router.route.startsWith(route);
    };

    const myExlorerActive = isActive('/home') || isActive('/app') || isActive('/tag') || isActive('/path');

    // let cmdProgressStr = 'Idle';
    // if (cmdProgress > 1) {
    //     cmdProgressStr = 'Working...';
    // }
    // if (cmdProgress >= 0 && cmdProgress <= 1) {
    //     cmdProgressStr = `Working ${cmdProgress * 100}%`;
    // }

    return (
        <div className='flex flex-row flex-1 h-full bg-[#1B1B1B] text-[#C5C5C5]'>
            <div className='flex flex-col w-60 bg-[#2F2F31] text-[#CCCCCC] space-y-6 px-5 py-4'>

                <div className="flex space-x-4 self-end">
                    <button className="disabled:opacity-50 disabled:cursor-default focus:outline-none p-1" onClick={goBack} disabled={!canGoBack}>
                        <FontAwesomeIcon icon={faChevronLeft} className="text-[#98979A]" />
                    </button>
                    <button className="disabled:opacity-50 disabled:cursor-default focus:outline-none p-1" onClick={goForward} disabled={!canGoForward}>
                        <FontAwesomeIcon icon={faChevronRight} className="text-[#98979A]" />
                    </button>
                </div>

                <div className="" />

                <Link href={`/home`}>
                    <a className={`flex items-center space-x-3 px-[6px] pt-[3px] pb-[4px] rounded ${myExlorerActive ? 'bg-[#444348] text-white' : ''}`}>
                        <FontAwesomeIcon icon={faStar} className={myExlorerActive ? 'text-white' : 'text-[#98979A]'} />
                        <div className="text-[14px]">My Explorer</div>
                    </a>
                </Link>
                <Link href={`/installed`}>
                    <a className={`flex items-center space-x-3 px-[6px] pt-[3px] pb-[4px] rounded ${isActive('/installed') ? 'bg-[#444348] text-white' : ''}`}>
                        <FontAwesomeIcon icon={faBox} className={isActive('/installed') ? 'text-white' : 'text-[#98979A]'} />
                        <div className="text-[14px]">On This Computer</div>
                    </a>
                </Link>
                <Link href={`/updates`}>
                    <a className={`flex items-center space-x-3 px-[6px] pt-[3px] pb-[4px] rounded ${isActive('/updates') ? 'bg-[#444348] text-white' : ''}`}>
                        <FontAwesomeIcon icon={faDownload} className={isActive('/updates') ? 'text-white' : 'text-[#98979A]'} />
                        <div className="text-[14px]">Updates</div>
                    </a>
                </Link>

            </div>

            <div className='flex flex-col flex-1 h-full'>

                <div className="flex items-center p-4 border-b-[1px] border-[#4A4A4A] space-x-4 text-[#98979A] focus-within:text-[#C9C9C9] transition-color">
                    <FontAwesomeIcon icon={faSearch} className="" />
                    <input
                        placeholder="Search for apps..."
                        className="px-2 py-1 flex-1 rounded focus:outline-none bg-transparent"
                        type="text"
                        value={search}
                        onKeyDown={handleKeyDown}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onChange={e => {
                            console.log('change', e.target.value);
                            mutate(setSearch(e.target.value));
                        }}
                    />
                    {
                        search.length > 0 &&
                        <button className="focus:outline-none" onClick={clearSearch}>
                            <FontAwesomeIcon icon={faTimesCircle} className=""  />
                        </button>
                    }
                </div>

                <div className={`overflow-auto transition-opacity ${searching && search.length === 0 ? 'opacity-50' : ''}`}>
                    {children}
                </div>

                {/*{*/}
                {/*    currentTask &&*/}
                {/*    <div className="p-4">*/}
                {/*        {cmdProgressStr}*/}
                {/*    </div>*/}
                {/*}*/}

                {/*<div className="p-4">*/}
                {/*    {*/}
                {/*        queue.map(item => (*/}
                {/*            <div key={`${item.packageIdentifier}-${item.packageVersion}`}>*/}
                {/*                {item.packageIdentifier} {item.packageVersion}*/}
                {/*            </div>*/}
                {/*        ))*/}
                {/*    }*/}
                {/*</div>*/}
            </div>

           <TaskList />

        </div>
    );
}
