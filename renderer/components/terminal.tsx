import React, {useEffect, useState} from "react";
import {ITask} from "../helper/types";
import {useSelector} from "../state/store";

interface Props {
    task: ITask;
    className?: string;
}

export default function Terminal(props: Props) {
    const {task, className} = props;

    // const [cmdProgress, setCmdProgress] = useState(-1);
    const [terminalBuffer, setTerminalBuffer] = useState([]);
    const queue = useSelector(state => state.queue);
    const xtermRef = React.useRef(null);

    useEffect(() => {
        if (!xtermRef.current) return;
        if (!task.buffer) return;

        const sameBuffer = terminalBuffer.length <= task.buffer.length && terminalBuffer.every((data, i) => task.buffer.length > i && task.buffer[i] === data);

        if (sameBuffer) {
            task.buffer.forEach((data, i) => {
                if (terminalBuffer.length > i && terminalBuffer[i] === data) return; // continue
                xtermRef.current.terminal.write(data);
            });
        } else {
            xtermRef.current.terminal.clear();
            task.buffer.forEach(data => xtermRef.current.terminal.write(data));
        }
        setTerminalBuffer([...task.buffer]);
    }, [task, xtermRef.current]);

    const doData = async (x: any) => {
        // console.log('doData', x);
        // await ipcRenderer.invoke('pty', x);
    };

    const handleLineFeed = (terminal: any) => {
        setTimeout(() => terminal.resize(terminal.cols, Math.max(5, terminal._core.buffer.y + 2)));
    };

    let ImportedComponent = null
    // if (global?.window && window !== undefined) {
    // if (global?.window && window !== undefined) {
    // const importing = require("insert path here");
    const importing = require('../helper/XTerm');
    const MyComponent = importing.default //can also be a different export
    // @ts-ignore
    ImportedComponent = <MyComponent
        ref={xtermRef}
        onLineFeed={handleLineFeed}
        onData={doData}
        options={{ rows: 5, cols: 80 }}
        className="flex"
    />
    // } else { //for build purposes only
    //     ImportedComponent = <div><p>Component not available.</p></div>;
    // }

    return (
        <div className="flex self-start bg-black p-4 rounded">
            {ImportedComponent}
        </div>
    );
}
