import React from "react";
import {IApp} from "../helper/types";
import {fixPackageIcon} from "../helper/util";

interface Props {
    app: IApp;
    className: string;
}

export default function Terminal(props: Props) {
    const {app, className} = props;

    if (!app) {
        return (
            <div/>
        );
    }

    return (
        <div className="flex self-start bg-black p-4 rounded">

            <Terminal />

            {ImportedComponent}
        </div>
    );
}
