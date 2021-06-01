import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBox, faDownload, faSearch, faStar} from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import {useMutate, useSelector} from "../state/store";
import {setSearch} from "../state/action";
import Link from "next/link";

interface Props {
    publisher: string;
    parts: any[];
}

export default function Breadcrumb(props: Props) {
    const {parts, publisher} = props;

    const breadcrumbParts = parts.map((part, i) => ({
        path: parts.slice(0, i+1).join('.'),
        name: i === 0 ? publisher : part,
        last: i === parts.length - 1,
    }));

    return (
        <div className="flex space-x-3">
            {
                breadcrumbParts.map(part => (
                    <div key={part.path} className="flex space-x-3">
                        <Link href={`/path/${encodeURIComponent(part.path)}`}>
                            <a className="text-sm hover:underline">{part.name}</a>
                        </Link>
                        {
                            !part.last &&
                            <div className="text-sm">
                                {'>'}
                            </div>
                        }
                    </div>
                ))
            }
        </div>
    );
}
