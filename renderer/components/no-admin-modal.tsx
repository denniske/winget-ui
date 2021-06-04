import React from "react";
import {useMutate, useSelector} from "../state/store";
import {ipcRenderer} from "../helper/bridge";

interface Props {
    // task: ITask;
}

export default function NoAdminModal(props: Props) {
    const {} = props;
    const mutate = useMutate();

    const modal = useSelector(state => state.modal);

    if (modal?.type !== 'no-admin') return <div/>;

    const restartAsAdmin = async () => {
        await ipcRenderer.invoke('restart-as-admin');
    };

    return (
        <div className="fixed flex items-center justify-center top-0 bottom-0 left-0 right-0 bg-gray-900 bg-opacity-40">
            <div className="bg-[#1B1B1B] border-[1px] border-[#4A4A4A] rounded">

                <div className="px-8 pt-4">
                    Restart required
                </div>

                <div className="px-8 pt-4 text-sm">
                    For managing packages with winget, admin rights are required.
                </div>

                <div className="flex p-4 space-x-4 justify-end">

                    <button className="bg-[#1F6FFF] text-[14px] text-white rounded px-8 py-1"
                            onClick={restartAsAdmin}>
                        Restart as admin
                    </button>

                </div>

            </div>
        </div>
    );
}
