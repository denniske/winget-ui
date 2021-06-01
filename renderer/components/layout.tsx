import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBox, faDownload, faSearch, faStar} from "@fortawesome/free-solid-svg-icons";
import React, {useEffect, useState} from "react";
import {useMutate, useSelector} from "../state/store";
import {setSearch} from "../state/action";
import Link from "next/link";
import {useRouter} from "next/router";

export default function Layout(props: any) {
    const {children} = props;
    const router = useRouter();
    const mutate = useMutate();
    const search = useSelector(state => state.search);

    const handleKeyDown = (e: any) => {
        console.log(e);
        if (e.key === 'Enter') {
            router.push('/home');
        }
    };

    useEffect(() => {
        if (search.length >= 3) {
            router.push('/home');
        }
    }, [search]);

    return (
        <div className='flex flex-row w-full h-full'>
            <div className='flex flex-col w-96 bg-gray-300 space-y-6 px-5 py-16'>

                <Link href={`/home`}>
                    <a className='flex items-center space-x-3'>
                        <FontAwesomeIcon icon={faStar} className="text-gray-600"/>
                        <div>Explore</div>
                    </a>
                </Link>
                <div className='flex items-center space-x-3'>
                    <FontAwesomeIcon icon={faBox} className="text-gray-600"/>
                    <div>Installed</div>
                </div>
                <div className='flex items-center space-x-3'>
                    <FontAwesomeIcon icon={faDownload} className="text-gray-600"/>
                    <div>Updates</div>
                </div>

            </div>

            <div className='flex flex-col w-full h-full space-y-3'>

                <div className="p-4 border-b-2 border-gray-300 space-x-4">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-600"/>
                    <input
                        className="text-black px-2 py-1 rounded focus:outline-none"
                        type="text" value={search} onKeyDown={handleKeyDown} onChange={e => mutate(setSearch(e.target.value))}/>
                </div>

                {children}
            </div>
        </div>
    );
}
