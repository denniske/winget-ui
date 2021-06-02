import React from "react";
import {IApp} from "../helper/types";
import {fixPackageIcon} from "../helper/util";

interface Props {
    app: IApp;
    className: string;
}

export default function AppIcon(props: Props) {
    const {app, className} = props;

    if (!app) {
        return (
            <div/>
        );
    }

    return (
        <>
            {
                app.packageIcon &&
                <img src={fixPackageIcon(app)} className={`${className} mt-1 mb-2`}/>
            }
            {
                !app.packageIcon &&
                <div className={`${className} bg-[#555] rounded w-11 h-11 mt-1 mb-2`} />
                // <FontAwesomeIcon icon={faWindowMaximize} size={"5x"} className="w-11 h-11 mt-1 mb-2" />
            }
        </>
    );
}
